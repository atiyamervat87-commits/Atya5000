import fs from 'fs';
import path from 'path';
import {
  Client,
  LegalCase,
  Hearing,
  DocumentItem,
  TaskItem,
  FinancialTransaction,
  PaymentVerification,
  OfficeSettings,
  AuditLog,
} from '../types/office';

export interface DatabaseState {
  settings: OfficeSettings;
  clients: Client[];
  cases: LegalCase[];
  hearings: Hearing[];
  documents: DocumentItem[];
  tasks: TaskItem[];
  transactions: FinancialTransaction[];
  paymentRequests: PaymentVerification[];
  auditLogs: AuditLog[];
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'abqaryno_db.json');

const INITIAL_STATE: DatabaseState = {
  settings: {
    officeName: 'مكتب المستشار عطيه الهلباوي للمحاماة والاستشارات القانونية',
    counselorName: 'المستشار عطيه الهلباوي',
    title: 'محامٍ بالنقض والدستورية العليا ومجلس الدولة',
    phone: '01153747612',
    secondaryPhone: '01012345678',
    address: 'برج المحامين الملكي - شارع الجمهورية - وسط البلد - القاهرة',
    walletNumber: '01153747612',
    consultationFee: 200,
    currency: 'جنيه مصري',
    email: 'counselor@elhelbawy-law.eg',
    licenseNumber: 'قيد استئناف ونقض 48215 - نقابة المحامين العامة',
  },
  clients: [
    {
      id: 'cli-1',
      name: 'شركة النيل للتطوير والاستثمار العقاري',
      phone: '01099887766',
      nationalId: '10023456789012 (سجل تجاري 84210)',
      email: 'legal@nile-development.eg',
      address: 'التجمع الخامس - القاهرة الجديدة',
      type: 'شركة',
      notes: 'موكل دائم - قضايا عقارات وتراخيص ومنازعات مقاولات',
      createdAt: '2024-01-15T10:00:00.000Z',
    },
    {
      id: 'cli-2',
      name: 'الحاج صابر عبد الفتاح إبراهيم',
      phone: '01155443322',
      nationalId: '27503120104456',
      email: 'saber.fattah@gmail.com',
      address: 'شارع الهرم - الجيزة',
      type: 'فرد',
      notes: 'نزاع تركة وقسمة قضائية وصحة توقيع عقود بيع أطيان',
      createdAt: '2024-02-01T11:30:00.000Z',
    },
    {
      id: 'cli-3',
      name: 'المهندسة منى عثمان الشاذلي',
      phone: '01223344556',
      nationalId: '28609051403218',
      email: 'mona.shazly@outlook.com',
      address: 'المعادي - القاهرة',
      type: 'فرد',
      notes: 'دعوى عمالية - فصل تعسفي ومطالبة بمستحقات مالية ومكافأة نهاية الخدمة',
      createdAt: '2024-03-10T14:15:00.000Z',
    },
    {
      id: 'cli-4',
      name: 'الأستاذ طارق السعدني مصطفى',
      phone: '01001122334',
      nationalId: '27911200109876',
      email: 'tareq.saadani@trade-group.com',
      address: 'مدينة نصر - القاهرة',
      type: 'فرد',
      notes: 'جنحة شيك دون رصيد وخيانة أمانة تجارية',
      createdAt: '2024-03-22T09:00:00.000Z',
    },
  ],
  cases: [
    {
      id: 'case-1',
      caseNumber: '1420',
      year: '2024',
      court: 'محكمة جنوب القاهرة الابتدائية',
      circuit: 'الدائرة (7) مدني كلي',
      type: 'مدني - صحة ونفاذ عقد بيع عقار',
      title: 'دعوى صحة ونفاذ عقد بيع شقة بمدينة نصر',
      clientId: 'cli-1',
      clientName: 'شركة النيل للتطوير والاستثمار العقاري',
      opponentName: 'ممدوح حسن الشناوي',
      opponentLawyer: 'الأستاذ إبراهيم جاد الحق المحامي',
      assignedLawyer: 'المستشار عطيه الهلباوي',
      status: 'متداولة',
      claimAmount: 2500000,
      notes: 'تم تقديم أصل العقد وسداد أمانة الخبير وبانتظار تقرير مكتب الخبراء',
      createdAt: '2024-01-20T12:00:00.000Z',
      nextHearingDate: '2026-11-15',
    },
    {
      id: 'case-2',
      caseNumber: '3180',
      year: '2024',
      court: 'محكمة جنح المعادي الجزئية',
      circuit: 'دائرة الجنح المستأنفة (2)',
      type: 'جنائي - جنحة خيانة أمانة',
      title: 'جنحة تبديد منقولات وأمانة تجارية',
      clientId: 'cli-4',
      clientName: 'الأستاذ طارق السعدني مصطفى',
      opponentName: 'سعيد عبد العال المنياوي',
      opponentLawyer: 'الأستاذ محمود زكي المحامي',
      assignedLawyer: 'المستشار عطيه الهلباوي',
      status: 'متداولة',
      claimAmount: 750000,
      notes: 'تم الدفع بمدنية النزاع ووجود شراكة تجارية وحساب جارٍ بين الطرفين',
      createdAt: '2024-03-25T10:00:00.000Z',
      nextHearingDate: '2026-11-08',
    },
    {
      id: 'case-3',
      caseNumber: '890',
      year: '2024',
      court: 'محكمة الجيزة الابتدائية',
      circuit: 'الدائرة (3) عمال كلي',
      type: 'عمالي - تعويض عن فصل تعسفي',
      title: 'دعوى تعويض عن فصل تعسفي ومستحقات مهلة الإخطار',
      clientId: 'cli-3',
      clientName: 'المهندسة منى عثمان الشاذلي',
      opponentName: 'شركة النظم الحديثة للتكنولوجيا',
      opponentLawyer: 'المستشار القانوني للشركة',
      assignedLawyer: 'أ/ سامح فرج المحامي بالمكتب',
      status: 'متداولة',
      claimAmount: 320000,
      notes: 'تمت إحالة الدعوى للتحقيق لإثبات واقعة منعها من الحضور والبصمة',
      createdAt: '2024-03-15T11:00:00.000Z',
      nextHearingDate: '2026-11-20',
    },
    {
      id: 'case-4',
      caseNumber: '5520',
      year: '2023',
      court: 'محكمة استئناف عالي القاهرة',
      circuit: 'الدائرة (18) تجاري',
      type: 'تجاري - فسخ عقد توريد ومطالبة بالشرط الجزائي',
      title: 'استئناف حكم تعويض في عقد توريد خامات',
      clientId: 'cli-1',
      clientName: 'شركة النيل للتطوير والاستثمار العقاري',
      opponentName: 'مؤسسة الدلتا للمقاولات العامة',
      opponentLawyer: 'الأستاذ نبيل فوزي المحامي بالنقض',
      assignedLawyer: 'المستشار عطيه الهلباوي',
      status: 'محكوم فيها',
      claimAmount: 1800000,
      notes: 'صدر الحكم لصالح الموكل بالتعويض الكامل وتأييد الحكم الابتدائي وجارٍ اتخاذ إجراءات الصيغة التنفيذية',
      createdAt: '2023-11-10T14:00:00.000Z',
      nextHearingDate: undefined,
    },
  ],
  hearings: [
    {
      id: 'hear-1',
      caseId: 'case-2',
      caseNumber: '3180 / 2024',
      court: 'محكمة جنح المعادي',
      circuit: 'دائرة الجنح المستأنفة (2)',
      date: '2026-11-08',
      time: '09:30 ص',
      decision: 'الجلسة محددة لسماع مرافعة الدفاع في الدفع بمدنية النزاع وبطلان التسليم',
      requirements: 'تجهيز حافظة مستندات تتضمن عقد الشركة وتصفية الحساب البنكي المشترك',
      nextAction: 'تقديم المرافعة الشفوية والمذكرة القانونية',
      nextDate: '2026-11-22',
      attended: false,
    },
    {
      id: 'hear-2',
      caseId: 'case-1',
      caseNumber: '1420 / 2024',
      court: 'محكمة جنوب القاهرة الابتدائية',
      circuit: 'الدائرة (7) مدني كلي',
      date: '2026-11-15',
      time: '10:00 ص',
      decision: 'جلسة ورود تقرير مكتب خبراء وزارة العدل جنوب القاهرة',
      requirements: 'استخراج شهادة بسداد كامل أمانة الخبير ومتابعة إيداع التقرير',
      nextAction: 'الاطلاع على تقرير الخبير وإبداء الملاحظات والطعن عليه إن لزم',
      nextDate: '2026-12-05',
      attended: false,
    },
    {
      id: 'hear-3',
      caseId: 'case-3',
      caseNumber: '890 / 2024',
      court: 'محكمة الجيزة الابتدائية',
      circuit: 'الدائرة (3) عمال كلي',
      date: '2026-11-20',
      time: '10:30 ص',
      decision: 'جلسة سماع شهود المدعية لإثبات واقعة الفصل التعسفي ومنع الدخول',
      requirements: 'حضور شاهدي الإثبات (زملاء العمل السابقين) بالجلسة',
      nextAction: 'مناقشة الشهود وإثبات أقوالهم بمحضر الجلسة',
      nextDate: '2026-12-10',
      attended: false,
    },
  ],
  documents: [
    {
      id: 'doc-1',
      caseId: 'case-1',
      caseNumber: '1420 / 2024',
      clientId: 'cli-1',
      clientName: 'شركة النيل للتطوير والاستثمار العقاري',
      title: 'مذكرة بدفاع المشتري في دعوى صحة ونفاذ عقد بيع',
      category: 'مذكرة دفاع',
      fileName: 'مذكرة_دفاع_صحة_ونفاذ_عقد_بيع.docx',
      fileSize: '48.2 KB',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      notes: 'تأصيل صحة التوقيع وأركان العقد وانتقال الملكية وسداد كامل الثمن',
      uploadedAt: '2024-03-01T12:00:00.000Z',
    },
    {
      id: 'doc-2',
      caseId: 'case-2',
      caseNumber: '3180 / 2024',
      clientId: 'cli-4',
      clientName: 'الأستاذ طارق السعدني مصطفى',
      title: 'صحيفة الدفع بمدنية النزاع في جنحة خيانة أمانة',
      category: 'مذكرة دفاع',
      fileName: 'مذكرة_انتفاء_القصد_الجنائي_خيانة_أمانة.pdf',
      fileSize: '124.5 KB',
      fileType: 'application/pdf',
      notes: 'مستندة إلى أحكام محكمة النقض في انتفاء ركن التسليم وعقد الوديعة',
      uploadedAt: '2024-04-10T09:30:00.000Z',
    },
    {
      id: 'doc-3',
      caseId: 'case-3',
      caseNumber: '890 / 2024',
      clientId: 'cli-3',
      clientName: 'المهندسة منى عثمان الشاذلي',
      title: 'عقد العمل المبرم ومستندات تقرير مكتب العمل',
      category: 'عقد',
      fileName: 'عقد_العمل_وشكوى_مكتب_العمل.pdf',
      fileSize: '312.0 KB',
      fileType: 'application/pdf',
      notes: 'صورة رسمية من شكوى مكتب العمل بتقرير تعذر التسوية الودية',
      uploadedAt: '2024-03-18T14:20:00.000Z',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'سحب صورة رسمية من تقرير الخبير الهندسي',
      description: 'مراجعة سكرتارية الدائرة السابعة مدني كلي جنوب القاهرة واستلام نسخة التقرير',
      caseId: 'case-1',
      caseNumber: '1420 / 2024',
      clientId: 'cli-1',
      assignee: 'أ/ سامح فرج المحامي',
      dueDate: '2026-11-10',
      priority: 'عاجل',
      status: 'قيد التنفيذ',
    },
    {
      id: 'task-2',
      title: 'إعلان الشهود لجلسة التحقيق العمالي',
      description: 'استلام أصل صحيفة الإعلان من قلم المحضرين وتسليمها للمحكمة',
      caseId: 'case-3',
      caseNumber: '890 / 2024',
      clientId: 'cli-3',
      assignee: 'أ/ أحمد ربيع الكاتب الإداري',
      dueDate: '2026-11-12',
      priority: 'هام',
      status: 'قيد الانتظار',
    },
    {
      id: 'task-3',
      title: 'إيداع مذكرة الدفاع الختامية في جنحة المعادي',
      description: 'طباعة وتجليد المذكرة مع حوافظ المستندات المودعة بالتوكيل',
      caseId: 'case-2',
      caseNumber: '3180 / 2024',
      clientId: 'cli-4',
      assignee: 'المستشار عطيه الهلباوي',
      dueDate: '2026-11-06',
      priority: 'عاجل',
      status: 'قيد التنفيذ',
    },
  ],
  transactions: [
    {
      id: 'trn-1',
      type: 'أتعاب متفق عليها',
      clientId: 'cli-1',
      clientName: 'شركة النيل للتطوير والاستثمار العقاري',
      caseId: 'case-1',
      caseNumber: '1420 / 2024',
      amount: 45000,
      date: '2024-01-20',
      paymentMethod: 'تحويل بنكي',
      invoiceNumber: 'INV-2024-001',
      notes: 'إجمالي الأتعاب التعاقدية عن مباشرة دعوى صحة ونفاذ العقد حتى صدور الحكم النهائي',
    },
    {
      id: 'trn-2',
      type: 'دفعة محصلة',
      clientId: 'cli-1',
      clientName: 'شركة النيل للتطوير والاستثمار العقاري',
      caseId: 'case-1',
      caseNumber: '1420 / 2024',
      amount: 25000,
      date: '2024-01-22',
      paymentMethod: 'تحويل بنكي',
      invoiceNumber: 'REC-2024-001',
      notes: 'الدفعة الأولى المقدمة عند التعاقد وإيداع صحيفة الدعوى',
    },
    {
      id: 'trn-3',
      type: 'مصروفات قضائية',
      clientId: 'cli-1',
      clientName: 'شركة النيل للتطوير والاستثمار العقاري',
      caseId: 'case-1',
      caseNumber: '1420 / 2024',
      amount: 4200,
      date: '2024-02-05',
      paymentMethod: 'نقدي',
      invoiceNumber: 'EXP-2024-001',
      notes: 'رسوم قيد الدعوى وإعلان صحيفة الافتتاح وشهر العريضة بالشهر العقاري',
    },
    {
      id: 'trn-4',
      type: 'أتعاب متفق عليها',
      clientId: 'cli-4',
      clientName: 'الأستاذ طارق السعدني مصطفى',
      caseId: 'case-2',
      caseNumber: '3180 / 2024',
      amount: 20000,
      date: '2024-03-25',
      paymentMethod: 'نقدي',
      invoiceNumber: 'INV-2024-002',
      notes: 'أتعاب المرافعة في جنحة خيانة الأمانة أمام محكمتي أول درجة والاستئناف',
    },
    {
      id: 'trn-5',
      type: 'دفعة محصلة',
      clientId: 'cli-4',
      clientName: 'الأستاذ طارق السعدني مصطفى',
      caseId: 'case-2',
      caseNumber: '3180 / 2024',
      amount: 15000,
      date: '2024-03-25',
      paymentMethod: 'فودافون كاش',
      invoiceNumber: 'REC-2024-002',
      notes: 'سداد دفعة الأتعاب عبر محفظة فودافون كاش 01153747612',
    },
    {
      id: 'trn-6',
      type: 'أتعاب متفق عليها',
      clientId: 'cli-3',
      clientName: 'المهندسة منى عثمان الشاذلي',
      caseId: 'case-3',
      caseNumber: '890 / 2024',
      amount: 18000,
      date: '2024-03-15',
      paymentMethod: 'إنستاباي',
      invoiceNumber: 'INV-2024-003',
      notes: 'أتعاب تمثيل الموكلة في الدعوى العمالية بمحكمة الجيزة',
    },
    {
      id: 'trn-7',
      type: 'دفعة محصلة',
      clientId: 'cli-3',
      clientName: 'المهندسة منى عثمان الشاذلي',
      caseId: 'case-3',
      caseNumber: '890 / 2024',
      amount: 10000,
      date: '2024-03-16',
      paymentMethod: 'إنستاباي',
      invoiceNumber: 'REC-2024-003',
      notes: 'الدفعة الأولى محولة بحساب إنستاباي',
    },
    {
      id: 'trn-8',
      type: 'رسوم إعلان وخبرة',
      clientId: 'cli-1',
      clientName: 'شركة النيل للتطوير والاستثمار العقاري',
      caseId: 'case-1',
      caseNumber: '1420 / 2024',
      amount: 3000,
      date: '2024-03-02',
      paymentMethod: 'نقدي',
      invoiceNumber: 'EXP-2024-002',
      notes: 'سداد أمانة الخبير الهندسي بخزينة محكمة جنوب القاهرة الابتدائية',
    },
  ],
  paymentRequests: [
    {
      id: 'pay-demo-1',
      userId: 'user-demo-active',
      userName: 'المهندس كريم حاتم',
      phone: '01011223344',
      amount: 200,
      walletNumber: '01153747612',
      referenceNumber: 'VF-94821035',
      proofNote: 'تم تحويل 200 جنيه عبر فودافون كاش لجلسة استشارة خاصة عاجلة',
      status: 'approved',
      submittedAt: '2024-10-20T14:30:00.000Z',
      reviewedBy: 'المستشار عطيه الهلباوي (المالك)',
      reviewedAt: '2024-10-20T14:35:00.000Z',
    },
    {
      id: 'pay-demo-2',
      userId: 'user-pending-test',
      userName: 'الأستاذة رانيا الصاوي',
      phone: '01199884422',
      amount: 200,
      walletNumber: '01153747612',
      referenceNumber: 'VF-77821944',
      proofNote: 'تم التحويل قبل قليل وأرفق رقم العملية برجاء اعتماد الاستحقاق',
      status: 'under_review',
      submittedAt: '2024-10-22T17:15:00.000Z',
    },
  ],
  auditLogs: [
    {
      id: 'log-1',
      action: 'تهيئة المنظومة الملكية',
      details: 'تم إنشاء مستودع البيانات التأسيسي وتأكيد الهوية الملكية وقواعد الصلاحيات',
      performedBy: 'النظام الآلي - عبقرينو',
      timestamp: '2024-10-22T18:00:00.000Z',
    },
    {
      id: 'log-2',
      action: 'اعتماد دفع استشارة خاصة',
      details: 'تم التحقق من تحويل 200 جنيه للمحفظة 01153747612 للعميل كريم حاتم واعتماد دخوله',
      performedBy: 'المستشار عطيه الهلباوي (المالك)',
      timestamp: '2024-10-20T14:35:00.000Z',
    },
  ],
};

class OfficeDatabase {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadDatabase();
  }

  private loadDatabase(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return { ...INITIAL_STATE, ...parsed };
      }
    } catch (err) {
      console.error('Error loading database from file, using initial state:', err);
    }
    this.saveDatabase(INITIAL_STATE);
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  public saveDatabase(stateToSave?: DatabaseState): void {
    try {
      const data = stateToSave || this.state;
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public logAudit(action: string, details: string, performedBy: string): void {
    const entry: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      details,
      performedBy,
      timestamp: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(entry);
    // Keep max 200 logs
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
    this.saveDatabase();
  }

  // --- Clients CRUD ---
  public getClients(): Client[] {
    return this.state.clients;
  }

  public addClient(client: Omit<Client, 'id' | 'createdAt'>, user: string): Client {
    const newClient: Client = {
      ...client,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.clients.unshift(newClient);
    this.logAudit('إضافة موكل', `تم إضافة الموكل: ${newClient.name}`, user);
    this.saveDatabase();
    return newClient;
  }

  public updateClient(id: string, updates: Partial<Client>, user: string): Client | null {
    const index = this.state.clients.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.state.clients[index] = { ...this.state.clients[index], ...updates };
    this.logAudit('تعديل موكل', `تم تعديل بيانات الموكل: ${this.state.clients[index].name}`, user);
    this.saveDatabase();
    return this.state.clients[index];
  }

  public deleteClient(id: string, user: string): boolean {
    const client = this.state.clients.find((c) => c.id === id);
    if (!client) return false;
    this.state.clients = this.state.clients.filter((c) => c.id !== id);
    this.logAudit('حذف موكل', `تم حذف الموكل: ${client.name}`, user);
    this.saveDatabase();
    return true;
  }

  // --- Cases CRUD ---
  public getCases(): LegalCase[] {
    return this.state.cases;
  }

  public addCase(caseData: Omit<LegalCase, 'id' | 'createdAt'>, user: string): LegalCase {
    const newCase: LegalCase = {
      ...caseData,
      id: `case-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.cases.unshift(newCase);
    this.logAudit('تسجيل قضية', `تم تسجيل القضية رقم ${newCase.caseNumber} / ${newCase.year} - ${newCase.court}`, user);
    this.saveDatabase();
    return newCase;
  }

  public updateCase(id: string, updates: Partial<LegalCase>, user: string): LegalCase | null {
    const index = this.state.cases.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.state.cases[index] = { ...this.state.cases[index], ...updates };
    this.logAudit('تعديل قضية', `تم تعديل القضية رقم ${this.state.cases[index].caseNumber}`, user);
    this.saveDatabase();
    return this.state.cases[index];
  }

  public deleteCase(id: string, user: string): boolean {
    const legalCase = this.state.cases.find((c) => c.id === id);
    if (!legalCase) return false;
    this.state.cases = this.state.cases.filter((c) => c.id !== id);
    this.logAudit('حذف قضية', `تم حذف القضية: ${legalCase.caseNumber} / ${legalCase.year}`, user);
    this.saveDatabase();
    return true;
  }

  // --- Hearings CRUD ---
  public getHearings(): Hearing[] {
    return this.state.hearings;
  }

  public addHearing(hearing: Omit<Hearing, 'id'>, user: string): Hearing {
    const newHearing: Hearing = {
      ...hearing,
      id: `hear-${Date.now()}`,
    };
    this.state.hearings.unshift(newHearing);
    // update next hearing date on case if provided
    if (hearing.caseId && hearing.date) {
      const targetCase = this.state.cases.find((c) => c.id === hearing.caseId);
      if (targetCase) {
        targetCase.nextHearingDate = hearing.date;
      }
    }
    this.logAudit('تسجيل جلسة', `تم تسجيل جلسة بتاريخ ${hearing.date} للقضية ${hearing.caseNumber}`, user);
    this.saveDatabase();
    return newHearing;
  }

  public updateHearing(id: string, updates: Partial<Hearing>, user: string): Hearing | null {
    const index = this.state.hearings.findIndex((h) => h.id === id);
    if (index === -1) return null;
    this.state.hearings[index] = { ...this.state.hearings[index], ...updates };
    this.logAudit('تحديث جلسة', `تم تحديث جلسة القضية ${this.state.hearings[index].caseNumber}`, user);
    this.saveDatabase();
    return this.state.hearings[index];
  }

  public deleteHearing(id: string, user: string): boolean {
    const hearing = this.state.hearings.find((h) => h.id === id);
    if (!hearing) return false;
    this.state.hearings = this.state.hearings.filter((h) => h.id !== id);
    this.logAudit('حذف جلسة', `تم حذف جلسة القضية ${hearing.caseNumber}`, user);
    this.saveDatabase();
    return true;
  }

  // --- Documents CRUD ---
  public getDocuments(): DocumentItem[] {
    return this.state.documents;
  }

  public addDocument(doc: Omit<DocumentItem, 'id' | 'uploadedAt'>, user: string): DocumentItem {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    this.state.documents.unshift(newDoc);
    this.logAudit('إيداع مستند', `تم إيداع المستند: ${newDoc.title} (${newDoc.fileName})`, user);
    this.saveDatabase();
    return newDoc;
  }

  public deleteDocument(id: string, user: string): boolean {
    const doc = this.state.documents.find((d) => d.id === id);
    if (!doc) return false;
    this.state.documents = this.state.documents.filter((d) => d.id !== id);
    this.logAudit('حذف مستند', `تم حذف المستند: ${doc.title}`, user);
    this.saveDatabase();
    return true;
  }

  // --- Tasks CRUD ---
  public getTasks(): TaskItem[] {
    return this.state.tasks;
  }

  public addTask(task: Omit<TaskItem, 'id'>, user: string): TaskItem {
    const newTask: TaskItem = {
      ...task,
      id: `task-${Date.now()}`,
    };
    this.state.tasks.unshift(newTask);
    this.logAudit('إسناد مهمة', `تم إسناد مهمة: ${newTask.title} إلى ${newTask.assignee}`, user);
    this.saveDatabase();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<TaskItem>, user: string): TaskItem | null {
    const index = this.state.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.state.tasks[index] = { ...this.state.tasks[index], ...updates };
    this.logAudit('تحديث مهمة', `تم تعديل حالة المهمة: ${this.state.tasks[index].title}`, user);
    this.saveDatabase();
    return this.state.tasks[index];
  }

  public deleteTask(id: string, user: string): boolean {
    const task = this.state.tasks.find((t) => t.id === id);
    if (!task) return false;
    this.state.tasks = this.state.tasks.filter((t) => t.id !== id);
    this.logAudit('حذف مهمة', `تم حذف المهمة: ${task.title}`, user);
    this.saveDatabase();
    return true;
  }

  // --- Financials CRUD ---
  public getTransactions(): FinancialTransaction[] {
    return this.state.transactions;
  }

  public addTransaction(trx: Omit<FinancialTransaction, 'id'>, user: string): FinancialTransaction {
    const newTrx: FinancialTransaction = {
      ...trx,
      id: `trn-${Date.now()}`,
    };
    this.state.transactions.unshift(newTrx);
    this.logAudit('تسجيل حركة مالية', `تم تسجيل ${newTrx.type} بمبلغ ${newTrx.amount} جنيه للموكل ${newTrx.clientName}`, user);
    this.saveDatabase();
    return newTrx;
  }

  public deleteTransaction(id: string, user: string): boolean {
    const trx = this.state.transactions.find((t) => t.id === id);
    if (!trx) return false;
    this.state.transactions = this.state.transactions.filter((t) => t.id !== id);
    this.logAudit('حذف حركة مالية', `تم حذف الحركة المالية: ${trx.type} بمبلغ ${trx.amount}`, user);
    this.saveDatabase();
    return true;
  }

  // --- Settings ---
  public getSettings(): OfficeSettings {
    return this.state.settings;
  }

  public updateSettings(settings: Partial<OfficeSettings>, user: string): OfficeSettings {
    this.state.settings = { ...this.state.settings, ...settings };
    this.logAudit('تعديل إعدادات المكتب', 'تم تعديل البيانات الرسمية للمكتب والمحفظة', user);
    this.saveDatabase();
    return this.state.settings;
  }

  // --- Payments & Private Consultation Gate ---
  public getPaymentRequests(): PaymentVerification[] {
    return this.state.paymentRequests;
  }

  public submitPaymentProof(data: {
    userId: string;
    userName: string;
    phone: string;
    referenceNumber: string;
    proofNote?: string;
    proofImageUrl?: string;
  }): PaymentVerification {
    const newRequest: PaymentVerification = {
      id: `pay-${Date.now()}`,
      userId: data.userId,
      userName: data.userName,
      phone: data.phone,
      amount: this.state.settings.consultationFee,
      walletNumber: this.state.settings.walletNumber,
      referenceNumber: data.referenceNumber,
      proofNote: data.proofNote,
      proofImageUrl: data.proofImageUrl,
      status: 'under_review',
      submittedAt: new Date().toISOString(),
    };
    this.state.paymentRequests.unshift(newRequest);
    this.logAudit('طلب استشارة خاصة', `تم تقديم إثبات سداد 200 جنيه برقم مرجعي ${data.referenceNumber} للمستخدم ${data.userName}`, data.userName);
    this.saveDatabase();
    return newRequest;
  }

  public verifyPayment(
    paymentId: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    rejectionReason?: string
  ): PaymentVerification | null {
    const req = this.state.paymentRequests.find((p) => p.id === paymentId);
    if (!req) return null;
    req.status = status;
    req.reviewedBy = reviewedBy;
    req.reviewedAt = new Date().toISOString();
    if (rejectionReason) req.rejectionReason = rejectionReason;

    this.logAudit(
      status === 'approved' ? 'قبول استحقاق استشارة خاصة' : 'رفض استحقاق استشارة خاصة',
      `الطلب ${paymentId} للمستخدم ${req.userName} تم ${status === 'approved' ? 'قبوله' : 'رفضه'} بواسطة ${reviewedBy}`,
      reviewedBy
    );
    this.saveDatabase();
    return req;
  }

  // Quick verification for testing user session
  public quickVerifyUser(userId: string, userName: string, isApproved: boolean): boolean {
    const existing = this.state.paymentRequests.find((p) => p.userId === userId);
    if (existing) {
      existing.status = isApproved ? 'approved' : 'unpaid';
      existing.reviewedBy = 'المستشار عطيه الهلباوي (المالك)';
      existing.reviewedAt = new Date().toISOString();
    } else if (isApproved) {
      this.state.paymentRequests.unshift({
        id: `pay-${Date.now()}`,
        userId,
        userName,
        phone: '01153747612',
        amount: 200,
        walletNumber: this.state.settings.walletNumber,
        referenceNumber: `FAST-${Date.now().toString().slice(-6)}`,
        status: 'approved',
        submittedAt: new Date().toISOString(),
        reviewedBy: 'المستشار عطيه الهلباوي (المالك)',
        reviewedAt: new Date().toISOString(),
      });
    }
    this.saveDatabase();
    return true;
  }

  // --- Statistics Calculation ---
  public getOfficeStatistics() {
    const totalCases = this.state.cases.length;
    const activeCases = this.state.cases.filter((c) => c.status === 'متداولة' || c.status === 'مؤجلة').length;
    const closedCases = this.state.cases.filter((c) => c.status === 'محكوم فيها' || c.status === 'منتهية').length;

    const totalClients = this.state.clients.length;
    const upcomingHearings = this.state.hearings.filter((h) => {
      if (!h.date) return false;
      return new Date(h.date) >= new Date(new Date().setHours(0, 0, 0, 0));
    }).length;

    const pendingTasks = this.state.tasks.filter((t) => t.status !== 'مكتملة' && t.status !== 'ملغاة').length;

    let totalAgreedFees = 0;
    let totalCollected = 0;
    let totalExpenses = 0;

    for (const trx of this.state.transactions) {
      if (trx.type === 'أتعاب متفق عليها') totalAgreedFees += trx.amount;
      else if (trx.type === 'دفعة محصلة') totalCollected += trx.amount;
      else if (trx.type === 'مصروفات قضائية' || trx.type === 'رسوم إعلان وخبرة' || trx.type === 'دمغات وتوكيلات') {
        totalExpenses += trx.amount;
      }
    }

    const uncollectedFees = Math.max(0, totalAgreedFees - totalCollected);
    const netBalance = totalCollected - totalExpenses;

    return {
      totalCases,
      activeCases,
      closedCases,
      totalClients,
      upcomingHearings,
      pendingTasks,
      totalAgreedFees,
      totalCollected,
      totalExpenses,
      uncollectedFees,
      netBalance,
      approvedConsultations: this.state.paymentRequests.filter((p) => p.status === 'approved').length,
      pendingPayments: this.state.paymentRequests.filter((p) => p.status === 'under_review').length,
    };
  }

  // --- Natural Language Arabic Query Processor for Smart Reports ---
  public executeSmartQueryReport(userQuery: string): {
    title: string;
    queryPrompt: string;
    executiveSummary: string;
    filtersApplied: string[];
    period?: string;
    metrics: Record<string, any>;
    tableHeaders: string[];
    tableRows: any[][];
    isEmpty: boolean;
  } {
    const q = (userQuery || '').trim().toLowerCase();
    const stats = this.getOfficeStatistics();

    // 1. Financial Report Query
    if (q.includes('مالي') || q.includes('أتعاب') || q.includes('مصروفات') || q.includes('تحصيل') || q.includes('حسابات')) {
      const rows = this.state.transactions.map((t) => [
        t.date,
        t.type,
        t.clientName,
        t.caseNumber || 'عام',
        `${t.amount.toLocaleString()} ج.م`,
        t.paymentMethod,
        t.notes || '-',
      ]);

      return {
        title: 'التقرير المالي الذكي للأتعاب والمصروفات والتحصيل',
        queryPrompt: userQuery,
        executiveSummary: `بلغ إجمالي الأتعاب المتفق عليها المسجلة ${stats.totalAgreedFees.toLocaleString()} جنيه مصري، تم تحصيل مبلغ ${stats.totalCollected.toLocaleString()} جنيه مصري منها بالفعل بنسبة تحصيل بلغت ${stats.totalAgreedFees > 0 ? Math.round((stats.totalCollected / stats.totalAgreedFees) * 100) : 0}%، في حين بلغت المصروفات والرسوم القضائية ${stats.totalExpenses.toLocaleString()} جنيه مصري، ويتبقى أتعاب غير محصلة قدرها ${stats.uncollectedFees.toLocaleString()} جنيه مصري، مما يسفر عن صافي دخل نقدي قدره ${stats.netBalance.toLocaleString()} جنيه مصري.`,
        filtersApplied: ['النوع: الحركات المالية المعتمدة', 'العملة: الجنيه المصري'],
        metrics: {
          'الأتعاب المتفق عليها': `${stats.totalAgreedFees.toLocaleString()} ج.م`,
          'المبالغ المحصلة فعلياً': `${stats.totalCollected.toLocaleString()} ج.م`,
          'المصروفات والرسوم': `${stats.totalExpenses.toLocaleString()} ج.م`,
          'الأتعاب غير المحصلة (المتبقية)': `${stats.uncollectedFees.toLocaleString()} ج.م`,
          'صافي الإيراد النقدي': `${stats.netBalance.toLocaleString()} ج.م`,
        },
        tableHeaders: ['التاريخ', 'نوع الحركة', 'الموكل', 'رقم القضية', 'المبلغ', 'طريقة السداد', 'البيان'],
        tableRows: rows,
        isEmpty: rows.length === 0,
      };
    }

    // 2. Hearings Report Query
    if (q.includes('جلسات') || q.includes('جلسة') || q.includes('مواعيد المحاكم')) {
      let filteredHearings = this.state.hearings;
      if (q.includes('قادمة') || q.includes('المقبلة')) {
        filteredHearings = filteredHearings.filter((h) => new Date(h.date) >= new Date(new Date().setHours(0, 0, 0, 0)));
      }

      const rows = filteredHearings.map((h) => [
        h.date,
        h.time || '10:00 ص',
        h.court,
        h.caseNumber,
        h.requirements || '-',
        h.decision || 'قيد الانتظار',
        h.nextAction || '-',
      ]);

      return {
        title: 'تقرير الجلسات والأجندة القضائية',
        queryPrompt: userQuery,
        executiveSummary: `رصدت المنظومة عدد (${filteredHearings.length}) جلسات مسجلة في رول المحاكم. تشمل الجلسات القادمة استحقاقات جوهرية كإيداع تقارير الخبراء، وسماع شهود الإثبات، وتقديم مذكرات الدفاع الختامية.`,
        filtersApplied: [q.includes('قادمة') ? 'الفلتر: الجلسات القادمة فقط' : 'الفلتر: جميع الجلسات المسجلة'],
        metrics: {
          'إجمالي الجلسات': filteredHearings.length,
          'محكمة جنوب القاهرة': filteredHearings.filter((h) => h.court.includes('جنوب القاهرة')).length,
          'محكمة جنح المعادي': filteredHearings.filter((h) => h.court.includes('المعادي')).length,
          'محكمة الجيزة': filteredHearings.filter((h) => h.court.includes('الجيزة')).length,
        },
        tableHeaders: ['تاريخ الجلسة', 'الموعد', 'المحكمة', 'رقم القضية', 'المطلوب بالجلسة', 'قرار المحكمة / النتيجة', 'الإجراء التالي'],
        tableRows: rows,
        isEmpty: rows.length === 0,
      };
    }

    // 3. Client Specific Report
    const matchedClient = this.state.clients.find((c) => q.includes(c.name.toLowerCase()) || q.includes(c.phone));
    if (matchedClient) {
      const clientCases = this.state.cases.filter((c) => c.clientId === matchedClient.id);
      const clientTrx = this.state.transactions.filter((t) => t.clientId === matchedClient.id);
      const clientDocs = this.state.documents.filter((d) => d.clientId === matchedClient.id);

      const rows = clientCases.map((c) => [
        `${c.caseNumber} / ${c.year}`,
        c.court,
        c.type,
        c.opponentName,
        c.status,
        c.nextHearingDate || 'لا توجد جلسة محددة',
      ]);

      const clientAgreed = clientTrx.filter((t) => t.type === 'أتعاب متفق عليها').reduce((s, x) => s + x.amount, 0);
      const clientPaid = clientTrx.filter((t) => t.type === 'دفعة محصلة').reduce((s, x) => s + x.amount, 0);

      return {
        title: `تقرير الملف الشامل للموكل: ${matchedClient.name}`,
        queryPrompt: userQuery,
        executiveSummary: `الموكل (${matchedClient.name}) مقيد تحت رقم هاتف (${matchedClient.phone}). لديه عدد (${clientCases.length}) قضايا مسجلة بالمكتب، ومودع له (${clientDocs.length}) مستندات رسمية. الموقف المالي: إجمالي الأتعاب المتفق عليها ${clientAgreed.toLocaleString()} ج.م، المسدد منها ${clientPaid.toLocaleString()} ج.م، والمتبقي في ذمته ${Math.max(0, clientAgreed - clientPaid).toLocaleString()} ج.م.`,
        filtersApplied: [`الموكل المحدد: ${matchedClient.name}`, `النوع: ${matchedClient.type}`],
        metrics: {
          'عدد القضايا': clientCases.length,
          'القضايا المتداولة': clientCases.filter((c) => c.status === 'متداولة').length,
          'إجمالي الأتعاب': `${clientAgreed.toLocaleString()} ج.م`,
          'المسدد': `${clientPaid.toLocaleString()} ج.م`,
          'المتبقي': `${Math.max(0, clientAgreed - clientPaid).toLocaleString()} ج.م`,
        },
        tableHeaders: ['رقم القضية والسنة', 'المحكمة', 'نوع الدعوى', 'الخصم', 'الحالة الراهنة', 'الجلسة القادمة'],
        tableRows: rows,
        isEmpty: rows.length === 0,
      };
    }

    // 4. Tasks & Procedures Report
    if (q.includes('مهام') || q.includes('مهمة') || q.includes('إجراءات')) {
      const rows = this.state.tasks.map((t) => [
        t.title,
        t.assignee,
        t.priority,
        t.dueDate,
        t.status,
        t.caseNumber || '-',
      ]);

      return {
        title: 'تقرير متابعة المهام والإجراءات التنفيذية',
        queryPrompt: userQuery,
        executiveSummary: `إجمالي المهام المسجلة في جدول أعمال المكتب هو (${this.state.tasks.length}) مهمة. منها عدد (${this.state.tasks.filter((t) => t.priority === 'عاجل').length}) مهام ذات أولوية قصوى عاجلة يجب إنجازها لتفادي فوات المواعيد الإجرائية.`,
        filtersApplied: ['الفلاتر: جميع المهام الإدارية والقضائية'],
        metrics: {
          'إجمالي المهام': this.state.tasks.length,
          'قيد التنفيذ': this.state.tasks.filter((t) => t.status === 'قيد التنفيذ').length,
          'قيد الانتظار': this.state.tasks.filter((t) => t.status === 'قيد الانتظار').length,
          'المهام العاجلة': this.state.tasks.filter((t) => t.priority === 'عاجل').length,
        },
        tableHeaders: ['المهمة المطلوبة', 'المسؤول عنها', 'الأولوية', 'الموعد الأقصى', 'الحالة', 'رقم القضية المرتبطة'],
        tableRows: rows,
        isEmpty: rows.length === 0,
      };
    }

    // 5. Default / General Cases Report (Filtered or Comprehensive)
    let filteredCases = this.state.cases;
    const filters: string[] = [];

    if (q.includes('متداولة') || q.includes('جارية')) {
      filteredCases = filteredCases.filter((c) => c.status === 'متداولة');
      filters.push('الحالة: متداولة فقط');
    } else if (q.includes('محكوم') || q.includes('منتهية')) {
      filteredCases = filteredCases.filter((c) => c.status === 'محكوم فيها' || c.status === 'منتهية');
      filters.push('الحالة: محكوم فيها أو منتهية');
    }

    if (q.includes('جنوب القاهرة')) {
      filteredCases = filteredCases.filter((c) => c.court.includes('جنوب القاهرة'));
      filters.push('المحكمة: جنوب القاهرة');
    } else if (q.includes('المعادي')) {
      filteredCases = filteredCases.filter((c) => c.court.includes('المعادي'));
      filters.push('المحكمة: المعادي');
    } else if (q.includes('الجيزة')) {
      filteredCases = filteredCases.filter((c) => c.court.includes('الجيزة'));
      filters.push('المحكمة: الجيزة');
    }

    const rows = filteredCases.map((c) => [
      `${c.caseNumber} / ${c.year}`,
      c.title,
      c.clientName,
      c.opponentName,
      c.court,
      c.status,
      c.assignedLawyer,
      c.nextHearingDate || '-',
    ]);

    return {
      title: 'التقرير القضائي الشامل للقضايا والدعاوى',
      queryPrompt: userQuery,
      executiveSummary: `استخرجت المنظومة بياناً بعدد (${filteredCases.length}) قضايا مطابقة لمعايير الاستعلام. يتولى المكتب متابعة هذه النزاعات بمختلف محاكم الاستئناف والابتدائية مع اتخاذ كافة الإجراءات القانونية والمذكرات اللازمة لصالح الموكلين.`,
      filtersApplied: filters.length > 0 ? filters : ['عرض جميع القضايا والدعاوى'],
      metrics: {
        'إجمالي القضايا المستخرجة': filteredCases.length,
        'قضايا متداولة': filteredCases.filter((c) => c.status === 'متداولة').length,
        'قضايا محكوم فيها': filteredCases.filter((c) => c.status === 'محكوم فيها').length,
        'جلسات قادمة محددة': filteredCases.filter((c) => c.nextHearingDate).length,
      },
      tableHeaders: ['رقم القضية والسنة', 'موضوع النزاع', 'الموكل', 'الخصم', 'المحكمة المختصة', 'الحالة', 'المحامي المسؤول', 'تاريخ الجلسة القادمة'],
      tableRows: rows,
      isEmpty: rows.length === 0,
    };
  }
}

export const officeDb = new OfficeDatabase();
