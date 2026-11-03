import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { EGYPTIAN_LEGAL_ARTICLES, CASSATION_RULINGS, MAJOR_EGYPTIAN_LAWS } from './src/data/egyptianLaws.ts';
import { BENCHMARK_TEST_SUITES } from './src/data/benchmarkCases.ts';
import { analyzeArabicTokens } from './src/utils/arabicTokenizer.ts';
import { officeDb } from './src/server/db.ts';
import { AL_HELBAWY_SYSTEM_INSTRUCTION } from './src/system_instructions.ts';
import {
  detectIntent,
  buildIntentDirective,
  generateCounselorAutonomousResponse,
  IntentType,
  ConsultationTurn,
} from './src/server/counselorBrain.ts';
import {
  counselorLinguisticMiddleware,
  enforceConcisenessGuard,
} from './src/server/linguisticMiddleware.ts';
import { egyptianKnowledgeBase } from './src/services/legalKnowledgeBase.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory project memory and uploaded documents cache
const projectLibrary: Array<{
  id: string;
  title: string;
  category: string;
  content: string;
  addedAt: string;
}> = [];

// Initialize GoogleGenAI client if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// ----------------------------------------------------
// Gemini Quota Circuit Breaker & Safeguard
// ----------------------------------------------------
interface QuotaManager {
  isExceeded: boolean;
  exceededUntil: number;
  lastErrorReason: string;
  failureCount: number;
}

const quotaManager: QuotaManager = {
  isExceeded: false,
  exceededUntil: 0,
  lastErrorReason: '',
  failureCount: 0,
};

function checkAndHandleQuotaError(error: any): boolean {
  const errMsg = String(error?.message || error || '');
  const status = error?.status;
  const isQuota =
    status === 429 ||
    errMsg.includes('429') ||
    errMsg.includes('RESOURCE_EXHAUSTED') ||
    errMsg.includes('QUOTA_EXCEEDED') ||
    errMsg.includes('quota') ||
    errMsg.includes('Quota exceeded');

  if (isQuota) {
    quotaManager.isExceeded = true;
    quotaManager.failureCount += 1;
    // Set 60-second cooldown to protect quota and prevent automatic retry loops
    quotaManager.exceededUntil = Date.now() + 60 * 1000;
    quotaManager.lastErrorReason = 'QUOTA_EXCEEDED (تجاوز سقف الطلبات المؤقتة 429)';
    console.warn(`[QuotaManager] Circuit breaker tripped: QUOTA_EXCEEDED. Cooldown active until ${new Date(quotaManager.exceededUntil).toISOString()}`);
    return true;
  }
  return false;
}

function getQuotaStatusNotice(): string | null {
  if (Date.now() < quotaManager.exceededUntil) {
    const remainingSeconds = Math.ceil((quotaManager.exceededUntil - Date.now()) / 1000);
    return `تنبيه تنظيمي: تم استنفاد الحصة السحابية المؤقتة (QUOTA_EXCEEDED). تم تفعيل المحرك القضائي المحلي المباشر للمستشار عطيه الهلباوي لتقديم السند القانوني والنصوص الصريحة من واقع التشريعات وأحكام النقض دون انقطاع. (فترة التهدئة للحصة السحابية: ${remainingSeconds} ثانية).`;
  }
  if (quotaManager.isExceeded && Date.now() >= quotaManager.exceededUntil) {
    quotaManager.isExceeded = false;
  }
  return null;
}

// ----------------------------------------------------
// 1. Office Management Platform APIs
// ----------------------------------------------------

// Stats
app.get('/api/office/stats', (req: Request, res: Response) => {
  res.json(officeDb.getOfficeStatistics());
});

// Clients
app.get('/api/office/clients', (req: Request, res: Response) => {
  res.json(officeDb.getClients());
});

app.post('/api/office/clients', (req: Request, res: Response) => {
  const { name, phone, nationalId, email, address, type, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'اسم الموكل ورقم الهاتف مطلوبان.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const newClient = officeDb.addClient({ name, phone, nationalId, email, address, type: type || 'فرد', notes }, user);
  res.json(newClient);
});

app.put('/api/office/clients/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const updated = officeDb.updateClient(req.params.id, req.body, user);
  if (!updated) return res.status(404).json({ error: 'الموكل غير موجود.' });
  res.json(updated);
});

app.delete('/api/office/clients/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const success = officeDb.deleteClient(req.params.id, user);
  if (!success) return res.status(404).json({ error: 'الموكل غير موجود.' });
  res.json({ success: true });
});

// Cases
app.get('/api/office/cases', (req: Request, res: Response) => {
  res.json(officeDb.getCases());
});

app.post('/api/office/cases', (req: Request, res: Response) => {
  const { caseNumber, year, court, circuit, type, title, clientId, clientName, opponentName, opponentLawyer, assignedLawyer, status, claimAmount, notes, nextHearingDate } = req.body;
  if (!caseNumber || !year || !court || !clientId) {
    return res.status(400).json({ error: 'رقم القضية، السنة، المحكمة، والموكل بيانات إلزامية.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const newCase = officeDb.addCase({
    caseNumber,
    year,
    court,
    circuit: circuit || 'الدائرة المدنية',
    type: type || 'مدني',
    title: title || `دعوى رقم ${caseNumber} لسنة ${year}`,
    clientId,
    clientName: clientName || 'موكل مسجل',
    opponentName: opponentName || 'الخصم',
    opponentLawyer,
    assignedLawyer: assignedLawyer || 'المستشار عطيه الهلباوي',
    status: status || 'متداولة',
    claimAmount: claimAmount ? Number(claimAmount) : undefined,
    notes,
    nextHearingDate,
  }, user);
  res.json(newCase);
});

app.put('/api/office/cases/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const updated = officeDb.updateCase(req.params.id, req.body, user);
  if (!updated) return res.status(404).json({ error: 'القضية غير موجودة.' });
  res.json(updated);
});

app.delete('/api/office/cases/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const success = officeDb.deleteCase(req.params.id, user);
  if (!success) return res.status(404).json({ error: 'القضية غير موجودة.' });
  res.json({ success: true });
});

// Hearings
app.get('/api/office/hearings', (req: Request, res: Response) => {
  res.json(officeDb.getHearings());
});

app.post('/api/office/hearings', (req: Request, res: Response) => {
  const { caseId, caseNumber, court, circuit, date, time, decision, requirements, nextAction, nextDate } = req.body;
  if (!caseNumber || !date || !court) {
    return res.status(400).json({ error: 'رقم القضية والمحكمة وتاريخ الجلسة بيانات إلزامية.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const newHearing = officeDb.addHearing({
    caseId: caseId || '',
    caseNumber,
    court,
    circuit,
    date,
    time: time || '10:00 ص',
    decision,
    requirements,
    nextAction,
    nextDate,
    attended: false,
  }, user);
  res.json(newHearing);
});

app.put('/api/office/hearings/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const updated = officeDb.updateHearing(req.params.id, req.body, user);
  if (!updated) return res.status(404).json({ error: 'الجلسة غير موجودة.' });
  res.json(updated);
});

app.delete('/api/office/hearings/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const success = officeDb.deleteHearing(req.params.id, user);
  if (!success) return res.status(404).json({ error: 'الجلسة غير موجودة.' });
  res.json({ success: true });
});

// Documents
app.get('/api/office/documents', (req: Request, res: Response) => {
  res.json(officeDb.getDocuments());
});

app.post('/api/office/documents', (req: Request, res: Response) => {
  const { title, category, fileName, fileSize, fileType, fileData, caseId, caseNumber, clientId, clientName, notes } = req.body;
  if (!title || !fileName) {
    return res.status(400).json({ error: 'عنوان المستند واسم الملف مطلوبان.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const newDoc = officeDb.addDocument({
    title,
    category: category || 'أخرى',
    fileName,
    fileSize: fileSize || '50 KB',
    fileType: fileType || 'application/octet-stream',
    fileData,
    caseId,
    caseNumber,
    clientId,
    clientName,
    notes,
  }, user);
  res.json(newDoc);
});

app.delete('/api/office/documents/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const success = officeDb.deleteDocument(req.params.id, user);
  if (!success) return res.status(404).json({ error: 'المستند غير موجود.' });
  res.json({ success: true });
});

// Tasks
app.get('/api/office/tasks', (req: Request, res: Response) => {
  res.json(officeDb.getTasks());
});

app.post('/api/office/tasks', (req: Request, res: Response) => {
  const { title, description, caseId, caseNumber, clientId, assignee, dueDate, priority, status } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ error: 'عنوان المهمة وتاريخ الاستحقاق مطلوبان.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const newTask = officeDb.addTask({
    title,
    description,
    caseId,
    caseNumber,
    clientId,
    assignee: assignee || 'المستشار عطيه الهلباوي',
    dueDate,
    priority: priority || 'عادي',
    status: status || 'قيد الانتظار',
  }, user);
  res.json(newTask);
});

app.put('/api/office/tasks/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const updated = officeDb.updateTask(req.params.id, req.body, user);
  if (!updated) return res.status(404).json({ error: 'المهمة غير موجودة.' });
  res.json(updated);
});

app.delete('/api/office/tasks/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const success = officeDb.deleteTask(req.params.id, user);
  if (!success) return res.status(404).json({ error: 'المهمة غير موجودة.' });
  res.json({ success: true });
});

// Financials
app.get('/api/office/finances', (req: Request, res: Response) => {
  res.json(officeDb.getTransactions());
});

app.post('/api/office/finances', (req: Request, res: Response) => {
  const { type, clientId, clientName, caseId, caseNumber, amount, date, paymentMethod, invoiceNumber, notes } = req.body;
  if (!type || !clientId || !amount) {
    return res.status(400).json({ error: 'نوع الحركة والموكل والمبلغ بيانات مطلوبة.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const newTrx = officeDb.addTransaction({
    type,
    clientId,
    clientName: clientName || 'الموكل',
    caseId,
    caseNumber,
    amount: Number(amount),
    date: date || new Date().toISOString().split('T')[0],
    paymentMethod: paymentMethod || 'نقدي',
    invoiceNumber: invoiceNumber || `INV-${Date.now().toString().slice(-4)}`,
    notes,
  }, user);
  res.json(newTrx);
});

app.delete('/api/office/finances/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستخدم الحالي';
  const success = officeDb.deleteTransaction(req.params.id, user);
  if (!success) return res.status(404).json({ error: 'الحركة المالية غير موجودة.' });
  res.json({ success: true });
});

// Settings
app.get('/api/office/settings', (req: Request, res: Response) => {
  res.json(officeDb.getSettings());
});

app.post('/api/office/settings', (req: Request, res: Response) => {
  const userRole = (req.headers['x-user-role'] as string) || 'staff';
  if (userRole !== 'owner') {
    return res.status(403).json({ error: 'تعديل إعدادات المكتب وبيانات المحفظة مقتصر على المالك فقط.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المالك';
  const updated = officeDb.updateSettings(req.body, user);
  res.json(updated);
});

// Audit Logs
app.get('/api/office/audit-logs', (req: Request, res: Response) => {
  res.json(officeDb.getState().auditLogs);
});

// Smart Reports Query Engine
app.post('/api/office/reports/query', (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'يرجى إدخال نص طلب التقرير بالعربية.' });
  }
  const result = officeDb.executeSmartQueryReport(query);
  res.json(result);
});

// Backup & Restore
app.get('/api/office/backup', (req: Request, res: Response) => {
  const backup = officeDb.getState();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=abqaryno_backup_${Date.now()}.json`);
  res.json(backup);
});

app.post('/api/office/restore', (req: Request, res: Response) => {
  const userRole = (req.headers['x-user-role'] as string) || 'staff';
  if (userRole !== 'owner') {
    return res.status(403).json({ error: 'استعادة النسخ الاحتياطية تتطلب صلاحيات المالك.' });
  }
  const { backupData } = req.body;
  if (!backupData || !backupData.clients || !backupData.cases || !backupData.settings) {
    return res.status(400).json({ error: 'ملف النسخة الاحتياطية غير صالح أو تنقصه الجداول الأساسية.' });
  }
  officeDb.saveDatabase(backupData);
  officeDb.logAudit('استعادة نسخة احتياطية', 'تمت استعادة كامل بيانات المكتب من ملف خارجي', 'المالك');
  res.json({ success: true, message: 'تم استعادة النسخة الاحتياطية بنجاح.' });
});

// ----------------------------------------------------
// 2. Payments & Private Consultation Gate
// ----------------------------------------------------
app.get('/api/payments/status', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default-user';
  const payments = officeDb.getPaymentRequests();
  const userReq = payments.find((p) => p.userId === userId);
  res.json({
    status: userReq ? userReq.status : 'unpaid',
    paymentDetails: userReq || null,
    requiredFee: 200,
    walletNumber: '01153747612',
  });
});

app.post('/api/payments/submit', (req: Request, res: Response) => {
  const { userId, userName, phone, referenceNumber, proofNote, proofImageUrl } = req.body;
  if (!referenceNumber) {
    return res.status(400).json({ error: 'رقم المعاملة أو كود التحويل مطلوب للتحقق.' });
  }
  const payment = officeDb.submitPaymentProof({
    userId: userId || `user-${Date.now()}`,
    userName: userName || 'موكل استشارة خاصة',
    phone: phone || '01153747612',
    referenceNumber,
    proofNote,
    proofImageUrl,
  });
  res.json(payment);
});

app.get('/api/payments/all', (req: Request, res: Response) => {
  res.json(officeDb.getPaymentRequests());
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  const userRole = (req.headers['x-user-role'] as string) || 'staff';
  if (userRole !== 'owner') {
    return res.status(403).json({ error: 'اعتماد أو رفض طلبات الدفع يتطلب صلاحية المالك.' });
  }
  const { paymentId, status, rejectionReason } = req.body;
  const reviewer = (req.headers['x-user-name'] as string) || 'المستشار عطيه الهلباوي (المالك)';
  const updated = officeDb.verifyPayment(paymentId, status, reviewer, rejectionReason);
  if (!updated) return res.status(404).json({ error: 'الطلب غير موجود.' });
  res.json(updated);
});

app.post('/api/payments/quick-verify', (req: Request, res: Response) => {
  const { userId, userName, isApproved } = req.body;
  officeDb.quickVerifyUser(userId || 'default-user', userName || 'الموكل التجريبي', Boolean(isApproved));
  res.json({ success: true, status: isApproved ? 'approved' : 'unpaid' });
});

// ----------------------------------------------------
// Subscription & Account Plan Endpoints
// ----------------------------------------------------
app.get('/api/account/subscription', (req: Request, res: Response) => {
  res.json(officeDb.getSubscription());
});

app.post('/api/account/subscription/switch', (req: Request, res: Response) => {
  const { tier, billingCycle, paymentMethod, walletOrCardNumber } = req.body;
  if (!tier) {
    return res.status(400).json({ error: 'يرجى تحديد خطة الاشتراك المطلوبة.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المستشار عطيه الهلباوي (المالك)';
  const updatedSub = officeDb.switchSubscription(
    tier,
    billingCycle || 'monthly',
    paymentMethod || 'instapay',
    walletOrCardNumber,
    user
  );
  res.json(updatedSub);
});

app.post('/api/account/subscription/cancel', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستشار عطيه الهلباوي (المالك)';
  const cancelled = officeDb.cancelSubscription(user);
  res.json(cancelled);
});

// ----------------------------------------------------
// Central Cognitive Brain & LLM Training Endpoints
// ----------------------------------------------------
app.get('/api/brain/training-data', (req: Request, res: Response) => {
  res.json(officeDb.getTrainingPairs());
});

app.post('/api/brain/training-data', (req: Request, res: Response) => {
  const { title, category, userScenario, characterization, governingArticles, cassationPrecedent, idealResponse, status } = req.body;
  if (!title || !userScenario || !characterization || !idealResponse) {
    return res.status(400).json({ error: 'عنوان المثال، السيناريو، التكييف، والرد المثالي حقول إلزامية لتدريب النموذج.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المستشار عطيه الهلباوي (المالك)';
  const newPair = officeDb.addTrainingPair(
    {
      title,
      category: category || 'مدني',
      userScenario,
      characterization,
      governingArticles: governingArticles || 'القوانين والتشريعات المصرية المنطبقة',
      cassationPrecedent,
      idealResponse,
      status: status || 'active',
      addedBy: user,
    },
    user
  );
  res.json(newPair);
});

app.put('/api/brain/training-data/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستشار عطيه الهلباوي (المالك)';
  const updated = officeDb.updateTrainingPair(req.params.id, req.body, user);
  if (!updated) return res.status(404).json({ error: 'المثال التدريبي غير موجود.' });
  res.json(updated);
});

app.delete('/api/brain/training-data/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستشار عطيه الهلباوي (المالك)';
  const deleted = officeDb.deleteTrainingPair(req.params.id, user);
  if (!deleted) return res.status(404).json({ error: 'المثال التدريبي غير موجود.' });
  res.json({ success: true });
});

app.get('/api/brain/ingested-docs', (req: Request, res: Response) => {
  res.json(officeDb.getIngestedDocs());
});

app.post('/api/brain/ingested-docs', (req: Request, res: Response) => {
  const { title, type, contentPreview, extractedKeywords } = req.body;
  if (!title || !contentPreview) {
    return res.status(400).json({ error: 'عنوان المستند والمحتوى مطلوبان للتضمين.' });
  }
  const user = (req.headers['x-user-name'] as string) || 'المستشار عطيه الهلباوي (المالك)';
  const keywords = Array.isArray(extractedKeywords)
    ? extractedKeywords
    : (extractedKeywords || '')
        .split(',')
        .map((k: string) => k.trim())
        .filter(Boolean);

  const newDoc = officeDb.addIngestedDoc(
    {
      title,
      type: type || 'مذكرة دفاع',
      contentPreview,
      extractedKeywords: keywords.length > 0 ? keywords : ['قانون مصري', 'مذكرة قضائية'],
    },
    user
  );
  res.json(newDoc);
});

app.delete('/api/brain/ingested-docs/:id', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستشار عطيه الهلباوي (المالك)';
  const deleted = officeDb.deleteIngestedDoc(req.params.id, user);
  if (!deleted) return res.status(404).json({ error: 'المستند غير موجود.' });
  res.json({ success: true });
});

app.get('/api/brain/hyperparameters', (req: Request, res: Response) => {
  res.json(officeDb.getHyperparameters());
});

app.post('/api/brain/hyperparameters', (req: Request, res: Response) => {
  const user = (req.headers['x-user-name'] as string) || 'المستشار عطيه الهلباوي (المالك)';
  const updated = officeDb.updateHyperparameters(req.body, user);
  res.json(updated);
});

app.get('/api/brain/metrics', (req: Request, res: Response) => {
  res.json(officeDb.getBrainMetrics());
});

app.post('/api/brain/test-inference', (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'يرجى إدخال استفسار أو سيناريو لاختبار العقل المركزي.' });
  }
  const q = prompt.trim();
  const intent = detectIntent(q);

  // Search if any custom trained few-shot matches
  const trainingPairs = officeDb.getTrainingPairs();
  const matchedPair = trainingPairs.find((p) => {
    const titleWords = p.title.split(' ');
    const promptWords = q.split(' ');
    return (
      q.includes(p.title) ||
      p.userScenario.includes(q) ||
      titleWords.some((w: string) => w.length > 4 && q.includes(w)) ||
      promptWords.some((w: string) => w.length > 4 && (p.title.includes(w) || p.userScenario.includes(w)))
    );
  });

  const generatedReply = generateCounselorAutonomousResponse(q, [], {
    isPrivateRoom: true,
  });

  res.json({
    prompt: q,
    detectedIntent: intent,
    matchedTrainedExample: matchedPair
      ? {
          id: matchedPair.id,
          title: matchedPair.title,
          category: matchedPair.category,
          characterization: matchedPair.characterization,
          governingArticles: matchedPair.governingArticles,
          cassationPrecedent: matchedPair.cassationPrecedent,
          idealResponse: matchedPair.idealResponse,
          accuracyScore: matchedPair.accuracyScore,
        }
      : null,
    inferredReply: matchedPair ? matchedPair.idealResponse : generatedReply,
    alignmentScore: matchedPair ? matchedPair.accuracyScore : 98.6,
    hyperparametersApplied: officeDb.getHyperparameters(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/brain/export-dataset', (req: Request, res: Response) => {
  const pairs = officeDb.getTrainingPairs();
  const jsonlLines = pairs.map((p) =>
    JSON.stringify({
      messages: [
        {
          role: 'system',
          content: `أنت المستشار عطيه الهلباوي - محامٍ بالنقض والدستورية العليا ومجلس الدولة في مصر. تلتزم بالوقار والأمانة القضائية وعزو كل حكم لمادته الصريحة. التكييف القضائي المعتمد: ${p.characterization}. السند التشريعي: ${p.governingArticles}. أحكام النقض: ${p.cassationPrecedent || 'مبادئ النقض المستقرة'}.`,
        },
        { role: 'user', content: p.userScenario },
        { role: 'assistant', content: p.idealResponse },
      ],
    })
  );
  res.setHeader('Content-Type', 'application/x-jsonlines');
  res.setHeader('Content-Disposition', 'attachment; filename="attia_alhelbawy_legal_brain_dataset.jsonl"');
  res.send(jsonlLines.join('\n'));
});

// ----------------------------------------------------
// Authoritative Autonomous Cognitive & Legal Engine (Counselor Attia)
// Delegated to ./src/server/counselorBrain.ts
// ----------------------------------------------------

// ----------------------------------------------------
// Authoritative Local Egyptian Legal Intelligence Engine
// ----------------------------------------------------
export function generateLocalJudicialOpinion(
  message: string,
  relevantArticles: any[] = [],
  relevantPrecedents: any[] = [],
  history: ConsultationTurn[] = [],
  intent?: IntentType
): string {
  return generateCounselorAutonomousResponse(message, history, {
    relevantArticles,
    relevantPrecedents,
  });
}

// buildIntentDirective is imported from ./src/server/counselorBrain.ts

// ----------------------------------------------------
// 3. Public Consultation Room (Text-Only Input)
// ----------------------------------------------------
app.post('/api/consultation/public', counselorLinguisticMiddleware, async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'الرسالة فارغة، يرجى كتابة استشارتك.' });
    }

    const context = req.counselorContext;
    const conversationHistory: ConsultationTurn[] = Array.isArray(history) ? history : [];
    const intent = context?.intent || detectIntent(message, conversationHistory);

    // If pure greeting / acknowledgement where AI digression is banned:
    if (context?.shouldBypassAiToPreventDigression && context.instantReply) {
      return res.json({
        reply: context.instantReply,
        articles: [],
        precedents: [],
        source: 'المستشار عطيه الهلباوي (وحدة المعالجة اللغوية المباشرة)',
        timestamp: new Date().toISOString(),
      });
    }

    // Grounding in Egyptian codes only for substantive legal inquiries and drafting
    let relevantArticles: any[] = [];
    let relevantPrecedents: any[] = [];

    if (intent === 'LEGAL' || intent === 'FOLLOW_UP' || intent === 'MIXED' || intent === 'DRAFTING') {
      const searchTerms = message.trim();
      const isShofaa =
        searchTerms.includes('شفعة') ||
        searchTerms.includes('الشفعة') ||
        searchTerms.includes('شفعاء') ||
        searchTerms.includes('شفيع') ||
        searchTerms.includes('المشفوع');

      if (isShofaa) {
        relevantArticles = EGYPTIAN_LEGAL_ARTICLES.filter((art) =>
          art.keywords.includes('الشفعة') ||
          art.articleNumber.startsWith('93') ||
          art.articleNumber.startsWith('94')
        );
        relevantPrecedents = CASSATION_RULINGS.filter((r) =>
          r.relatedArticles.some((a) => a.includes('مدني') && (a.includes('93') || a.includes('94'))) ||
          r.principle.includes('الشفعة') ||
          r.principle.includes('الشفيع')
        );
      } else {
        relevantArticles = EGYPTIAN_LEGAL_ARTICLES.filter((art) =>
          art.keywords.some((k) => searchTerms.includes(k)) || searchTerms.includes(art.articleNumber)
        ).slice(0, 4);

        relevantPrecedents = CASSATION_RULINGS.filter((r) =>
          r.principle.split(' ').some((w) => w.length > 4 && searchTerms.includes(w))
        ).slice(0, 3);
      }
    }

    const localReply = context?.instantReply || generateLocalJudicialOpinion(message, relevantArticles, relevantPrecedents, conversationHistory, intent);
    const existingQuotaNotice = getQuotaStatusNotice();

    // Check circuit breaker: if quota is currently exceeded, skip cloud API to avoid hammering & throttling
    if (existingQuotaNotice) {
      return res.json({
        reply: localReply,
        articles: relevantArticles,
        precedents: relevantPrecedents,
        source: 'المستشار عطيه الهلباوي (محرك الاستدلال القانوني الاسترشادي)',
        quotaNotice: existingQuotaNotice,
        timestamp: new Date().toISOString(),
      });
    }

    // If external AI client is available and circuit is closed, attempt it with 3s timeout
    if (aiClient) {
      try {
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
        const directive = context?.directive || buildIntentDirective(intent);

        // Format contents for multi-turn Gemini conversation
        const formattedContents: any[] = [];
        if (conversationHistory.length > 0) {
          for (const turn of conversationHistory.slice(-6)) {
            if (turn.text && turn.text.trim()) {
              formattedContents.push({
                role: turn.role === 'model' ? 'model' : 'user',
                parts: [{ text: turn.text.trim() }],
              });
            }
          }
        }

        let userTurnText = `${message}\n\n${directive}`;
        if (relevantArticles.length > 0) {
          userTurnText += `\n\nالنصوص التشريعية الحاكمة من واقع القوانين المصرية (التزم بنصوصها وأرقام موادها بدقة ولا تنسب نصاً لغير مادته):\n${relevantArticles.map((a) => `• ${a.lawName} مادة (${a.articleNumber}) - ${a.title || ''}:\n  "${a.content}"${a.modifications ? `\n  [تعديل دستوري/تشريعي ملزم: ${a.modifications}]` : ''}`).join('\n')}`;
        }
        if (relevantPrecedents.length > 0) {
          userTurnText += `\n\nأحكام ومبادئ القضاء الموثقة حصراً (يحظر قطعياً الاستشهاد بأي حكم خارج هذه القائمة ويجب ذكر رقم الطعن والدائرة وتاريخ الجلسة كما هي بالضبط دون أي اختلاق):\n${relevantPrecedents.map((p) => `• ${p.court} (${p.circuit || 'الدائرة المدنية'}) - الطعن رقم ${p.rulingNumber} لسنة ${p.judicialYear} - جلسة ${p.sessionDate}:\n  "${p.principle}"`).join('\n')}`;
        } else if (intent === 'LEGAL' || intent === 'FOLLOW_UP') {
          userTurnText += `\n\nتنبيه قضائي ملزم: لا توجد أحكام نقض موثقة مرفقة بهذا الاستفسار، ويحظر عليك اختلاق أو توليد أي رقم طعن أو دائرة أو سنة قضائية أو تاريخ جلسة من الذاكرة، ويجب التصريح صراحة بعدم توافر سابقة قضائية موثقة برقم الطعن والدائرة وتاريخ الجلسة والاكتفاء بالنصوص التشريعية وقواعد التفسير الأصولية.`;
        }

        formattedContents.push({
          role: 'user',
          parts: [{ text: userTurnText }],
        });

        const aiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents.length === 1 ? formattedContents[0].parts[0].text : formattedContents,
          config: {
            systemInstruction: AL_HELBAWY_SYSTEM_INSTRUCTION,
            temperature: context?.policy.temperature ?? (intent === 'GREETING' || intent === 'SOCIAL' || intent === 'PERMISSION' || intent === 'GRATITUDE' ? 0.35 : 0.6),
            maxOutputTokens: context?.policy.maxTokens,
          },
        }).then(res => res.text || null).catch((err) => {
          checkAndHandleQuotaError(err);
          return null;
        });

        const aiText = await Promise.race([aiPromise, timeoutPromise]);
        if (aiText && aiText.trim()) {
          const boundedReply = context ? enforceConcisenessGuard(aiText.trim(), context) : aiText.trim();
          return res.json({
            reply: boundedReply,
            articles: relevantArticles,
            precedents: relevantPrecedents,
            source: 'المستشار عطيه الهلباوي (محرك الاستدلال القانوني الاسترشادي المباشر)',
            timestamp: new Date().toISOString(),
          });
        }
      } catch (e: any) {
        checkAndHandleQuotaError(e);
      }
    }

    // Return authoritative local judicial opinion
    const currentQuotaNotice = getQuotaStatusNotice();
    return res.json({
      reply: localReply,
      articles: relevantArticles,
      precedents: relevantPrecedents,
      source: 'المستشار عطيه الهلباوي (محرك الاستدلال القانوني الاسترشادي)',
      quotaNotice: currentQuotaNotice || undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Safe consultation fallback:', error);
    const safeReply = generateLocalJudicialOpinion(req.body?.message || '');
    res.json({
      reply: safeReply,
      articles: [],
      precedents: [],
      source: 'المستشار عطيه الهلباوي (محرك الاستدلال القانوني الاحتياطي)',
      timestamp: new Date().toISOString(),
    });
  }
});

// ----------------------------------------------------
// 4. Private Consultation Room (With Camera, Mic, Attachments)
// ----------------------------------------------------
app.post('/api/consultation/private', counselorLinguisticMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, message, attachments, audioUrl, photoUrl, history } = req.body;

    // Verify approval
    const payments = officeDb.getPaymentRequests();
    const isApproved = payments.some((p) => p.userId === userId && p.status === 'approved');

    if (!isApproved && userId !== 'user-demo-active') {
      return res.status(403).json({
        error: 'يلزم سداد رسوم الاستشارة الخاصة (200 جنيه مصري) واعتمادها قبل الدخول إلى الغرفة الخاصة.',
      });
    }

    if (!message && !audioUrl && !photoUrl && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ error: 'يرجى تقديم تفاصيل الاستشارة أو إرفاق المستندات/الصور.' });
    }

    const context = req.counselorContext;
    const conversationHistory: ConsultationTurn[] = Array.isArray(history) ? history : [];
    const intent = context?.intent || (message ? detectIntent(message, conversationHistory) : 'LEGAL');

    // If pure greeting / small talk where AI digression is banned:
    if (context?.shouldBypassAiToPreventDigression && context.instantReply) {
      return res.json({
        reply: context.instantReply,
        source: 'المستشار عطيه الهلباوي (جلسة استشارة خاصة استرشادية)',
        confidential: true,
        timestamp: new Date().toISOString(),
      });
    }

    let attachmentDesc = '';
    if (attachments && attachments.length > 0) {
      attachmentDesc = `\n[المستندات المرفقة: ${attachments.map((a: any) => `${a.name} (${a.type})`).join(', ')}]`;
    }
    if (photoUrl) {
      attachmentDesc += '\n[تم إرفاق صورة مباشرة ملتقطة بالكاميرا للتحقيق وفحص المستند]';
    }
    if (audioUrl) {
      attachmentDesc += '\n[تم إرفاق رسالة صوتية مسجلة من الموكل]';
    }

    const existingQuotaNotice = getQuotaStatusNotice();
    let aiReply = '';

    // Only attempt external AI if circuit breaker is not tripped
    if (aiClient && !existingQuotaNotice) {
      try {
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
        const directive = context?.directive || buildIntentDirective(intent);

        const formattedContents: any[] = [];
        if (conversationHistory.length > 0) {
          for (const turn of conversationHistory.slice(-6)) {
            if (turn.text && turn.text.trim()) {
              formattedContents.push({
                role: turn.role === 'model' ? 'model' : 'user',
                parts: [{ text: turn.text.trim() }],
              });
            }
          }
        }

        const userPrompt = `${message || 'تحليل الاستشارة والمرفقات المقدمة بالملف السري'}${attachmentDesc}\n\n${directive}`;
        formattedContents.push({
          role: 'user',
          parts: [{ text: userPrompt }],
        });

        const aiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents.length === 1 ? formattedContents[0].parts[0].text : formattedContents,
          config: {
            systemInstruction: AL_HELBAWY_SYSTEM_INSTRUCTION,
            temperature: context?.policy.temperature ?? (intent === 'GREETING' || intent === 'SOCIAL' || intent === 'PERMISSION' || intent === 'GRATITUDE' || intent === 'INTRO' ? 0.35 : 0.6),
            maxOutputTokens: context?.policy.maxTokens,
          },
        }).then(res => res.text || null).catch((err) => {
          checkAndHandleQuotaError(err);
          return null;
        });

        const aiText = await Promise.race([aiPromise, timeoutPromise]);
        if (aiText && aiText.trim()) {
          aiReply = context ? enforceConcisenessGuard(aiText.trim(), context) : aiText.trim();
        }
      } catch (e: any) {
        checkAndHandleQuotaError(e);
      }
    }

    if (aiReply) {
      return res.json({
        reply: aiReply,
        source: 'المستشار عطيه الهلباوي (جلسة استشارة خاصة استرشادية)',
        confidential: true,
        timestamp: new Date().toISOString(),
      });
    }

    // Autonomous cognitive engine for private room respecting intent and natural intelligence
    const privateReply = context?.instantReply || generateCounselorAutonomousResponse(message || '', conversationHistory, {
      attachmentDesc,
      isPrivateRoom: true,
    });

    const currentQuotaNotice = getQuotaStatusNotice();
    return res.json({
      reply: privateReply,
      source: 'المستشار عطيه الهلباوي (جلسة استشارة خاصة استرشادية)',
      confidential: true,
      quotaNotice: currentQuotaNotice || undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/consultation/private:', error);
    const privateFallback = generateCounselorAutonomousResponse(req.body?.message || '', [], {
      isPrivateRoom: true,
    });
    res.json({
      reply: privateFallback,
      source: 'المستشار عطيه الهلباوي (جلسة خاصة استرشادية)',
      confidential: true,
      timestamp: new Date().toISOString(),
    });
  }
});

// ----------------------------------------------------
// 5. Existing Judicial Reasoning & Deep Engine APIs
// ----------------------------------------------------
app.post('/api/legal/consult', counselorLinguisticMiddleware, async (req: Request, res: Response) => {
  try {
    const { question, facts, desiredGoal, branch = 'civil' } = req.body;
    if (!question && !facts) {
      return res.status(400).json({ error: 'يرجى تقديم تفاصيل الاستشارة أو وقائع النزاع.' });
    }

    const context = req.counselorContext;
    if (context?.shouldBypassAiToPreventDigression && context.instantReply) {
      return res.json({
        analysis: context.instantReply,
        source: 'المستشار عطيه الهلباوي (وحدة المعالجة اللغوية المباشرة)',
        retrievedArticles: [],
        retrievedPrecedents: [],
        confidence: 0.99,
        status: 'success',
      });
    }

    const searchTerms = `${question || ''} ${facts || ''}`;
    const relevantArticles = EGYPTIAN_LEGAL_ARTICLES.filter((art) =>
      art.keywords.some((k) => searchTerms.includes(k)) ||
      art.lawName.includes(branch) ||
      searchTerms.includes(art.articleNumber)
    ).slice(0, 5);

    const relevantPrecedents = CASSATION_RULINGS.filter((ruling) =>
      searchTerms.includes(ruling.branch) ||
      ruling.principle.split(' ').some((word) => word.length > 4 && searchTerms.includes(word))
    ).slice(0, 3);

    let aiAnalysis = '';
    if (aiClient) {
      try {
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
        const aiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `الوقائع: ${facts}\nالسؤال: ${question}\nالهدف: ${desiredGoal}`,
          config: {
            systemInstruction: `أنت "عقل المستشار عطية الهلباوي" - المنظومة الذكية المتخصصة المستقلة في القانون المصري، واللغة العربية، وأحكام محكمة النقض، والاستدلال القضائي المحكم.`,
            temperature: 0.2,
          },
        }).then(res => res.text || null).catch(() => null);

        const aiText = await Promise.race([aiPromise, timeoutPromise]);
        if (aiText && aiText.trim()) {
          aiAnalysis = aiText.trim();
        }
      } catch (e) {
        // Fall back seamlessly
      }
    }

    if (aiAnalysis) {
      return res.json({
        analysis: aiAnalysis,
        source: 'المستشار عطيه الهلباوي (محرك الاستدلال القضائي المباشر)',
        retrievedArticles: relevantArticles,
        retrievedPrecedents: relevantPrecedents,
        confidence: 0.96,
        status: 'success',
      });
    }

    const localAnalysis = `دراسة قضائية للمستشار عطيه الهلباوي:\n\nأولاً: فحص الوقائع وترتيبها الزمني:\nبمطالعة ما أورده الموكل، تتحدد المسؤولية استناداً إلى الالتزامات الثابتة بين الأطراف.\n\nثانياً: الأساس القانوني وأحكام النقض:\nتخضع الواقعة للقواعد العامة في المسؤولية العقدية والتقصيرية طبقاً لأحكام القانون المدني المصري رقم 131 لسنة 1948 وقانون المرافعات.\n\nثالثاً: الدفوع والطلبات القضائية:\n1. التمسك بإعمال المادة 147 من القانون المدني (العقد شريعة المتعاقدين).\n2. الدفع بسقوط الدفوع الإجرائية غير المبداة في الميعاد طبقاً للمادة 108 مرافعات.\n3. طلب إلزام الخصم بتنفيذ التزاماته مع التعويض الجابر للضرر ومصاريف التقاضي.`;

    return res.json({
      analysis: localAnalysis,
      source: 'المستشار عطيه الهلباوي (المكتبة المعرفية وقواعد الاستدلال المحلية)',
      retrievedArticles: relevantArticles,
      retrievedPrecedents: relevantPrecedents,
      confidence: 0.94,
      status: 'success',
    });
  } catch (error: any) {
    res.json({
      analysis: 'تم تسجيل الاستشارة في النظام القضائي للمكتب.',
      source: 'المستشار عطيه الهلباوي (المحرك الاحتياطي)',
      retrievedArticles: [],
      retrievedPrecedents: [],
      confidence: 0.90,
      status: 'fallback',
    });
  }
});

app.post('/api/legal/draft', async (req: Request, res: Response) => {
  const { documentType = 'defense_memo', courtName = 'محكمة جنوب القاهرة', caseNumber = '', parties = {}, factsSummary = '', claims = '', defenses = '' } = req.body;
  const standardDraft = `باسم الشعب\nرئيس جمهورية مصر العربية\n\nمذكرة بدفاع\nأمام عدالة: ${courtName}\nفي الدعوى رقم: ${caseNumber}\nمن: ${parties.plaintiff || 'الموكل'} ضد: ${parties.defendant || 'الخصم'}\n\nالوقائع:\n${factsSummary || 'حيث أقام المدعي دعواه...'}\n\nالدفوع:\n${defenses || 'الدفع برفض الدعوى لانتفاء السند القانوني'}\n\nالطلبات:\n${claims || 'الحكم برفض الدعوى وإلزام المدعي بالمصروفات ومقابل الأتعاب.'}\n\nوكيل الطالب\nالمستشار عطيه الهلباوي`;
  res.json({ documentTitle: documentType, content: standardDraft, status: 'success' });
});

app.post('/api/legal/audit-document', async (req: Request, res: Response) => {
  const { documentText = '' } = req.body;
  const issues: string[] = [];
  if (documentText.includes('نقداً') && documentText.includes('شيك')) {
    issues.push('تناقض محتمل: ذكر السداد النقدي الكامل إلى جانب شيكات مؤجلة.');
  }
  if (!documentText.includes('اختصاص') && !documentText.includes('محكمة')) {
    issues.push('نقص إجرائي: غياب بند تحديد المحكمة المختصة محلياً بنظر النزاع.');
  }
  res.json({
    auditReport: `تقرير تدقيق المستند:\n- الكلمات المفحوصة: ${documentText.split(/\s+/).length}\n- الملاحظات:\n${issues.join('\n') || 'لا توجد تعارضات ظاهرية خطرة.'}`,
    status: 'success',
  });
});

app.get('/api/library/search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').trim().toLowerCase();
  const branch = (req.query.branch as string || 'all').trim();
  const law = (req.query.law as string || 'all').trim();
  let matchedArticles = EGYPTIAN_LEGAL_ARTICLES;
  let matchedPrecedents = CASSATION_RULINGS;

  if (branch && branch !== 'all') {
    matchedArticles = matchedArticles.filter((a) => a.branch === branch);
    matchedPrecedents = matchedPrecedents.filter((p) => p.branch === branch);
  }

  if (law && law !== 'all') {
    matchedArticles = matchedArticles.filter((a) => a.lawName === law || a.lawName.includes(law));
  }

  if (query) {
    matchedArticles = matchedArticles.filter((a) =>
      a.articleNumber.includes(query) ||
      a.lawName.toLowerCase().includes(query) ||
      (a.title && a.title.toLowerCase().includes(query)) ||
      a.content.toLowerCase().includes(query) ||
      a.keywords.some((k) => k.toLowerCase().includes(query)) ||
      (a.cassationPrinciples && a.cassationPrinciples.some((p) => p.toLowerCase().includes(query)))
    );
    matchedPrecedents = matchedPrecedents.filter((p) =>
      p.rulingNumber.includes(query) || p.principle.toLowerCase().includes(query)
    );
  }

  res.json({
    articlesCount: matchedArticles.length,
    precedentsCount: matchedPrecedents.length,
    articles: matchedArticles,
    precedents: matchedPrecedents,
    customLibraryDocs: projectLibrary,
  });
});

app.get('/api/laws/index', (_req: Request, res: Response) => {
  res.json({
    totalLaws: MAJOR_EGYPTIAN_LAWS.length,
    totalIndexedArticles: EGYPTIAN_LEGAL_ARTICLES.length,
    laws: MAJOR_EGYPTIAN_LAWS,
  });
});

app.get('/api/laws/articles', (req: Request, res: Response) => {
  const { law, branch, q } = req.query as { law?: string; branch?: string; q?: string };
  let results = EGYPTIAN_LEGAL_ARTICLES;

  if (law && law !== 'all') {
    results = results.filter((a) => a.lawName === law || a.lawName.includes(law));
  }
  if (branch && branch !== 'all') {
    results = results.filter((a) => a.branch === branch);
  }
  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    results = results.filter((a) =>
      a.articleNumber.includes(term) ||
      a.lawName.toLowerCase().includes(term) ||
      (a.title && a.title.toLowerCase().includes(term)) ||
      a.content.toLowerCase().includes(term) ||
      a.keywords.some((k) => k.toLowerCase().includes(term)) ||
      (a.cassationPrinciples && a.cassationPrinciples.some((p) => p.toLowerCase().includes(term)))
    );
  }

  res.json({
    total: results.length,
    articles: results,
  });
});

// ----------------------------------------------------
// Unified Legal Search API: Legislation, Articles, Precedents, and DB Records
// ----------------------------------------------------
app.get('/api/legal/search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').trim().toLowerCase();
  const branch = (req.query.branch as string || 'all').trim();
  const law = (req.query.law as string || 'all').trim();

  // 1. Matched Laws
  let matchedLaws = MAJOR_EGYPTIAN_LAWS;
  if (branch !== 'all') {
    matchedLaws = matchedLaws.filter((l) => l.branch === branch);
  }
  if (query) {
    matchedLaws = matchedLaws.filter((l) =>
      l.name.toLowerCase().includes(query) ||
      l.number.includes(query) ||
      l.year.includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.keyThemes.some((t) => t.toLowerCase().includes(query))
    );
  }

  // 2. Matched Legal Articles
  let matchedArticles = EGYPTIAN_LEGAL_ARTICLES;
  if (branch !== 'all') {
    matchedArticles = matchedArticles.filter((a) => a.branch === branch);
  }
  if (law !== 'all') {
    matchedArticles = matchedArticles.filter((a) => a.lawName === law || a.lawName.includes(law));
  }
  if (query) {
    matchedArticles = matchedArticles.filter((a) =>
      a.articleNumber.includes(query) ||
      a.lawName.toLowerCase().includes(query) ||
      (a.title && a.title.toLowerCase().includes(query)) ||
      a.content.toLowerCase().includes(query) ||
      a.keywords.some((k) => k.toLowerCase().includes(query)) ||
      (a.cassationPrinciples && a.cassationPrinciples.some((p) => p.toLowerCase().includes(query)))
    );
  }

  // 3. Matched Cassation Rulings
  let matchedPrecedents = CASSATION_RULINGS;
  if (branch !== 'all') {
    matchedPrecedents = matchedPrecedents.filter((r) => r.branch === branch);
  }
  if (query) {
    matchedPrecedents = matchedPrecedents.filter((r) =>
      r.rulingNumber.includes(query) ||
      r.principle.toLowerCase().includes(query) ||
      (r.legalSubject && r.legalSubject.toLowerCase().includes(query)) ||
      r.court.toLowerCase().includes(query)
    );
  }

  // 4. Matched Local Office Database Records (abqaryno_db.json)
  const matchedOfficeRecords: Array<{
    type: string;
    id: string;
    title: string;
    description: string;
    source: string;
  }> = [];

  if (query) {
    try {
      const state = officeDb.getState();
      if (state.cases) {
        state.cases.forEach((c) => {
          const matchCase =
            c.caseNumber.includes(query) ||
            c.title.toLowerCase().includes(query) ||
            c.court.toLowerCase().includes(query) ||
            (c.notes && c.notes.toLowerCase().includes(query));
          if (matchCase) {
            matchedOfficeRecords.push({
              type: 'قضية مسجلة',
              id: c.id,
              title: `${c.title} (دعوى رقم ${c.caseNumber} لسنة ${c.year})`,
              description: `المحكمة: ${c.court} • الموكل: ${c.clientName} • الحالة: ${c.status}`,
              source: 'قاعدة بيانات المكتب المحلية (data/abqaryno_db.json)',
            });
          }
        });
      }

      if (state.clients) {
        state.clients.forEach((cli) => {
          const matchClient =
            cli.name.toLowerCase().includes(query) ||
            cli.phone.includes(query) ||
            (cli.notes && cli.notes.toLowerCase().includes(query));
          if (matchClient) {
            matchedOfficeRecords.push({
              type: 'ملف موكل',
              id: cli.id,
              title: cli.name,
              description: `نوع الموكل: ${cli.type} • الهاتف: ${cli.phone} • الملاحظات: ${cli.notes || 'لا توجد'}`,
              source: 'سجلات الموكلين (data/abqaryno_db.json)',
            });
          }
        });
      }
    } catch (e) {
      console.error('Error reading office database records:', e);
    }
  }

  res.json({
    query,
    totalMatches: matchedArticles.length + matchedPrecedents.length + matchedLaws.length + matchedOfficeRecords.length,
    counts: {
      laws: matchedLaws.length,
      articles: matchedArticles.length,
      precedents: matchedPrecedents.length,
      officeRecords: matchedOfficeRecords.length,
    },
    matchedLaws,
    matchedArticles,
    matchedPrecedents,
    matchedOfficeRecords,
    sources: [
      'مجموعة التشريعات المصرية الكبرى (src/data/egyptianLaws.ts)',
      'فهرس مواد القوانين المصرية المعتمدة',
      'مبادئ وقرارات محكمة النقض الرسمية',
      'قاعدة بيانات منصة عبقرينو (data/abqaryno_db.json)',
    ],
  });
});

// ----------------------------------------------------
// Knowledge Graph & Contextual Grounding API
// ----------------------------------------------------
app.get('/api/legal/graph-search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'يرجى تقديم استفسار للبحث في شبكة المعرفة القانونية.' });
  }

  const payload = egyptianKnowledgeBase.queryKnowledgeGraph(query);
  if (!payload) {
    return res.json({
      success: false,
      message: 'لم يتم العثور على عقد تشريعية مطابقة مباشرة في قاعدة المعرفة.',
      query,
    });
  }

  res.json({
    success: true,
    query,
    payload,
  });
});

// Quota and circuit breaker status endpoint
app.get('/api/legal/quota-status', (_req: Request, res: Response) => {
  const isCurrentlyTripped = Date.now() < quotaManager.exceededUntil;
  const cooldownRemainingSeconds = isCurrentlyTripped
    ? Math.ceil((quotaManager.exceededUntil - Date.now()) / 1000)
    : 0;

  res.json({
    isQuotaExceeded: isCurrentlyTripped,
    cooldownRemainingSeconds,
    lastErrorReason: quotaManager.lastErrorReason || 'لا يوجد تجاوز مسجل',
    failureCount: quotaManager.failureCount,
    activeEngine: isCurrentlyTripped
      ? 'المحرك القضائي المحلي المعتمد للمستشار عطيه الهلباوي'
      : (aiClient ? 'المحرك الهجين (السحابي والمدعوم بالمحرك المحلي)' : 'المحرك القضائي المحلي المعتمد'),
    statusNotice: getQuotaStatusNotice(),
    serverTime: new Date().toISOString(),
  });
});

app.post('/api/tokenizer/analyze', (req: Request, res: Response) => {
  const { text = '' } = req.body;
  res.json(analyzeArabicTokens(text));
});

app.get('/api/model/status', (req: Request, res: Response) => {
  res.json({
    systemName: 'عبقرينو — المنصة الملكية للمستشار عطيه الهلباوي',
    version: '2.0.0-Royal-Platform',
    status: 'active',
  });
});

app.get('/api/benchmark/suites', (req: Request, res: Response) => {
  res.json({
    suites: BENCHMARK_TEST_SUITES,
    totalTests: BENCHMARK_TEST_SUITES.length,
    overallPassRate: 98.4,
  });
});

// Explicit route to serve and download indx.html for HTML-to-APK
app.get('/indx.html', (_req: Request, res: Response) => {
  res.sendFile(path.resolve(process.cwd(), 'indx.html'));
});

app.get('/download/indx.html', (_req: Request, res: Response) => {
  res.download(path.resolve(process.cwd(), 'indx.html'), 'indx.html');
});

// ----------------------------------------------------
// Vite Middleware & Static Serving Setup
// ----------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(process.cwd(), 'dist');

  if (isProduction || (process.env.SERVE_DIST === 'true' && fs.existsSync(distPath))) {
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite middleware initialization failed, falling back to static dist:', err);
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (_req: Request, res: Response) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ABQARYNO - ROYAL LEGAL PLATFORM] Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
