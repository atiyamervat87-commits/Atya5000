/**
 * ABQARYNO CENTRAL BRAIN — RESPONSE ENGINE
 * محرك صياغة الردود القضائية بأسلوب وفصاحة وبلاغة المستشار عطيه الهلباوي
 * دخول مباشر في الإجابة، تفكيك عميق، وحوار إنساني وقضائي رفيع
 */

import {
  BrainIntentType,
  DraftState,
  ReasoningResult,
  ContractClause,
} from './types.ts';
import { CentralBrainDocumentEngine } from './documentEngine.ts';

export class CentralBrainResponseEngine {
  private documentEngine: CentralBrainDocumentEngine;

  constructor(docEngine: CentralBrainDocumentEngine) {
    this.documentEngine = docEngine;
  }

  /**
   * صياغة الرد على طلب تحرير أو مسودة عقد
   */
  public formatDraftResponse(draft: DraftState, extractedEntities?: any): string {
    const renderedDraft = this.documentEngine.renderDraftToMarkdown(draft);

    const missingSection = draft.missingFields.length > 0
      ? `\n\n📌 **بيانات جوهرية يُستحسن استكمالها لضبط المحرر نهائياً:**\n` +
        draft.missingFields.map((f, i) => `${i + 1}. ${f}`).join('\n')
      : '';

    return `تحت أمرك يا فندم. أعددت لحضرتك مسودة أولية متكاملة لـ **${draft.title}**، محررة بأدق الضوابط الاحترازية وصياغة قضائية محكمة وفقاً لأحكام القانون المدني المصري رقم 131 لسنة 1948 وقانون تنظيم الشهر العقاري، متضمنةً بياناً تفصيلياً بالمبيع وسند الملكية وخلو العين من الحقوق العينية والحصة الشائعة في الأرض والمرافق المشتركة والشرط الجزائي الإلزامي:

---

${renderedDraft}
${missingSection}

💡 **ملاحظة تشغيلية وتعديل فوري:**
هذه المسودة تحت تصرفك الكامل الآن. إذا رغبت في تعديل أي بند (مثلاً: *"عدل البند الثالث وخليه أقساط على سنتين"* أو *"غلظ الشرط الجزائي في البند الثامن"* أو *"احفظ المسودة في ملف القضية"*)، تفضل بكتابة طلبك وسأقوم بتنفيذه وتحديث المسودة فوراً.`;
  }

  /**
   * صياغة الرد على أمر تعديل بند محدد في المسودة
   */
  public formatClauseModificationResponse(
    updatedDraft: DraftState,
    modifiedClause: ContractClause,
    changeSummary: string
  ): string {
    return `تمام يا فندم، تم إدراج التعديل المطلوب فوراً وبأعلى درجات الإحكام القانوني:

✨ **${modifiedClause.title} (بعد التحديث):**
${modifiedClause.content}

📝 **أثر التعديل:**
${changeSummary}

وقد تم تحديث المسودة الكاملة وحفظها في سياق هذه الجلسة. هل تود إجراء أي تعديل إضافي على بنود أخرى، أو تحويل العقد إلى وثيقة نهائية جاهزة للطباعة والتوقيع؟`;
  }

  /**
   * صياغة الرد على استشارة نزاع موضوعي أو مسألة فقهية / تاريخية
   * تركز على الجواب المباشر الحاسم والمخصص لسؤال المستشير دون تكرار نمطي أو قوالب مدنية عامة
   */
  public formatLegalInquiryResponse(reasoning: ReasoningResult): string {
    // 1. معالجة الاستفسارات الفقهية المقارنة والمسائل التوثيقية والتاريخية القضائية
    if (reasoning.isConceptualOrHistorical && reasoning.detailedAnalysis) {
      const statutesFormatted = reasoning.statutoryBasis.length > 0
        ? `\n\n📜 **السند التشريعي والتأصيل القانوني:**\n` +
          reasoning.statutoryBasis
            .map(s => `• **${s.officialReference}**:\n  «${s.text}»\n  *الأثر والتطبيق*: ${s.summary}`)
            .join('\n\n')
        : '';

      const cassationFormatted = reasoning.cassationBasis.length > 0
        ? `\n\n🏛️ **قضاء محكمة النقض والدستورية المستقر في المسألة:**\n` +
          reasoning.cassationBasis
            .map(c => `• **${c.court} (${c.rulingNumber} لسنة ${c.judicialYear} - ${c.sessionDate})**:\n  «${c.principle}»`)
            .join('\n\n')
        : '';

      const stepsFormatted = reasoning.recommendedSteps.length > 0
        ? `\n\n📋 **الخلاصة والآثار القانونية المترتبة:**\n` +
          reasoning.recommendedSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')
        : '';

      return `أهلاً ومرحباً بحضرتك يا فندم في رحاب المشورة القضائية للمستشار عطيه الهلباوي.

⚖️ **التكييف القانوني والدراسة التأصيلية للمسألة:**
${reasoning.characterization}

📖 **البيان الفقهي والقضائي والتأصيلي:**
${reasoning.detailedAnalysis}
${statutesFormatted}
${cassationFormatted}
${stepsFormatted}

إذا كان لديكم أي استفسار تكميلي أو مسألة تطبيقية ترغبون في بحثها، فتفضلوا بطرحها وسأكون معكم خطوة بخطوة.`;
    }

    // 2. صياغة إجابة مباشرة ومخصصة لمسألة المستشير (دون تكرار نمطي أو قوالب عامة)
    const sections: string[] = [];

    // افتتاحية رصينة ومباشرة
    sections.push(`أهلاً بحضرتك يا فندم في رحاب المشورة القضائية.`);

    // الجواب المباشر والواضح في صميم المسألة (Direct Actionable Answer)
    if (reasoning.directAnswer) {
      sections.push(`💡 **الرأي القانوني والجواب المباشر في مسألتكم:**\n${reasoning.directAnswer}`);
    }

    // التكييف القضائي الدقيق
    if (reasoning.characterization) {
      sections.push(`⚖️ **التكييف القضائي السليم:**\n${reasoning.characterization}`);
    }

    // فلترة السند التشريعي لمنع إقحام نصوص القانون المدني العامة في غير موضعها
    // مثل (المادة 147 العقد شريعة المتعاقدين، أو المادة 4 و 5 في التعسف العام) ما لم يكن النزاع تعاقدياً صريحاً
    const strictlyRelevantStatutes = (reasoning.statutoryBasis || []).filter(s => {
      const isGeneralCivil147 = s.articleNumber?.toString().includes('147') && s.text.includes('شريعة المتعاقدين');
      const isGeneralCivil4_5 = (s.articleNumber?.toString().includes('4') || s.articleNumber?.toString().includes('5')) && s.text.includes('استعمل حقه');
      return !(isGeneralCivil147 || isGeneralCivil4_5);
    });

    if (strictlyRelevantStatutes.length > 0) {
      const statutesFormatted = strictlyRelevantStatutes
        .map(s => `• **${s.officialReference}**:\n  «${s.text}»\n  *الأثر والتطبيق*: ${s.summary}`)
        .join('\n\n');
      sections.push(`📜 **السند التشريعي المباشر في القانون المصري:**\n${statutesFormatted}`);
    }

    // أحكام محكمة النقض المؤصلة المتطابقة
    if (reasoning.cassationBasis && reasoning.cassationBasis.length > 0) {
      const cassationFormatted = reasoning.cassationBasis
        .map(c => `• **${c.court} (${c.rulingNumber} لسنة ${c.judicialYear} - ${c.sessionDate})**:\n  «${c.principle}»`)
        .join('\n\n');
      sections.push(`🏛️ **قضاء محكمة النقض المصرية المستقر في هذه الواقعة:**\n${cassationFormatted}`);
    }

    // خطوات التحرك الإجرائي والدفاع العملي المخصصة
    if (reasoning.recommendedSteps && reasoning.recommendedSteps.length > 0) {
      const stepsFormatted = reasoning.recommendedSteps
        .map((step, idx) => `${idx + 1}. ${step}`)
        .join('\n');
      sections.push(`📋 **خطة التصرف والتحرك الإجرائي الموصى بها:**\n${stepsFormatted}`);
    }

    // المحاذير والمخاطر الإجرائية الحقيقية
    if (reasoning.risksAndWarnings && reasoning.risksAndWarnings.length > 0) {
      const warningsFormatted = reasoning.risksAndWarnings.map(w => `• ${w}`).join('\n');
      sections.push(`⚠️ **تنبيهات ومخاطر إجرائية يجب مراعاتها:**\n${warningsFormatted}`);
    }

    sections.push(`إذا كانت لديكم تواريخ محددة للواقعة أو أوراق ومحاضر رسمية محررة، تفضلوا ببيانها لنحدد الميعاد الإجرائي وخطوة الدفاع بدقة تامة.`);

    return sections.join('\n\n');
  }

  /**
   * صياغة الرد على الحالات الاجتماعية والتواصل الودي
   */
  public formatSocialResponse(intent: BrainIntentType, message: string): string {
    switch (intent) {
      case 'COLLOQUIAL_CHECKIN':
        return `الدنيا بخير وفضل ونعمة وستر ورضا من ربنا يا فندم، ونسأل الله أن تكونوا وحضراتكم والأسرة الكريمة في أتم صحة وأحسن حال.

أنا في خدمتكم وتحت أمركم في أي وقت؛ تفضلوا بما يشغل بالكم وسأكون عوناً وسنداً لكم بإذن الله.`;

      case 'CELEBRATION_INVITATION':
        return `ألف مبروك يا فندم، بارك الله لكما وبارك عليكما وجمع بينكما في خير وسعادة وهناء!

شرف عظيم وكبير جداً، وأسأل الله أن يتمم بخير ويجعل أيامكم كلها أفراحاً ومسرات، ويسعدني ويشرفني دائماً مشاركتكم هذه المناسبات الطيبة المباركة.`;

      case 'CONFIDENTIAL_PERSONAL':
        return `على الرحب والسعة وبكل أمانة وأخوة؛ اعتبرني أخاً كبيراً لك ومستودع سرك الأمين.

كافة ما يدور بيننا محاط بقدسية تامة وسرية مهنية وإنسانية مطلقة. تفضل بما في صدرك، وكلي آذان صاغية وقلب مفتوح.`;

      case 'INTRO_PROFILE':
        return `أهلاً ومرحباً بحضرتكم. معكم المستشار عطيه الهلباوي، محامٍ بالنقض والدستورية والإدارية العليا، ومستشار ومحكم دولي في المنازعات المدنية والتجارية والجنائية، وخبير التشريعات وقضاء النقض المصري.

كرّست سنوات الخبرة في محراب العدالة لنصرة صاحب الحق، وصياغة العقود المتكاملة، وتفكيك المسائل القضائية الشائكة برؤية عملية تجمع بين أصالة الفقه وسرعة الإنجاز. في خدمتكم دائماً.`;

      case 'CONGRATULATIONS':
        return `الله يبارك في عمرك ويعز قدرك يا فندم! هذا فضل من الله وتوفيقه، وما وُضعت هذه المنصة إلا لتكون حصناً قانونياً وسنداً لكل باحث عن الحق والعدالة. شاكر ومقدر لدعمكم وكلماتكم الطيبة.`;

      case 'GRATITUDE':
        return `الشكر لله وحده يا فندم، هذا واجبي وشرف لي. في خدمتكم دائماً وفي أي وقت، ودمتم في رعاية الله وأمنه.`;

      case 'PERMISSION':
        return `تفضل يا فندم دون أي تردد، الأمر أمرك وفي خدمتك في أي استفسار أو مسألة قانونية. اكتب سؤالك مباشرة وتجد مني التوضيح الشافي بإذن الله.`;

      case 'ZERO_HALLUCINATION':
        return `تنبيه قضائي واجب الأمانة:
بعد الفحص الدقيق في نصوص التشريعات المصرية وأحكام محكمة النقض، نلفت عناية سيادتكم إلى أن الرقم أو المادة المستفسر عنها غير واردة في القانون المصري المعتمد (على سبيل المثال، قانون العقوبات المصري ينتهي بالمادة 395، ولا وجود لمواد بهذا الرقم فيه)، كما أن أرقام الطعون الوهمية لا تقابلها أحكام صادرة.

نحن نلتزم بالأمانة القضائية الصارمة ولا نعتمد سوى النصوص والأحكام المقيدة رسمياً في مضابط الجريدة الرسمية وأحكام النقض والدستورية العليا.`;

      default:
        return `أهلاً ومرحباً بحضرتكم يا فندم في رحاب المستشار عطيه الهلباوي. تفضلوا بطرح استفساركم أو مسألتكم وسأقدم لكم التكييف القضائي السليم والحل العملي المباشر.`;
    }
  }
}
