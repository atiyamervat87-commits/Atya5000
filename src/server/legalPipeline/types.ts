/**
 * TYPES DEFINITION: EGYPTIAN LEGAL DATA PROCESSING PIPELINE
 * خط أنابيب معالجة وهندسة البيانات القانونية المصرية
 */

export type LegalBranch =
  | 'مدني'
  | 'جنائي'
  | 'تجاري'
  | 'عمل وتأمينات'
  | 'إداري ومجلس دولة'
  | 'أحوال شخصية وأسرة'
  | 'مرافعات وإثبات'
  | 'شهر عقاري وتوثيق'
  | 'دستوري'
  | 'عامة وقضائية';

export type LawEnactmentStatus =
  | 'ساري ومعمول به'
  | 'معدل بتشريع لاحق'
  | 'ملغى كلياً'
  | 'مقضي بعدم دستوريته جزئياً'
  | 'مقضي بعدم دستوريته كلياً';

export interface RawLegalInput {
  id: string;
  fileName?: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'raw_text';
  rawContent: string;
  sourceContext?: string;
  uploadedAt: string;
}

export interface CleanedTextResult {
  cleanedText: string;
  originalCharCount: number;
  cleanedCharCount: number;
  removedDiacriticsCount: number;
  fixedOcrArtifactsCount: number;
  normalizedLigaturesCount: number;
  extractedArticles: ExtractedArticleSegment[];
  qualityCleaningScore: number; // 0-100%
}

export interface ExtractedArticleSegment {
  articleNumber: string;
  lawNameHint?: string;
  title?: string;
  bodyText: string;
  subClauses?: string[];
  charIndex: number;
}

export interface ClassificationResult {
  primaryBranch: LegalBranch;
  confidenceScore: number; // 0-100%
  secondaryBranches: Array<{ branch: LegalBranch; score: number }>;
  matchedKeywords: string[];
  suggestedTopics: string[];
}

export interface CitationLink {
  id: string;
  sourceType: 'تشريع' | 'مادة' | 'حكم نقض' | 'مذكرة' | 'فتوى';
  sourceTitle: string;
  targetType: 'تشريع معدل' | 'مادة مرتبطة' | 'حكم نقض ملزم' | 'جريدة رسمية';
  targetTitle: string;
  targetLawNumber?: string;
  targetArticleNumber?: string;
  relationType: 'تعديل تشريعي' | 'إلغاء جزئي' | 'استناد قضائي' | 'إحالة موضوعية' | 'تفسير دستوري';
  verificationConfidence: number; // 0-100%
}

export interface ProvenanceMetadata {
  officialSource: string; // e.g., "الجريدة الرسمية - العدد 9 مكرر"
  enactmentDate?: string;
  effectiveDate?: string;
  officialGazetteIssue?: string;
  issuingAuthority: 'مجلس النواب' | 'رئيس الجمهورية' | 'مجلس الوزراء' | 'محكمة النقض' | 'المحكمة الدستورية العليا';
  status: LawEnactmentStatus;
  lastAuditedAt: string;
  auditedBy: string;
}

export interface ProcessedLegalDocument {
  id: string;
  rawInputId: string;
  title: string;
  originalFileName?: string;
  rawText: string;
  cleanedText: string;
  charCount: number;
  wordCount: number;
  classification: ClassificationResult;
  provenance: ProvenanceMetadata;
  extractedArticles: ExtractedArticleSegment[];
  citationLinks: CitationLink[];
  searchIndex: {
    tokens: string[];
    invertedKeywords: string[];
    stemmedIndex: string[];
  };
  qualityFidelityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface QualityReport {
  timestamp: string;
  totalDocumentsProcessed: number;
  averageCleaningFidelity: number; // e.g. 98.5%
  classificationAccuracyScore: number; // e.g. 99.2%
  citationResolutionRate: number; // e.g. 97.8%
  brokenLinksDetected: number;
  searchBenchmarkLatencyMs: number;
  searchRetrievalPrecision: number; // e.g. 99.0%
  testsExecuted: Array<{
    testId: string;
    testName: string;
    passed: boolean;
    metric: string;
    details: string;
  }>;
}

export interface PipelineStats {
  totalProcessedDocs: number;
  totalArticlesIndexed: number;
  totalCitationLinks: number;
  branchDistribution: Record<LegalBranch, number>;
  latestRunAt: string;
  overallFidelityScore: number;
}
