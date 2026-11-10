/**
 * ABQARYNO CENTRAL BRAIN — LEGAL CITATION SERVICE
 * محرك التوثيق المرجعي التلقائي للمواد القانونية المستخرجة من عقل المستشار
 * يستخرج المواد وأسماء التشريعات ويصيغها وفق معايير التوثيق القضائي الرسمي للمذكرات
 */

import { LegalCitation, CitationsExtractionResult } from '../types/citation.ts';
import { EGYPTIAN_LEGAL_ARTICLES, MAJOR_EGYPTIAN_LAWS } from '../data/egyptianLaws.ts';

// Known Egyptian Codifications and Laws dictionary
const KNOWN_CODES: Array<{
  keywords: string[];
  lawName: string;
  lawNumber: string;
  lawYear: string;
  gazette: string;
  branch: string;
}> = [
  {
    keywords: ['مدني', 'المدني', 'المدنى', 'الالتزامات', 'العقد', 'الشفعة'],
    lawName: 'القانون المدني المصري',
    lawNumber: '131',
    lawYear: '1948',
    gazette: 'الجريدة الرسمية — الوقائع المصرية العدد 108 مكرر أ في 16 يوليو 1948',
    branch: 'مدني',
  },
  {
    keywords: ['عقوبات', 'العقوبات', 'جنائي', 'الجنائي', 'أمانة', 'سرقة', 'نصب', 'قتل', 'تبديد'],
    lawName: 'قانون العقوبات المصري',
    lawNumber: '58',
    lawYear: '1937',
    gazette: 'الوقائع المصرية — العدد 71 في 31 يوليو 1937 وتعديلاته',
    branch: 'جنائي',
  },
  {
    keywords: ['إجراءات جنائية', 'اجراءات جنائية', 'الحبس الاحتياطي', 'تفتيش', 'ضبط قضائي', 'تحقيق'],
    lawName: 'قانون الإجراءات الجنائية',
    lawNumber: '150',
    lawYear: '1950',
    gazette: 'الوقائع المصرية — العدد 90 في 3 سبتمبر 1950 ومعدلاته بالجريدة الرسمية',
    branch: 'إجراءات جنائية',
  },
  {
    keywords: ['مرافعات', 'المرافعات', 'استئناف', 'اختصاص', 'إعلان', 'دعوى'],
    lawName: 'قانون المرافعات المدنية والتجارية',
    lawNumber: '13',
    lawYear: '1968',
    gazette: 'الجريدة الرسمية — العدد 19 مكرر في 9 مايو 1968',
    branch: 'مرافعات',
  },
  {
    keywords: ['إثبات', 'اثبات', 'الإثبات', 'شهادة', 'يمين', 'محررات رسمية'],
    lawName: 'قانون الإثبات في المواد المدنية والتجارية',
    lawNumber: '25',
    lawYear: '1968',
    gazette: 'الجريدة الرسمية — العدد 21 مكرر في 23 مايو 1968',
    branch: 'إثبات',
  },
  {
    keywords: ['عمل', 'العمل', 'فصل تعسفي', 'مكتب العمل', 'أجر', 'عامل'],
    lawName: 'قانون العمل المصري',
    lawNumber: '12',
    lawYear: '2003',
    gazette: 'الجريدة الرسمية — العدد 14 مكرر في 7 أبريل 2003 وتعديلاته',
    branch: 'عمل',
  },
  {
    keywords: ['تصالح', 'مخالفات بناء', 'حيز عمراني', 'تقنين'],
    lawName: 'قانون التصالح في بعض مخالفات البناء وتقنين أوضاعها',
    lawNumber: '187',
    lawYear: '2023',
    gazette: 'الجريدة الرسمية — العدد 50 مكرر في 17 ديسمبر 2023 ولائحته 1121 لسنة 2024',
    branch: 'إداري وتخطيط عمراني',
  },
  {
    keywords: ['شهر عقاري', 'توثيق', 'تسجيل شقة', 'سجل عيني'],
    lawName: 'قانون تنظيم الشهر العقاري',
    lawNumber: '9',
    lawYear: '2022',
    gazette: 'الجريدة الرسمية — العدد 9 مكرر في 6 مارس 2022 المعدل للقانون 114 لسنة 1946',
    branch: 'شهر عقاري وتوثيق',
  },
  {
    keywords: ['إيجار', 'ايجار', 'إيجارات', 'قيمة إيجارية'],
    lawName: 'قانون إيجار الأماكن وتنظيم العلاقة بين المؤجر والمستأجر',
    lawNumber: '4',
    lawYear: '1996',
    gazette: 'الجريدة الرسمية — العدد 5 مكرر في 30 يناير 1996 المعدل بالقانون 137 لسنة 2006',
    branch: 'إيجارات',
  },
  {
    keywords: ['محاماة', 'المحاماة', 'أتعاب محاماة', 'وكالة بالخصومة'],
    lawName: 'قانون المحاماة المصري',
    lawNumber: '17',
    lawYear: '1983',
    gazette: 'الجريدة الرسمية — العدد 26 في 30 يونيو 1983 وتعديلاته بالقانون 147 لسنة 2019',
    branch: 'محاماة',
  },
];

/**
 * تحويل الأرقام العربية المشرقية إلى غربية لتسهيل المطابقة
 */
function normalizeDigits(str: string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[٠-٩]/g, (d) => String(arabicNumerals.indexOf(d)));
}

export class LegalCitationService {
  /**
   * استخراج وتوثيق كافة المواد القانونية الواردة في النص تلقائياً
   */
  public extractCitations(text: string, externalStatutes?: any[]): CitationsExtractionResult {
    if (!text || typeof text !== 'string') {
      return { annotatedText: '', citations: [], totalExtracted: 0 };
    }

    const citationsMap = new Map<string, LegalCitation>();
    let markerIndex = 1;

    // 1. فحص المواد المباشرة المرفقة مسبقاً (e.g. from governingStatutes / statutoryBasis)
    if (externalStatutes && Array.isArray(externalStatutes)) {
      for (const stat of externalStatutes) {
        const rawArt = stat.articleNumber || stat.article;
        if (!rawArt) continue;
        const normArt = normalizeDigits(String(rawArt)).trim();
        const lawName = stat.lawName || stat.law || 'القانون المصري الساري';
        const key = `${lawName}_${normArt}`;

        if (!citationsMap.has(key)) {
          const matchedArticleObj = EGYPTIAN_LEGAL_ARTICLES.find(
            (a) => a.articleNumber === normArt && (a.lawName.includes(lawName) || lawName.includes(a.lawName))
          );

          const matchedCode = KNOWN_CODES.find((c) =>
            lawName.includes(c.lawName) || c.keywords.some((k) => lawName.includes(k))
          );

          const fullLawName = matchedCode
            ? `${matchedCode.lawName} رقم ${matchedCode.lawNumber} لسنة ${matchedCode.lawYear}`
            : (stat.lawName || stat.law || 'القانون المصري');

          citationsMap.set(key, {
            id: `cite_${key.replace(/[^a-zA-Z0-9]/g, '_')}`,
            marker: `[هامش ${markerIndex++}]`,
            lawName: fullLawName,
            lawNumber: matchedCode?.lawNumber,
            lawYear: matchedCode?.lawYear,
            articleNumber: `المادة (${normArt})`,
            articleTitle: stat.title || matchedArticleObj?.title || `القاعدة القانونية للمادة (${normArt})`,
            officialGazette: matchedCode?.gazette || 'الجريدة الرسمية لجمهورية مصر العربية',
            summary: stat.summary || stat.text || matchedArticleObj?.content || `القاعدة الإلزامية المنظمة في المادة ${normArt}`,
            formalCitationText: `المادة (${normArt}) من ${fullLawName}`,
            branch: matchedCode?.branch || matchedArticleObj?.branch || 'تشريع عام',
            verified: true,
          });
        }
      }
    }

    // 2. البحث والتنقيب بالتعابير النمطية (Regex) عن المواد المذكورة في صلب النص
    // أنماط مثل: "المادة 147 من القانون المدني" أو "مادة 341 عقوبات" أو "المادة (267) من قانون العقوبات"
    const articleRegex = /(?:المادة|مادة)\s*[\(\[]?\s*([0-9\u0660-\u0669]+)\s*[\)\]]?(?:\s*(?:فقرة\s*[0-9\u0660-\u0669]+))?(?:\s*(?:من\s+)?(?:قانون\s+)?([^\n,\.\;،\(\)]+))?/gi;

    let match: RegExpExecArray | null;
    while ((match = articleRegex.exec(text)) !== null) {
      const rawNum = match[1];
      const contextLawSnippet = (match[2] || '').trim();
      if (!rawNum) continue;

      const normNum = normalizeDigits(rawNum);
      const articleNumInt = parseInt(normNum, 10);
      if (isNaN(articleNumInt) || articleNumInt <= 0 || articleNumInt > 3000) continue;

      // تحديد اسم التشريع الأقرب سياقاً
      let detectedCode = KNOWN_CODES.find((c) =>
        c.keywords.some((k) => contextLawSnippet.includes(k))
      );

      // إذا لم يذكر في نفس الجملة، نبحث في النص الكلي المحيط (300 حرف قبل وبعد)
      if (!detectedCode) {
        const startWindow = Math.max(0, match.index - 200);
        const endWindow = Math.min(text.length, match.index + 200);
        const surroundingText = text.slice(startWindow, endWindow).toLowerCase();

        detectedCode = KNOWN_CODES.find((c) =>
          c.keywords.some((k) => surroundingText.includes(k))
        );
      }

      // مطابقة مع قاعدة المواد التشريعية المصرية الحية EGYPTIAN_LEGAL_ARTICLES
      const matchedDbArticle = EGYPTIAN_LEGAL_ARTICLES.find((a) => {
        if (a.articleNumber !== normNum) return false;
        if (detectedCode) {
          return a.lawName.includes(detectedCode.lawName) || detectedCode.lawName.includes(a.lawName);
        }
        return true;
      });

      const effectiveLawName = detectedCode
        ? `${detectedCode.lawName} رقم ${detectedCode.lawNumber} لسنة ${detectedCode.lawYear}`
        : (matchedDbArticle ? matchedDbArticle.lawName : 'التشريع المصري المنظم');

      const key = `${effectiveLawName}_${normNum}`;

      if (!citationsMap.has(key)) {
        citationsMap.set(key, {
          id: `cite_${normNum}_${citationsMap.size + 1}`,
          marker: `[هامش ${markerIndex++}]`,
          lawName: effectiveLawName,
          lawNumber: detectedCode?.lawNumber,
          lawYear: detectedCode?.lawYear,
          articleNumber: `المادة (${normNum})`,
          articleTitle: matchedDbArticle?.title || `حكم المادة (${normNum}) وتطبيقاتها القضائية`,
          officialGazette: detectedCode?.gazette || 'الجريدة الرسمية والوقائع المصرية',
          summary: matchedDbArticle?.content
            ? (matchedDbArticle.content.length > 180 ? `${matchedDbArticle.content.slice(0, 180)}...` : matchedDbArticle.content)
            : `النص الملزم للمادة (${normNum}) الصادر في ${effectiveLawName}.`,
          formalCitationText: `المادة (${normNum}) من ${effectiveLawName}`,
          branch: detectedCode?.branch || matchedDbArticle?.branch || 'قانوني',
          verified: Boolean(matchedDbArticle || detectedCode),
        });
      }
    }

    // 3. البحث عن القوانين المنشورة بالرقم والسنة (مثلاً: القانون رقم 187 لسنة 2023)
    const lawNumberRegex = /قانون\s*(?:رقم\s*)?([0-9\u0660-\u0669]+)\s*لسنة\s*([0-9\u0660-\u0669]{4})/gi;
    let lawMatch: RegExpExecArray | null;
    while ((lawMatch = lawNumberRegex.exec(text)) !== null) {
      const lNum = normalizeDigits(lawMatch[1]);
      const lYear = normalizeDigits(lawMatch[2]);
      const key = `law_${lNum}_${lYear}`;

      if (!citationsMap.has(key)) {
        const matchedCode = KNOWN_CODES.find(c => c.lawNumber === lNum && c.lawYear === lYear);
        const lawFullName = matchedCode ? matchedCode.lawName : `القانون رقم ${lNum} لسنة ${lYear}`;

        citationsMap.set(key, {
          id: `cite_law_${lNum}_${lYear}`,
          marker: `[هامش ${markerIndex++}]`,
          lawName: `${lawFullName} رقم ${lNum} لسنة ${lYear}`,
          lawNumber: lNum,
          lawYear: lYear,
          articleNumber: 'كامل التشريع',
          articleTitle: matchedCode ? matchedCode.lawName : `أحكام القانون رقم ${lNum} لسنة ${lYear}`,
          officialGazette: matchedCode?.gazette || `الجريدة الرسمية المصرية لسنة ${lYear}`,
          summary: `التشريع الصادر ونفاذه بالجريدة الرسمية المصرية لسنة ${lYear}.`,
          formalCitationText: `${lawFullName} الصادر برقم ${lNum} لسنة ${lYear}`,
          branch: matchedCode?.branch || 'تشريع مصري',
          verified: true,
        });
      }
    }

    const citations = Array.from(citationsMap.values());

    return {
      annotatedText: text,
      citations,
      totalExtracted: citations.length,
    };
  }

  /**
   * صياغة توثيق رسمي جاهز للنسخ في المذكرات القضائية
   */
  public formatFormalCitation(citation: LegalCitation): string {
    return `${citation.formalCitationText} — المنشور في: ${citation.officialGazette || 'الجريدة الرسمية'}.`;
  }

  /**
   * توليد جدول الهوامش المرجعية للمذكرات والمحررات
   */
  public generateFootnotesMarkdown(citations: LegalCitation[]): string {
    if (!citations || citations.length === 0) return '';

    const lines: string[] = [];
    lines.push('\n---\n');
    lines.push('### 📜 **هامش التوثيق المرجعي للمواد القانونية (Official Citations Margin):**\n');

    citations.forEach((c) => {
      lines.push(`• **${c.articleNumber}** — **${c.lawName}**:`);
      lines.push(`  - *صيغة التوثيق القضائي*: «${c.formalCitationText}»`);
      lines.push(`  - *السند بالجريدة الرسمية*: ${c.officialGazette}`);
      if (c.summary) {
        lines.push(`  - *المضمون والتطبيق*: ${c.summary}`);
      }
      lines.push('');
    });

    return lines.join('\n');
  }
}

export const legalCitationService = new LegalCitationService();
