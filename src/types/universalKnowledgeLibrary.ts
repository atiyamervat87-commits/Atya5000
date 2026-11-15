/**
 * ATTYA UNIVERSAL MIND — MULTI-MILLION BOOK KNOWLEDGE LIBRARY SCHEMA
 * هيكل بيانات مكتبة المعرفة الإنسانية المليونية
 * توثيق وفهرسة ملايين الكتب والمصنفات والمخطوطات والمراجع القانونية والعلمية
 */

export interface KnowledgeBook {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  authorEra?: string; // e.g. "العصر الحديث 1952م", "العصر العباسي 204هـ"
  yearPublished: number | string;
  facultyId: string;
  subCategory: string;
  volumesCount: number;
  pagesCount: number;
  language: 'ar' | 'en' | 'fr' | 'la' | 'gr';
  historicalSignificance: string;
  synopsis: string;
  verifiedExcerpts: {
    chapter: string;
    text: string;
    pageOrSection: string;
  }[];
  citationFormat: string;
  relevanceToLegalMind: string;
  tags: string[];
  isFoundational: boolean;
  digitizationStatus: 'فهرسة كاملة ومفحوصة' | 'مستخلص رقمي معتمد' | 'نص محقق';
}

export interface KnowledgeFaculty {
  id: string;
  name: string;
  nameEn: string;
  totalVolumesEstimate: number;
  catalogedTitlesCount: number;
  color: string;
  iconName: string;
  description: string;
  keyAuthors: string[];
  sampleMasterpieces: string[];
  subFields: {
    id: string;
    title: string;
    estimatedBooks: number;
    description: string;
  }[];
}

export interface KnowledgeLibraryOverview {
  totalEstimatedBooks: number;
  totalCatalogedMasterpieces: number;
  totalFaculties: number;
  lastUpdated: string;
  faculties: KnowledgeFaculty[];
  eras: {
    id: string;
    name: string;
    range: string;
    estimatedBooks: number;
    color: string;
  }[];
  featuredBooks: KnowledgeBook[];
  sha256VerificationStamp: string;
}
