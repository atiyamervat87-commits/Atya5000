/**
 * محرك وقاعدة المعرفة القانونية المصرية المترابطة (Egyptian Legal Knowledge Base Service)
 * يربط بين الدستور، والقانون المدني، وقانون العقوبات، والإجراءات الجنائية، وأحكام النقض والدستورية
 * ويوفر استرجاعاً سياقياً مترابطاً (Contextual & Graph-Enhanced Retrieval) لخدمة النماذج اللغوية.
 */

import {
  LegalArticleNode,
  LegalCrossReferenceEdge,
  ContextualGroundingPayload,
  LegalRetrievalOptions,
} from '../types/legalKnowledgeGraph';

/**
 * 1. بنك العقد التشريعية الموثقة (Canonical Legal Nodes)
 */
export const EGYPTIAN_KNOWLEDGE_GRAPH_NODES: LegalArticleNode[] = [
  // ──────────────────────────────────────────────
  // المستوى الأول: القمة الدستورية (دستور مصر 2014 وتعديلاته)
  // ──────────────────────────────────────────────
  {
    urn: 'urn:lex:eg:constitution:2014:art:54',
    id: 'CONST-54',
    normLevel: 'CONSTITUTION',
    branch: 'CONSTITUTIONAL',
    lawNumber: 'دستور 2014',
    lawYear: 2014,
    lawOfficialName: 'دستور جمهورية مصر العربية المعدل لسنة 2014',
    partNumber: 'الباب الثالث: الحقوق والحريات والواجبات العامة',
    articleNumber: '54',
    officialTitle: 'حرمة الحرية الشخصية وحظر القبض والتفتيش بدون أمر قضائي',
    verbatimText:
      'الحرية الشخصية حق طبيعي، وهي مصونة لا تُمس، وفيما عدا حالة التلبس، لا يجوز القبض على أحد، أو تفتيشه، أو حبسه، أو تقييد حريته بأي قيد إلا بأمر قضائي مسبب يستلزمه التحقيق. ويجب أن يُبلغ فوراً كل من تُقيد حريته بأسباب ذلك، ويحاط بحقوقه كتابة، ويُمكّن من الاتصال بذويه وبمحاميه فوراً، وأن يُقدم إلى سلطة التحقيق خلال أربع وعشرين ساعة من وقت تقييد حريته.',
    status: 'ACTIVE_FULL',
    legalDomainTags: ['حريات شخصية', 'القبض', 'التفتيش', 'التلبس', 'ضمانات المتهم', 'بطلان الإجراءات'],
    coreLegalConcepts: ['الشرعية الدستورية الإجرائية', 'حرمة الحرية', 'مشروعية الدليل', 'حق الدفاع'],
    proceduralSanctions: ['بطلان القبض والتفتيش بطلاناً متعلقاً بالنظام العام', 'بطلان كافة الأدلة المترتبة على الإجراء الباطل'],
    precedentCitations: [
      {
        court: 'المحكمة الدستورية العليا',
        circuit: 'الهيئة العامة',
        appealNumber: '28',
        judicialYear: '17 ق دستورية',
        sessionDate: '1997/01/04',
        heldPrinciple:
          'الحرية الشخصية أصل أصيل لا يجوز تقييده إلا وفق ضمانات قضائية وإجرائية صارمة، وأي افتئات عليها يوجب البطلان المطلق وتجريد الإجراء من كل أثر قانوني.',
        relevance: 'قيد دستوري',
      },
      {
        court: 'محكمة النقض المصرية',
        circuit: 'الدائرة الجنائية',
        appealNumber: '1120',
        judicialYear: '84 ق',
        sessionDate: '2015/03/12',
        heldPrinciple:
          'إجراء القبض أو الاستيقاف المقيد للحرية بغير أمر قضائي وفي غير حالات التلبس المنصوص عليها حصراً يقع باطلاً ويبطل كل دليل مستمد منه عملاً بالمادة 54 من الدستور.',
        relevance: 'استقرار قضائي',
      },
    ],
    retrievalMetadata: {
      contextualPrefix: 'الدستور المصري 2014 (المادة 54) - الأصل الدستوري الأعلى في صون الحرية الشخصية وحظر القبض',
      denseKeywordsAr: ['دستور', 'مادة 54', 'الحرية الشخصية', 'القبض', 'التفتيش', 'أمر قضائي', 'تلبس', 'بطلان'],
      colloquialTermsAr: ['اتقبض عليا بدون إذن', 'تفتيش في الشارع', 'كمين بدون إذن', 'الظابط وقفني بدون تلبس', 'تلفيق'],
      searchWeight: 2.0,
    },
  },

  {
    urn: 'urn:lex:eg:constitution:2014:art:97',
    id: 'CONST-97',
    normLevel: 'CONSTITUTION',
    branch: 'CONSTITUTIONAL',
    lawNumber: 'دستور 2014',
    lawYear: 2014,
    lawOfficialName: 'دستور جمهورية مصر العربية المعدل لسنة 2014',
    partNumber: 'الباب الرابع: سيادة القانون',
    articleNumber: '97',
    officialTitle: 'حق التقاضي وحظر تحصين القرارات',
    verbatimText:
      'التقاضي حق مصون ومكفول للكافة. وتلتزم الدولة بتقريب جهات التقاضي، وتعمل على سرعة الفصل في القضايا، ويُحظر تحصين أي عمل أو قرار إداري من رقابة القضاء، ولا يُحاكم شخص إلا أمام قاضيه الطبيعي، والمحاكم الاستثنائية محظورة.',
    status: 'ACTIVE_FULL',
    legalDomainTags: ['حق التقاضي', 'القاضي الطبيعي', 'مجلس الدولة', 'إلغاء القرارات', 'تحصين القرارات'],
    coreLegalConcepts: ['سيادة القانون', 'حظر التحصين', 'الرقابة القضائية على أعمال الإدارة'],
    precedentCitations: [
      {
        court: 'المحكمة الدستورية العليا',
        circuit: 'الهيئة العامة',
        appealNumber: '15',
        judicialYear: '28 ق دستورية',
        sessionDate: '2008/04/13',
        heldPrinciple:
          'حظر تحصين أي عمل أو قرار إداري من رقابة القضاء هو أصل ديمقراطي حاكم لا يقبل استثناءً أو تفويضاً تشريعياً.',
        relevance: 'قيد دستوري',
      },
    ],
    retrievalMetadata: {
      contextualPrefix: 'الدستور المصري 2014 (المادة 97) - المبدأ الدستوري في حق التقاضي وحظر تحصين القرارات',
      denseKeywordsAr: ['دستور', 'مادة 97', 'حق التقاضي', 'القاضي الطبيعي', 'تحصين القرارات الإدارية', 'سيادة القانون'],
      colloquialTermsAr: ['عايز ارفع قضية ضد جهة حكومية', 'القرار محصن', 'ممنوع من المحكمة'],
      searchWeight: 1.8,
    },
  },

  // ──────────────────────────────────────────────
  // المستوى الثاني: قانون الإجراءات الجنائية (رقم 150 لسنة 1950)
  // ──────────────────────────────────────────────
  {
    urn: 'urn:lex:eg:code:crimproc:1950-150:art:30',
    id: 'CRIMPROC-30',
    normLevel: 'STATUTORY_CODE',
    branch: 'CRIMINAL_PROCEDURE',
    lawNumber: '150',
    lawYear: 1950,
    lawOfficialName: 'قانون الإجراءات الجنائية المصري رقم 150 لسنة 1950 وتعديلاته',
    partNumber: 'الكتاب الأول: في الدعوى العمومية وجمع الاستدلالات والتحقيق',
    chapterNumber: 'الباب الثاني: في التلبس بالجريمة',
    articleNumber: '30',
    officialTitle: 'حالات التلبس بالجريمة على سبيل الحصر',
    verbatimText:
      'تكون الجريمة متلبساً بها حال ارتكابها أو عقب ارتكابها ببرهة يسيرة. وتعتبر الجريمة متلبساً بها إذا تبع المجني عليه مرتكبها أو تبعته العامة مع الصياح إثر وقوعها، أو إذا وجد مرتكبها بعد وقوعها بوقت قريب حاملاً آلات أو أسلحة أو أمتعة أو أوراقاً أو أشياء أخرى يستدل منها على أنه فاعل أو شريك فيها، أو إذا وجدت به في هذا الوقت آثار أو علامات تفيد ذلك.',
    status: 'ACTIVE_FULL',
    legalDomainTags: ['التلبس', 'القبض', 'الضبط الجنائي', 'تفتيش', 'بطلان القبض'],
    coreLegalConcepts: ['الحصر التشريعي لحالات التلبس', 'المشاهدة المباشرة للحواس', 'انعدام التقدير الظني'],
    proceduralSanctions: ['بطلان التفتيش عند تخلف إحدى حالات المادة 30', 'استبعاد الدليل المستمد من التلبس الباطل'],
    precedentCitations: [
      {
        court: 'محكمة النقض المصرية',
        circuit: 'الدائرة الجنائية',
        appealNumber: '2541',
        judicialYear: '79 ق',
        sessionDate: '2010/05/18',
        heldPrinciple:
          'حالات التلبس واردة في المادة 30 من قانون الإجراءات الجنائية على سبيل الحصر لا على سبيل البيان أو القياس، ويكفي لبطلان الإجراء أن يكون الضابط قد اختلق حالة التلبس أو رتبها على مسلك غير مشروع.',
        relevance: 'استقرار قضائي',
      },
    ],
    retrievalMetadata: {
      contextualPrefix: 'قانون الإجراءات الجنائية المصري (المادة 30) - حالات التلبس الحصرية المبيحة للقبض والتفتيش',
      denseKeywordsAr: ['إجراءات جنائية', 'مادة 30', 'التلبس', 'حال ارتكابها', 'صياح العامة', 'آثار وعلامات'],
      colloquialTermsAr: ['متلبس بالجرم المشهود', 'مسكوه متلبس', 'شافوه بعينهم', 'الظابط ادعى التلبس'],
      searchWeight: 1.6,
    },
  },

  {
    urn: 'urn:lex:eg:code:crimproc:1950-150:art:34',
    id: 'CRIMPROC-34',
    normLevel: 'STATUTORY_CODE',
    branch: 'CRIMINAL_PROCEDURE',
    lawNumber: '150',
    lawYear: 1950,
    lawOfficialName: 'قانون الإجراءات الجنائية المصري رقم 150 لسنة 1950 وتعديلاته',
    chapterNumber: 'الباب الثاني: في التلبس بالجريمة',
    articleNumber: '34',
    officialTitle: 'سلطة مأمور الضبط القضائي في القبض على المتهم الحاضر في أحوال التلبس',
    verbatimText:
      'لمأمور الضبط القضائي في أحوال التلبس بالجنايات أو بالجنح التي يعاقب عليها بالحبس لمدة تزيد على ثلاثة أشهر، أن يأمر بالقبض على المتهم الحاضر الذي توجد دلائل كافية على اتهامه.',
    status: 'ACTIVE_FULL',
    legalDomainTags: ['القبض الإجرائي', 'مأمور الضبط القضائي', 'دلائل كافية', 'حدود الحبس المبيح للقبض'],
    coreLegalConcepts: ['التقييد الإجرائي لسلطة الضبط', 'التلازم بين التلبس والقبض', 'سيادة الشرعية الإجرائية'],
    proceduralSanctions: ['بطلان القبض إذا كانت عقوبة الجنحة لا تجاوز 3 أشهر أو انعدم التلبس'],
    precedentCitations: [
      {
        court: 'محكمة النقض المصرية',
        circuit: 'الدائرة الجنائية',
        appealNumber: '4410',
        judicialYear: '81 ق',
        sessionDate: '2012/04/24',
        heldPrinciple:
          'المادة 34 إجراءات جنائية لا تبيح لمأمور الضبط القبض إلا إذا كانت الجريمة متلبساً بها فعلاً ومعاقباً عليها بأكثر من ثلاثة أشهر حبس، فإن تخلفت إحداهما سقطت ولاية الضابط بالقبض وبطل ما يليه.',
        relevance: 'تفسير لازم',
      },
    ],
    retrievalMetadata: {
      contextualPrefix: 'قانون الإجراءات الجنائية المصري (المادة 34) - شروط القبض القانوني لمأمور الضبط المقيدة بالدستور',
      denseKeywordsAr: ['إجراءات جنائية', 'مادة 34', 'مأمور الضبط القضائي', 'القبض', 'جنح الحبس 3 أشهر', 'دلائل كافية'],
      colloquialTermsAr: ['سلطة الظابط في القبض', 'يجوز للظابط يقبض عليا', 'القبض في الجنحة'],
      searchWeight: 1.5,
    },
  },

  {
    urn: 'urn:lex:eg:code:crimproc:1950-150:art:251',
    id: 'CRIMPROC-251',
    normLevel: 'STATUTORY_CODE',
    branch: 'CRIMINAL_PROCEDURE',
    lawNumber: '150',
    lawYear: 1950,
    lawOfficialName: 'قانون الإجراءات الجنائية المصري رقم 150 لسنة 1950',
    chapterNumber: 'الباب الرابع: في الدعوى المدنية التابعة للدعوى الجنائية',
    articleNumber: '251',
    officialTitle: 'الادعاء المدني بالتعويض أمام المحكمة الجنائية',
    verbatimText:
      'لمن لحقه ضرر من الجريمة أن يقيم نفسه مدعياً بحقوق مدنية أمام المحكمة المنظورة أمامها الدعوى الجنائية، في أية حالة كانت عليها الدعوى حتى صدور القرار بإقفال باب المرافعة طبقاً للمادة (275)، ولا يقبل منه ذلك أمام المحكمة الاستئنافية.',
    status: 'ACTIVE_FULL',
    legalDomainTags: ['الادعاء المدني', 'التعويض عن الجريمة', 'المحكمة الجنائية', 'الضرر الجنائي'],
    coreLegalConcepts: ['تبعية الدعوى المدنية للدعوى الجنائية', 'وحدة المصدر الضار', 'التعويض المؤقت'],
    precedentCitations: [
      {
        court: 'محكمة النقض المصرية',
        circuit: 'الدائرة الجنائية والمدنية المشتركة',
        appealNumber: '890',
        judicialYear: '58 ق',
        sessionDate: '1989/02/16',
        heldPrinciple:
          'قبول الادعاء المدني أمام القضاء الجنائي مشروط بأن يكون الضرر المطالب بالتعويض عنه ناشئاً مباشرة عن الجريمة المرفوعة بها الدعوى الجنائية وفقاً للمادة 251 إجراءات جنائية والمادة 163 مدني.',
        relevance: 'استقرار قضائي',
      },
    ],
    retrievalMetadata: {
      contextualPrefix: 'قانون الإجراءات الجنائية (المادة 251) - رابطة التبعية للحق المدني والتعويض أمام المحكمة الجنائية',
      denseKeywordsAr: ['إجراءات جنائية', 'مادة 251', 'ادعاء مدني', 'تعويض مدني مؤقت', 'حقوق مدنية', 'ضرر من الجريمة'],
      colloquialTermsAr: ['عايز تعويض في الجنحة', 'ادعاء مدني بمبلغ 10001', 'تعويض مؤقت'],
      searchWeight: 1.5,
    },
  },

  // ──────────────────────────────────────────────
  // المستوى الثالث: قانون العقوبات المصري (رقم 58 لسنة 1937)
  // ──────────────────────────────────────────────
  {
    urn: 'urn:lex:eg:code:penal:1937-58:art:280',
    id: 'PENAL-280',
    normLevel: 'STATUTORY_CODE',
    branch: 'PENAL',
    lawNumber: '58',
    lawYear: 1937,
    lawOfficialName: 'قانون العقوبات المصري رقم 58 لسنة 1937 وتعديلاته',
    partNumber: 'الكتاب الثالث: الجنايات والجنح التي تقع على الأشخاص',
    chapterNumber: 'الباب السادس: القبض على الناس وحبسهم دون وجه حق',
    articleNumber: '280',
    officialTitle: 'جريمة القبض والاحتجاز بدون وجه حق',
    verbatimText:
      'كل من قبض على أي شخص أو حبسه أو حجزه بدون أمر أحد الحكام المختصين وفي غير الأحوال التي تصرح فيها القوانين واللوائح بالقبض على ذوي الشبهة يعاقب بالحبس أو بغرامة لا تتجاوز مائتي جنيه.',
    status: 'ACTIVE_FULL',
    legalDomainTags: ['القبض الباطل', 'الحبس بدون وجه حق', 'مسؤولية مأمور الضبط', 'حماية الحريات'],
    coreLegalConcepts: ['الجريمة المستمرة للاحتجاز', 'الجزاء الجنائي لانتهاك الشرعية الدستورية', 'المسؤولية الجنائية للموظف العام'],
    precedentCitations: [
      {
        court: 'محكمة النقض المصرية',
        circuit: 'الدائرة الجنائية',
        appealNumber: '1720',
        judicialYear: '42 ق',
        sessionDate: '1973/01/14',
        heldPrinciple:
          'تقوم جريمة المادة 280 عقوبات في حق كل من اعتدى على حرية المجني عليه باحتجازه أو حرمانه من حرية التنقل دون سند قانوني صريح مبيح، ولو كان الفاعل موظفاً عاماً أو رجل ضبط.',
        relevance: 'استقرار قضائي',
      },
    ],
    retrievalMetadata: {
      contextualPrefix: 'قانون العقوبات المصري (المادة 280) - الجزاء الجنائي الصارم على انتهاك المادة 54 من الدستور بالاحتجاز الباطل',
      denseKeywordsAr: ['عقوبات', 'مادة 280', 'قبض بدون وجه حق', 'حبس غير قانوني', 'احتجاز', 'حكام مختصين'],
      colloquialTermsAr: ['حبسوني بدون إذن', 'الظابط حجزني في القسم بدون محضر', 'احتجاز غير قانوني'],
      searchWeight: 1.5,
    },
  },

  {
    urn: 'urn:lex:eg:code:penal:1937-58:art:341',
    id: 'PENAL-341',
    normLevel: 'STATUTORY_CODE',
    branch: 'PENAL',
    lawNumber: '58',
    lawYear: 1937,
    lawOfficialName: 'قانون العقوبات المصري رقم 58 لسنة 1937 وتعديلاته',
    chapterNumber: 'الباب الثاني عشر: في خيانة الأمانة',
    articleNumber: '341',
    officialTitle: 'جريمة خيانة الأمانة وعقود الأمانة الخمسة (إيصال الأمانة)',
    verbatimText:
      'كل من اختلس أو استعمل أو بدد مبالغ أو أمتعة أو بضائع أو نقوداً أو تذاكر أو كتابات أخرى مشتملة على تمسك أو مخالصة أو غير ذلك إضراراً بمالكيها أو أصحابها أو واضعي اليد عليها وكانت الأشياء المذكورة لم تسلم له إلا على وجه الوديعة أو الإجارة أو على سبيل عارية الاستعمال أو الرهن أو كانت سلمت له بصفته وكيلاً بأجرة أو مجاناً بقصد عرضها للبيع أو استعمالها في أمر معين لمنفعة المالك أو غيره يحكم عليه بالحبس ويجوز أن يزاد عليه غرامة لا تتجاوز مائة جنيه مصري.',
    status: 'ACTIVE_FULL',
    legalDomainTags: ['خيانة أمانة', 'إيصال أمانة', 'تبديد', 'عقود الائتمان', 'الوديعة', 'الوكالة'],
    coreLegalConcepts: ['الحصر الخماسي لعقود الائتمان', 'الركن المادي بالتبديد أو الاختلاس', 'قصد الإضرار ونية التملك', 'مدنية النزاع'],
    proceduralSanctions: ['براءة المتهم إذا ثبت أن التسليم لم يكن بأحد عقود الأمانة الخمسة'],
    precedentCitations: [
      {
        court: 'محكمة النقض المصرية',
        circuit: 'الدائرة الجنائية',
        appealNumber: '1984',
        judicialYear: '60 ق',
        sessionDate: '1992/05/21',
        heldPrinciple:
          'لا تصح إدانة المتهم بجريمة خيانة الأمانة طبقاً للمادة 341 عقوبات إلا إذا ثبت اقتناع القاضي بأن تسليم المال كان حاصلاً بناءً على عقد من عقود الأمانة الواردة حصراً في المادة، فإن كان التسليم ناشئاً عن علاقة مدنية أو تجارية كعقد بيع أو شراكة انتفى الركن الجنائي وانحسر النزاع في نطاق القضاء المدني.',
        relevance: 'استقرار قضائي',
      },
    ],
    retrievalMetadata: {
      contextualPrefix: 'قانون العقوبات المصري (المادة 341) - جنحة خيانة الأمانة وعقود الوديعة والوكالة وإيصالات الأمانة',
      denseKeywordsAr: ['عقوبات', 'مادة 341', 'خيانة أمانة', 'إيصال أمانة', 'تبديد', 'اختلاس', 'وديعة', 'وكالة'],
      colloquialTermsAr: ['وصل أمانة', 'إيصال على بياض', 'مخدتش الفلوس', 'إيصال الأمانة كان ضمان تجاري'],
      searchWeight: 1.7,
    },
  },

  // ──────────────────────────────────────────────
  // المستوى الرابع: القانون المدني المصري (رقم 131 لسنة 1948)
  // ──────────────────────────────────────────────
  {
    urn: 'urn:lex:eg:code:civil:1948-131:art:163',
    id: 'CIVIL-163',
    normLevel: 'STATUTORY_CODE',
    branch: 'CIVIL',
    lawNumber: '131',
    lawYear: 1948,
    lawOfficialName: 'القانون المدني المصري رقم 131 لسنة 1948',
    partNumber: 'الكتاب الأول: الالتزامات بوجه عام',
    chapterNumber: 'الفصل الثالث: العمل غير المشروع (المسؤولية التقصيرية)',
    articleNumber: '163',
    officialTitle: 'القاعدة الكبرى للمسؤولية التقصيرية والتعويض عن الفعل الضار',
    verbatimText:
      'كل خطأ سبب ضرراً للغير يلزم من ارتكبه بالتعويض.',
    status: 'ACTIVE_FULL',
    legalDomainTags: ['المسؤولية التقصيرية', 'التعويض المدني', 'أركان الخطأ والضرر والسببية', 'التعويض الجابر للضرر'],
    coreLegalConcepts: ['أم القواعد المدنية', 'جبر الضرر المادي والأدبي', 'الارتباط بالفعل الجنائي والمدني'],
    precedentCitations: [
      {
        court: 'محكمة النقض المصرية',
        circuit: 'الدائرة المدنية',
        appealNumber: '142',
        judicialYear: '52 ق',
        sessionDate: '1986/11/27',
        heldPrinciple:
          'المادة 163 من القانون المدني أرست مبدأً عاماً يقضي بأن كل إخلال بواجب قانوني عام بعدم الإضرار بالغير يعد خطأً يوجب التعويض متى توافرت علاقة السببية بينه وبين الضرر المتحقق.',
        relevance: 'استقرار قضائي',
      },
    ],
    retrievalMetadata: {
      contextualPrefix: 'القانون المدني المصري (المادة 163) - الأصل العام الحاكم لجبر الأضرار والتعويض الناشئ عن أي خطأ أو جريمة',
      denseKeywordsAr: ['قانون مدني', 'مادة 163', 'مسؤولية تقصيرية', 'تعويض', 'خطأ', 'ضرر', 'علاقة سببية'],
      colloquialTermsAr: ['عايز ارفع تعويض', 'طالب بتعويض ملايين', 'ضرني وعايز حقي المدني'],
      searchWeight: 1.7,
    },
  },

  {
    urn: 'urn:lex:eg:code:civil:1948-131:art:936',
    id: 'CIVIL-936',
    normLevel: 'STATUTORY_CODE',
    branch: 'CIVIL',
    lawNumber: '131',
    lawYear: 1948,
    lawOfficialName: 'القانون المدني المصري رقم 131 لسنة 1948',
    partNumber: 'الكتاب الثالث: الحقوق العينية الأصلية',
    chapterNumber: 'الفصل الثاني: أسباب كسب الملكية - المبحث الخامس: الشفعة',
    articleNumber: '936',
    officialTitle: 'أصحاب الحق في الأخذ بالشفعة وترتيب درجاتهم وسقوط شفعة الجار دستورية',
    verbatimText:
      'يثبت الحق في الشفعة:\n( أ ) لمالك الرقبة إذا بيع كل حق الانتفاع الملابس لها أو بعضه.\n(ب) للشريك على الشيوع إذا بيع شيء من العقار الشائع إلى أجنبي.\n(ج) لصاحب حق الانتفاع إذا بيعت كل الرقبة الملابسة لهذا الحق أو بعضها.\n(د) لمالك الرقبة في الحكر إذا بيع كل حق الحكر الملابس لها أو بعضه، وللمستحكر إذا بيعت كل الرقبة الملابسة لحقه أو بعضها.\n[البند (هـ) الجار المالك: مقضي بعدم دستوريته نهائياً وساقط بقوة الدستور].',
    status: 'PARTIALLY_UNCONSTITUTIONAL',
    constitutionalStatusNote:
      'قضت المحكمة الدستورية العليا في القضية رقم 28 لسنة 28 قضائية "دستورية" بجلسة 2011/01/02 بعدم دستورية نص البند (هـ) من المادة 936 من القانون المدني فيما تضمنه من إثبات حق الشفعة للجار المالك، ونشر الحكم بالجريدة الرسمية بالعدد (2) تابع بتاريخ 2011/01/13 وبذلك سقطت شفعة الجار المالك نهائياً من المنظومة القانونية المصرية انتصاراً لحرية التعاقد وقدسية الملكية.',
    legalDomainTags: ['الشفعة', 'ملكية عقارية', 'الشريك على الشيوع', 'حق الانتفاع', 'عدم دستورية شفعة الجار'],
    coreLegalConcepts: ['الاستثناء المقيد لحرية التعاقد', 'الترتيب الحصري لطبقات الشفعاء', 'الأثر الملزم للأحكام الدستورية'],
    precedentCitations: [
      {
        court: 'المحكمة الدستورية العليا',
        circuit: 'الهيئة العامة',
        appealNumber: '28',
        judicialYear: '28 ق دستورية',
        sessionDate: '2011/01/02',
        heldPrinciple:
          'القضاء بعدم دستورية نص البند (هـ) من المادة 936 من القانون المدني وسقوط حق الجار المالك في الأخذ بالشفعة لمخالفته المادتين 32 و34 من الدستور وصونه لحرية التعاقد وحق الملكية الخاصة.',
        relevance: 'قيد دستوري',
      },
    ],
    retrievalMetadata: {
      contextualPrefix: 'القانون المدني المصري (المادة 936 معدلة دستورية) - أصحاب حق الشفعة الحصري وسقوط شفعة الجار حكماً',
      denseKeywordsAr: ['قانون مدني', 'مادة 936', 'شفعة', 'شريك على الشيوع', 'مالك الرقبة', 'عدم دستورية البند هـ'],
      colloquialTermsAr: ['الجار يطلب شفعة', 'جاري باع الشقة وعايز اشفع', 'حق الجار في الشفعة'],
      searchWeight: 1.8,
    },
  },
];

/**
 * 2. مصفوفة الروابط الشبكية بين المواد (Knowledge Graph Edges)
 */
export const EGYPTIAN_KNOWLEDGE_GRAPH_EDGES: LegalCrossReferenceEdge[] = [
  // أ. السند الدستوري لإجراءات القبض والتفتيش
  {
    id: 'EDGE-CONST54-CRIMPROC34',
    sourceUrn: 'urn:lex:eg:constitution:2014:art:54',
    targetUrn: 'urn:lex:eg:code:crimproc:1950-150:art:34',
    relationType: 'CONSTITUTIONAL_FOUNDATION',
    weight: 10,
    legalRationale:
      'المادة 54 من الدستور هي الأصل الدستوري الأعلى الذي يقيد سلطة مأمور الضبط القضائي الواردة بالمادة 34 إجراءات، فلا يجوز إعمال المادة 34 إلا في إطار حالة تلبس حقيقية صريحة مستوفية للضمانات الدستورية.',
    mutualBidirectional: true,
  },
  {
    id: 'EDGE-CONST54-CRIMPROC30',
    sourceUrn: 'urn:lex:eg:constitution:2014:art:54',
    targetUrn: 'urn:lex:eg:code:crimproc:1950-150:art:30',
    relationType: 'CONSTITUTIONAL_FOUNDATION',
    weight: 10,
    legalRationale:
      'حصر حالات التلبس بالمادة 30 إجراءات هو التفسير الإجرائي الإلزامي للاستثناء الوحيد المسموح به في المادة 54 من الدستور للقبض بدون أمر قضائي.',
    mutualBidirectional: true,
  },

  // ب. الجزاء الجنائي المترتب على مخالفة الدستور والإجراءات (حظر الاحتجاز الباطل)
  {
    id: 'EDGE-CRIMPROC34-PENAL280',
    sourceUrn: 'urn:lex:eg:code:crimproc:1950-150:art:34',
    targetUrn: 'urn:lex:eg:code:penal:1937-58:art:280',
    relationType: 'PROCEDURAL_ENFORCEMENT',
    weight: 9,
    legalRationale:
      'أي تجاوز من مأمور الضبط القضائي لشروط القبض المنصوص عليها بالمادة 34 والمادة 54 دستور ينقل الواقعة من دائرة العمل المشروع إلى دائرة التجريم المعاقب عليها بالمادة 280 عقوبات (القبض بدون وجه حق).',
    mutualBidirectional: true,
  },

  // ج. الرابطة العضوية بين الجنائي والمدني (خيانة الأمانة + التعويض المدني)
  {
    id: 'EDGE-PENAL341-CIVIL163',
    sourceUrn: 'urn:lex:eg:code:penal:1937-58:art:341',
    targetUrn: 'urn:lex:eg:code:civil:1948-131:art:163',
    relationType: 'CIVIL_CRIMINAL_NEXUS',
    weight: 10,
    legalRationale:
      'جريمة خيانة الأمانة (المادة 341 عقوبات) تمثل خطأً جنائياً ومدنياً في آنٍ واحد يترتب عليه التزام المبدد بتعويض المضرور بالمعادل المالي لما تم تبديده طبقاً للمادة 163 مدني.',
    mutualBidirectional: true,
  },
  {
    id: 'EDGE-PENAL341-CRIMPROC251',
    sourceUrn: 'urn:lex:eg:code:penal:1937-58:art:341',
    targetUrn: 'urn:lex:eg:code:crimproc:1950-150:art:251',
    relationType: 'PROCEDURAL_ENFORCEMENT',
    weight: 9,
    legalRationale:
      'المجني عليه في جنحة خيانة الأمانة يمارس حقه في المطالبة بالتعويض المدني (المادة 163 مدني) عن طريق آلية الادعاء بالحق المدني أمام القاضي الجنائي عملاً بالمادة 251 إجراءات جنائية.',
    mutualBidirectional: true,
  },

  // د. الرقابة القضائية على عدم دستورية القوانين (الشفعة)
  {
    id: 'EDGE-CIVIL936-CONSTINVALIDITY',
    sourceUrn: 'urn:lex:eg:code:civil:1948-131:art:936',
    targetUrn: 'urn:lex:eg:constitution:2014:art:97',
    relationType: 'CONSTITUTIONAL_INVALIDITY',
    weight: 10,
    legalRationale:
      'قضاء المحكمة الدستورية العليا الصادر في القضية 28 لسنة 28 ق دستورية أسقط البند (هـ) من المادة 936 مدني نهائياً من النظام القانوني، وألغى حق الجار في الشفعة لمخالفته حرية التعاقد وحرمة الملكية المصونة بالدستور.',
    mutualBidirectional: false,
  },
];

/**
 * 3. خوارزمية الاسترجاع السياقي والشبكي فائق الدقة (Contextual & Graph-Enhanced Retrieval)
 */
export class EgyptianLegalKnowledgeBase {
  private nodes: Map<string, LegalArticleNode> = new Map();
  private edges: LegalCrossReferenceEdge[] = [];

  constructor() {
    for (const node of EGYPTIAN_KNOWLEDGE_GRAPH_NODES) {
      this.nodes.set(node.urn, node);
      this.nodes.set(node.id, node);
    }
    this.edges = [...EGYPTIAN_KNOWLEDGE_GRAPH_EDGES];
  }

  /**
   * البحث واسترجاع النص الأساسي مع شبكة المواد الدستورية والإجرائية والموضوعية المقترنة به
   */
  public queryKnowledgeGraph(
    userQuery: string,
    options: LegalRetrievalOptions = {}
  ): ContextualGroundingPayload | null {
    const q = (userQuery || '').trim().toLowerCase();
    if (!q) return null;

    // 1. فرز العقدة الأساسية المطابقة بدقة
    const primaryNode = this.findBestMatchingNode(q);
    if (!primaryNode) return null;

    // 2. تتبع الأصول الدستورية والإجرائية والموضوعية المقترنة في الرسم البياني
    const connectedEdges = this.edges.filter(
      (e) => e.sourceUrn === primaryNode.urn || (e.mutualBidirectional && e.targetUrn === primaryNode.urn)
    );

    const constitutionalBackbone: LegalArticleNode[] = [];
    const proceduralCounterparts: LegalArticleNode[] = [];
    const substantiveCounterparts: LegalArticleNode[] = [];
    const traversalPathExplanation: string[] = [];

    traversalPathExplanation.push(
      `تم تحديد المادة المحورية الأولية: [${primaryNode.lawOfficialName} - مادة ${primaryNode.articleNumber}] كأقوى مطابقة قانونية للاستفسار.`
    );

    for (const edge of connectedEdges) {
      const neighborUrn = edge.sourceUrn === primaryNode.urn ? edge.targetUrn : edge.sourceUrn;
      const neighborNode = this.nodes.get(neighborUrn);
      if (!neighborNode) continue;

      if (neighborNode.normLevel === 'CONSTITUTION') {
        constitutionalBackbone.push(neighborNode);
        traversalPathExplanation.push(
          `ربط دستوري مباشر: تتبع علاقة [${edge.relationType}] إلى القمة الدستورية: المادة (${neighborNode.articleNumber}) من الدستور: ${edge.legalRationale}`
        );
      } else if (
        neighborNode.branch === 'CRIMINAL_PROCEDURE' ||
        neighborNode.branch === 'CIVIL_PROCEDURE'
      ) {
        proceduralCounterparts.push(neighborNode);
        traversalPathExplanation.push(
          `ربط إجرائي تنفيذي: استدعاء القيد أو الإجراء الحاكم من [${neighborNode.lawOfficialName} - مادة ${neighborNode.articleNumber}].`
        );
      } else {
        substantiveCounterparts.push(neighborNode);
        traversalPathExplanation.push(
          `ربط موضوعي متكامل: تتبع الأثر المدني/الجنائي المشترك إلى [${neighborNode.lawOfficialName} - مادة ${neighborNode.articleNumber}].`
        );
      }
    }

    // تجميع السوابق القضائية المعتمدة حصراً من المادة الأساسية والمواد المترابطة
    const allPrecedents = [
      ...primaryNode.precedentCitations,
      ...constitutionalBackbone.flatMap((n) => n.precedentCitations),
      ...substantiveCounterparts.flatMap((n) => n.precedentCitations),
    ];

    // إعداد الـ Grounding Prompt Payload المنظم والمحزم لمنع الهلوسة في النماذج
    const formattedGroundingContext = this.buildContextualPromptPayload(
      primaryNode,
      constitutionalBackbone,
      proceduralCounterparts,
      substantiveCounterparts,
      allPrecedents,
      traversalPathExplanation
    );

    return {
      query: userQuery,
      matchedPrimaryArticle: primaryNode,
      constitutionalBackbone: constitutionalBackbone.length > 0 ? constitutionalBackbone : undefined,
      proceduralCounterparts: proceduralCounterparts.length > 0 ? proceduralCounterparts : undefined,
      substantiveCounterparts: substantiveCounterparts.length > 0 ? substantiveCounterparts : undefined,
      relatedCassationPrecedents: allPrecedents,
      formattedGroundingContext,
      traversalPathExplanation,
    };
  }

  /**
   * اختيار المادة الأوثق صلة عبر التوفيق بين الألفاظ القانونية والعامية
   */
  private findBestMatchingNode(query: string): LegalArticleNode | null {
    let bestScore = 0;
    let selectedNode: LegalArticleNode | null = null;

    for (const node of EGYPTIAN_KNOWLEDGE_GRAPH_NODES) {
      let score = 0;

      // أ. تطابق رقم المادة المباشر
      if (query.includes(node.articleNumber) && (query.includes(node.lawNumber) || query.includes('مادة'))) {
        score += 50;
      }

      const queryTokens = query.split(/\s+/).filter((w) => w.length > 2);

      // ب. الكلمات المفتاحية التخصصية
      for (const kw of node.retrievalMetadata.denseKeywordsAr) {
        const kwLower = kw.toLowerCase();
        if (query.includes(kwLower)) {
          score += 10;
        } else if (queryTokens.some((t) => kwLower.includes(t) || t.includes(kwLower))) {
          score += 4;
        }
      }

      // ج. المفردات الشعبية والعامية المصرية
      for (const col of node.retrievalMetadata.colloquialTermsAr) {
        const colLower = col.toLowerCase();
        if (query.includes(colLower)) {
          score += 20;
        } else {
          const colWords = colLower.split(/\s+/).filter((w) => w.length > 2);
          const matchedWords = colWords.filter((cw) => queryTokens.some((qt) => qt.includes(cw) || cw.includes(qt)));
          if (matchedWords.length >= 2) {
            score += 15;
          } else if (matchedWords.length === 1) {
            score += 5;
          }
        }
      }

      // د. فحص وسوم النطاق (Domain Tags)
      for (const tag of node.legalDomainTags) {
        if (query.includes(tag.toLowerCase())) {
          score += 8;
        }
      }

      // هـ. الوزن المعياري
      score *= node.retrievalMetadata.searchWeight;

      if (score > bestScore) {
        bestScore = score;
        selectedNode = node;
      }
    }

    return selectedNode;
  }

  /**
   * بناء نص التحزيم السياقي (Contextual Payload) الجاهز للحقن في نافذة سياق Gemini أو LLM
   */
  private buildContextualPromptPayload(
    primary: LegalArticleNode,
    constitutional: LegalArticleNode[],
    procedural: LegalArticleNode[],
    substantive: LegalArticleNode[],
    precedents: LegalArticleNode['precedentCitations'],
    traversal: string[]
  ): string {
    let out = `═══════════════════════════════════════════════════════════════\n`;
    out += `سياق الاستدلال المعرفي والتشريعي الموثق من قاعدة المعرفة المصرية:\n`;
    out += `═══════════════════════════════════════════════════════════════\n\n`;

    out += `1. مسار الترابط والاستدلال القضائي المعتمد:\n`;
    traversal.forEach((step, idx) => {
      out += `  [${idx + 1}] ${step}\n`;
    });
    out += `\n`;

    if (constitutional.length > 0) {
      out += `2. القمة الدستورية الحاكمة للواقعة (لا تجوز مخالفتها بأي تشريع أو إجراء):\n`;
      constitutional.forEach((c) => {
        out += `  • ${c.lawOfficialName} - مادة (${c.articleNumber}) [${c.officialTitle || ''}]:\n`;
        out += `    «${c.verbatimText}»\n`;
      });
      out += `\n`;
    }

    out += `3. المادة التشريعية المحورية الحاكمة:\n`;
    out += `  • ${primary.lawOfficialName} - مادة (${primary.articleNumber}) [${primary.officialTitle || ''}]:\n`;
    out += `    «${primary.verbatimText}»\n`;
    if (primary.status === 'PARTIALLY_UNCONSTITUTIONAL' && primary.constitutionalStatusNote) {
      out += `    ★ تنبيه دستوري ملزم: ${primary.constitutionalStatusNote}\n`;
    }
    out += `\n`;

    if (procedural.length > 0) {
      out += `4. القيود والضمانات الإجرائية المرتبطة (مرافعات / إجراءات جنائية):\n`;
      procedural.forEach((p) => {
        out += `  • ${p.lawOfficialName} - مادة (${p.articleNumber}):\n`;
        out += `    «${p.verbatimText}»\n`;
      });
      out += `\n`;
    }

    if (substantive.length > 0) {
      out += `5. الروابط الموضوعية المشتركة (مدني / عقوبات / تعويض):\n`;
      substantive.forEach((s) => {
        out += `  • ${s.lawOfficialName} - مادة (${s.articleNumber}):\n`;
        out += `    «${s.verbatimText}»\n`;
      });
      out += `\n`;
    }

    if (precedents.length > 0) {
      out += `6. السوابق القضائية المعتمدة حصراً (يحظر الاستشهاد بغيرها):\n`;
      precedents.slice(0, 3).forEach((pr) => {
        out += `  • ${pr.court} (${pr.circuit}) - الطعن رقم ${pr.appealNumber} لسنة ${pr.judicialYear} ق - جلسة ${pr.sessionDate}:\n`;
        out += `    «${pr.heldPrinciple}»\n`;
      });
      out += `\n`;
    }

    out += `═══════════════════════════════════════════════════════════════\n`;
    out += `توجيه قضائي ملزم للنموذج: التزم التزاماً حرفياً بالنصوص الواردة أعلاه، واذكر كل نص برقم مادته واسم تشريعه دون أي تصرف أو تحريف.`;

    return out;
  }

  /**
   * استرجاع جميع العقد
   */
  public getAllNodes(): LegalArticleNode[] {
    return Array.from(new Set(this.nodes.values()));
  }

  /**
   * استرجاع جميع الروابط
   */
  public getAllEdges(): LegalCrossReferenceEdge[] {
    return [...this.edges];
  }
}

// تصدير نسخة عامة وحيدة (Singleton)
export const egyptianKnowledgeBase = new EgyptianLegalKnowledgeBase();
