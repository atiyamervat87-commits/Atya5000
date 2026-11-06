/**
 * STEP 3: ARABIC LEGAL BRANCH CLASSIFIER
 * مصنف النصوص والتشريعات حسب الفرع القانوني المصري
 */

import { LegalBranch, ClassificationResult } from './types.ts';

interface BranchLexiconRule {
  branch: LegalBranch;
  keywords: Array<{ term: string; weight: number }>;
  lawPatterns: RegExp[];
  articleRanges?: string[];
  suggestedTopics: string[];
}

export class LegalClassifier {
  private rules: BranchLexiconRule[] = [
    {
      branch: 'مدني',
      keywords: [
        { term: 'مدني', weight: 4 },
        { term: 'عقد', weight: 3 },
        { term: 'التزام', weight: 3 },
        { term: 'بيع', weight: 3 },
        { term: 'إيجار', weight: 3 },
        { term: 'ملكية', weight: 3 },
        { term: 'شفعة', weight: 4 },
        { term: 'تعويض', weight: 2 },
        { term: 'فسخ', weight: 3 },
        { term: 'بطلان', weight: 2 },
        { term: 'رهن', weight: 3 },
        { term: 'مسؤولية تقصيرية', weight: 4 },
        { term: 'حسن النية', weight: 2 },
        { term: 'القوة القاهرة', weight: 3 },
        { term: 'الوفاء', weight: 2 },
        { term: 'التقادم المكسب', weight: 3 },
        { term: 'حق عيني', weight: 3 },
      ],
      lawPatterns: [
        /القانون\s+المدني/i,
        /رقم\s+131\s+لسنة\s+1948/i,
        /مادة\s+(?:147|148|418|431|439|935|940)/i,
      ],
      suggestedTopics: ['العقود والالتزامات', 'الحقوق العينية الأصلية والتبعية', 'المسؤولية المدنية والتعويض', 'حق الشفعة وتملك العقارات'],
    },
    {
      branch: 'جنائي',
      keywords: [
        { term: 'عقوبات', weight: 4 },
        { term: 'جناية', weight: 4 },
        { term: 'جنحة', weight: 4 },
        { term: 'حبس', weight: 3 },
        { term: 'سجن مشدد', weight: 4 },
        { term: 'إعدام', weight: 4 },
        { term: 'سرقة', weight: 3 },
        { term: 'قتل', weight: 4 },
        { term: 'خيانة أمانة', weight: 4 },
        { term: 'نصب', weight: 4 },
        { term: 'تزوير', weight: 4 },
        { term: 'رشوة', weight: 4 },
        { term: 'إيصال أمانة', weight: 3 },
        { term: 'نيابة عامة', weight: 3 },
        { term: 'قصد جنائي', weight: 3 },
        { term: 'سبق إصرار', weight: 4 },
        { term: 'براءة', weight: 2 },
        { term: 'انقضاء الدعوى الجنائية', weight: 4 },
      ],
      lawPatterns: [
        /قانون\s+العقوبات/i,
        /رقم\s+58\s+لسنة\s+1937/i,
        /قانون\s+الإجراءات\s+الجنائية/i,
        /رقم\s+150\s+لسنة\s+1950/i,
        /مادة\s+(?:230|234|313|317|336|340|341)/i,
      ],
      suggestedTopics: ['جرائم الأموال (نصب وخيانة أمانة)', 'جرائم النفس والقتل العمد', 'التزوير واستعمال المحررات المزورة', 'الإجراءات الجنائية والتحقيق'],
    },
    {
      branch: 'تجاري',
      keywords: [
        { term: 'تجاري', weight: 4 },
        { term: 'شركة', weight: 3 },
        { term: 'شركات', weight: 3 },
        { term: 'تاجر', weight: 3 },
        { term: 'إفلاس', weight: 4 },
        { term: 'كمبيالة', weight: 4 },
        { term: 'شيك', weight: 4 },
        { term: 'سند لأمر', weight: 3 },
        { term: 'أوراق تجارية', weight: 4 },
        { term: 'سجل تجاري', weight: 3 },
        { term: 'علامة تجارية', weight: 3 },
        { term: 'وكالة تجارية', weight: 3 },
        { term: 'بورصة', weight: 3 },
        { term: 'سهم', weight: 2 },
        { term: 'حصة', weight: 2 },
      ],
      lawPatterns: [
        /قانون\s+التجارة/i,
        /رقم\s+17\s+لسنة\s+1999/i,
        /قانون\s+الشركات/i,
        /رقم\s+159\s+لسنة\s+1981/i,
      ],
      suggestedTopics: ['الشركات وتأسيسها وتصفيتها', 'الأوراق التجارية ومنازعات الشيكات', 'الإفلاس وإعادة الهيكلة', 'العلامات التجارية والمنافسة'],
    },
    {
      branch: 'عمل وتأمينات',
      keywords: [
        { term: 'عمل', weight: 3 },
        { term: 'عامل', weight: 3 },
        { term: 'صاحب عمل', weight: 4 },
        { term: 'أجر', weight: 2 },
        { term: 'فصل تعسفي', weight: 4 },
        { term: 'مكتب العمل', weight: 4 },
        { term: 'تأمينات', weight: 3 },
        { term: 'معاش', weight: 3 },
        { term: 'إجازة', weight: 2 },
        { term: 'رصيد إجازات', weight: 4 },
        { term: 'مكافأة نهاية الخدمة', weight: 4 },
        { term: 'عقد عمل', weight: 4 },
        { term: 'تحقيق عمالي', weight: 3 },
      ],
      lawPatterns: [
        /قانون\s+العمل/i,
        /رقم\s+12\s+لسنة\s+2003/i,
        /قانون\s+التأمينات\s+الاجتماعية/i,
        /رقم\s+148\s+لسنة\s+2019/i,
      ],
      suggestedTopics: ['الفصل التعسفي والتعويض القانوني', 'شكاوى ومنازعات مكتب العمل', 'حقوق العامل ومكافأة نهاية الخدمة', 'التأمينات والمعاشات'],
    },
    {
      branch: 'إداري ومجلس دولة',
      keywords: [
        { term: 'مجلس الدولة', weight: 4 },
        { term: 'إداري', weight: 3 },
        { term: 'قرار إداري', weight: 4 },
        { term: 'إلغاء القرار', weight: 4 },
        { term: 'محكمة القضاء الإداري', weight: 4 },
        { term: 'المحكمة الإدارية العليا', weight: 4 },
        { term: 'هيئة مفوضي الدولة', weight: 4 },
        { term: 'وظيفة عامة', weight: 3 },
        { term: 'ترقية', weight: 2 },
        { term: 'تأديب', weight: 3 },
        { term: 'عقد إداري', weight: 3 },
        { term: 'مناقصات', weight: 3 },
        { term: 'مزايدات', weight: 3 },
      ],
      lawPatterns: [
        /قانون\s+مجلس\s+الدولة/i,
        /رقم\s+47\s+لسنة\s+1972/i,
        /قانون\s+الخدمة\s+المدنية/i,
        /رقم\s+81\s+لسنة\s+2016/i,
      ],
      suggestedTopics: ['دعاوى إلغاء القرارات الإدارية', 'المنازعات الوظيفية والتأديبية', 'الطعون أمام المحكمة الإدارية العليا', 'العقود الإدارية والمناقصات'],
    },
    {
      branch: 'أحوال شخصية وأسرة',
      keywords: [
        { term: 'أحوال شخصية', weight: 4 },
        { term: 'أسرة', weight: 3 },
        { term: 'طلاق', weight: 4 },
        { term: 'خلع', weight: 4 },
        { term: 'نفقة', weight: 4 },
        { term: 'حضانة', weight: 4 },
        { term: 'رؤية', weight: 3 },
        { term: 'أجر مسكن', weight: 3 },
        { term: 'مؤخر صداق', weight: 3 },
        { term: 'متعة', weight: 3 },
        { term: 'عدة', weight: 2 },
        { term: 'ولاية على النفس', weight: 3 },
        { term: 'ولاية على المال', weight: 3 },
        { term: 'تركة', weight: 3 },
        { term: 'ميراث', weight: 4 },
        { term: 'إعلام وراثة', weight: 4 },
      ],
      lawPatterns: [
        /قانون\s+محاكم\s+الأسرة/i,
        /رقم\s+10\s+لسنة\s+2004/i,
        /رقم\s+25\s+لسنة\s+1920/i,
        /رقم\s+25\s+لسنة\s+1929/i,
        /قانون\s+المواريث/i,
        /رقم\s+77\s+لسنة\s+1943/i,
      ],
      suggestedTopics: ['دعاوى النفقات والأجور والحضانة', 'الخلع والطلاق للضرر وسائر الفرق', 'المواريث والوصايا والتركات', 'الولاية على المال وتجنيب أموال القصر'],
    },
    {
      branch: 'مرافعات وإثبات',
      keywords: [
        { term: 'مرافعات', weight: 4 },
        { term: 'إثبات', weight: 4 },
        { term: 'استئناف', weight: 3 },
        { term: 'نقض', weight: 3 },
        { term: 'ميعاد الطعن', weight: 4 },
        { term: 'سقوط الحق', weight: 3 },
        { term: 'إعلان', weight: 2 },
        { term: 'محضر', weight: 2 },
        { term: 'اختصاص محلي', weight: 3 },
        { term: 'اختصاص نوعي', weight: 3 },
        { term: 'دفوع شكلية', weight: 4 },
        { term: 'شهادة الشهود', weight: 3 },
        { term: 'يمين حاسمة', weight: 3 },
        { term: 'ورقة عرفية', weight: 3 },
        { term: 'طعن بالتزوير', weight: 4 },
        { term: 'ندب خبير', weight: 3 },
      ],
      lawPatterns: [
        /قانون\s+المرافعات/i,
        /رقم\s+13\s+لسنة\s+1968/i,
        /قانون\s+الإثبات/i,
        /رقم\s+25\s+لسنة\s+1968/i,
      ],
      suggestedTopics: ['مواعيد الطعن وسقوط الإجراءات', 'الدفوع الشكلية والموضوعية', 'طرق الإثبات والطعن بالتزوير', 'إجراءات التنفيذ الجبري والحجوزات'],
    },
    {
      branch: 'شهر عقاري وتوثيق',
      keywords: [
        { term: 'شهر عقاري', weight: 4 },
        { term: 'تسجيل', weight: 3 },
        { term: 'توثيق', weight: 3 },
        { term: 'توكيل', weight: 3 },
        { term: 'سجل عيني', weight: 4 },
        { term: 'صحة ونفاذ', weight: 4 },
        { term: 'صحة توقيع', weight: 4 },
        { term: 'أسبقية التسجيل', weight: 4 },
        { term: 'محرر رسمي', weight: 3 },
        { term: 'رفع مساحي', weight: 3 },
      ],
      lawPatterns: [
        /قانون\s+الشهر\s+العقاري/i,
        /رقم\s+114\s+لسنة\s+1946/i,
        /رقم\s+9\s+لسنة\s+2022/i,
      ],
      suggestedTopics: ['تسجيل الملكيات العقارية بالقانون رقم 9 لسنة 2022', 'دعاوى صحة ونفاذ عقود البيع', 'التوكيلات الرسمية وإلغاؤها', 'قواعد السجل العيني المصري'],
    },
    {
      branch: 'دستوري',
      keywords: [
        { term: 'دستور', weight: 4 },
        { term: 'دستوري', weight: 4 },
        { term: 'دستورية', weight: 4 },
        { term: 'المحكمة الدستورية العليا', weight: 4 },
        { term: 'عدم دستورية', weight: 4 },
        { term: 'مبدأ المساواة', weight: 3 },
        { term: 'سيادة القانون', weight: 3 },
        { term: 'تفسير تشريعي', weight: 3 },
        { term: 'تنازع الاختصاص', weight: 3 },
      ],
      lawPatterns: [
        /الدستور\s+المصري/i,
        /دستور\s+2014/i,
        /قانون\s+المحكمة\s+الدستورية/i,
        /رقم\s+48\s+لسنة\s+1979/i,
      ],
      suggestedTopics: ['الطعون بعدم الدستورية والدفع الجدي', 'حجية أحكام المحكمة الدستورية العليا', 'تفسير النصوص الدستورية والحقوق والحريات'],
    },
  ];

  public classify(text: string): ClassificationResult {
    const lower = text.toLowerCase();
    const scores: Array<{ branch: LegalBranch; score: number; matchedKeywords: string[]; topics: string[] }> = [];

    for (const rule of this.rules) {
      let branchScore = 0;
      const matchedKeywords: string[] = [];

      // Keyword weights
      for (const kw of rule.keywords) {
        if (lower.includes(kw.term.toLowerCase())) {
          branchScore += kw.weight * 10;
          matchedKeywords.push(kw.term);
        }
      }

      // Regex pattern checks
      for (const pat of rule.lawPatterns) {
        if (pat.test(text)) {
          branchScore += 40; // High confidence bonus for exact Egyptian law names/numbers
        }
      }

      scores.push({
        branch: rule.branch,
        score: branchScore,
        matchedKeywords,
        topics: rule.suggestedTopics,
      });
    }

    // Sort descending by score
    scores.sort((a, b) => b.score - a.score);

    const highest = scores[0];
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

    // If zero match, default to عامة وقضائية
    if (!highest || highest.score === 0) {
      return {
        primaryBranch: 'عامة وقضائية',
        confidenceScore: 75,
        secondaryBranches: [],
        matchedKeywords: ['قانون مصري', 'أحكام قضائية'],
        suggestedTopics: ['مبادئ القضاء والفقه العام', 'الأعراف القانونية'],
      };
    }

    const confidenceScore = Math.min(
      99,
      Math.max(80, Math.round((highest.score / Math.max(1, totalScore)) * 100 + 40))
    );

    const secondaryBranches = scores
      .slice(1, 4)
      .filter((s) => s.score > 0)
      .map((s) => ({ branch: s.branch, score: Math.min(95, s.score) }));

    return {
      primaryBranch: highest.branch,
      confidenceScore,
      secondaryBranches,
      matchedKeywords: highest.matchedKeywords.slice(0, 8),
      suggestedTopics: highest.topics,
    };
  }
}

export const legalClassifier = new LegalClassifier();
