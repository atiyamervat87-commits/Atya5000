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
   * صياغة الرد على استشارة نزاع موضوعي
   */
  public formatLegalInquiryResponse(reasoning: ReasoningResult): string {
    const statutesFormatted = reasoning.statutoryBasis
      .map(s => `• **${s.officialReference}**:\n  «${s.text}»\n  *الأثر والتطبيق*: ${s.summary}`)
      .join('\n\n');

    const cassationFormatted = reasoning.cassationBasis.length > 0
      ? `\n\n🏛️ **قضاء محكمة النقض المصرية المستقر في المسألة:**\n` +
        reasoning.cassationBasis
          .map(c => `• **${c.court} (${c.rulingNumber} لسنة ${c.judicialYear} - ${c.sessionDate})**:\n  «${c.principle}»`)
          .join('\n\n')
      : '';

    const stepsFormatted = reasoning.recommendedSteps
      .map((step, idx) => `${idx + 1}. ${step}`)
      .join('\n');

    const warningsFormatted = reasoning.risksAndWarnings.length > 0
      ? `\n\n⚠️ **تنبيهات ومخاطر إجرائية يجب تداركها فوراً:**\n` +
        reasoning.risksAndWarnings.map(w => `• ${w}`).join('\n')
      : '';

    return `أهلاً بحضرتك يا فندم. بعد التأمل الدقيق في الوقائع المعروضة، إليك التكييف القضائي والتأصيل التشريعي الحاكم وخطة التحرك الإجرائية:

⚖️ **أولاً: التكييف القضائي للواقعة:**
${reasoning.characterization}

📜 **ثانياً: السند التشريعي في القانون المصري:**
${statutesFormatted}
${cassationFormatted}

📋 **ثالثاً: خارطة التحرك الإجرائي والدفاع العملي:**
${stepsFormatted}
${warningsFormatted}

إذا كان بحوزتكم أية مستندات أو محاضر رسمية محررة، تفضلوا بإرفاقها أو بيان تواريخها لنحدد خطوة الطعن أو الدفاع بدقة متناهية.`;
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
