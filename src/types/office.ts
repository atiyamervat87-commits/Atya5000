export type UserRole = 'owner' | 'staff';

export interface UserSession {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  nationalId?: string;
  email?: string;
  address?: string;
  type: 'فرد' | 'شركة' | 'جهة حكومية';
  notes?: string;
  createdAt: string;
}

export type CaseStatus = 'متداولة' | 'مؤجلة' | 'محكوم فيها' | 'قيد الاستئناف' | 'قيد النقض' | 'منتهية';

export interface LegalCase {
  id: string;
  caseNumber: string;
  year: string;
  court: string;
  circuit: string;
  type: string;
  title: string;
  clientId: string;
  clientName: string;
  opponentName: string;
  opponentLawyer?: string;
  assignedLawyer: string;
  status: CaseStatus;
  claimAmount?: number;
  notes?: string;
  createdAt: string;
  nextHearingDate?: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  caseNumber: string;
  court: string;
  circuit?: string;
  date: string;
  time?: string;
  decision?: string;
  requirements?: string;
  nextAction?: string;
  nextDate?: string;
  attended: boolean;
}

export interface DocumentItem {
  id: string;
  caseId?: string;
  caseNumber?: string;
  clientId?: string;
  clientName?: string;
  title: string;
  category: 'مذكرة دفاع' | 'صحيفة دعوى' | 'عقد' | 'توكيل' | 'حكم قضائي' | 'مستند إثبات' | 'إيصال' | 'محضر شرطة' | 'أخرى';
  fileName: string;
  fileSize: string;
  fileType: string;
  fileData?: string; // base64 or text preview
  notes?: string;
  uploadedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  caseId?: string;
  caseNumber?: string;
  clientId?: string;
  assignee: string;
  dueDate: string;
  priority: 'عاجل' | 'هام' | 'عادي';
  status: 'قيد الانتظار' | 'قيد التنفيذ' | 'مكتملة' | 'ملغاة';
  completedAt?: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'أتعاب متفق عليها' | 'دفعة محصلة' | 'مصروفات قضائية' | 'رسوم إعلان وخبرة' | 'دمغات وتوكيلات';
  clientId: string;
  clientName: string;
  caseId?: string;
  caseNumber?: string;
  amount: number;
  date: string;
  paymentMethod: 'نقدي' | 'تحويل بنكي' | 'فودافون كاش' | 'إنستاباي' | 'شيك';
  invoiceNumber?: string;
  notes?: string;
}

export type PaymentStatus = 'unpaid' | 'under_review' | 'approved' | 'rejected';

export interface PaymentVerification {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  amount: number;
  walletNumber: string;
  referenceNumber: string;
  proofNote?: string;
  proofImageUrl?: string;
  status: PaymentStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface OfficeSettings {
  officeName: string;
  counselorName: string;
  title: string;
  phone: string;
  secondaryPhone: string;
  address: string;
  walletNumber: string; // 01153747612
  consultationFee: number; // 200 EGP
  currency: string;
  email: string;
  licenseNumber: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'counselor';
  text: string;
  timestamp: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: string;
  }[];
  audioUrl?: string;
  photoUrl?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}
