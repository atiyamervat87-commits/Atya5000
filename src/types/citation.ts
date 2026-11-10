/**
 * ABQARYNO CENTRAL BRAIN — LEGAL CITATIONS TYPES
 * نماذج بيانات التوثيق المرجعي التلقائي للمواد القانونية المصرية
 */

export interface LegalCitation {
  id: string;
  marker: string; // e.g. [هامش 1], [1], [م-1]
  lawName: string; // اسم التشريع الرسمي (مثل: القانون المدني المصري رقم 131 لسنة 1948)
  lawNumber?: string; // e.g. "131"
  lawYear?: string; // e.g. "1948"
  articleNumber: string; // رقم المادة (مثل: المادة 147، مادة 341)
  articleTitle?: string; // عنوان المادة أو موضوعها
  officialGazette?: string; // السند والنشر بالجريدة الرسمية
  summary: string; // ملخص القاعدة الموضوعية أو النص
  formalCitationText: string; // الصيغة القياسية للتوثيق في المذكرات القضائية
  branch?: string; // الفرع القضائي: مدني، جنائي، مرافعات، عمل...
  cassationLink?: string; // سابقة قضائية مرتبطة
  verified: boolean;
}

export interface CitationsExtractionResult {
  annotatedText: string;
  citations: LegalCitation[];
  totalExtracted: number;
}
