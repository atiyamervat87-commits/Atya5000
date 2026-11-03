/**
 * هيكل بيانات قاعدة المعرفة القانونية المصرية المترابطة (Egyptian Legal Knowledge Base & Graph Schema)
 * صُممت لدعم التدرج المعياري الدستوري والربط العضوي بين القوانين (الدستور، المدني، الجنائي، الإجراءات)
 * والاسترجاع السياقي فائق الدقة (Contextual & Semantic Graph Retrieval) للنماذج اللغوية.
 */

export type LegalNormLevel =
  | 'CONSTITUTION'           // القمة الدستورية (دستور جمهورية مصر العربية 2014 وتعديلاته)
  | 'INTERNATIONAL_TREATY'   // المعاهدات والاتفاقيات الدولية المصدق عليها (المادة 93 من الدستور)
  | 'ORGANIC_LAW'            // القوانين المكملة للدستور
  | 'STATUTORY_CODE'         // القوانين والتقنينات الأصلية (المدني، العقوبات، الإجراءات، المرافعات)
  | 'DECREE_REGULATION'      // اللوائح التنفيذية والقرارات الوزارية المقررة للحقوق
  | 'SUPREME_CONSTITUTIONAL' // أحكام المحكمة الدستورية العليا الملزمة لكافة سلطات الدولة
  | 'CASSATION_PRECEDENT';   // المبادئ المستقرة لمحكمة النقض المصرية (دوائر مدنية وجنائية وتجارية)

export type LegalBranchType =
  | 'CONSTITUTIONAL'    // دستوري وحريات وحقوق عامة
  | 'CIVIL'             // مدني والتزامات وعقود ومسؤولية
  | 'PENAL'             // جنائي وعقوبات وتجريم
  | 'CRIMINAL_PROCEDURE'// إجراءات جنائية وضمانات محاكمة
  | 'CIVIL_PROCEDURE'   // مرافعات مدنية وتجارية وإثبات
  | 'COMMERCIAL'        // تجارة وشيكات وشركات وإفلاس
  | 'ADMINISTRATIVE'    // مجلس دولة وقضاء إداري وإلغاء
  | 'LABOR'             // عمل وتأمينات اجتماعية
  | 'FAMILY';           // أسرة وأحوال شخصية

/**
 * أنواع الروابط والعلاقات التشريعية والقضائية بين المواد
 */
export type LegalRelationType =
  | 'CONSTITUTIONAL_FOUNDATION'  // سند دستوري: مادة القانون تستند لمبدأ في الدستور (مثل: مادة 34 إجراءات تستند للمادة 54 دستور)
  | 'CONSTITUTIONAL_INVALIDITY'  // قضاء دستوري بعدم الدستورية: إلغاء أثر المادة أو جزء منها بحكم دستوري ملزم
  | 'GENERAL_VS_SPECIAL'        // علاقة العام والخاص: مادة تمثل أصلاً عاماً ومادة أخرى تمثل حكماً خاصاً مقيداً
  | 'PROCEDURAL_ENFORCEMENT'    // مادة إجرائية تنفذ حقاً موضوعياً (مثل: حماية الملكية في المدني ينفذها الطرد المستعجل في المرافعات)
  | 'CIVIL_CRIMINAL_NEXUS'      // التبعية بين الجنائي والمدني (مثل: التعويض المدني المادة 163 مدني ناشئ عن جريمة 341 عقوبات)
  | 'STATUTORY_EXCEPTION'       // استثناء تشريعي صريح من أصل عام
  | 'DIRECT_INVOCATION'         // إحالة مباشرة صريحة في نص المادة لمادة أخرى
  | 'SUBSEQUENT_AMENDMENT'      // تعديل لاحق لقانون بموجب تشريع جديد;

/**
 * الكيان الأساسي لعقدة المادة القانونية (Legal Article Node)
 */
export interface LegalArticleNode {
  // 1. المعرفات المعيارية
  urn: string;                      // المعرف الموحد عالمياً، مثال: "urn:lex:eg:constitution:2014:art:54" أو "urn:lex:eg:code:civil:1948-131:art:163"
  id: string;                       // معرف نظامي فريد وقصير
  normLevel: LegalNormLevel;        // الرتبة في هرم كلسن التشريعي
  branch: LegalBranchType;          // الفرع القانوني
  lawNumber: string;                // رقم القانون (مثل: "131" أو "58" أو "دستور 2014")
  lawYear: number;                  // سنة الإصدار الرسمية
  lawOfficialName: string;          // الاسم الرسمي للتشريع بالجريدة الرسمية
  partNumber?: string;              // الباب أو الكتاب (مثل: "الباب الثاني: الحقوق والحريات")
  chapterNumber?: string;           // الفصل (مثل: "الفصل الأول: الالتزامات بوجه عام")

  // 2. المتن التشريعي والأركان
  articleNumber: string;            // رقم المادة (مثل: "54" أو "375 مكرر")
  officialTitle?: string;           // العنوان الرسمي أو الدارج للمادة
  verbatimText: string;             // النص الحرفي الرسمي الموثق بدون أي تصرف
  officialEnactmentDate?: string;   // تاريخ السريان الأولي
  lastAmendedDate?: string;         // تاريخ آخر تعديل تشريعي سارٍ

  // 3. السلامة التشريعية والسريان (Validity & Enforceability)
  status: 'ACTIVE_FULL' | 'ACTIVE_AMENDED' | 'PARTIALLY_UNCONSTITUTIONAL' | 'REPEALED';
  constitutionalStatusNote?: string;// مذكرة قضائية حول الوضع الدستوري للمادة
  activeAmendmentsHistory?: {
    amendingLaw: string;            // القانون المعدل (مثل: "القانون رقم 10 لسنة 2020")
    gazetteDate: string;            // تاريخ النشر بالجريدة الرسمية
    summary: string;                // مضمون التعديل
  }[];

  // 4. التحليل الموضوعي والتكييف (Substantive Taxonomy)
  legalDomainTags: string[];        // وسوم النطاق (مثل: ["حريات شخصية", "تلبس", "بطلان القبض"])
  coreLegalConcepts: string[];      // المفاهيم القانونية الأصولية (مثل: ["مشروعية الدليل", "النظام العام", "افتراض البراءة"])
  proceduralSanctions?: string[];   // الجزاءات المترتبة على مخالفة المادة (مثل: ["بطلان إجراءات التحقيق", "سقوط الحق"])

  // 5. روابط السوابق القضائية المعتمدة حصراً (Linked Judicial Precedents)
  precedentCitations: {
    court: 'محكمة النقض المصرية' | 'المحكمة الدستورية العليا' | 'المحكمة الإدارية العليا';
    circuit: string;
    appealNumber: string;
    judicialYear: string;
    sessionDate: string;
    heldPrinciple: string;
    relevance: 'تفسير لازم' | 'قيد دستوري' | 'استقرار قضائي';
  }[];

  // 6. بيانات التضمين والاسترجاع السياقي للنماذج (Contextual & Semantic Embeddings Payload)
  retrievalMetadata: {
    contextualPrefix: string;       // سياق الأبوة التشريعية لتغذية نماذج التضمين ومنع الغموض
    denseKeywordsAr: string[];      // كلمات مفتاحية معيارية مشتقة بالصرف العربي
    colloquialTermsAr: string[];    // مصطلحات دارجة وعامية مصرية تكافئ النص (مثل: "اتقبض عليه بدون إذن", "تلفيق محضر")
    searchWeight: number;           // وزن الأولوية في الاسترجاع (الدستور والقواعد الآمرة = 1.5)
  };
}

/**
 * علاقة الربط الشبكي بين مادتين (Knowledge Graph Edge)
 */
export interface LegalCrossReferenceEdge {
  id: string;
  sourceUrn: string;                // المادة المصدر
  targetUrn: string;                // المادة المستهدفة
  relationType: LegalRelationType;  // نوع العلاقة
  weight: number;                   // قوة الترابط (من 1 إلى 10)
  legalRationale: string;           // السند الفقهي والقضائي للربط (لماذا ترتبط هاتان المادتان؟)
  judicialBasis?: string;           // حكم نقض أو دستورية قرر هذا الارتباط العضوي
  mutualBidirectional: boolean;     // هل الرابط تبادلي ثنائي الاتجاه
}

/**
 * مخرجات استرجاع السياق القانوني المحزم للنموذج اللغوي (Contextual RAG Payload)
 */
export interface ContextualGroundingPayload {
  query: string;
  matchedPrimaryArticle: LegalArticleNode;
  constitutionalBackbone?: LegalArticleNode[];     // السند الدستوري الحاكم للواقعة
  proceduralCounterparts?: LegalArticleNode[];     // المواد الإجرائية الحاكمة للدفوع والمواعيد
  substantiveCounterparts?: LegalArticleNode[];    // المواد الموضوعية ذات الصلة المباشرة
  relatedCassationPrecedents: LegalArticleNode['precedentCitations'];
  formattedGroundingContext: string;               // نص السياق المجهز للحقن المباشر في Prompt النموذج
  traversalPathExplanation: string[];              // مسار الاستدلال الذي اتخذه المحرك لربط المواد ببعضها
}

/**
 * خيارات محرك البحث والاسترجاع المترابط
 */
export interface LegalRetrievalOptions {
  includeConstitutionalFoundation?: boolean; // تضمين الأصول الدستورية تلقائياً
  includeProceduralLinks?: boolean;          // تضمين مواد الإجراءات المقترنة
  includeCivilCriminalNexus?: boolean;       // تضمين التعويض المدني التابع للجنائي أو العكس
  maxGraphDepth?: number;                    // عمق التحري في الرسم البياني للعلاقات (افتراضياً 2)
  confidenceThreshold?: number;              // عتبة التطابق الدلالي الأدنى
}
