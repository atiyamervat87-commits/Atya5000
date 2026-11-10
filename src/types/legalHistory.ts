/**
 * أنماط وواجهات سجل القضايا والمسودات القضائية (Legal History Tracker)
 * مكتب المستشار عطيه الهلباوي — منصة عبقرينو
 */

export type HistoryItemType = 'case_query' | 'draft_document';

export type LegalBranchType =
  | 'civil'             // القانون المدني والعقود
  | 'criminal'          // القانون الجنائي والإجراءات
  | 'labor'             // قانون العمل والتأمينات
  | 'tenancy'           // الإيجارات وإخلاء الأماكن
  | 'commercial'        // القانون التجاري والشركات
  | 'administrative'    // مجلس الدولة والقضاء الإداري
  | 'personal_status'   // الأحوال الشخصية والأسرة
  | 'real_estate'       // الشهر العقاري والملكية
  | 'general';          // استشارة عامة وتكييف قضائي

export type DocumentCategoryType =
  | 'عقد'
  | 'مذكرة دفاع'
  | 'صحيفة دعوى'
  | 'إنذار رسمي'
  | 'طلب قضائي'
  | 'إيصال أمانة'
  | 'تقرير استدلال';

export type ItemStatusType = 'مسودة أولية' | 'قيد المتابعة' | 'منقحة' | 'معتمدة نهائياً' | 'مكتمل';

export interface BaseHistoryEntry {
  id: string;
  type: HistoryItemType;
  title: string;
  timestamp: string;          // ISO String
  formattedDate: string;      // 2026/11/10 - 01:15 م
  branch: LegalBranchType;
  branchLabel: string;
  status: ItemStatusType;
  isStarred?: boolean;
  notes?: string;
  tags?: string[];
  sourceRoom?: 'public' | 'private' | 'consultation_room' | 'manual';
}

export interface CaseQueryEntry extends BaseHistoryEntry {
  type: 'case_query';
  query: string;               // نص السؤال أو سرد الوقائع
  characterization: string;    // التكييف القضائي السليم
  directAnswer: string;        // خلاصة الرأي القانوني المباشر
  statutoryBasis?: Array<{
    lawName: string;
    articleNumber: string;
    summary: string;
  }>;
  cassationPrinciple?: string; // مبدأ محكمة النقض
  recommendedSteps?: string[]; // خطوات التحرك الإجرائي
}

export interface DraftDocumentEntry extends BaseHistoryEntry {
  type: 'draft_document';
  documentCategory: DocumentCategoryType;
  content: string;             // نص المسودة بالكامل (Markdown)
  wordCount: number;
  clausesCount: number;
  parties?: {
    firstParty?: string;
    secondParty?: string;
  };
  governingLaw?: string;
}

export type LegalHistoryEntry = CaseQueryEntry | DraftDocumentEntry;

export interface LegalHistoryExportData {
  appName: string;
  counselorName: string;
  exportedAt: string;
  sessionDuration: string;
  stats: {
    totalEntries: number;
    totalQueries: number;
    totalDrafts: number;
    branchesCount: Record<string, number>;
  };
  entries: LegalHistoryEntry[];
}
