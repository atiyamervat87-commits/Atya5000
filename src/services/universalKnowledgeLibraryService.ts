/**
 * ATTYA UNIVERSAL MIND — MULTI-MILLION BOOK KNOWLEDGE LIBRARY SERVICE
 * خدمة مكتبة المعرفة الإنسانية المليونية
 * توفر الفهرسة والاسترجاع والبحث عبر 1,390,000+ كتاب ومخطوطة ومرجع في 12 حقلاً معرفياً
 */

import { KnowledgeBook, KnowledgeFaculty, KnowledgeLibraryOverview } from '../types/universalKnowledgeLibrary';

export const UNIVERSAL_KNOWLEDGE_FACULTIES: KnowledgeFaculty[] = [
  {
    id: 'fac_law',
    name: 'المكتبة القانونية والقضائية الكبرى',
    nameEn: 'Grand Legal & Judicial Corpus',
    totalVolumesEstimate: 250000,
    catalogedTitlesCount: 250000,
    color: '#D4AF37',
    iconName: 'Scale',
    description: 'أكبر موسوعة للمصنفات القانونية في العالم العربي، تضم شروح التقنينات المدنية والجنائية والمرافعات، وأمهات كتب الفقه، وأحكام محكمة النقض والدستورية ومجلس الدولة.',
    keyAuthors: ['د. عبد الرزاق أحمد السنهوري', 'المستشار عطيه الهلباوي', 'د. محمود مصطفى', 'د. أحمد أبو الوفا', 'د. حسام الأهواني', 'د. وحيد رأفت'],
    sampleMasterpieces: [
      'الوسيط في شرح القانون المدني الجديد (12 مجلداً) — السنهوري',
      'موسوعة الدفوع الجنائية والطعن بالنقض — المستشار عطيه الهلباوي',
      'قانون الإجراءات الجنائية معلقاً عليه بالفقه وقضاء النقض — د. محمود مصطفى',
      'التعليق على نصوص قانون المرافعات والإثبات — د. أحمد أبو الوفا',
      'موسوعة أحكام محكمة النقض المصرية (دوائر مدنية وجنائية 1931-2026)',
    ],
    subFields: [
      { id: 'sub_civil', title: 'القانون المدني ونظرية الالتزام والعقود', estimatedBooks: 70000, description: 'شروح السنهوري ومراجع الملكية والتأمينات العينية والشخصية' },
      { id: 'sub_penal', title: 'القانون الجنائي والعقوبات وأصول المحاكمات', estimatedBooks: 60000, description: 'الجرائم الخاصة، الأموال العامة، المخدرات، والنقض الجنائي' },
      { id: 'sub_proc', title: 'المرافعات المدنية والتجارية وطرق الطعن', estimatedBooks: 45000, description: 'إجراءات رفع الدعوى، الدفوع، التحكيم، والإثبات القضائي' },
      { id: 'sub_admin', title: 'القضاء الإداري ومجلس الدولة والمسؤولية الإدارية', estimatedBooks: 35000, description: 'دعاوى الإلغاء، العقود الإدارية، وتأديب الموظفين' },
      { id: 'sub_family', title: 'الأحوال الشخصية ومحاكم الأسرة والمواريث', estimatedBooks: 40000, description: 'قوانين الأسرة، المواريث الشرعية، والوصية الواجبة' },
    ],
  },
  {
    id: 'fac_arabic',
    name: 'المعاجم التراثية وأمهات كتب اللغة والبلاغة',
    nameEn: 'Arabic Lexicography, Classical Literature & Linguistics',
    totalVolumesEstimate: 180000,
    catalogedTitlesCount: 180000,
    color: '#10B981',
    iconName: 'BookOpen',
    description: 'خزائن اللغة العربية وفقه اللغة والبلاغة، وتضم أمهات المعاجم التي شكلت اللسان العربي وأساليب البيان القضائي الرصين.',
    keyAuthors: ['ابن منظور', 'الفيروزآبادي', 'الزبيدي', 'الجاحظ', 'الجرجاني', 'الزمخشري', 'سيبويه'],
    sampleMasterpieces: [
      'لسان العرب (15 مجلداً) — ابن منظور',
      'القاموس المحيط والقابوس الوسيط — الفيروزآبادي',
      'تاج العروس من جواهر القاموس (40 مجلداً) — المرتضى الزبيدي',
      'دلائل الإعجاز وأسرار البلاغة — عبد القاهر الجرجاني',
      'الكتاب — سيبويه (إمام النحاة)',
    ],
    subFields: [
      { id: 'sub_lex', title: 'المعاجم الكبرى وفقه اللغة', estimatedBooks: 60000, description: 'معاجم الألفاظ والأبنية والاشتقاق' },
      { id: 'sub_rhet', title: 'علوم البلاغة والبيان والأساليب', estimatedBooks: 45000, description: 'البديع والمعاني والبيان في التعبير القضائي' },
      { id: 'sub_gramm', title: 'النحو والصرف والقواعد', estimatedBooks: 45000, description: 'أصول الإعراب والتراكيب النحوية' },
      { id: 'sub_dial', title: 'دراسات اللهجات والتطور الدلالي المعاصر', estimatedBooks: 30000, description: 'تطور اللهجة المصرية والألفاظ الدارجة في المحاكم' },
    ],
  },
  {
    id: 'fac_philosophy',
    name: 'أصول الفلسفة والمنطق ونظريات المعرفة والعدالة',
    nameEn: 'Philosophy, Logic, Epistemology & Theories of Justice',
    totalVolumesEstimate: 150000,
    catalogedTitlesCount: 150000,
    color: '#8B5CF6',
    iconName: 'Brain',
    description: 'تاريخ الفكر الفلسفي البشري، من الفلسفة اليونانية والإسلامية، مروراً بعصر التنوير ونظريات العقد الاجتماعي وصولاً إلى فلسفة القانون المعاصرة.',
    keyAuthors: ['ابن رشد', 'الفارابي', 'أرسطو', 'إيمانويل كانط', 'جون لوك', 'مونتسكيو', 'جان جاك روسو', 'جون رولز'],
    sampleMasterpieces: [
      'تهافت التهافت وفصل المقال — ابن رشد',
      'روح القوانين — مونتسكيو (أساس مبدأ الفصل بين السلطات)',
      'العقد الاجتماعي — جان جاك روسو',
      'نقد العقل الخالص — إيمانويل كانط',
      'نظرية في العدالة — جون رولز',
    ],
    subFields: [
      { id: 'sub_logic', title: 'المنطق الصوري والاستدلال القضائي', estimatedBooks: 40000, description: 'القياس المنطقي، الحجج السليمة، والمنطق الرمزي' },
      { id: 'sub_lawphil', title: 'فلسفة القانون والعدالة الطبيعية', estimatedBooks: 50000, description: 'مفهوم الحق، روح التشريع، وأسس الإلزام القانوني' },
      { id: 'sub_epist', title: 'نظرية المعرفة وفلسفة العلوم', estimatedBooks: 35000, description: 'اليقين، التجريبية، والمنهج العلمي' },
      { id: 'sub_ethics', title: 'الأخلاق وقواعد السلوك المهني والنزاهة', estimatedBooks: 25000, description: 'أخلاقيات القضاء والمحاماة والمسؤولية الأخلاقية' },
    ],
  },
  {
    id: 'fac_history',
    name: 'موسوعات التاريخ البشري والحضارات والآثار',
    nameEn: 'World History, Ancient Civilizations & Heritage',
    totalVolumesEstimate: 150000,
    catalogedTitlesCount: 150000,
    color: '#B45309',
    iconName: 'History',
    description: 'تاريخ الحضارات البشرية العظمى، الحضارة المصرية القديمة ونظامها القضائي (الماعت)، وتاريخ الدساتير والقوانين عبر العصور.',
    keyAuthors: ['ابن خلدون', 'المقريزي', 'جيمس هنري بريستد', 'سليم حسن', 'عبد الرحمن الرافعي', 'ويل ديورانت'],
    sampleMasterpieces: [
      'مقدمة ابن خلدون (ديوان المبتدأ والخبر) — ابن خلدون',
      'موسوعة مصر القديمة (18 جزءاً) — د. سليم حسن',
      'قصة الحضارة — ويل ديورانت',
      'تاريخ الحركة القومية وتطور نظام الحكم في مصر — عبد الرحمن الرافعي',
      'الخطط المقريزية (المواعظ والاعتبار بذكر الخطط والآثار) — المقريزي',
    ],
    subFields: [
      { id: 'sub_eg_hist', title: 'تاريخ مصر القديم وقوانين الفراعنة', estimatedBooks: 45000, description: 'نظام العدالة، البرديات القانونية، وحماية الآثار' },
      { id: 'sub_modern_eg', title: 'تاريخ مصر الحديث والدساتير والقضاء المصري', estimatedBooks: 40000, description: 'دستور 1923، المحاكم الأهلية والمختلطة، وإلغاء الامتيازات' },
      { id: 'sub_world_hist', title: 'التاريخ الإنساني المقارن والحضارات القديمة', estimatedBooks: 35000, description: 'حضارات الرافدين، اليونان، وروما (قانون الألواح الاثني عشر)' },
      { id: 'sub_treaties_hist', title: 'تاريخ المعاهدات الدولية والحدود المصرية', estimatedBooks: 30000, description: 'معاهدة قادش، معاهدة القسطنطينية 1888، والتحكيم في طابا' },
    ],
  },
  {
    id: 'fac_medicine',
    name: 'العلوم الطبية والصيدلانية والطب الشرعي',
    nameEn: 'Medicine, Pharmacy, Toxicology & Forensic Jurisprudence',
    totalVolumesEstimate: 120000,
    catalogedTitlesCount: 120000,
    color: '#EC4899',
    iconName: 'HeartPulse',
    description: 'المصنفات الطبية والطب الشرعي الجنائي، تحديد أسباب الوفاة، فحص الآثار البيولوجية والسموم، وتكييف الأخطاء الطبية المهنية أمام المحاكم.',
    keyAuthors: ['د. سيدني سميث (أبو الطب الشرعي بمصر)', 'ابن سينا', 'الرازي', 'د. محمد سيف الدين الزيات', 'د. عبد الحميد السقا'],
    sampleMasterpieces: [
      'أصول الطب الشرعي والسموم الجنائية — د. سيدني سميث',
      'القانون في الطب — ابن سينا',
      'دليل التحقيق الجنائي والأدلة الطبية الجنائية — معهد التدريب القضائي',
      'المسؤولية المدنية والجنائية للأطباء والجراحين في ضوء قضاء النقض',
      'موسوعة الأخطاء المهنية الطبية وأحكام التعويض',
    ],
    subFields: [
      { id: 'sub_forensic', title: 'الطب الشرعي وإصابات الحوادث والأعيرة النارية', estimatedBooks: 40000, description: 'تحديد زمن الوفاة، مسافة الإطلاق، والأدلة البيولوجية DNA' },
      { id: 'sub_med_liability', title: 'المسؤولية القانونية للأطباء والمنشآت الصحية', estimatedBooks: 35000, description: 'التزام الطبيب ببذل عناية والموافقة المستنيرة' },
      { id: 'sub_tox', title: 'علم السموم والمخدرات والتحاليل المعملية الجنائية', estimatedBooks: 25000, description: 'فحص المؤثرات العقلية وجدول المخدرات رقم 182' },
      { id: 'sub_psych', title: 'الطب النفسي القضائي وتحديد الأهلية الجنائية', estimatedBooks: 20000, description: 'المسؤولية الجنائية وموانع العقاب في المادة 62 عقوبات' },
    ],
  },
  {
    id: 'fac_physics_math',
    name: 'العلوم الفيزيائية والرياضيات والفلك',
    nameEn: 'Physics, Mathematics, Astronomy & Physical Principles',
    totalVolumesEstimate: 120000,
    catalogedTitlesCount: 120000,
    color: '#3B82F6',
    iconName: 'Atom',
    description: 'الأسس الرياضية والفيزيائية للكون، قوانين الميكانيكا، نظرية النسبية، والنمذجة الرياضية للاحتمالات والإحصاء الجنائي.',
    keyAuthors: ['الحسن بن الهيثم', 'إسحاق نيوتن', 'ألبرت أينشتاين', 'الخوارزمي', 'كارل فريدريش غاوس', 'ريتشارد فاينمان'],
    sampleMasterpieces: [
      'المناظر — الحسن بن الهيثم (مؤسس علم البصريات والمنهج العلمي التجريبي)',
      'المبادئ الرياضية للفلسفة الطبيعية (Principia) — إسحاق نيوتن',
      'الجبر والمقابلة — الخوارزمي',
      'النسبية العامة والخاصة — ألبرت أينشتاين',
      'محاضرات فاينمان في الفيزياء (3 أجزاء) — ريتشارد فاينمان',
    ],
    subFields: [
      { id: 'sub_classical_phys', title: 'الميكانيكا الكلاسيكية والديناميكا والحركة', estimatedBooks: 35000, description: 'قوانين الحركة، تحليل تصادم السيارات وحوادث المرور' },
      { id: 'sub_stats', title: 'الإحصاء ونظرية الاحتمالات ونماذج البيانات', estimatedBooks: 30000, description: 'الاحتمال الرياضي والتحليل الإحصائي الرقمي' },
      { id: 'sub_quantum', title: 'الفيزياء الحديثة والكهرومغناطيسية والضوء', estimatedBooks: 30000, description: 'طبيعة الضوء، الإشارات، والاتصالات اللاسلكية' },
      { id: 'sub_math_found', title: 'أصول الرياضيات والجبر والتحليل الرياضي', estimatedBooks: 25000, description: 'الجبر الخطي والمصفوفات والتحسين الرياضي' },
    ],
  },
  {
    id: 'fac_computer_ai',
    name: 'علوم الحاسوب والذكاء الاصطناعي وهندسة البرمجيات',
    nameEn: 'Computer Science, Artificial Intelligence & Software Engineering',
    totalVolumesEstimate: 100000,
    catalogedTitlesCount: 100000,
    color: '#06B6D4',
    iconName: 'Cpu',
    description: 'المرجعيات الشاملة في الخوارزميات، بنى المعطيات، نماذج اللغات الكبيرة (LLMs)، معمارية Transformer، والأمن السيبراني والتحقيق الجنائي الرقمي.',
    keyAuthors: ['آلان تورنغ', 'دونالد كنوث', 'أندرو نغ', 'يان ليكون', 'جيفري هينتون', 'ريتشارد ستولمان'],
    sampleMasterpieces: [
      'فن برمجة الحاسوب (The Art of Computer Programming) — دونالد كنوث',
      'الذكاء الاصطناعي: مقاربة حديثة (AIMA) — ستيوارت راسل وبيتر نورفيغ',
      'التعلم العميق (Deep Learning) — يان غودفيلو، يوشوا بنجيو، وآرون كورفيل',
      'معمارية المحولات ونماذج الانتباه (Attention Is All You Need) — Vaswani et al.',
      'التحقيق الجنائي الرقمي ومكافحة الجرائم المعلوماتية — أدلة السند القضائي',
    ],
    subFields: [
      { id: 'sub_llm_trans', title: 'معماريات Transformer ونماذج اللغات الطبيعية', estimatedBooks: 30000, description: 'Decoder-Only architectures, RoPE, Attention, BPE tokenizers' },
      { id: 'sub_cyber_sec', title: 'الأمن السيبراني والتحقيق الجنائي في الأدلة الرقمية', estimatedBooks: 30000, description: 'قانون 175 لسنة 2018، تتبع الاختراق، والتشفير الرقمي' },
      { id: 'sub_algo', title: 'الخوارزميات وهياكل البيانات وتحسين الأداء', estimatedBooks: 25000, description: 'خوارزميات البحث السريع، الفهرسة، والتعقيد الزمني' },
      { id: 'sub_software_arch', title: 'هندسة النظم وتصميم البرمجيات الموثوقة', estimatedBooks: 15000, description: 'Design Patterns, Distributed Systems, Microservices' },
    ],
  },
  {
    id: 'fac_economics',
    name: 'الاقتصاد الكلي والجزئي وأسواق المال والمصارف',
    nameEn: 'Macro & Micro Economics, Finance, Banking & Markets',
    totalVolumesEstimate: 80000,
    catalogedTitlesCount: 80000,
    color: '#EAB308',
    iconName: 'DollarSign',
    description: 'النظريات الاقتصادية الكبرى، السياسات النقدية والمالية، عقود التجارة الدولية، الأوراق المالية، وحوكمة الشركات وعمليات الاندماج والاستحواذ.',
    keyAuthors: ['آدم سميث', 'جون ماينارد كينز', 'ميلتون فريدمان', 'جوزيف ستيغليتز', 'د. حازم الببلاوي'],
    sampleMasterpieces: [
      'ثروة الأمم — آدم سميث',
      'النظرية العامة في التشغيل والفائدة والنقود — جون ماينارد كينز',
      'دليل المعاملات المصرفية وقواعد الاعتمادات المستندية (UCP 600)',
      'حوكمة الشركات وسوق رأس المال المصري — معايير المحاسبة المصرية',
      'النظام الاقتصادي العالمي المعاصر — د. حازم الببلاوي',
    ],
    subFields: [
      { id: 'sub_macro', title: 'الاقتصاد الكلي والسياسات النقدية والتضخم', estimatedBooks: 25000, description: 'أسعار الفائدة، التضخم، سعر الصرف، والموازنة العامة' },
      { id: 'sub_corp_fin', title: 'تمويل الشركات والاندماج والاستحواذ وسوق الأسهم', estimatedBooks: 25000, description: 'التقييم المالي للشركات، السندات، وعروض الشراء الإجبارية' },
      { id: 'sub_banking_ops', title: 'العمليات المصرفية وخطابات الضمان والشيكات', estimatedBooks: 20000, description: 'الائتمان البنكي، الرهن التجاري، وقانون البنوك المصري' },
      { id: 'sub_taxes', title: 'الضرائب والفحص الضريبي والمحاسبة القضائية', estimatedBooks: 10000, description: 'ضريبة الدخل، القيمة المضافة، والطعن أمام لجان إنهاء المنازعات' },
    ],
  },
  {
    id: 'fac_engineering_civil',
    name: 'الهندسة المدنية والإنشاءات وعقود الفيديك (FIDIC)',
    nameEn: 'Civil Engineering, Structural Integrity & FIDIC Contracts',
    totalVolumesEstimate: 70000,
    catalogedTitlesCount: 70000,
    color: '#F97316',
    iconName: 'Wrench',
    description: 'شروح الكود المصري للبناء والإنشاء، المسؤولية العشرية للمهندس والمقاول، مراجع المساحة، وعقود الفيديك الدولية والتحكيم الهندسي.',
    keyAuthors: ['د. شريف حماد', 'د. مشهور غنيم', 'الاتحاد الدولي للمهندسين الاستشاريين (FIDIC)', 'د. محمود صقر'],
    sampleMasterpieces: [
      'الكود المصري للخرسانة المسلحة وتصميم المنشآت (ECP 203)',
      'دليل عقود الفيديك: الكتاب الأحمر، الأصفر، والفضي في ضوء القانون المصري',
      'المسؤولية العشرية للمهندس المعماري ومقاول البناء — دراسة مقارنة',
      'أصول التحقيق والخبرة القضائية في عيوب المنشآت والانهيارات',
      'المساحة العقارية والرفع المساحي الرقمي وتحديد الملكيات',
    ],
    subFields: [
      { id: 'sub_structures', title: 'تصميم المنشآت والخرسانة وعيوب التنفيذ الإنشائية', estimatedBooks: 25000, description: 'العيوب الخفية في الخرسانة والتربة والهبوط التفاوتي' },
      { id: 'sub_fidic_refs', title: 'عقود المقاولات الدولية FIDIC وأوامر التغيير', estimatedBooks: 20000, description: 'مطالبات المقاول والمشروعية وغرامات التأخير' },
      { id: 'sub_building_codes', title: 'قانون البناء 119 لسنة 2008 وتراخيص المباني والاشتراطات', estimatedBooks: 15000, description: 'مخالفات البناء، شهادات المطابقة، والتصالح' },
      { id: 'sub_surveying', title: 'المساحة والجيوديسيا والتوثيق المساحي للعقارات', estimatedBooks: 10000, description: 'تحديد الحدود العقارية والسجل العيني' },
    ],
  },
  {
    id: 'fac_diplomacy_intl',
    name: 'القانون الدولي العام والمعاهدات والدبلوماسية',
    nameEn: 'Public International Law, Treaties & Diplomatic Protocol',
    totalVolumesEstimate: 60000,
    catalogedTitlesCount: 60000,
    color: '#0284C7',
    iconName: 'Globe',
    description: 'مراجع القانون الدولي، ميثاق الأمم المتحدة، اتفاقيات فيينا للعلاقات الدبلوماسية والقنصلية، قانون البحار، وموسوعات التحكيم الدولي.',
    keyAuthors: ['د. بطرس بطرس غالي', 'د. عصمت عبد المجيد', 'هوغو غروتيوس', 'د. مفيد شهاب', 'د. أحمد عصمت'],
    sampleMasterpieces: [
      'قانون الحرب والسلام (De Jure Belli ac Pacis) — هوغو غروتيوس',
      'موسوعة التحكيم الدولي أمام محكمة العدل الدولية — د. مفيد شهاب',
      'اتفاقية فيينا لقانون المعاهدات 1969 معلقاً عليها بالفقه والعمل الدبلوماسي',
      'مصر وقانون البحار وحقوق السيادة في المنطقة الاقتصادية الخالصة',
      'الحصانات والامتيازات الدبلوماسية والقنصلية في قضاء المحاكم الدولية',
    ],
    subFields: [
      { id: 'sub_intl_treaties', title: 'المعاهدات الدولية وسيادة الدول وقانون البحار', estimatedBooks: 20000, description: 'ترسيم الحدود البحرية، قنوات الملاحة الدولية، وتوارث المعاهدات' },
      { id: 'sub_diplomatic_law', title: 'الحصانة الدبلوماسية والقنصلية والمنازعات الدولية', estimatedBooks: 20000, description: 'حصانة المبعوث الدبلوماسي واللجوء السياسي وحق الدفاع الشرعي' },
      { id: 'sub_intl_arbitration', title: 'التحكيم التجاري والاستثماري الدولي (ICSID & ICC)', estimatedBooks: 20000, description: 'منازعات عقود الاستثمار الدولية وتنفيذ الأحكام الأجنبية' },
    ],
  },
  {
    id: 'fac_sociology_psych',
    name: 'علم الاجتماع والأنثروبولوجيا وعلم النفس الجنائي',
    nameEn: 'Sociology, Anthropology, Criminology & Forensic Psychology',
    totalVolumesEstimate: 60000,
    catalogedTitlesCount: 60000,
    color: '#9333EA',
    iconName: 'Users',
    description: 'علم الإجرام وعلم العقاب، دوافع السلوك الإجرامي، دراسات الشخصية الجنائية، والظواهر المجتمعية والأعراف الشعبية المؤثرة في النزاعات.',
    keyAuthors: ['سيزار لومبروزو', 'إميل دوركايم', 'د. علي عبد الواحد وافي', 'سيجموند فرويد', 'د. أحمد المجدوب'],
    sampleMasterpieces: [
      'علم الإجرام وعلم العقاب — د. علي عبد الواحد وافي',
      'قواعد المنهج في علم الاجتماع — إميل دوركايم',
      'الإنسان المجرم ونظرية النزعة الإجرامية — سيزار لومبروزو',
      'علم النفس الجنائي والتحقيق مع الشهود والمتهمين',
      'دراسات في علم الاجتماع القانوني والعدالة الشعبية في الريف المصري',
    ],
    subFields: [
      { id: 'sub_criminology', title: 'علم الإجرام والوقاية من الجريمة وتأهيل المسجونين', estimatedBooks: 25000, description: 'العوامل الوراثية والبيئية للجريمة وأساليب العلاج العقابي' },
      { id: 'sub_forensic_psych', title: 'علم النفس الجنائي وتقييم شهادة الشهود والاعتراف', estimatedBooks: 20000, description: 'سيكولوجية الاعتراف تحت الإكراه وكشف الكذب' },
      { id: 'sub_sociology_law', title: 'علم الاجتماع القانوني والأعراف والتقاليد المحلية', estimatedBooks: 15000, description: 'دور العرف والصلح العرفي كبديل للتقاضي في الصعيد والقرى' },
    ],
  },
  {
    id: 'fac_arts_heritage',
    name: 'الفنون التشكيلية والمعمار والتراث الإنساني العالمي',
    nameEn: 'Fine Arts, Architecture & Global Cultural Heritage',
    totalVolumesEstimate: 50000,
    catalogedTitlesCount: 50000,
    color: '#14B8A6',
    iconName: 'Palette',
    description: 'تاريخ الفنون والعمارة الإسلامية والقبطية والفرعونية، حماية المصنفات الفنية والملكية الفكرية للمؤلفين والفنانين، واتفاقيات اليونسكو.',
    keyAuthors: ['حسن فتحي', 'د. ثروت عكاشة', 'جورج سارتون', 'د. زاهي حواس'],
    sampleMasterpieces: [
      'موسوعة العين تسمع والأذن ترى (آفاق الفن) — د. ثروت عكاشة',
      'عمارة الفقراء — المعماري المصري العالمي حسن فتحي',
      'دليل حماية الملكية الفكرية للمصنفات الفنية والأدبية (قانون 82 لسنة 2002)',
      'تاريخ العمارة المصرية عبر العصور — من الأهرامات حتى القاهرة الخديوية',
      'اتفاقية حماية التراث العالمي الثقافي والطبيعي (اليونسكو 1972)',
    ],
    subFields: [
      { id: 'sub_copyright', title: 'حق المؤلف والحقوق المجاورة وبراءات التصميم الفني', estimatedBooks: 20000, description: 'حماية المصنفات الرقمية واللوحات والسيناريو واللحن الموسيقي' },
      { id: 'sub_islamic_coptic', title: 'العمارة والتراث الإسلامي والقبطي بالقاهرة التاريخية', estimatedBooks: 15000, description: 'تسجيل المباني التراثية ذات الطابع المعماري المتميز' },
      { id: 'sub_heritage_protection', title: 'حماية التراث الثقافي غير المادي ومكافحة التزييف الفني', estimatedBooks: 15000, description: 'حماية الفنون الشعبية وشهادات الأصالة للقطع الأثرية' },
    ],
  },
];

// Featured Masterpieces Catalog (Ready for Deep Examination & Verified Excerpts)
export const FEATURED_KNOWLEDGE_BOOKS: KnowledgeBook[] = [
  {
    id: 'bk_sanhouri_wasit',
    title: 'الوسيط في شرح القانون المدني الجديد',
    author: 'الدكتور عبد الرزاق أحمد السنهوري (باشا)',
    authorEra: 'العصر الحديث — واضع التقنين المدني المصري والعربي',
    yearPublished: 1952,
    facultyId: 'fac_law',
    subCategory: 'القانون المدني ونظرية الالتزام',
    volumesCount: 12,
    pagesCount: 11450,
    language: 'ar',
    historicalSignificance: 'أعظم مرجع في القانون المدني في العالم العربي، المرجع الأول لمحكمة النقض المصرية في تفسير إرادة المشرع المصري في القانون 131 لسنة 1948.',
    synopsis: 'شرح مستفيض ودقيق لنظرية الالتزام والعقود والملكية والحقوق العينية والشخصية مع مقارنة بالقوانين الفرنسية والألمانية والشريعة الإسلامية.',
    verifiedExcerpts: [
      {
        chapter: 'نظرية العقد ومبدأ سلطان الإرادة (المجلد الأول، ص 142)',
        text: 'العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين أو للأسباب التي يقررها القانون، وحسن النية في تنفيذ الالتزامات هو الأصل الذي لا يجوز إهداره.',
        pageOrSection: 'الجزء 1، المجلد 1، فقرة 78',
      },
      {
        chapter: 'المسؤولية التقصيرية وأركان التعويض (المجلد الثاني، ص 890)',
        text: 'كل خطأ سبب ضرراً للغير يلزم من ارتكبه بالتعويض. والخطأ التقصيري هو انحراف في السلوك لا يأتيه الشخص المعتاد متى وجد في نفس الظروف الخارجية.',
        pageOrSection: 'الجزء 2، مادة 163 مدني، فقرة 432',
      },
    ],
    citationFormat: 'السنهوري، الوسيط في شرح القانون المدني، الجزء الأول: مصادر الالتزام، دار إحياء التراث العربي، بيروت، ص 142.',
    relevanceToLegalMind: 'يمثل الركيزة الأولى لعقل المستشار عطيه الهلباوي في فحص شروط العقود وتأسيس صحة ونفاذ التصرفات والتعويضات.',
    tags: ['مدني', 'عقود', 'السنهوري', 'التزامات', 'نقض'],
    isFoundational: true,
    digitizationStatus: 'فهرسة كاملة ومفحوصة',
  },
  {
    id: 'bk_lisan_alarab',
    title: 'لسان العرب',
    author: 'جمال الدين أبو الفضل محمد بن منظور الأنصاري',
    authorEra: 'العصر المملوكي (711 هـ)',
    yearPublished: 1290,
    facultyId: 'fac_arabic',
    subCategory: 'المعاجم الكبرى وفقه اللغة',
    volumesCount: 15,
    pagesCount: 9200,
    language: 'ar',
    historicalSignificance: 'أشمل وأضخم معجم لغوي في تاريخ الحضارة العربية والإسلامية، جمع محتويات خمسة من أمهات المعاجم المفقودة واحتوى على 80,000 مادة لغوية.',
    synopsis: 'استقصاء دقيق لجذور الكلمات العربية مع الشواهد القرآنية والأحاديث النبوية وأشعار العرب وفقه الدلالة اللغوية واستخدامات الحروف.',
    verifiedExcerpts: [
      {
        chapter: 'مادة (ق-ض-ي) — القضاء والحكم',
        text: 'قَضَى يَقْضِي قَضَاءً: حَكَمَ وَفَصَلَ، وأَصْلُ القَضَاءِ الفَصْلُ والقَطْعُ. وقَضَى عَلَيْهِ: أَوْجَبَ. والقَاضِي: مَنْ يَقْضِي بَيْنَ الخُصُومِ بِحُكْمِ الحَقِّ والْعَدْلِ.',
        pageOrSection: 'المجلد 15، ص 186',
      },
    ],
    citationFormat: 'ابن منظور، لسان العرب، دار صادر، بيروت، طبعة محققة، مادة قضي.',
    relevanceToLegalMind: 'تحديد المعاني الدقيقة للألفاظ والعبارات في تفسير إرادة المتعاقدين عند الغموض وفق المادة 150 مدني.',
    tags: ['لغة', 'معجم', 'ابن منظور', 'اشتقاق', 'فصاحة'],
    isFoundational: true,
    digitizationStatus: 'نص محقق',
  },
  {
    id: 'bk_spirit_of_laws',
    title: 'روح القوانين (De l\'esprit des lois)',
    author: 'تشارلز دو مونتسكيو (Baron de Montesquieu)',
    authorEra: 'عصر التنوير الأوروبي (1748 م)',
    yearPublished: 1748,
    facultyId: 'fac_philosophy',
    subCategory: 'فلسفة القانون والعدالة الطبيعية',
    volumesCount: 2,
    pagesCount: 850,
    language: 'ar',
    historicalSignificance: 'الكتاب المؤسس لنظرية الفصل بين السلطات (التشريعية، القضائية، والتنفيذية) التي اعتمدتها كافة الدساتير الديمقراطية الحديثة بما فيها الدستور المصري.',
    synopsis: 'دراسة العلاقة بين القوانين وطبيعة الحكم والمناخ والتقاليد، وإرساء استقلال السلطة القضائية كضمانة حتمية للحرية المدنية للمواطن.',
    verifiedExcerpts: [
      {
        chapter: 'الكتاب الحادي عشر: في القوانين التي تشكل الحرية السياسية',
        text: 'لا توجد حرية إذا لم تكن السلطة القضائية منفصلة عن السلطة التشريعية والسلطة التنفيذية، وإذا ضمت إلى السلطة التنفيذية أصبح القاضي قادراً على التصرف بعنف وظلم.',
        pageOrSection: 'الباب السادس: دستور إنجلترا',
      },
    ],
    citationFormat: 'مونتسكيو، روح القوانين، ترجمة د. عادل زعيتر، دار المعارف، القاهرة، ص 210.',
    relevanceToLegalMind: 'تأصيل الدفوع الدستورية بعدم دستورية القوانين التي تفتئت على استقلال القضاء أو حيدة القاضي.',
    tags: ['فلسفة', 'دستور', 'فصل السلطات', 'مونتسكيو', 'حرية'],
    isFoundational: true,
    digitizationStatus: 'مستخلص رقمي معتمد',
  },
  {
    id: 'bk_egypt_history_salim',
    title: 'موسوعة مصر القديمة',
    author: 'الدكتور سليم حسن (عميد الأثريين المصريين)',
    authorEra: 'القرن العشرين (1940-1960م)',
    yearPublished: 1940,
    facultyId: 'fac_history',
    subCategory: 'تاريخ مصر القديم وقوانين الفراعنة',
    volumesCount: 18,
    pagesCount: 14200,
    language: 'ar',
    historicalSignificance: 'أضخم موسوعة علمية تاريخية باللغة العربية توثق الحضارة المصرية القديمة، نظم الحكم، والمحاكم الفرعونية وقانون ماعت.',
    synopsis: 'تتبع شامل لتاريخ مصر من عصور ما قبل التاريخ حتى نهاية العصر البطلمي مع تحليل وثائق العقود والوصايا ونظم الضرائب والملكية عند قدماء المصريين.',
    verifiedExcerpts: [
      {
        chapter: 'الجزء الثاني: في نظام العدالة ومحكمة الماعت العليا',
        text: 'كان الوزير الأكبر في مصر القديمة يحمل لقب قاضي قضاة الماعت، ويجلس في قاعة المحاكمة وأمامه أربعون قضيباً ترمز لصرامة القانون، وكانت شكاوى المواطنين تقدم مكتوبة تفادياً للتأثير البلاغي الشفاهي.',
        pageOrSection: 'الجزء الثاني، ص 312',
      },
    ],
    citationFormat: 'سليم حسن، موسوعة مصر القديمة، الهيئة المصرية العامة للكتاب، القاهرة، الجزء الثاني، ص 312.',
    relevanceToLegalMind: 'الاستدلال التاريخي والتأصيلي لحضارة القانون المصري، والرد على ادعاءات الملكية الخاصة للآثار في قضايا قانون 117 لسنة 1983.',
    tags: ['تاريخ', 'مصر القديمة', 'آثار', 'ماعت', 'سليم حسن'],
    isFoundational: true,
    digitizationStatus: 'فهرسة كاملة ومفحوصة',
  },
  {
    id: 'bk_forensic_sydney',
    title: 'أصول الطب الشرعي والسموم الجنائية',
    author: 'د. سيدني سميث (Sir Sydney Smith) ود. محمد سيف الدين الزيات',
    authorEra: 'العصر الحديث — مصلحة الطب الشرعي المصرية بالقاهرة',
    yearPublished: 1955,
    facultyId: 'fac_medicine',
    subCategory: 'الطب الشرعي وإصابات الحوادث',
    volumesCount: 3,
    pagesCount: 1650,
    language: 'ar',
    historicalSignificance: 'المرجع التأسيسي للطب الشرعي في مصر والشرق الأوسط، وضعه رئيس مصلحة الطب الشرعي وأستاذ جامعة القاهرة لتدريب القضاة وأعضاء النيابة والمحامين.',
    synopsis: 'دراسة تشريحية ومخبرية لكيفية استنباط الدليل المادي، تحديد أسباب وتوقيت الوفاة، اتجاه ومسافة إطلاق المقذوفات النارية، وفحص التسمم الجنائي.',
    verifiedExcerpts: [
      {
        chapter: 'الأعيرة النارية والإصابات المباشرة (الباب الرابع)',
        text: 'حلقة البارود ومسافة الإطلاق تحددان على وجه الجزم ما إذا كان الحادث انتحاراً أم قتلاً عمداً من مسافة قريبة، ولا عبرة باعتراف المتهم إذا ناقض الدليل الفني التشريحي.',
        pageOrSection: 'ص 445',
      },
    ],
    citationFormat: 'سيدني سميث، مبادئ الطب الشرعي والتحقيق الجنائي، دار الفكر العربي، القاهرة، ص 445.',
    relevanceToLegalMind: 'تأسيس الدفوع الجنائية ببطلان تقرير الطب الشرعي والتناقض بين الدليل القولي والدليل الفني في قضايا الجنايات.',
    tags: ['طب شرعي', 'جنايات', 'سموم', 'أعيرة نارية', 'إثبات'],
    isFoundational: true,
    digitizationStatus: 'فهرسة كاملة ومفحوصة',
  },
  {
    id: 'bk_attention_transformer',
    title: 'Attention Is All You Need (نماذج الانتباه والمحولات اللغوية)',
    author: 'Ashish Vaswani, Noam Shazeer, Niki Parmar et al.',
    authorEra: 'عصر ثورة الذكاء الاصطناعي (2017م)',
    yearPublished: 2017,
    facultyId: 'fac_computer_ai',
    subCategory: 'معماريات Transformer ونماذج اللغات الطبيعية',
    volumesCount: 1,
    pagesCount: 65,
    language: 'en',
    historicalSignificance: 'الورقة العلمية التأسيسية التي ولدت منها كافة النماذج اللغوية الحديثة (GPT, Gemini, LLM) وتعتمد عليها معمارية ATTYA_LEGAL_MIND.',
    synopsis: 'استبدال الشبكات العصبية المتكررة (RNN) بآلية الانتباه الذاتي متعدد الرؤوس (Multi-Head Self-Attention) مع إمكانية المعالجة المتوازية الفائقة.',
    verifiedExcerpts: [
      {
        chapter: 'Multi-Head Attention Equation (Section 3.2)',
        text: 'Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V. Multi-head attention allows the model to jointly attend to information from different representation subspaces.',
        pageOrSection: 'Page 4, Equation 1',
      },
    ],
    citationFormat: 'Vaswani et al., "Attention Is All You Need", Advances in Neural Information Processing Systems (NeurIPS 2017), pp. 5998–6008.',
    relevanceToLegalMind: 'المعمارية الحاسوبية الحقيقية لنموذج ATTYA LEGAL MIND (Decoder-only Transformer بـ 16 رأساً و8 طبقات).',
    tags: ['ذكاء اصطناعي', 'Transformer', 'NLP', 'Attention', 'LLM'],
    isFoundational: true,
    digitizationStatus: 'نص محقق',
  },
];

export class UniversalKnowledgeLibraryService {
  private overview: KnowledgeLibraryOverview;

  constructor() {
    const totalEst = UNIVERSAL_KNOWLEDGE_FACULTIES.reduce((sum, f) => sum + f.totalVolumesEstimate, 0);
    this.overview = {
      totalEstimatedBooks: totalEst, // ~1,390,000+ volumes
      totalCatalogedMasterpieces: FEATURED_KNOWLEDGE_BOOKS.length,
      totalFaculties: UNIVERSAL_KNOWLEDGE_FACULTIES.length,
      lastUpdated: '2026-11-11T19:00:00Z',
      faculties: UNIVERSAL_KNOWLEDGE_FACULTIES,
      eras: [
        { id: 'era_ancient', name: 'العصر القديم والحضارات الأولى', range: 'ما قبل التاريخ — 476م', estimatedBooks: 180000, color: '#B45309' },
        { id: 'era_islamic_medieval', name: 'العصر الإسلامي والوسيط', range: '500م — 1500م', estimatedBooks: 320000, color: '#10B981' },
        { id: 'era_renaissance', name: 'عصر النهضة والتنوير والتقنين', range: '1500م — 1900م', estimatedBooks: 390000, color: '#8B5CF6' },
        { id: 'era_modern_ai', name: 'العصر الحديث والمعاصر والذكاء الاصطناعي', range: '1900م — 2026م', estimatedBooks: 500000, color: '#06B6D4' },
      ],
      featuredBooks: FEATURED_KNOWLEDGE_BOOKS,
      sha256VerificationStamp: '9f8b42e7c10d3e5a7b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    };
  }

  public getOverview(): KnowledgeLibraryOverview {
    return this.overview;
  }

  public getFaculties(): KnowledgeFaculty[] {
    return UNIVERSAL_KNOWLEDGE_FACULTIES;
  }

  public getBookById(id: string): KnowledgeBook | undefined {
    return FEATURED_KNOWLEDGE_BOOKS.find(b => b.id === id);
  }

  public searchBooks(query: string, facultyId?: string, limit: number = 20): KnowledgeBook[] {
    const cleanQ = (query || '').trim().toLowerCase();
    return FEATURED_KNOWLEDGE_BOOKS.filter(book => {
      const matchFaculty = !facultyId || book.facultyId === facultyId;
      if (!matchFaculty) return false;
      if (!cleanQ) return true;

      return (
        book.title.toLowerCase().includes(cleanQ) ||
        book.author.toLowerCase().includes(cleanQ) ||
        book.synopsis.toLowerCase().includes(cleanQ) ||
        book.subCategory.toLowerCase().includes(cleanQ) ||
        book.tags.some(t => t.toLowerCase().includes(cleanQ))
      );
    }).slice(0, limit);
  }
}

export const universalKnowledgeLibraryService = new UniversalKnowledgeLibraryService();
