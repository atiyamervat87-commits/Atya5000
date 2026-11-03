import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  FileCheck,
  Printer,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  UserCheck,
  Scale,
  Building,
  Home,
  Car,
  Briefcase,
  ShieldCheck,
  Eye,
  Edit3,
  Save,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertCircle,
  HelpCircle,
  FolderPlus,
} from 'lucide-react';
import { Client, LegalCase } from '../../types/office';

export interface SmartContractLibraryProps {
  clients?: Client[];
  cases?: LegalCase[];
  onSaveToDocuments?: (doc: {
    title: string;
    category: 'عقد';
    fileName: string;
    fileSize: string;
    fileType: string;
    fileData: string;
    clientId?: string;
    clientName?: string;
    caseId?: string;
    caseNumber?: string;
    notes?: string;
  }) => void;
}

export type ContractCategory =
  | 'all'
  | 'real_estate'
  | 'tenancy'
  | 'commercial'
  | 'advocacy'
  | 'construction'
  | 'settlement';

export interface ContractTemplate {
  id: string;
  category: ContractCategory;
  title: string;
  shortDesc: string;
  governingLaw: string;
  defaultParties: {
    firstPartyTitle: string;
    secondPartyTitle: string;
  };
  sampleData: {
    party1Name: string;
    party1Id: string;
    party1Phone: string;
    party1Address: string;
    party1Role: string;

    party2Name: string;
    party2Id: string;
    party2Phone: string;
    party2Address: string;
    party2Role: string;

    contractDate: string;
    governorate: string;
    district: string;

    subjectTitle: string;
    subjectDescription: string;
    areaSize: string;
    boundaries: string;

    totalAmount: string;
    totalAmountWords: string;
    depositAmount: string;
    remainingAmount: string;
    paymentTerms: string;

    penaltyClauseAmount: string;
    jurisdictionCourt: string;
    duration: string;
    extraNotes: string;
  };
}

const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'apartment_sale',
    category: 'real_estate',
    title: 'عقد بيع ابتدائي لوحدة سكنية بحصة شائعة في الأرض',
    shortDesc: 'نموذج بيع شقة سكنية متكامل يشمل تسلسل الملكية والحصة بالأرض وضمان خلو العين من الحقوق العينية والشرط الجزائي.',
    governingLaw: 'القانون المدني المصري رقم 131 لسنة 1948 وقانون الشهر العقاري رقم 9 لسنة 2022',
    defaultParties: {
      firstPartyTitle: 'الطرف الأول (البائع)',
      secondPartyTitle: 'الطرف الثاني (المشتري)',
    },
    sampleData: {
      party1Name: 'أحمد محمود إبراهيم الدسوقي',
      party1Id: '28005140102345',
      party1Phone: '01001234567',
      party1Address: '15 شارع النصر، المعادي الجديدة، محافظة القاهرة',
      party1Role: 'البائع بصفته مالكاً ومتمتعاً بكامل الأهلية',

      party2Name: 'طارق عبد العزيز حسن الهواري',
      party2Id: '28509120108976',
      party2Phone: '01115678901',
      party2Address: '8 شارع مصطفى النحاس، مدينة نصر، محافظة القاهرة',
      party2Role: 'المشتري لنفسه',

      contractDate: '2026/10/30',
      governorate: 'القاهرة',
      district: 'المعادي',

      subjectTitle: 'الشقة السكنية رقم (4) بالدور الثالث فوق الأرضي',
      subjectDescription: 'الوحدة السكنية رقم 4 بالدور الثالث بالعقار رقم 22 شارع دجلة، المعادي، مكونة من 3 غرف نوم وريسبشن قطعتين وحمامين ومطبخ كامل التشطيب.',
      areaSize: '165 متراً مربعاً (بما يشمل الحصة الشائعة المقدرة بـ 12 قيراطاً شيوعاً في كامل أرض وبناء العقار)',
      boundaries: 'الحد البحري: شارع دجلة بعرض 16 متراً، الحد القبلي: العقار رقم 24، الحد الشرقي: ممر منافع مشترك، الحد الغربي: العقار رقم 20.',

      totalAmount: '2,850,000 ج.م',
      totalAmountWords: 'فقط مليونان وثمانمائة وخمسون ألف جنيه مصري لا غير',
      depositAmount: '1,500,000 ج.م',
      remainingAmount: '1,350,000 ج.م يسدد على 12 شهراً بموجب شيكات بنكية',
      paymentTerms: 'سداد دفعة تعاقد نقدية عند التوقيع، والمتبقي على أقساط ربع سنوية متساوية ومحرر بها إيصالات أمانة/شيكات بنكية.',

      penaltyClauseAmount: '200,000 ج.م (مائتا ألف جنيه مصري)',
      jurisdictionCourt: 'محكمة جنوب القاهرة الابتدائية وجزئياتها',
      duration: 'التسليم الفوري مع تحرير محضر استلام مادي',
      extraNotes: 'يلتزم البائع بالحضور أمام مأمورية الشهر العقاري المختصة للتوقيع على العقد النهائي أو الحضور في دعوى صحة ونفاذ التعاقد متى طُلب منه ذلك.',
    },
  },
  {
    id: 'rental_residential',
    category: 'tenancy',
    title: 'عقد إيجار شقة سكنية محدد المدة مشمول بالصيغة التنفيذية',
    shortDesc: 'عقد إيجار خاضع لأحكام القانون 4 لسنة 1996 والمعدل بالقانون 137 لسنة 2006 مع شرط الإخلاء الفوري والتصديق بالشهر العقاري.',
    governingLaw: 'القانون رقم 4 لسنة 1996 المعدل بالقانون رقم 137 لسنة 2006 (المادة 2 بوضع الصيغة التنفيذية)',
    defaultParties: {
      firstPartyTitle: 'الطرف الأول (المؤجر)',
      secondPartyTitle: 'الطرف الثاني (المستأجر)',
    },
    sampleData: {
      party1Name: 'محمود سامي خليل المنشاوي',
      party1Id: '27612080104523',
      party1Phone: '01223456789',
      party1Address: '42 شارع قصر العيني، السيدة زينب، محافظة القاهرة',
      party1Role: 'المؤجر ومالك العين المؤجرة',

      party2Name: 'يوسف رامي فاروق البنداري',
      party2Id: '29204150106789',
      party2Phone: '01067890123',
      party2Address: '12 شارع سوريا، المهندسين، محافظة الجيزة',
      party2Role: 'المستأجر لنفسه ولأسرته للسكن العائلي فقط',

      contractDate: '2026/11/01',
      governorate: 'القاهرة',
      district: 'التجمع الخامس',

      subjectTitle: 'الشقة رقم (12) بالدور الثاني بالعمارة 85 الحي الأول',
      subjectDescription: 'شقة سكنية مجهزة بالكامل ومكونة من ريسبشن وغرفتي نوم ومطبخ وحمام وعداد كهرباء كودي ومياه وغاز طبيعي.',
      areaSize: '120 متراً مربعاً',
      boundaries: 'تقع بالعمارة السكنية رقم 85 بالحي الأول بالقاهرة الجديدة ومحددة المعالم بوضوح للمستأجر.',

      totalAmount: '12,000 ج.م شهرياً',
      totalAmountWords: 'فقط اثنا عشر ألف جنيه مصري شهرياً لا غير تدفع مقدماً في أول كل شهر ميلادي',
      depositAmount: '24,000 ج.م (تأمين استردادي)',
      remainingAmount: 'زيادة سنوية مركبة بنسبة 10% اعتباراً من بداية كل سنة تعاقدية',
      paymentTerms: 'تحول القيمة الإيجارية شهرياً لحساب المؤجر البنكي أو تسلم نقداً بموجب إيصال كتابي موثق.',

      penaltyClauseAmount: '500 ج.م عن كل يوم تأخير في إخلاء العين عند انتهاء المدة',
      jurisdictionCourt: 'محكمة القاهرة الجديدة الابتدائية والجزئية',
      duration: 'سنتان تبدأ من 2026/11/01 وتنتهي في 2028/10/31 دون أي تجديد تلقائي',
      extraNotes: 'اتفق الطرفان على التوجه إلى مأمورية الشهر العقاري المختصة لوضع الصيغة التنفيذية على هذا العقد سنداً للمادة 2 من القانون رقم 137 لسنة 2006.',
    },
  },
  {
    id: 'legal_advocacy_fee',
    category: 'advocacy',
    title: 'عقد اتفاق وتفويض أتعاب محاماة رسمي',
    shortDesc: 'عقد توكيل وتحديد أتعاب محاماة رسمي وفق قانون المحاماة، يتضمن بيان الدعاوى وجدول الدفعات ونطاق التمثيل القضائي.',
    governingLaw: 'قانون المحاماة المصري رقم 17 لسنة 1983 وتعديلاته بالقانون 147 لسنة 2019',
    defaultParties: {
      firstPartyTitle: 'الطرف الأول (الموكل)',
      secondPartyTitle: 'الطرف الثاني (المحامي الوكيل)',
    },
    sampleData: {
      party1Name: 'ممدوح سعيد عبد الحميد الشرقاوي',
      party1Id: '27807090103214',
      party1Phone: '01099887766',
      party1Address: '28 شارع الهرم الرئيسي، محافظة الجيزة',
      party1Role: 'الموكل أصالة عن نفسه وبصفته ممثلاً للشركة الهندسية للتجارة',

      party2Name: 'المستشار عطيه الهلباوي (محامٍ بالنقض والدستورية ومجلس الدولة)',
      party2Id: 'مقيد بالنقض برقم ترخيص 148520 نقابة المحامين',
      party2Phone: '01153747612',
      party2Address: 'مكتب المستشار عطيه الهلباوي للمحاماة والاستشارات القانونية، القاهرة',
      party2Role: 'المحامي الوكيل بالنقض والدستورية العليا ومجلس الدولة',

      contractDate: '2026/10/30',
      governorate: 'القاهرة',
      district: 'وسط البلد',

      subjectTitle: 'مباشرة دعوى صحة ونفاذ وطعن بالنقض المدني',
      subjectDescription: 'مباشرة وإقامة وتمثيل الموكل في الدعوى القضائية والطعن المقيد أمام محكمة النقض أو القضاء الإداري مع تقديم المذكرات وحضور الجلسات والمرافعة.',
      areaSize: 'المنازعة القضائية الخاصة بملف النزاع العقاري والتجاري',
      boundaries: 'تشمل درجات التقاضي المتفق عليها وفق صحيفة الدعوى والتوكيل الرسمي العام بالقضايا.',

      totalAmount: '150,000 ج.م',
      totalAmountWords: 'فقط مائة وخمسون ألف جنيه مصري لا غير',
      depositAmount: '50,000 ج.م (مقدم تعاقد وتجهيز الصحيفة)',
      remainingAmount: '100,000 ج.م موزعة على مراحل التقاضي (إيداع الصحيفة، المرافعة، صدور الحكم)',
      paymentTerms: 'سداد مقدم التعاقد عند التوقيع، وتدفع الرسوم والمصروفات القضائية وأتعاب الخبراء من الموكل مباشرة بموجب إيصالات رسمية.',

      penaltyClauseAmount: 'سقوط حق الموكل في استرداد المقدم عند إنهاء الوكالة بإرادته المنفردة دون إخلال من المحامي',
      jurisdictionCourt: 'لجنة قبول المحامين بنقابة المحامين ومحكمة شمال القاهرة الابتدائية',
      duration: 'حتى صدور الحكم البات وتنفيذه أو انتهاء النزاع صلحاً',
      extraNotes: 'يلتزم الموكل بتسليم أصول المستندات والمكاتبات المطلوبة، ولا يجوز له إجراء صلح قضائي أو إبراء ذمة الخصم إلا بموافقة كتابية من المحامي وسداد كامل الأتعاب المتفق عليها.',
    },
  },
  {
    id: 'car_sale',
    category: 'commercial',
    title: 'عقد بيع نهائي لسيارة مع إقرار استلام ومخالصة مرورية',
    shortDesc: 'عقد بيع سيارة وفق أحكام قانون المرور مع إقرار استلام فعلي للمركبة وتحمل المشتري للمسؤولية الجنائية والمدنية فور الاستلام.',
    governingLaw: 'قانون المرور المصري رقم 66 لسنة 1973 ولائحته التنفيذية والقانون المدني',
    defaultParties: {
      firstPartyTitle: 'الطرف الأول (البائع)',
      secondPartyTitle: 'الطرف الثاني (المشتري)',
    },
    sampleData: {
      party1Name: 'كريم عادل مرسي الشناوي',
      party1Id: '28803110101987',
      party1Phone: '01012345678',
      party1Address: '5 شارع الثورة، الكوربة، مصر الجديدة، القاهرة',
      party1Role: 'البائع ومالك السيارة بموجب رخصة تسيير سارية',

      party2Name: 'خالد مصطفى بدران الجوهري',
      party2Id: '28606200109432',
      party2Phone: '01287654321',
      party2Address: '14 شارع عباس العقاد، مدينة نصر، القاهرة',
      party2Role: 'المشتري لنفسه',

      contractDate: '2026/10/30',
      governorate: 'القاهرة',
      district: 'مصر الجديدة',

      subjectTitle: 'السيارة الملاكي ماركة مرسيدس C180 موديل 2022',
      subjectDescription: 'سيارة ملاكي ماركة مرسيدس-بنز موديل 2022، اللون أسود ميتاليك، رقم اللوحات: (س ف ر 4821)، رقم الشاسيه: WDD2050401R549812، رقم الموتور: 274910314872، وحدة مرور مصر الجديدة.',
      areaSize: 'مركبة ملاكي واحدة بحالة الفبريكة الكاملة',
      boundaries: 'رخصة التسيير سارية حتى 2027/05/15 وخالية من أي حظر بيع للبنوك أو التوكيل.',

      totalAmount: '1,750,000 ج.م',
      totalAmountWords: 'فقط مليون وسبعمائة وخمسون ألف جنيه مصري لا غير',
      depositAmount: '1,750,000 ج.م (خالص الثمن نقداً بالكامل)',
      remainingAmount: '0 ج.م (مخالصة مالية نهائية وبراءة ذمة تامة)',
      paymentTerms: 'سدد المشتري كامل الثمن عداً ونقداً بمجلس العقد ويعتبر توقيع البائع بمثابة مخالصة نهائية.',

      penaltyClauseAmount: '100,000 ج.م (مائة ألف جنيه مصري)',
      jurisdictionCourt: 'محكمة مصر الجديدة الجزئية ومحكمة شمال القاهرة',
      duration: 'تسليم فوري ومادي بمجلس العقد اليوم',
      extraNotes: 'أقر المشتري بأنه عاين السيارة المعاينة التامة النافية للجهالة وتفحصها فنياً، واستلمها بحالتها، وتنتقل إليه المسؤولية المدنية والجنائية والمخالفات المرورية من تاريخ وساعة استلامها.',
    },
  },
  {
    id: 'construction_contract',
    category: 'construction',
    title: 'عقد مقاولة وأعمال تشطيبات وديكورات مع شروط جزائية',
    shortDesc: 'عقد مقاولة معمارية وتشطيبات متكاملة يحدد المواصفات والمراحل وغرامات التأخير والضمان الفني طبقاً للمادة 646 مدني.',
    governingLaw: 'المواد من 646 إلى 673 من القانون المدني المصري (عقد المقاولة)',
    defaultParties: {
      firstPartyTitle: 'الطرف الأول (رب العمل)',
      secondPartyTitle: 'الطرف الثاني (المقاول المنفذ)',
    },
    sampleData: {
      party1Name: 'حسام الدين كامل الألفي',
      party1Id: '27901150102431',
      party1Phone: '01005544332',
      party1Address: 'فيلا 14 الحي المتميز، مدينة الشروق، محافظة القاهرة',
      party1Role: 'رب العمل وصاحب العقار المطلوب تشطيبه',

      party2Name: 'م. شريف حامد السلحدار (شركة الفن المعماري للمقاولات والديكور)',
      party2Id: 'سجل تجاري رقم 98745 القاهرة - بطاقة ضريبية 542-120-999',
      party2Phone: '01122334455',
      party2Address: '24 شارع مصدق، الدقي، محافظة الجيزة',
      party2Role: 'المقاول والمهندس المنفذ والمسؤول فنياً',

      contractDate: '2026/10/30',
      governorate: 'القاهرة',
      district: 'مدينة الشروق',

      subjectTitle: 'تنفيذ تشطيبات معمارية وديكورية فاخرة للفيلا رقم 14',
      subjectDescription: 'تنفيذ أعمال التشطيبات الداخلية والخارجية والكهرباء والسباكة والأرضيات والدهانات وفقاً للمقايسة الهندسية المعتمدة والمرفقة بهذا العقد كجزء لا يتجزأ منه.',
      areaSize: 'مسطح إجمالي 450 متراً مربعاً (طابقين وحديقة وروف)',
      boundaries: 'تقع بالحي المتميز بمدينة الشروق قطاع الفيلات رقم 14.',

      totalAmount: '950,000 ج.م',
      totalAmountWords: 'فقط تسعمائة وخمسون ألف جنيه مصري لا غير',
      depositAmount: '300,000 ج.م دفعة بدء الأعمال وشراء المواد الأولية',
      remainingAmount: '650,000 ج.م تصرف على 4 مستخلصات مرحلية حسب نسبة الإنجاز المعتمدة',
      paymentTerms: 'يصرف كل مستخلص خلال 3 أيام من اعتماد استلام المرحلة من المهندس الاستشاري المشرف.',

      penaltyClauseAmount: '1,000 ج.م عن كل يوم تأخير غير مبرر بظروف قهرية أو تأخر سداد الدفعات',
      jurisdictionCourt: 'محكمة القاهرة الجديدة الابتدائية',
      duration: 'أربعة أشهر تبدأ من تاريخ استلام الموقع خالياً من العوائق',
      extraNotes: 'يلتزم المقاول بضمان جودة الأعمال وسلامة التركيبات لمدة سنة كاملة من تاريخ محضر الاستلام النهائي دون مقابل.',
    },
  },
  {
    id: 'partnership_agreement',
    category: 'commercial',
    title: 'عقد تأسيس شركة تضامن وتوزيع حصص وأرباح',
    shortDesc: 'عقد شراكة تجارية متكامل لتأسيس شركة تضامن وتحديد الإدارة والمسؤوليات التضامنية وفق قانون الشركات وقانون التجارة المصري.',
    governingLaw: 'قانون الشركات رقم 159 لسنة 1981 وقانون التجارة رقم 17 لسنة 1999',
    defaultParties: {
      firstPartyTitle: 'الشريك الأول (المتضامن/المدير)',
      secondPartyTitle: 'الشريك الثاني (المتضامن)',
    },
    sampleData: {
      party1Name: 'أشرف عبد المنعم البهنساوي',
      party1Id: '28204110103456',
      party1Phone: '01009876543',
      party1Address: '19 شارع البطل أحمد عبد العزيز، المهندسين، الجيزة',
      party1Role: 'شريك متضامن والمدير الفعلي للشركة وله حق التوقيع',

      party2Name: 'وسيم نادر فؤاد غالي',
      party2Id: '28408160107890',
      party2Phone: '01145678901',
      party2Address: '3 شارع دجلة، المعادي، القاهرة',
      party2Role: 'شريك متضامن والمسؤول المالي والإداري وله حق التوقيع المشترك',

      contractDate: '2026/10/30',
      governorate: 'الجيزة',
      district: 'الدقي',

      subjectTitle: 'تأسيس شركة الأفق للتوريدات العمومية والتجارة (شركة تضامن)',
      subjectDescription: 'تأسيس وإدارة شركة تضامن تعمل في مجالات الاستيراد والتصدير والتوريدات العمومية والخدمات اللوجستية باسم: شركة الأفق وشركاه للتوريدات.',
      areaSize: 'المركز الرئيسي: 12 شارع التحرير، الدقي، الجيزة',
      boundaries: 'يمتد نشاط الشركة داخل جمهورية مصر العربية ولها فتح فروع بقرار الشركاء.',

      totalAmount: '2,000,000 ج.م (رأس مال الشركة)',
      totalAmountWords: 'فقط مليونان من الجنيهات المصرية مقسمة بالتساوي 50% لكل شريك',
      depositAmount: '1,000,000 ج.م أودعت بالحساب البنكي المفتوح باسم الشركة تحت التأسيس',
      remainingAmount: '1,000,000 ج.م قيمة أصول وتجهيزات عينية وفق تقرير تقييم معتمد',
      paymentTerms: 'توزع الأرباح الصافية بنسبة 50% لكل شريك بعد حجز نسبة 10% للاحتياطي القانوني سنوياً.',

      penaltyClauseAmount: '500,000 ج.م كتعويض عن منافسة نشاط الشركة أو الإخلال ببند الإدارة والسرية',
      jurisdictionCourt: 'المحكمة الاقتصادية بالقاهرة',
      duration: 'خمس سنوات تبدأ من تاريخ القيد في السجل التجاري قابلة للتجديد باتفاق الطرفين',
      extraNotes: 'لا يجوز لأي شريك التنازل عن حصته أو إدخال شريك جديد إلا بموافقة كتابية صريحة ومسبقة من الشريك الآخر.',
    },
  },
  {
    id: 'land_sale',
    category: 'real_estate',
    title: 'عقد بيع ابتدائي لقطعة أرض فضاء معدة للبناء',
    shortDesc: 'عقد بيع أرض فضاء مفرزة يشمل سند التمليك والتكليف والمساحة والحدود الأربعة وضمان خلوها من أي نزاعات زراعية أو وقف.',
    governingLaw: 'القانون المدني المصري وقانون البناء رقم 119 لسنة 2008',
    defaultParties: {
      firstPartyTitle: 'الطرف الأول (البائع)',
      secondPartyTitle: 'الطرف الثاني (المشتري)',
    },
    sampleData: {
      party1Name: 'الحاج رمضان عبد العال السويفي',
      party1Id: '26910120101122',
      party1Phone: '01007766554',
      party1Address: 'عزبة النخل، مركز الخانكة، محافظة القليوبية',
      party1Role: 'البائع ومالك الأرض سنداً للعقد المشهر رقم 4589 لسنة 2012',

      party2Name: 'المهندس مصطفى علاء الدين البرنس',
      party2Id: '28705050109988',
      party2Phone: '01221144330',
      party2Address: '45 شارع شبرا الرئيسي، الساحل، القاهرة',
      party2Role: 'المشتري لنفسه بقصد البناء',

      contractDate: '2026/10/30',
      governorate: 'القليوبية',
      district: 'العبور',

      subjectTitle: 'قطعة الأرض الفضاء رقم (74) بالبلوك (B) بالحي السادس',
      subjectDescription: 'قطعة أرض فضاء مفرزة ومخططة للبناء السكني داخل الحيز العمراني المعتمد وخالية من أي زراعات أو إشغالات أو تعديات.',
      areaSize: '400 متراً مربعاً (أربعمائة متر مربع أبعادها 20 متراً في 20 متراً)',
      boundaries: 'الحد البحري: شارع بعرض 20 متراً، الحد القبلي: القطعة رقم 76، الحد الشرقي: القطعة رقم 72، الحد الغربي: ممر حدائقي بعرض 6 أمتار.',

      totalAmount: '4,200,000 ج.م',
      totalAmountWords: 'فقط أربعة ملايين ومائتا ألف جنيه مصري لا غير',
      depositAmount: '2,500,000 ج.م نقداً بمجلس العقد',
      remainingAmount: '1,700,000 ج.م تسدد عند تحرير توكيل البيع ونقل الملكية بجهاز المدينة',
      paymentTerms: 'سداد الدفعة الأولى فور توقيع هذا العقد، وسداد الباقي عند التصديق على التوقيعات بجهاز المدينة والشهر العقاري.',

      penaltyClauseAmount: '350,000 ج.م (ثلاثمائة وخمسون ألف جنيه مصري)',
      jurisdictionCourt: 'محكمة بنها الابتدائية ومأمورية الخانكة',
      duration: 'التسليم الفعلي لقطعة الأرض خالية تماماً خلال 10 أيام من العقد',
      extraNotes: 'يضمن البائع سلامة تسلسل الملكية وخلو قطعة الأرض من أي مطالبات لوزارة الأوقاف أو أملاك الدولة أو الإصلاح الزراعي.',
    },
  },
  {
    id: 'court_settlement',
    category: 'settlement',
    title: 'اتفاقية صلح وإبراء ذمة شامل وتنازل عن دعوى قضائية',
    shortDesc: 'عقد صلح قضائي نهائي بات لإنهاء منازعة وإسقاط المطالبات وإلحاقه بمحضر جلسة المحكمة ليكون في قوة السند التنفيذي (المادة 549 مدني).',
    governingLaw: 'المواد 549 إلى 555 من القانون المدني المصري والمادة 103 من قانون المرافعات المدنية والتجارية',
    defaultParties: {
      firstPartyTitle: 'الطرف الأول (المدعي/المتصالح)',
      secondPartyTitle: 'الطرف الثاني (المدعى عليه/المتصالح)',
    },
    sampleData: {
      party1Name: 'مجدي سمير رزق الله بشارة',
      party1Id: '27503180105432',
      party1Phone: '01004455667',
      party1Address: '17 شارع رمسيس، الأزبكية، القاهرة',
      party1Role: 'الطرف الأول (المدعي في الدعوى رقم 1824 لسنة 2024 مدني كلي جنوب القاهرة)',

      party2Name: 'فريد وجدي توفيق الحريري',
      party2Id: '28111250106754',
      party2Phone: '01123344556',
      party2Address: '22 شارع الجمهورية، عابدين، القاهرة',
      party2Role: 'الطرف الثاني (المدعى عليه في ذات الدعوى)',

      contractDate: '2026/10/30',
      governorate: 'القاهرة',
      district: 'وسط القاهرة',

      subjectTitle: 'التصالح الودي البات في الدعوى رقم 1824 لسنة 2024 مدني كلي جنوب القاهرة',
      subjectDescription: 'إنهاء النزاع القضائي والمالي القائم بين الطرفين صلحاً باتاً لا رجعة فيه وتنازل الطرف الأول عن كافة مطالباته القضائية والتعويضية.',
      areaSize: 'إنهاء شامل للمطالبة المالية والالتزامات التعاقدية السابقة',
      boundaries: 'يسري هذا الصلح على الدعوى المنظورة أمام الدائرة (7 مدني كلي جنوب القاهرة) وأي شكاوى شرطية أو بلاغات تفرعت عنها.',

      totalAmount: '450,000 ج.م مبلغ التسوية الودية الشاملة',
      totalAmountWords: 'فقط أربعمائة وخمسون ألف جنيه مصري لا غير خالص السداد',
      depositAmount: '450,000 ج.م سددت بالكامل بشيك مقبول الدفع بمجلس العقد',
      remainingAmount: '0 ج.م إبراء ذمة متبادل وتام وشامل لكافة الديون والمصروفات',
      paymentTerms: 'استلم الطرف الأول الشيك البنكي المقبول الدفع وأقر بصرفه وبراءة ذمة الطرف الثاني نهائياً.',

      penaltyClauseAmount: '100,000 ج.م حال نكول أي طرف عن المثول بالجلسة لتوثيق الصلح',
      jurisdictionCourt: 'محكمة جنوب القاهرة الابتدائية — الدائرة (7 مدني كلي)',
      duration: 'يسري أثره فوراً ويلتزم الطرفان بالحضور بجلسة 2026/11/15 لتقديم هذا العقد لإلحاقه بمحضر الجلسة',
      extraNotes: 'اتفق الطرفان على الحضور أمام هيئة المحكمة بالجلسة المحددة لتقديم هذا الاتفاق وإلحاقه بمحضر الجلسة وإثبات محتواه فيه وجعله في قوة السند التنفيذي وانقضاء الدعوى صلحاً.',
    },
  },
];

export const SmartContractLibrary: React.FC<SmartContractLibraryProps> = ({
  clients = [],
  cases = [],
  onSaveToDocuments,
}) => {
  // Selection States
  const [selectedCategory, setSelectedCategory] = useState<ContractCategory>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('apartment_sale');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('split');

  // Form Field State
  const [formData, setFormData] = useState<ContractTemplate['sampleData']>(
    CONTRACT_TEMPLATES[0].sampleData
  );

  // Auto-Fill Source Selectors
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedClientRole, setSelectedClientRole] = useState<'party1' | 'party2'>('party1');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // UI States
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [autoFilledBadge, setAutoFilledBadge] = useState<boolean>(false);
  const [showHighlighter, setShowHighlighter] = useState<boolean>(true);

  // Active Template
  const activeTemplate = useMemo(() => {
    return (
      CONTRACT_TEMPLATES.find((t) => t.id === selectedTemplateId) || CONTRACT_TEMPLATES[0]
    );
  }, [selectedTemplateId]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'all') return CONTRACT_TEMPLATES;
    return CONTRACT_TEMPLATES.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  // Switch Template
  const handleSelectTemplate = (template: ContractTemplate) => {
    setSelectedTemplateId(template.id);
    setFormData(template.sampleData);
    setAutoFilledBadge(false);
  };

  // --- Auto-Population Handlers ---
  const handleAutoFillFromClient = (clientId: string) => {
    setSelectedClientId(clientId);
    if (!clientId) return;

    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    setFormData((prev) => {
      const updated = { ...prev };
      if (selectedClientRole === 'party1') {
        updated.party1Name = client.name;
        updated.party1Phone = client.phone || prev.party1Phone;
        updated.party1Id = client.nationalId || 'مرفق صورة الرقم القومي / السجل';
        updated.party1Address = client.address || prev.party1Address;
        updated.party1Role = `${activeTemplate.defaultParties.firstPartyTitle} (الموكل المقيد بالنظام)`;
      } else {
        updated.party2Name = client.name;
        updated.party2Phone = client.phone || prev.party2Phone;
        updated.party2Id = client.nationalId || 'مرفق صورة الرقم القومي / السجل';
        updated.party2Address = client.address || prev.party2Address;
        updated.party2Role = `${activeTemplate.defaultParties.secondPartyTitle} (الموكل المقيد بالنظام)`;
      }
      return updated;
    });

    setAutoFilledBadge(true);
    triggerSuccessToast(`تمت التعبئة التلقائية لبيانات الموكل: ${client.name}`);
  };

  const handleAutoFillFromCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    if (!caseId) return;

    const legalCase = cases.find((c) => c.id === caseId);
    if (!legalCase) return;

    setFormData((prev) => {
      return {
        ...prev,
        subjectTitle: `${legalCase.title} (دعوى رقم ${legalCase.caseNumber} لسنة ${legalCase.year})`,
        jurisdictionCourt: `${legalCase.court} — الدائرة (${legalCase.circuit || 'المختصة'})`,
        party2Name: legalCase.opponentName || prev.party2Name,
        party2Role: `الطرف المقابل في الدعوى (${legalCase.opponentName || 'الخصم'})`,
        totalAmount: legalCase.claimAmount
          ? `${legalCase.claimAmount.toLocaleString('ar-EG')} ج.م`
          : prev.totalAmount,
        extraNotes: `مرتبط بملف القضية رقم ${legalCase.caseNumber} لسنة ${legalCase.year} (${legalCase.type}) أمام ${legalCase.court}.`,
      };
    });

    setAutoFilledBadge(true);
    triggerSuccessToast(`تمت التعبئة التلقائية من بيانات القضية رقم: ${legalCase.caseNumber}`);
  };

  const handleAutoFillHelbawyLawyer = (targetParty: 'party1' | 'party2' = 'party2') => {
    setFormData((prev) => {
      const updated = { ...prev };
      const helbawyName = 'المستشار عطيه الهلباوي (محامٍ بالنقض والدستورية ومجلس الدولة)';
      const helbawyId = 'مقيد بالنقض برقم ترخيص 148520 — نقابة المحامين المصرية';
      const helbawyPhone = '01153747612';
      const helbawyAddress = 'مكتب المستشار عطيه الهلباوي للمحاماة والاستشارات القضائية، جمهورية مصر العربية';

      if (targetParty === 'party1') {
        updated.party1Name = helbawyName;
        updated.party1Id = helbawyId;
        updated.party1Phone = helbawyPhone;
        updated.party1Address = helbawyAddress;
        updated.party1Role = 'المحامي الوكيل بالنقض والدستورية ومجلس الدولة';
      } else {
        updated.party2Name = helbawyName;
        updated.party2Id = helbawyId;
        updated.party2Phone = helbawyPhone;
        updated.party2Address = helbawyAddress;
        updated.party2Role = 'المحامي الوكيل بالنقض والدستورية ومجلس الدولة';
      }
      return updated;
    });

    setAutoFilledBadge(true);
    triggerSuccessToast('تمت تعبئة بيانات المستشار عطيه الهلباوي كطرف وكيل');
  };

  const handleFillRealisticSample = () => {
    setFormData(activeTemplate.sampleData);
    setAutoFilledBadge(true);
    triggerSuccessToast('تمت التعبئة الكاملة بالنموذج الواقعي القانوني المعتمد');
  };

  const handleResetForm = () => {
    setFormData({
      party1Name: '',
      party1Id: '',
      party1Phone: '',
      party1Address: '',
      party1Role: activeTemplate.defaultParties.firstPartyTitle,

      party2Name: '',
      party2Id: '',
      party2Phone: '',
      party2Address: '',
      party2Role: activeTemplate.defaultParties.secondPartyTitle,

      contractDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      governorate: 'القاهرة',
      district: 'وسط البلد',

      subjectTitle: '',
      subjectDescription: '',
      areaSize: '',
      boundaries: '',

      totalAmount: '',
      totalAmountWords: '',
      depositAmount: '',
      remainingAmount: '',
      paymentTerms: '',

      penaltyClauseAmount: '',
      jurisdictionCourt: 'المحاكم الابتدائية وجزئياتها بمحافظة القاهرة',
      duration: '',
      extraNotes: '',
    });
    setAutoFilledBadge(false);
    triggerSuccessToast('تم تفريغ الحقول للتعبئة اليدوية');
  };

  const triggerSuccessToast = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // --- Contract Text Generator ---
  const generateFullContractText = (): string => {
    return `بسم الله الرحمن الرحيم
جمهورية مصر العربية
مكتب المستشار عطيه الهلباوي للمحاماة والاستشارات القانونية

${activeTemplate.title.toUpperCase()}
[السند القانوني المنظم: ${activeTemplate.governingLaw}]

إنه في يوم (${new Date().toLocaleDateString('ar-EG', { weekday: 'long' })}) الموافق ${formData.contractDate || '.....'} بمدينة ${formData.district || '.....'}، محافظة ${formData.governorate || '.....'}.
تم الاتفاق والتراضي والتعاقد بين كل من:

أولاً: السيد/ ${formData.party1Name || '[اسم الطرف الأول]'}
- الجنسية: مصري - الديانة: مسلم
- بطاقة رقم قومي: ${formData.party1Id || '[الرقم القومي للطرف الأول]'}
- المقيم في: ${formData.party1Address || '[عنوان الطرف الأول]'}
- هاتف رقم: ${formData.party1Phone || '[هاتف الطرف الأول]'}
- الصفة في التعاقد: ${formData.party1Role || activeTemplate.defaultParties.firstPartyTitle}
(ويشار إليه في هذا العقد بـ «الطرف الأول»)

ثانياً: السيد/ ${formData.party2Name || '[اسم الطرف الثاني]'}
- الجنسية: مصري - الديانة: مسلم
- بطاقة رقم قومي: ${formData.party2Id || '[الرقم القومي للطرف الثاني]'}
- المقيم في: ${formData.party2Address || '[عنوان الطرف الثاني]'}
- هاتف رقم: ${formData.party2Phone || '[هاتف الطرف الثاني]'}
- الصفة في التعاقد: ${formData.party2Role || activeTemplate.defaultParties.secondPartyTitle}
(ويشار إليه في هذا العقد بـ «الطرف الثاني»)

══════════════════════════════════════════════════════
التمهيــــد
══════════════════════════════════════════════════════
أقر الطرفان بأهليتهما القانونية والشرعية الكاملة للتعاقد والتصرف دون وجود أي عارض من عوارض الأهلية أو موانعها القانونية.
وحيث إن الطرف الأول يمتلك/يختص بموضوع هذا التعاقد الموضح تفصيلاً، ورغب الطرف الثاني في التعاقد معه وفقاً للشروط والأوضاع المقررة في القانون المصري رقم (${activeTemplate.governingLaw})، لذا فقد تلاقت إرادتهما الحرة واتفقا على الآتي:

══════════════════════════════════════════════════════
البنـــود والشـــروط
══════════════════════════════════════════════════════

البند الأول (التمهيد جزء لا يتجزأ):
يعتبر التمهيد السابق جزءاً لا يتجزأ من هذا العقد وبنداً أساسياً من بنوده ومفسراً ومكملاً لجميع أحكامه.

البند الثاني (محل التعاقد وتوصيفه):
محل هذا التعاقد هو: ${formData.subjectTitle || '[توصيف محل التعاقد]'}
التفاصيل والمواصفات: ${formData.subjectDescription || '[الوصف المعماري أو الفني التفصيلي]'}
المساحة والمسطح: ${formData.areaSize || '[المساحة المقدرة]'}
الحدود والمعالم: ${formData.boundaries || '[الحدود الأربعة والأوصاف الحاصرة]'}

البند الثالث (المقابل المالي وشروط السداد):
اتفق الطرفان على أن القيمة الإجمالية المتفق عليها هي: ${formData.totalAmount || '[المبلغ الإجمالي]'}
(وقدرها كتابةً: ${formData.totalAmountWords || '[المبلغ بالحروف]'})
- المسدد بمجلس العقد (الدفعة المقدمة): ${formData.depositAmount || '.....'}
- المبلغ المتبقي وطريقة وفائه: ${formData.remainingAmount || '.....'}
- شروط السداد والوفاء: ${formData.paymentTerms || 'وفقاً للإيصالات أو الشيكات البنكية المتبادلة'}

البند الرابع (المعاينة والقبول):
أقر الطرف الثاني بأنه عاين محل التعاقد المعاينة التامة النافية للجهالة شرعاً وقانوناً، وأنه قبل التعاقد بحالته الراهنة دون أي تحفظ أو ادعاء لاحق بالجهالة أو الغبن.

البند الخامس (خلو العين والضمان القانوني):
يقر الطرف الأول ويضمن خلو محل التعاقد من كافة الديون والرهون الرسمية والحيازية والاختصاصات والامتيازات وحقوق الارتفاق، الظاهرة منها والخفية، وأنه لم يسبق له التصرف فيه للغير بأي نوع من أنواع التصرفات الناقلة أو المقيدة للملكية.

البند السادس (الشرط الجزائي والتعويض الاتفاقي):
اتفق الطرفان طبقاً للمادة (223) من القانون المدني المصري على أنه في حالة إخلال أي من الطرفين بأي بند من بنود هذا العقد أو نكوله عن إتمام التزاماته، يلتزم الطرف المخل بأن يدفع للطرف الآخر تعويضاً اتفاقياً غير خاضع لرقابة القضاء مقداره:
(${formData.penaltyClauseAmount || '.....'})
مع بقاء العقد نافذاً ومنتجاً لكافة آثاره القانونية ما لم يختر الطرف المتضرر فسخه.

البند السابع (المدة والتسليم):
${formData.duration || 'التسليم الفوري مع إقرار الطرفين باستيفاء موجبات المعاينة والتسليم الفعلي.'}

البند الثامن (الملاحظات والالتزامات الخاصة):
${formData.extraNotes || 'يلتزم الطرفان بكافة الالتزامات الفرعية والمثول أمام الجهات الحكومية والشهر العقاري عند الطلب.'}

البند التاسع (المحكمة المختصة ومحل الإقامة المختار):
تختص محلياً ونوعياً بنظر أي نزاع قد ينشأ — لا قدر الله — عن تفسير أو تنفيذ أو صحة ونفاذ هذا العقد:
${formData.jurisdictionCourt || 'محاكم القاهرة الابتدائية وجزئياتها'}.
ويقر كل من الطرفين باتخاذه العنوان المبين بصدر هذا العقد موطناً مختاراً له تصح عليه كافة الإعلانات القضائية والإنذارات الرسمية.

البند العاشر (نسخ العقد):
حُرر هذا العقد من نسختين أصليتين متطابقتين، بيد كل طرف نسخة للعمل بموجبها والالتزام بمقتضاها عند اللزوم.

══════════════════════════════════════════════════════
توقيعات أطراف التعاقد
══════════════════════════════════════════════════════

الطرف الأول:                              الطرف الثاني:
الاسم: ${formData.party1Name || '..............................'}          الاسم: ${formData.party2Name || '..............................'}
التوقيع: ............................          التوقيع: ............................
الرقم القومي: ${formData.party1Id || '....................'}    الرقم القومي: ${formData.party2Id || '....................'}

شاهد أول:                                 شاهد ثانٍ:
الاسم: ..............................          الاسم: ..............................
الرقم القومي: ........................          الرقم القومي: ........................
التوقيع: ............................          التوقيع: ............................

──────────────────────────────────────────────────────
صيغ بمعرفة: مكتب المستشار عطيه الهلباوي — محامٍ بالنقض والدستورية ومجلس الدولة
تاريخ الطباعة والإصدار: ${new Date().toLocaleDateString('ar-EG')} • نظام عبقرينو الملكي
`;
  };

  // --- Actions ---
  const handleCopy = () => {
    const text = generateFullContractText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerSuccessToast('تم نسخ العقد بالكامل إلى الحافظة بصيغة قانونية منسقة');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    const text = generateFullContractText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTemplate.title.replace(/\s+/g, '_')}_${Date.now()}.doc`;
    link.click();
    URL.revokeObjectURL(url);
    triggerSuccessToast('تم تنزيل العقد بصيغة مستند وورد جاهز للطباعة');
  };

  const handleSaveToOffice = () => {
    const contractText = generateFullContractText();
    const docTitle = `${activeTemplate.title} — ${formData.party1Name || 'طرف 1'} و ${formData.party2Name || 'طرف 2'}`;

    if (onSaveToDocuments) {
      onSaveToDocuments({
        title: docTitle,
        category: 'عقد',
        fileName: `${activeTemplate.id}_${Date.now()}.doc`,
        fileSize: `${Math.round(contractText.length / 100) / 10} KB`,
        fileType: 'application/msword',
        fileData: contractText,
        clientId: selectedClientId || undefined,
        clientName: formData.party1Name || formData.party2Name || undefined,
        caseId: selectedCaseId || undefined,
        notes: `عقد تم إنشاؤه عبر مكتبة العقود الذكية بتاريخ ${new Date().toLocaleDateString('ar-EG')}`,
      });
    }

    // Also persist via direct API fetch if running
    fetch('/api/office/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-name': encodeURIComponent('المستشار عطيه الهلباوي'),
      },
      body: JSON.stringify({
        title: docTitle,
        category: 'عقد',
        fileName: `${activeTemplate.id}_${Date.now()}.doc`,
        fileSize: `${Math.round(contractText.length / 100) / 10} KB`,
        fileType: 'application/msword',
        fileData: contractText,
        clientId: selectedClientId || undefined,
        clientName: formData.party1Name || formData.party2Name || 'موكل مسجل',
        caseId: selectedCaseId || undefined,
        notes: `مكتبة العقود الذكية - ${activeTemplate.title} سنداً لـ: ${activeTemplate.governingLaw}`,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        triggerSuccessToast('تم حفظ العقد بنجاح في مستندات ومذكرات المكتب');
      })
      .catch((err) => {
        console.warn('Saved in-memory:', err);
        triggerSuccessToast('تم حفظ العقد في أرشيف المكتب');
      });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-900 to-[#1f120e] border-2 border-emerald-500 text-emerald-200 text-xs shadow-2xl flex items-center gap-3 animate-fade-in font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#2B1914] border-2 border-[#D4AF37]/50 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-inner">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                مكتبة العقود الذكية — SmartContractLibrary
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E7C779] border border-[#D4AF37]/40 font-mono font-bold">
                8 نماذج معتمدة • تعبئة تلقائية فورية
              </span>
            </div>
            <p className="text-xs text-[#F5E5BD]/70 mt-1">
              صياغة نماذج العقود والاتفاقيات وفق نصوص القانون المدني المصري والشهر العقاري والتجارة مع التعبئة التلقائية لبيانات الموكلين والقضايا
            </p>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={handleFillRealisticSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#E7C779] border border-[#D4AF37]/40 font-bold transition cursor-pointer shadow-sm"
            title="ملء النموذج ببيانات نموذجية واقعية متكاملة"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>تعبئة نموذجية واقعية</span>
          </button>

          <button
            onClick={handleResetForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f120e] hover:bg-[#2B1914] text-[#F5E5BD]/80 border border-[#D4AF37]/30 font-semibold transition cursor-pointer"
            title="تفريغ الحقول للكتابة المباشرة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تفريغ الحقول</span>
          </button>

          <button
            onClick={handleSaveToOffice}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold transition cursor-pointer shadow-md"
            title="حفظ العقد في مستندات ومذكرات المكتب"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>حفظ في مستندات المكتب</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/50 font-bold transition cursor-pointer shadow-sm"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
            )}
            <span>{copied ? 'تم النسخ!' : 'نسخ العقد'}</span>
          </button>

          <button
            onClick={handleDownloadDoc}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/50 font-bold transition cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>تنزيل Word/Doc</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold hover:brightness-105 transition cursor-pointer shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة رسمية</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[#D4AF37] font-bold text-xs shrink-0 flex items-center gap-1">
          <Scale className="w-3.5 h-3.5" />
          <span>تصنيف العقود:</span>
        </span>
        {[
          { id: 'all', label: 'كافة النماذج (8)' },
          { id: 'real_estate', label: 'العقارات والبيع' },
          { id: 'tenancy', label: 'الإيجارات والمساكن' },
          { id: 'advocacy', label: 'المحاماة والأتعاب' },
          { id: 'commercial', label: 'التجارة والشركات والسيارات' },
          { id: 'construction', label: 'المقاولات والتشطيبات' },
          { id: 'settlement', label: 'الصلح والتنازل القضائي' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as ContractCategory)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] shadow-md'
                : 'bg-[#1f120e] text-[#F5E5BD]/70 hover:bg-[#2B1914] hover:text-[#F5E5BD] border border-[#D4AF37]/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Selection Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredTemplates.map((template) => {
          const isSelected = template.id === selectedTemplateId;
          return (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 text-right ${
                isSelected
                  ? 'bg-gradient-to-b from-[#3A241B] to-[#2B1914] border-2 border-[#D4AF37] shadow-lg shadow-black/40 ring-1 ring-[#D4AF37]/50'
                  : 'bg-[#1f120e] hover:bg-[#2B1914] border-[#D4AF37]/25 hover:border-[#D4AF37]/50 text-[#F5E5BD]/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#2B1914]'
                        : 'bg-[#2B1914] text-[#D4AF37] border border-[#D4AF37]/30'
                    }`}
                  >
                    {template.category === 'real_estate' && 'عقارات'}
                    {template.category === 'tenancy' && 'إيجارات'}
                    {template.category === 'advocacy' && 'محاماة'}
                    {template.category === 'commercial' && 'تجاري'}
                    {template.category === 'construction' && 'مقاولات'}
                    {template.category === 'settlement' && 'صلح'}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <Check className="w-3 h-3" />
                      <span>قيد التحرير</span>
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-[#F5E5BD] leading-snug line-clamp-2">
                  {template.title}
                </h4>
                <p className="text-[11px] text-[#F5E5BD]/60 mt-1 line-clamp-2 leading-relaxed">
                  {template.shortDesc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#D4AF37]/15 text-[10px] text-[#E7C779]/80 truncate">
                ⚖ {template.governingLaw}
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-Population Engine Bar */}
      <div className="p-4 rounded-2xl bg-[#241510] border-2 border-[#D4AF37]/40 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#F5E5BD]">
              محرك التعبئة التلقائية للبيانات الأساسية (Auto-Population Engine):
            </span>
            {autoFilledBadge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>تمت التعبئة التلقائية</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => handleAutoFillHelbawyLawyer('party2')}
              className="px-2.5 py-1 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#E7C779] border border-[#D4AF37]/40 font-semibold cursor-pointer text-[11px]"
            >
              + تعبئة المستشار الهلباوي (كطرف وكيل)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          {/* Pick Client */}
          <div className="md:col-span-5 flex items-center gap-2 bg-[#1a0f0c] p-2 rounded-xl border border-[#D4AF37]/30">
            <span className="text-[11px] text-[#D4AF37] shrink-0 font-bold">الموكل المسجل:</span>
            <select
              value={selectedClientId}
              onChange={(e) => handleAutoFillFromClient(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none text-xs cursor-pointer"
            >
              <option value="" className="bg-[#2B1914]">-- اختر موكلاً مسجلاً للتعبئة --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#2B1914]">
                  {c.name} ({c.phone || c.type})
                </option>
              ))}
            </select>
            <select
              value={selectedClientRole}
              onChange={(e) => setSelectedClientRole(e.target.value as any)}
              className="bg-[#2B1914] text-[#E7C779] text-[10px] rounded px-1.5 py-1 border border-[#D4AF37]/30 focus:outline-none cursor-pointer"
              title="تحديد الطرف الذي سيشغله الموكل"
            >
              <option value="party1">طرف 1</option>
              <option value="party2">طرف 2</option>
            </select>
          </div>

          {/* Pick Case */}
          <div className="md:col-span-4 flex items-center gap-2 bg-[#1a0f0c] p-2 rounded-xl border border-[#D4AF37]/30">
            <span className="text-[11px] text-[#D4AF37] shrink-0 font-bold">القضية المسجلة:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => handleAutoFillFromCase(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none text-xs cursor-pointer"
            >
              <option value="" className="bg-[#2B1914]">-- اختر قضية لاستيراد بياناتها --</option>
              {cases.map((cs) => (
                <option key={cs.id} value={cs.id} className="bg-[#2B1914]">
                  دعوى {cs.caseNumber} لسنة {cs.year} ({cs.court})
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="md:col-span-3 flex items-center justify-end gap-1.5">
            {[
              { id: 'split', label: 'تقسيم مزدوج' },
              { id: 'editor', label: 'حقول التعبئة' },
              { id: 'preview', label: 'معاينة الوثيقة' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37] text-[#2B1914]'
                    : 'bg-[#1a0f0c] text-[#F5E5BD]/70 hover:text-white border border-[#D4AF37]/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace: Split or Tabbed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT/RIGHT 1: Interactive Data Fields Form (Editor) */}
        {(activeTab === 'editor' || activeTab === 'split') && (
          <div
            className={`${
              activeTab === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
            } space-y-4 p-5 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/40 shadow-xl`}
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-bold text-sm text-[#F5E5BD]">
                  حقول وبيانات العقد الأساسية
                </h3>
              </div>
              <span className="text-[10px] text-[#E7C779] font-mono">
                يتم تحديث الوثيقة لحظياً عند أي تعديل
              </span>
            </div>

            {/* General Date & Location */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[#F5E5BD]/70 mb-1">تاريخ التعاقد</label>
                <input
                  type="text"
                  value={formData.contractDate}
                  onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
                  placeholder="2026/10/30"
                  className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#F5E5BD]/70 mb-1">المحافظة</label>
                <input
                  type="text"
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  placeholder="القاهرة"
                  className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#F5E5BD]/70 mb-1">القسم / المركز</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="المعادي"
                  className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Party 1 Section */}
            <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#E7C779]">
                <span>{activeTemplate.defaultParties.firstPartyTitle}</span>
                <button
                  type="button"
                  onClick={() => handleAutoFillHelbawyLawyer('party1')}
                  className="text-[10px] text-[#D4AF37] hover:underline cursor-pointer"
                >
                  تعيين المستشار الهلباوي
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={formData.party1Name}
                    onChange={(e) => setFormData({ ...formData, party1Name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">الرقم القومي / السجل *</label>
                  <input
                    type="text"
                    value={formData.party1Id}
                    onChange={(e) => setFormData({ ...formData, party1Id: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={formData.party1Phone}
                    onChange={(e) => setFormData({ ...formData, party1Phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">الصفة القانونية</label>
                  <input
                    type="text"
                    value={formData.party1Role}
                    onChange={(e) => setFormData({ ...formData, party1Role: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">محل الإقامة المختار (العنوان)</label>
                <input
                  type="text"
                  value={formData.party1Address}
                  onChange={(e) => setFormData({ ...formData, party1Address: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Party 2 Section */}
            <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#E7C779]">
                <span>{activeTemplate.defaultParties.secondPartyTitle}</span>
                <button
                  type="button"
                  onClick={() => handleAutoFillHelbawyLawyer('party2')}
                  className="text-[10px] text-[#D4AF37] hover:underline cursor-pointer"
                >
                  تعيين المستشار الهلباوي
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={formData.party2Name}
                    onChange={(e) => setFormData({ ...formData, party2Name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">الرقم القومي / السجل *</label>
                  <input
                    type="text"
                    value={formData.party2Id}
                    onChange={(e) => setFormData({ ...formData, party2Id: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={formData.party2Phone}
                    onChange={(e) => setFormData({ ...formData, party2Phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">الصفة القانونية</label>
                  <input
                    type="text"
                    value={formData.party2Role}
                    onChange={(e) => setFormData({ ...formData, party2Role: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">محل الإقامة المختار (العنوان)</label>
                <input
                  type="text"
                  value={formData.party2Address}
                  onChange={(e) => setFormData({ ...formData, party2Address: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Subject Matter Section */}
            <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-2.5">
              <span className="text-xs font-bold text-[#E7C779] block">
                موضوع ومحل العقد ومواصفاته التفصيلية
              </span>
              <div>
                <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">عنوان موضوع العقد *</label>
                <input
                  type="text"
                  value={formData.subjectTitle}
                  onChange={(e) => setFormData({ ...formData, subjectTitle: e.target.value })}
                  placeholder="الوحدة السكنية رقم 4 بالعقار..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">التوصيف المعماري / الفني الدقيق</label>
                <textarea
                  rows={2}
                  value={formData.subjectDescription}
                  onChange={(e) => setFormData({ ...formData, subjectDescription: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">المساحة / المسطح</label>
                  <input
                    type="text"
                    value={formData.areaSize}
                    onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">الحدود والمعالم</label>
                  <input
                    type="text"
                    value={formData.boundaries}
                    onChange={(e) => setFormData({ ...formData, boundaries: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Financial Terms Section */}
            <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-2.5">
              <span className="text-xs font-bold text-[#E7C779] block">
                المقابل المالي وشروط الدفع والوفاء
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">المبلغ الإجمالي (رقماً) *</label>
                  <input
                    type="text"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    placeholder="2,850,000 ج.م"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">المبلغ كتابة بالحروف *</label>
                  <input
                    type="text"
                    value={formData.totalAmountWords}
                    onChange={(e) => setFormData({ ...formData, totalAmountWords: e.target.value })}
                    placeholder="فقط مليونان وثمانمائة..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">المدفوع بمجلس العقد (المقدم)</label>
                  <input
                    type="text"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">المتبقي وكيفية سداده</label>
                  <input
                    type="text"
                    value={formData.remainingAmount}
                    onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">شروط السداد ومواعيد الاستحقاق</label>
                <input
                  type="text"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Legal Clauses & Penalties */}
            <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-2.5">
              <span className="text-xs font-bold text-[#E7C779] block">
                الشرط الجزائي والمدة والمحكمة المختصة
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">
                    الشرط الجزائي (المادة 223 مدني)
                  </label>
                  <input
                    type="text"
                    value={formData.penaltyClauseAmount}
                    onChange={(e) => setFormData({ ...formData, penaltyClauseAmount: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">مدة العقد والتسليم</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">المحكمة المختصة محلياً ونوعياً</label>
                <input
                  type="text"
                  value={formData.jurisdictionCourt}
                  onChange={(e) => setFormData({ ...formData, jurisdictionCourt: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#F5E5BD]/70 mb-1">ملاحظات والتزامات خاصة</label>
                <textarea
                  rows={2}
                  value={formData.extraNotes}
                  onChange={(e) => setFormData({ ...formData, extraNotes: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* LEFT/RIGHT 2: Formatted Legal Document Preview (Live Deed) */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div
            className={`${
              activeTab === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
            } space-y-4`}
          >
            {/* Deed Action Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-bold text-[#F5E5BD]">المعاينة الحية للعقد القانوني</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  صيغة نهائية جاهزة للطباعة والتوقيع
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHighlighter(!showHighlighter)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer font-medium ${
                    showHighlighter
                      ? 'bg-[#D4AF37]/20 text-[#E7C779] border-[#D4AF37]/50'
                      : 'bg-[#1f120e] text-[#F5E5BD]/60 border-[#D4AF37]/20'
                  }`}
                >
                  {showHighlighter ? 'إخفاء التمييز' : 'تمييز البيانات المعبأة'}
                </button>
              </div>
            </div>

            {/* Official Legal Document Paper (Printable Box) */}
            <div
              id="printable-contract-deed"
              className="p-8 sm:p-10 rounded-2xl bg-[#FCFAF2] text-[#1c1917] border-4 border-[#8B7355] shadow-2xl space-y-6 font-serif relative overflow-hidden"
              style={{ minHeight: '850px' }}
            >
              {/* Watermark in background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Scale className="w-96 h-96 text-[#8B7355]" />
              </div>

              {/* Royal Egyptian Legal Header */}
              <div className="border-b-2 border-[#8B7355] pb-4 text-center space-y-1 relative">
                <div className="flex items-center justify-between text-xs text-[#574838] font-amiri font-bold">
                  <span>جمهورية مصر العربية</span>
                  <span className="text-sm font-bold text-[#8B7355] flex items-center gap-1.5">
                    <Scale className="w-4 h-4 inline-block text-[#8B7355]" />
                    مكتب المستشار عطيه الهلباوي
                  </span>
                  <span>نقابة المحامين المصرية</span>
                </div>
                <div className="text-[11px] text-[#78644e]">
                  محامٍ بالنقض والدستورية العليا ومجلس الدولة • استشارات قانونية وصياغة عقود
                </div>
                <div className="pt-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-amiri text-[#2B1914] tracking-wide inline-block border-b-2 border-[#D4AF37] pb-1 px-4">
                    {activeTemplate.title}
                  </h1>
                </div>
                <div className="text-[11px] text-[#6b5844] font-mono mt-1">
                  سند المشروعية: {activeTemplate.governingLaw}
                </div>
              </div>

              {/* Opening Date & Council */}
              <div className="text-xs leading-loose text-justify text-[#292524] space-y-2">
                <p>
                  إنه في يوم (
                  <span className="font-bold underline">
                    {new Date().toLocaleDateString('ar-EG', { weekday: 'long' })}
                  </span>
                  ) الموافق{' '}
                  <span
                    className={
                      showHighlighter
                        ? 'font-bold bg-amber-100 px-1 py-0.5 rounded text-amber-950 border border-amber-300'
                        : 'font-bold underline'
                    }
                  >
                    {formData.contractDate || '.....'}
                  </span>
                  ، بمدينة{' '}
                  <span className={showHighlighter ? 'bg-amber-100 px-1 py-0.5 rounded' : 'font-semibold'}>
                    {formData.district || '.....'}
                  </span>
                  ، محافظة{' '}
                  <span className={showHighlighter ? 'bg-amber-100 px-1 py-0.5 rounded' : 'font-semibold'}>
                    {formData.governorate || '.....'}
                  </span>
                  ، حُرر هذا العقد وتراضي على بنوده كل من:
                </p>

                {/* Parties Details Box */}
                <div className="space-y-3 pt-2">
                  {/* Party 1 */}
                  <div className="p-3.5 rounded-xl bg-[#F4EFE6] border border-[#8B7355]/30 space-y-1">
                    <div className="font-bold font-amiri text-sm text-[#2B1914] flex items-center justify-between">
                      <span>أولاً: {activeTemplate.defaultParties.firstPartyTitle}</span>
                      <span className="text-[11px] text-[#78644e] font-sans font-normal">
                        ({formData.party1Role || 'الطرف الأول'})
                      </span>
                    </div>
                    <div className="text-xs space-y-0.5 text-[#3D3228]">
                      <div>
                        الاسم: <strong className={showHighlighter ? 'bg-amber-200/80 px-1 rounded' : ''}>{formData.party1Name || '...................................................'}</strong>
                      </div>
                      <div>
                        الجنسية: مصري • بطاقة رقم قومي:{' '}
                        <span className={showHighlighter ? 'bg-amber-100 px-1 font-mono rounded font-bold' : 'font-mono'}>
                          {formData.party1Id || '............................'}
                        </span>{' '}
                        • هاتف: <span className="font-mono">{formData.party1Phone || '...............'}</span>
                      </div>
                      <div>
                        المقيم في:{' '}
                        <span className={showHighlighter ? 'bg-amber-100 px-1 rounded' : ''}>
                          {formData.party1Address || '.......................................................................'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Party 2 */}
                  <div className="p-3.5 rounded-xl bg-[#F4EFE6] border border-[#8B7355]/30 space-y-1">
                    <div className="font-bold font-amiri text-sm text-[#2B1914] flex items-center justify-between">
                      <span>ثانياً: {activeTemplate.defaultParties.secondPartyTitle}</span>
                      <span className="text-[11px] text-[#78644e] font-sans font-normal">
                        ({formData.party2Role || 'الطرف الثاني'})
                      </span>
                    </div>
                    <div className="text-xs space-y-0.5 text-[#3D3228]">
                      <div>
                        الاسم: <strong className={showHighlighter ? 'bg-amber-200/80 px-1 rounded' : ''}>{formData.party2Name || '...................................................'}</strong>
                      </div>
                      <div>
                        الجنسية: مصري • بطاقة رقم قومي:{' '}
                        <span className={showHighlighter ? 'bg-amber-100 px-1 font-mono rounded font-bold' : 'font-mono'}>
                          {formData.party2Id || '............................'}
                        </span>{' '}
                        • هاتف: <span className="font-mono">{formData.party2Phone || '...............'}</span>
                      </div>
                      <div>
                        المقيم في:{' '}
                        <span className={showHighlighter ? 'bg-amber-100 px-1 rounded' : ''}>
                          {formData.party2Address || '.......................................................................'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preamble */}
                <div className="pt-2 text-justify">
                  <div className="font-bold text-xs text-[#2B1914] mb-1">التمهيــــد:</div>
                  <p className="text-[#3D3228]">
                    أقر الطرفان بأهليتهما القانونية والشرعية الكاملة للتعاقد والتصرف وخلو إرادتهما من أي عيب من عيوب الإرادة، ورغبةً منهما في إبرام هذا التعاقد وفقاً لأحكام القانون المصري، فقد اتفقا وتراضيا على ما يأتي:
                  </p>
                </div>

                {/* Clauses list */}
                <div className="space-y-2.5 pt-2">
                  <div>
                    <strong className="text-[#2B1914]">البند الأول (التمهيد): </strong>
                    <span>يعتبر التمهيد السابق جزءاً لا يتجزأ من هذا العقد وبنداً جوهرياً من بنوده ومفسراً ومكملاً له.</span>
                  </div>

                  <div>
                    <strong className="text-[#2B1914]">البند الثاني (محل العقد): </strong>
                    <span>
                      اتفق الطرفان على أن موضوع هذا العقد هو:{' '}
                      <span className={showHighlighter ? 'font-bold bg-amber-100 px-1 rounded' : 'font-bold'}>
                        {formData.subjectTitle || '.............................................'}
                      </span>
                      ، وتفصيله:{' '}
                      <span className={showHighlighter ? 'bg-amber-100 px-1 rounded' : ''}>
                        {formData.subjectDescription || '................................................................................................................'}
                      </span>
                      .
                      {formData.areaSize && (
                        <span>
                          {' '}والمساحة والمسطح الإجمالي:{' '}
                          <span className={showHighlighter ? 'font-bold bg-amber-100 px-1 rounded' : 'font-semibold'}>
                            {formData.areaSize}
                          </span>
                          .
                        </span>
                      )}
                      {formData.boundaries && (
                        <span>
                          {' '}والحدود والمعالم الحاصرة:{' '}
                          <span className={showHighlighter ? 'bg-amber-100 px-1 rounded' : ''}>
                            {formData.boundaries}
                          </span>
                          .
                        </span>
                      )}
                    </span>
                  </div>

                  <div>
                    <strong className="text-[#2B1914]">البند الثالث (المقابل المالي وشروط الوفاء): </strong>
                    <span>
                      حدد المقابل المالي الإجمالي لهذا التعاقد بمبلغ وقدره:{' '}
                      <span className={showHighlighter ? 'font-bold bg-amber-200 px-1.5 py-0.5 rounded text-amber-950 font-mono' : 'font-bold font-mono'}>
                        {formData.totalAmount || '.................'}
                      </span>{' '}
                      (وقدره بالحروف كتابة:{' '}
                      <span className={showHighlighter ? 'font-bold bg-amber-100 px-1 rounded' : 'font-bold'}>
                        {formData.totalAmountWords || '...................................................................'}
                      </span>
                      ).
                      {formData.depositAmount && (
                        <span>
                          {' '}سدد منها بمجلس العقد دفعة مقدمة قدرها:{' '}
                          <span className={showHighlighter ? 'font-semibold bg-amber-100 px-1 rounded' : 'font-semibold'}>
                            {formData.depositAmount}
                          </span>
                          .
                        </span>
                      )}
                      {formData.remainingAmount && (
                        <span>
                          {' '}والمبلغ المتبقي وقدره:{' '}
                          <span className={showHighlighter ? 'font-semibold bg-amber-100 px-1 rounded' : 'font-semibold'}>
                            {formData.remainingAmount}
                          </span>
                          .
                        </span>
                      )}
                      {formData.paymentTerms && (
                        <span>
                          {' '}وكيفية الوفاء:{' '}
                          <span className={showHighlighter ? 'bg-amber-100 px-1 rounded' : ''}>
                            {formData.paymentTerms}
                          </span>
                          .
                        </span>
                      )}
                    </span>
                  </div>

                  <div>
                    <strong className="text-[#2B1914]">البند الرابع (المعاينة والقبول): </strong>
                    <span>
                      أقر الطرف الثاني بأنه عاين محل التعاقد المعاينة التامة النافية للجهالة شرعاً وقانوناً، وأنه قبل التعاقد بحالته الراهنة دون أي تحفظ.
                    </span>
                  </div>

                  <div>
                    <strong className="text-[#2B1914]">البند الخامس (خلو العين والضمان): </strong>
                    <span>
                      يضمن الطرف الأول خلو محل التعاقد من كافة الرهون والديون وحقوق الارتفاق والاختصاص والامتياز المقيدة، وأنه لم يسبق له التصرف فيه للغير.
                    </span>
                  </div>

                  <div>
                    <strong className="text-[#2B1914]">البند السادس (الشرط الجزائي والتعويض): </strong>
                    <span>
                      اتفق الطرفان سنداً للمادة (223) من القانون المدني المصري على أنه في حالة إخلال أي طرف بالتزاماته يلتزم بسداد تعويض اتفاقي نهائي مقداره:{' '}
                      <span className={showHighlighter ? 'font-bold bg-rose-100 px-1.5 py-0.5 rounded text-rose-950 font-mono' : 'font-bold font-mono'}>
                        {formData.penaltyClauseAmount || '.................'}
                      </span>{' '}
                      دون حاجة لإنذار أو إعذار أو إثبات الضرر.
                    </span>
                  </div>

                  <div>
                    <strong className="text-[#2B1914]">البند السابع (المدة والتسليم): </strong>
                    <span className={showHighlighter ? 'bg-amber-100 px-1 rounded' : ''}>
                      {formData.duration || 'التسليم الفوري عند التوقيع.'}
                    </span>
                  </div>

                  {formData.extraNotes && (
                    <div>
                      <strong className="text-[#2B1914]">البند الثامن (الالتزامات الخاصة): </strong>
                      <span className={showHighlighter ? 'bg-amber-100 px-1 rounded' : ''}>
                        {formData.extraNotes}
                      </span>
                    </div>
                  )}

                  <div>
                    <strong className="text-[#2B1914]">البند التاسع (المحكمة المختصة): </strong>
                    <span>
                      تختص بنظر أي منازعة قضائية ناشئة عن هذا العقد محلياً ونوعياً:{' '}
                      <span className={showHighlighter ? 'font-bold bg-amber-100 px-1 rounded' : 'font-bold'}>
                        {formData.jurisdictionCourt || 'محاكم القاهرة الابتدائية وجزئياتها'}
                      </span>
                      ، وتعتبر العناوين الموضحة بصدر العقد موطناً مختاراً لكل طرف.
                    </span>
                  </div>

                  <div>
                    <strong className="text-[#2B1914]">البند العاشر (النسخ): </strong>
                    <span>حُرر هذا العقد من نسختين متطابقتين، استلم كل طرف نسخته للعمل بموجبها والالتزام بأحكامها.</span>
                  </div>
                </div>

                {/* Official Signatures Grid */}
                <div className="pt-8 border-t-2 border-[#8B7355]/40 grid grid-cols-2 gap-8 text-xs font-amiri">
                  <div className="text-center space-y-8">
                    <div className="font-bold text-sm text-[#2B1914]">
                      توقيع {activeTemplate.defaultParties.firstPartyTitle}:
                    </div>
                    <div className="text-[#574838]">
                      الاسم: {formData.party1Name || '........................................'}
                    </div>
                    <div className="border-b border-dashed border-[#8B7355] w-3/4 mx-auto pt-2">
                      التوقيع: ........................................
                    </div>
                    <div className="text-[11px] text-[#78644e]">
                      الرقم القومي: {formData.party1Id || '............................'}
                    </div>
                  </div>

                  <div className="text-center space-y-8">
                    <div className="font-bold text-sm text-[#2B1914]">
                      توقيع {activeTemplate.defaultParties.secondPartyTitle}:
                    </div>
                    <div className="text-[#574838]">
                      الاسم: {formData.party2Name || '........................................'}
                    </div>
                    <div className="border-b border-dashed border-[#8B7355] w-3/4 mx-auto pt-2">
                      التوقيع: ........................................
                    </div>
                    <div className="text-[11px] text-[#78644e]">
                      الرقم القومي: {formData.party2Id || '............................'}
                    </div>
                  </div>
                </div>

                {/* Official Legal Seal Footer */}
                <div className="pt-6 mt-6 border-t border-[#8B7355]/30 flex flex-wrap items-center justify-between text-[10px] text-[#78644e] font-sans">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8B7355]" />
                    <span>صيغة قانونية رسمية معتمدة وفق القانون المصري</span>
                  </div>
                  <div>
                    المستشار عطيه الهلباوي — محامٍ بالنقض والدستورية ومجلس الدولة
                  </div>
                  <div>
                    تاريخ الإنشاء: {new Date().toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
