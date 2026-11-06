/**
 * ABQARYNO CENTRAL BRAIN — DOCUMENT ENGINE
 * محرك صياغة وتعديل العقود والمحررات القانونية المصرية بنداً بنداً (Clause-by-Clause)
 * مع دعم التعديل اللحظي التراكمي وتتبع حالة المسودة عبر الأدوار
 */

import { DraftState, ContractClause } from './types.ts';

export class CentralBrainDocumentEngine {
  /**
   * إنشاء مسودة أولية متكاملة لعقد بيع شقة سكنية
   */
  public generateApartmentSaleDraft(extracted?: {
    firstParty?: string;
    secondParty?: string;
    price?: string;
    location?: string;
  }): DraftState {
    const seller = extracted?.firstParty || '[اسم البائع رباعياً - طرف أول]';
    const buyer = extracted?.secondParty || '[اسم المشتري رباعياً - طرف ثانٍ]';
    const priceText = extracted?.price || '[يُحدد الثمن الإجمالي رقماً وكتابة، مثلاً: 1,500,000 ج.م]';

    const clauses: ContractClause[] = [
      {
        number: 1,
        title: 'البند الأول: موضوع العقد وبيان المبيع الدقيق',
        key: 'subject_matter',
        content: `باع وأسقط وتنازل الطرف الأول (البائع) بكافة الضمانات الفعلية والقانونية إلى الطرف الثاني (المشتري) القابل لذلك، ما هو كامل الشقة السكنية الكائنة بالعقار رقم [  ] بشارع [  ]، قسم/مركز [  ]، محافظة [  ]، والواقعة بالدور [  ]، والبالغ مساحتها الإجمالية [  ] متراً مربعاً تقريباً تحت العجز والزيادة، وتتكون من [  ] غرف وصالة ومطبخ وحمام، ومحدودة بالحدود الأربعة الآتية:
- الحد البحري: [  ] بطول [  ]م.
- الحد القبلي: [  ] بطول [  ]م.
- الحد الشرقي: [  ] بطول [  ]م.
- الحد الغربي: [  ] بطول [  ]م.`
      },
      {
        number: 2,
        title: 'البند الثاني: أيلولة الملكية وسند البائع',
        key: 'title_chain',
        content: `يقر الطرف الأول (البائع) بأن ملكية الشقة المبيعة آلت إليه بطريق [الشراء بموجب عقد بيع ابتدائي/مسجل برقم ... لسنة ... شهر عقاري ... / أو بطريق الميراث الشرعي عن مورثه المرحوم ... وفق إعلام الوراثة الصادر في المادة ... لسنة ... ورثة ...].`
      },
      {
        number: 3,
        title: 'البند الثالث: الثمن وطريقة السداد',
        key: 'price_and_payment',
        content: `تم هذا البيع نظير ثمن إجمالي وجزافي متفق عليه قدره ${priceText} يُسدد كالآتي:
1. مبلغ وقدره [  ] ج.م (دفعة تعاقد نقدية) قام الطرف الثاني بسدادها عداً ونقداً للطرف الأول بمجلس هذا العقد، ويُعد توقيع الطرف الأول بمثابة مخالصة نهائية باستلامه.
2. المبلغ المتبقي وقدره [  ] ج.م يُسدد [عند الاستلام الفعلي للوحدة في موعد غايته ... / أو على أقساط متساوية ومحددة].`
      },
      {
        number: 4,
        title: 'البند الرابع: المعاينة والاستلام ونقل الحيازة',
        key: 'inspection_and_delivery',
        content: `يقر الطرف الثاني (المشتري) بأنه عاين الشقة المبيعة المعاينة التامة النافية للجهالة شرعاً وقانوناً، وقبلها بحالتها الراهنة، ويتعهد الطرف الأول بتسليم الوحدة خالية من كافة الشواغل والأشخاص في موعد غايته [  /  / 202  ]، وتنتقل الحيازة والانتفاع للمشتري من تاريخ التسليم.`
      },
      {
        number: 5,
        title: 'البند الخامس: الحصة الشائعة في الأرض والأجزاء المشتركة',
        key: 'common_land_share',
        content: `يشمل هذا البيع حصة شائعة في أرض العقار المقام عليه البناء، وكذا في الأجزاء المشتركة (المداخل، السلالم، المصاعد، الأسطح) بنسبة تعادل مساحة الوحدة المبيعة إلى مجموع مسطح وحدات العقار الإجمالية وفق المادة 856 من القانون المدني المصري.`
      },
      {
        number: 6,
        title: 'البند السادس: خلو العين من الحقوق العينية والديون',
        key: 'free_of_encumbrances',
        content: `يقر الطرف الأول ويضمن سلامة ملكيته للعين المبيعة، وأنها خالية تماماً من كافة الرهون، والاختصاصات، وحقوق الامتياز، والدعاوى، والديون والضرائب العقارية واستهلاكات المرافق حتى تاريخ تحرير هذا العقد، ويتحمل أي مديونيات سابقة إن ظهرت.`
      },
      {
        number: 7,
        title: 'البند السابع: التزام البائع بالمثول ونقل الملكية رسمياً',
        key: 'official_registration',
        content: `يلتزم الطرف الأول (البائع) بالحضور أمام مكتب الشهر العقاري المختص لتوثيق عقد البيع النهائي، أو بالمثول أمام المحكمة للإقرار بصحة التوقيع أو صحة ونفاذ هذا العقد عند إخطاره بذلك، وتقديم كافة أصول مستندات الملكية والمستندات المساحية اللازمة.`
      },
      {
        number: 8,
        title: 'البند الثامن: الشرط الجزائي والتعويض الاتفاقي',
        key: 'penalty_clause',
        content: `اتفق الطرفان على أنه في حال إخلال أي طرف بالتزاماته الجوهرية الواردة في هذا العقد أو نكوله عن إتمام نقل الملكية أو الامتناع عن التسليم، يلتزم الطرف المخل بأن يدفع للطرف الآخر تعويضاً اتفاقياً نهائياً لا يخضع لرقابة القضاء قدره [  ] ج.م، مع بقاء العقد نافذاً ومنتجاً لكافة آثاره القانونية.`
      },
      {
        number: 9,
        title: 'البند التاسع: الاختصاص القضائي والمحل المختار',
        key: 'jurisdiction',
        content: `تختص محكمة [  ] الابتدائية وجزئياتها بنظر أي نزاع قد ينشأ لا قدر الله بخصوص تفسير أو تنفيذ بنود هذا العقد، ويقر كل من الطرفين باتخاذ العنوان الموضح بصدر العقد محلاً مختاراً لكافة الإعلانات والمراسلات القضائية والقانونية.`
      },
      {
        number: 10,
        title: 'البند العاشر: عدد النسخ والتوقيعات',
        key: 'copies_and_signatures',
        content: `تحرر هذا العقد من نسختين متطابقتين، بيد كل طرف نسخة للعمل بموجبها عند اللزوم، وجرى التوقيع برضاء تام وإيجاب وقبول متبادل.`
      }
    ];

    const missingFields: string[] = [];
    if (!extracted?.firstParty) missingFields.push('اسم الطرف الأول (البائع) ورقمه القومي وعنوانه التفصيلي');
    if (!extracted?.secondParty) missingFields.push('اسم الطرف الثاني (المشتري) ورقمه القومي وعنوانه التفصيلي');
    if (!extracted?.price) missingFields.push('الثمن الإجمالي المتفق عليه ومقدار المقدم والدفعات');
    if (!extracted?.location) missingFields.push('العنوان التفصيلي للوحدة ورقمها ورقم العقار والدور');

    return {
      id: `draft_${Date.now()}`,
      documentType: 'عقد بيع وحدة سكنية (شقة)',
      title: 'عقد بيع ابتدائي لوحدة سكنية محددة المعالم والحدود',
      preamble: `إنه في يوم [اليوم] الموافق [  /  / 202  ]، تم الاتفاق والتراضي بين كل من:
أولاً: السيد/ ${seller}، مصري الجنسية، بطاقة رقم قومي: [          ]، والمقيم في: [          ] (طرف أول - بائع).
ثانياً: السيد/ ${buyer}، مصري الجنسية، بطاقة رقم قومي: [          ]، والمقيم في: [          ] (طرف ثانٍ - مشترٍ).
وبعد أن أقر الطرفان بأهليتهما القانونية الكاملة للتعاقد والتصرف وخلوهما من أي مانع شرعي أو قانوني، اتفقا على ما يأتي:`,
      parties: {
        firstParty: { label: 'البائع', name: extracted?.firstParty },
        secondParty: { label: 'المشتري', name: extracted?.secondParty },
      },
      clauses,
      missingFields,
      status: 'drafting',
    };
  }

  /**
   * إنشاء مسودة إيصال أمانة قانوني محكم
   */
  public generateTrustReceiptDraft(extracted?: { firstParty?: string; secondParty?: string; price?: string }): DraftState {
    const receiver = extracted?.firstParty || '[اسم المستلم/المودع لديه - أمين الأمانة]';
    const giver = extracted?.secondParty || '[اسم المودع/المسلم للمال]';
    const beneficiary = '[اسم الطرف الثالث المستفيد الفعلي من المال]';
    const amount = extracted?.price || '[المبلغ رقماً وكتابة بالجنيه المصري]';

    const clauses: ContractClause[] = [
      {
        number: 1,
        title: 'الإقرار بالاستلام والصفة',
        content: `استلمت أنا الموقع أدناه السيد/ ${receiver}، المقيم في: [          ]، وحامل بطاقة رقم قومي: [          ]، من السيد/ ${giver}، المقيم في: [          ]، وحامل بطاقة رقم قومي: [          ]، مبلغاً وقدره ${amount} فقط لا غير عداً ونقداً.`
      },
      {
        number: 2,
        title: 'سبب الاستلام والتسليم للغير (أركان المادة 341 عقوبات)',
        content: `وذلك على سبيل الأمانة والوديعة للقيام بتسليمه وتوصيله إلى السيد/ ${beneficiary}، المقيم في: [          ].`
      },
      {
        number: 3,
        title: 'الالتزام والجزاء الجنائي والمدني',
        content: `فإذا لم أقم بتسليم هذا المبلغ المودع أمانة إلى المستفيد المذكور فور طلبه، أكون مبدداً وخائناً للأمانة ومسؤولاً جنائياً وفقاً لنص المادة 341 من قانون العقوبات المصري، مع التزامي بكافة التعويضات المدنية المترتبة على ذلك.`
      }
    ];

    return {
      id: `draft_trust_${Date.now()}`,
      documentType: 'إيصال أمانة قانوني ثلاثي الأطراف',
      title: 'إيصال أمانة مستوفٍ لأركان المادة 341 عقوبات مصري',
      preamble: 'بسم الله الرحمن الرحيم\nإيصال أمانة قانوني',
      parties: {
        firstParty: { label: 'المستلم (المؤتمن)' },
        secondParty: { label: 'المودع (المسلم)' },
      },
      clauses,
      missingFields: ['أسماء الأطراف الثلاثة رباعية', 'أرقام بطاقات الرقم القومي سارية', 'المبلغ بالتفقيط الكامل'],
      status: 'drafting',
    };
  }

  /**
   * تعديل بند محدد في المسودة النشطة بناءً على أمر المستخدم (Multi-Turn Clause Modification)
   */
  public modifyClause(
    draft: DraftState,
    instruction: string,
    clauseIndex?: number
  ): { updatedDraft: DraftState; modifiedClause: ContractClause; changeSummary: string } {
    const updated = JSON.parse(JSON.stringify(draft)) as DraftState;
    const lower = instruction.toLowerCase();

    // العثور على البند المستهدف: إما بالرقم المحدد أو بالبحث عن الكلمات المفتاحية
    let targetIndex = -1;
    if (clauseIndex && clauseIndex >= 1 && clauseIndex <= updated.clauses.length) {
      targetIndex = clauseIndex - 1;
    } else {
      if (lower.includes('سداد') || lower.includes('اقساط') || lower.includes('ثمن') || lower.includes('فلوس') || lower.includes('قسط')) {
        targetIndex = updated.clauses.findIndex(c => c.key === 'price_and_payment' || c.number === 3);
      } else if (lower.includes('تسليم') || lower.includes('معاينه') || lower.includes('استلام')) {
        targetIndex = updated.clauses.findIndex(c => c.key === 'inspection_and_delivery' || c.number === 4);
      } else if (lower.includes('شرط جزائي') || lower.includes('تعويض')) {
        targetIndex = updated.clauses.findIndex(c => c.key === 'penalty_clause' || c.number === 8);
      } else if (lower.includes('شهر عقاري') || lower.includes('تسجيل') || lower.includes('حضور')) {
        targetIndex = updated.clauses.findIndex(c => c.key === 'official_registration' || c.number === 7);
      } else {
        targetIndex = 2; // البند الثالث هو الافتراضي الأكثر طلباً للتعديل (طريقة السداد)
      }
    }

    if (targetIndex < 0 || targetIndex >= updated.clauses.length) {
      targetIndex = 0;
    }

    const targetClause = updated.clauses[targetIndex];
    let changeSummary = '';

    // تعديل طريقة السداد إلى أقساط
    if (lower.includes('اقساط') || lower.includes('قسط') || lower.includes('سنتين') || lower.includes('سنه') || lower.includes('سنة')) {
      targetClause.title = 'البند الثالث: الثمن الإجمالي وجدول الأقساط الميسرة';
      targetClause.content = `تم هذا البيع نظير ثمن إجمالي قدره [  ] ج.م، تم الاتفاق والتراضي بين الطرفين على سداده على النحو التالي:
1. دفعة مقدمة قدرها [  ] ج.م، قام الطرف الثاني (المشتري) بسدادها نقداً للطرف الأول بمجلس هذا العقد، ويُعد توقيع الطرف الأول إيصالاً باستلامها.
2. المبلغ المتبقي وقدره [  ] ج.م، يُسدد على أقساط [ربع سنوية / شهرية] متساوية بواقع [  ] ج.م لكل قسط، تبدأ من تاريخ [  /  / 202  ] وتنتهي في [  /  / 202  ] (على مدار سنتين)، مقابل شيكات بنكية / إيصالات سداد موقعة من المشتري تسلم له تباعاً عند سداد كل قسط.`;
      changeSummary = 'تم تعديل طريقة السداد لتكون مقسطة بجدول زمني محدد بدلاً من السداد الفوري/النقدي الكامل.';
    }
    // تشديد الشرط الجزائي
    else if (lower.includes('قوي') || lower.includes('اقوى') || lower.includes('اشد') || lower.includes('مضاعف') || lower.includes('شرط جزائي')) {
      targetClause.title = 'البند الثامن: الشرط الجزائي المشدد والتعويض الاتفاقي الملزم';
      targetClause.content = `اتفق الطرفان بأنه في حالة رجوع أي طرف في البيع أو تخلف البائع عن التسليم في الميعاد أو تخلف المشتري عن الوفاء بأحد الأقساط، يُلزم الطرف المخل بأن يدفع للطرف الآخر مبلغاً وقدره [مبلغ مشدد، مثلاً: 200,000 ج.م] كتعويض اتفاقي نهائي لا دخل للقضاء في تقديره، مع استحقاق فوائد قانونية تأخيرية بنسبة 4% سنوياً عملاً بنص المادة 226 من القانون المدني.`;
      changeSummary = 'تم تغليظ الشرط الجزائي وإضافة نصوص التعويض الاتفاقي غير الخاضع لرقابة القضاء مع فائدة التأخير.';
    }
    // تعديل عام مرن حسب تعليمات المستخدم
    else {
      targetClause.content = `${targetClause.content}\n[تعديل وفق طلب المستشير]: تم استيعاب التوجيه وتعديل البند ليتضمن الالتزام التام بـ «${instruction}».`;
      changeSummary = `تم إدراج التعديل المباشر في ${targetClause.title}.`;
    }

    targetClause.isModified = true;
    updated.lastModifiedClauseNumber = targetClause.number;

    return {
      updatedDraft: updated,
      modifiedClause: targetClause,
      changeSummary,
    };
  }

  /**
   * تنسيق العقد الكامل كنص مخرج للمستشير
   */
  public renderDraftToMarkdown(draft: DraftState): string {
    const parts: string[] = [];
    parts.push(`### ${draft.title}\n`);
    parts.push(draft.preamble);
    parts.push('\n---\n');

    for (const c of draft.clauses) {
      const tag = c.isModified ? ' ✨ *(بند تم تعديله بناءً على طلبك)*' : '';
      parts.push(`#### ${c.title}${tag}`);
      parts.push(c.content);
      parts.push('');
    }

    return parts.join('\n');
  }
}
