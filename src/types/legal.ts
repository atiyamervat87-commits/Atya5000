export type LegalBranch =
  | 'civil' // القانون المدني
  | 'commercial' // القانون التجاري والشركات
  | 'criminal' // القانون الجنائي والإجراءات
  | 'administrative' // القضاء الإداري ومجلس الدولة
  | 'procedural' // قانون المرافعات والإثبات
  | 'labor' // قانون العمل والتأمينات
  | 'personal_status' // الأحوال الشخصية
  | 'real_estate' // الشهر العقاري والتسجيل
  | 'intellectual_property' // الملكية الفكرية
  | 'constitutional'; // القانون الدستوري

export interface LegalArticle {
  id: string;
  lawName: string;
  lawNumber: string;
  lawYear: string;
  articleNumber: string;
  branch: LegalBranch;
  title?: string;
  content: string;
  status: 'ساري' | 'معدل' | 'ملغى' | 'تاريخي';
  modifications?: string;
  cassationPrinciples?: string[];
  keywords: string[];
}

export interface CassationRuling {
  id: string;
  court: 'محكمة النقض المصرية' | 'المحكمة الإدارية العليا' | 'المحكمة الدستورية العليا';
  rulingNumber: string;
  judicialYear: string;
  sessionDate: string;
  principle: string;
  branch: LegalBranch;
  relatedArticles: string[];
}

export interface FactItem {
  id: string;
  date?: string;
  description: string;
  isEstablished: boolean; // واقعة ثابتة بدليل أم مجرد ادعاء
  evidenceSource?: string;
}

export interface DefenseItem {
  id: string;
  type: 'شكلي' | 'موضوعي';
  name: string;
  legalGround: string;
  explanation: string;
  strength: 'قوي جداً' | 'متوسط' | 'مشروط بتوفر دليل';
}

export interface ConsultationResponse {
  caseSummary: string;
  jurisdiction: string;
  legalBranch: string;
  chronologicalFacts: FactItem[];
  parties: { name: string; capacity: string; obligations: string }[];
  legalIssues: string[];
  applicableArticles: {
    lawName: string;
    lawNumber: string;
    articleNumber: string;
    text: string;
    status: string;
    relevance: string;
  }[];
  formalDefenses: DefenseItem[]; // الدفوع الشكلية
  substantiveDefenses: DefenseItem[]; // الدفوع الموضوعية
  evidenceAudit: {
    availableEvidence: string[];
    missingEvidence: string[];
    recommendations: string[];
  };
  proceduralDeadlines: {
    action: string;
    deadlineDays: number;
    statutoryBasis: string;
    urgencyLevel: 'حرج' | 'عاجل' | 'عادي';
  }[];
  conclusionsAndStrategy: string;
  confidenceScore: number;
  caveats: string[];
}

export interface TokenAnalysisResult {
  rawText: string;
  normalizedText: string;
  tokenCount: number;
  charCount: number;
  bytesCount: number;
  compressionRatio: number; // Bytes per token or Chars per token
  tokens: {
    id: number;
    tokenText: string;
    isDiacritics: boolean;
    isLegalTerm: boolean;
    byteLength: number;
  }[];
}

export interface BenchmarkTestResult {
  id: string;
  name: string;
  category: string;
  description: string;
  inputPrompt: string;
  expectedBehavior: string;
  actualOutput: string;
  status: 'passed' | 'warning' | 'failed';
  score: number; // 0 to 100
  empiricalVerification: string;
}

export interface ModelStageStatus {
  stageId: number;
  title: string;
  category: 'code' | 'trained' | 'tested' | 'proven' | 'compute_needed';
  statusPercent: number;
  summary: string;
  evidence: string;
  deliverables: string[];
}
