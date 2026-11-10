/**
 * وحدة إدارة وحفظ وتصدير سجل القضايا والمسودات داخل الجلسة (Legal History Storage)
 * مكتب المستشار عطيه الهلباوي — منصة عبقرينو
 */

import {
  LegalHistoryEntry,
  CaseQueryEntry,
  DraftDocumentEntry,
  LegalHistoryExportData,
  LegalBranchType,
} from '../types/legalHistory';

const STORAGE_KEY = 'attya_legal_history_session_v1';
export const HISTORY_EVENT_NAME = 'attya_legal_history_changed';

export const BRANCH_LABELS: Record<LegalBranchType, string> = {
  civil: 'القانون المدني والعقود',
  criminal: 'القانون الجنائي والإجراءات',
  labor: 'قانون العمل والتأمينات',
  tenancy: 'قوانين الإيجار وإخلاء الأماكن',
  commercial: 'القانون التجاري والشركات',
  administrative: 'القضاء الإداري ومجلس الدولة',
  personal_status: 'الأحوال الشخصية والأسرة',
  real_estate: 'الشهر العقاري والتسجيل',
  general: 'استشارة وتكييف قضائي عام',
};

// بذور بيانات واقعية للجلسة الحالية لضمان جاهزية النظام فور الفتح
const INITIAL_SEED_ENTRIES: LegalHistoryEntry[] = [
  {
    id: 'query-seed-1',
    type: 'case_query',
    title: 'نزاع عقد بيع شقة وتأخر في الاستلام مع شرط جزائي',
    branch: 'civil',
    branchLabel: 'القانون المدني والعقود',
    status: 'مكتمل',
    isStarred: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    formattedDate: new Date(Date.now() - 1000 * 60 * 45).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    sourceRoom: 'consultation_room',
    query: 'اشترى المشتري شقة سكنية بموجب عقد بيع ابتدائي وسدد 75% من الثمن، ونص البند الرابع على التسليم بغرامة تأخير 5000 ج.م شهرياً. امتنعت الشركة عن التسليم متذرعة بارتفاع الأسعار وتطالب بزيادة 30%.',
    characterization: 'دعوى إلزام بتسليم مبيع مفرز مع التعويض وإعمال الشرط الجزائي الاتفاقي طبقاً للمادتين 147 و 223 من القانون المدني المصري رقم 131 لسنة 1948.',
    directAnswer: 'العقد شريعة المتعاقدين ولا يجوز تعديله أو فسخه إلا باتفاق الطرفين أو بمقتضى نص القانون (المادة 147 مدني). امتناع البائع بحجة ارتفاع الأسعار غير مقبول، ويحق للمشتري رفع دعوى تسليم مبيع مع إلزام البائع بسداد غرامة التأخير التعاقدية.',
    statutoryBasis: [
      {
        lawName: 'القانون المدني رقم 131 لسنة 1948',
        articleNumber: 'المادة 147',
        summary: 'القوة الملزمة للعقد (العقد شريعة المتعاقدين).',
      },
      {
        lawName: 'القانون المدني رقم 131 لسنة 1948',
        articleNumber: 'المادة 223 و 224',
        summary: 'جواز تقدير التعويض الاتفاقي في العقد وسريان الشرط الجزائي دون حاجة لإثبات الضرر.',
      },
    ],
    cassationPrinciple: 'الطعن رقم 1840 لسنة 54 ق مدني: "الشرط الجزائي المنصوص عليه في العقد يجعل الضرر واقعاً في تقدير المتعاقدين ولا يكلف الدائن بإثباته."',
    recommendedSteps: [
      'توجيه إنذار رسمي على يد محضر بإلزام الشركة بالتسليم خلال 15 يوماً وسداد غرامات التأخير المتراكمة.',
      'قيد دعوى تسليم شقة سكنية أمام المحكمة الابتدائية المختصة مع طلب ندب خبير هندسي لإثبات المعاينة ونسبة الإنجاز.',
      'المطالبة بفوائد تأخيرية قانونية بنسبة 4% عن المبالغ المسددة عملاً بالمادة 226 مدني.',
    ],
    tags: ['عقد بيع', 'شرط جزائي', 'تسليم شقة', 'قانون مدني'],
  },
  {
    id: 'draft-seed-2',
    type: 'draft_document',
    title: 'مسودة عقد بيع ابتدائي لشقة سكنية بالتقسيط مع شرط جزائي محكم',
    documentCategory: 'عقد',
    branch: 'civil',
    branchLabel: 'القانون المدني والعقود',
    status: 'معتمدة نهائياً',
    isStarred: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    formattedDate: new Date(Date.now() - 1000 * 60 * 25).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    sourceRoom: 'manual',
    clausesCount: 9,
    wordCount: 520,
    governingLaw: 'القانون المدني المصري 131 لسنة 1948 وقانون الشهر العقاري 9 لسنة 2022',
    parties: {
      firstParty: 'الطرف الأول: البائع (بكامل أهليته المعتبرة قانوناً)',
      secondParty: 'الطرف الثاني: المشتري (بكامل أهليته للتصرف والتعاقد)',
    },
    content: `## عقد بيع ابتدائي لوحدة سكنية مفرزة

إنه في يوم [  ] الموافق [  ] / [  ] / 2026 م، تم الاتفاق والتراضي بين كلٍ من:
- **الطرف الأول (البائع)**: السيد/ [  ]، مصري الجنسية، بطاقة رقم قومي: [  ]، المقيم في: [  ].
- **الطرف الثاني (المشتري)**: السيد/ [  ]، مصري الجنسية، بطاقة رقم قومي: [  ]، المقيم في: [  ].

### تمهيد
يمتلك الطرف الأول كامل الوحدة السكنية رقم [  ] بالدور [  ] بالعقار رقم [  ] الكائن بشارع [  ]، قسم [  ]، محافظة [  ]، وسند ملكيته مسجل أو مقيد بموجب [  ]. ورغبة من الطرف الثاني في شرائها، فقد اتفق الطرفان على البنود الآتية:

### البند الأول: موضوع البيع
باع وأسقط وتنازل الطرف الأول بكافة الضمانات الفعلية والقانونية إلى الطرف الثاني القابل لذلك الوحدة السكنية الموصوفة بصدر العقد، بما يشمل حصة شائعة في الأرض والمرافق المشتركة تعادل نسبة مساحة الوحدة إلى مجموع مساحات العقار.

### البند الثاني: الثمن وطريقة السداد
تم هذا البيع برضاء وقبول الطرفين نظير ثمن إجمالي متفق عليه قدره [  ] ج.م، تم سداد دفعة تعاقد نقدية قدرها [  ] ج.م بمجلس هذا العقد، ويُسدد الباقي على أقساط ربع سنوية متساوية على مدار سنتين (24 شهراً) بموجب إيصالات سداد موقعة.

### البند الثالث: التسليم والشرط الجزائي
يلتزم الطرف الأول بتسليم الوحدة للطرف الثاني صالحة للسكن في موعد غايته [  ] / [  ] / 2026 م. وفي حال تأخر الطرف الأول عن التسليم يلتزم بسداد مبلغ 5000 ج.م شهرياً كتعويض اتفاقي للطرف الثاني. وإذا أخل أي طرف بالعقد، يلتزم بسداد شرط جزائي غير خاضع لرقابة القضاء قدره [  ] ج.م مع بقاء العقد نافذاً ومنتجاً لآثاره.

### البند الرابع: سريان القوانين والاختصاص القضائي
يخضع هذا العقد لأحكام القانون المدني المصري رقم 131 لسنة 1948، وتختص محاكم [  ] الابتدائية وجزئياتها بنظر أي نزاع ينشأ بشأنه.

حرر هذا العقد من نسختين بيد كل طرف نسخة للعمل بموجبها عند اللزوم.`,
    tags: ['عقد بيع', 'أقساط', 'تسليم', 'شهر عقاري'],
  },
  {
    id: 'query-seed-3',
    type: 'case_query',
    title: 'جنحة خيانة أمانة لإيصال على بياض بين شركاء تجاريين',
    branch: 'criminal',
    branchLabel: 'القانون الجنائي والإجراءات',
    status: 'مكتمل',
    isStarred: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    formattedDate: new Date(Date.now() - 1000 * 60 * 15).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    sourceRoom: 'public',
    query: 'أقام الشاكي جنحة مباشرة بموجب إيصال أمانة تم توقيعه على بياض كضمان لحسابات شركة تجارية بينهما، والشاكي يطالب بمبلغ 750 ألف جنيه رغم وجود حسابات بنكية تثبت تصفية الشركة.',
    characterization: 'جنحة خيانة أمانة مؤثمة بنص المادة 341 عقوبات، مع انتفاء ركن التسليم الحقيقي ومدنية النزاع ووجوب الطعن بالتزوير صلب الإيصال.',
    directAnswer: 'جريمة خيانة الأمانة لا تقوم إلا إذا ثبت تسليم المال فعلياً على سبيل الأمانة في أحد عقود الوديعة أو الوكالة الحصرية المنصوص عليها بالمادة 341 عقوبات؛ وتوقيع الإيصال كضمان لمعاملة تجارية ينفي القصد الجنائي ويوجب البراءة لمدنية النزاع.',
    statutoryBasis: [
      {
        lawName: 'قانون العقوبات المصري رقم 58 لسنة 1937',
        articleNumber: 'المادة 341',
        summary: 'حصر عقود الأمانة وضرورة ثبوت واقعة التسليم الحقيقي للمال.',
      },
      {
        lawName: 'قانون الإثبات رقم 25 لسنة 1968',
        articleNumber: 'المادة 49 وما بعدها',
        summary: 'إجراءات الادعاء بالتزوير على صلب الورقة الموقعة على بياض.',
      },
    ],
    cassationPrinciple: 'الطعن رقم 2841 لسنة 72 ق جنائي: "إذا كان تسليم الورقة على بياض ضماناً لحساب شركة تجارية انتفى ركن التسليم في جريمة خيانة الأمانة وتعين القضاء بالبراءة لمدنية النزاع."',
    recommendedSteps: [
      'المثول أمام محكمة الجنح والدفع بمدنية النزاع وانتفاء ركن التسليم الفعلي.',
      'التقرير بالطعن بالتزوير على صلب الإيصال بالطب الشرعي لإثبات عدم معاصرة كتابة الصلب للتوقيع.',
      'تقديم عقد الشركة والمراسلات والحسابات البنكية الدالة على وجود معاملات مدنية وتجارية بين الطرفين.',
    ],
    tags: ['خيانة أمانة', 'إيصال أمانة', 'طعن بالتزوير', 'براءة'],
  },
  {
    id: 'draft-seed-4',
    type: 'draft_document',
    title: 'إنذار رسمي على يد محضر بالتكليف بالوفاء بالأجرة وفسخ عقد الإيجار',
    documentCategory: 'إنذار رسمي',
    branch: 'tenancy',
    branchLabel: 'قوانين الإيجار وإخلاء الأماكن',
    status: 'منقحة',
    isStarred: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    formattedDate: new Date(Date.now() - 1000 * 60 * 5).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    sourceRoom: 'private',
    clausesCount: 4,
    wordCount: 280,
    governingLaw: 'القانون رقم 4 لسنة 1996 وقانون المرافعات المدنية والتجارية',
    parties: {
      firstParty: 'المنذر: المؤجر السيد/ [  ]',
      secondParty: 'المنذر إليه: المستأجر السيد/ [  ]',
    },
    content: `## إنذار رسمي بالتكليف بالوفاء بالأجرة على يد محضر

بناءً على طلب السيد/ [  ]، المقيم في [  ]، ومحله المختار مكتب المستشار عطيه الهلباوي المحامي بالنقض والدستورية العليا.
أنا [  ] محضر محكمة [  ] الجزئية قد انتقلت وأعلنت:
السيد/ [  ]، المقيم في: [  ]، مخاطباً مع: [  ].

### وأنذرته بالآتي:
بموجب عقد إيجار مؤرخ [  ] / [  ] / [  ]، استأجر المنذر إليه من المنذر الشقة السكنية الكائنة بـ [  ] نظير أجرة شهرية قدرها [  ] ج.م تُدفع مقدماً في أول كل شهر.
وحيث إن المنذر إليه قد تخلف وامتنع عن سداد الأجرة المستحقة عن الأشهر من [  ] حتى [  ] بإجمالي مبلغ قدره [  ] ج.م، وحيث تنص المادة [  ] من العقد والمادة 18 من قانون إيجار الأماكن والمادة 586 من القانون المدني على وجوب التكليف بالوفاء.

### بناءً عليه:
كلف المحضر المنذر إليه بسداد إجمالي الأجرة المتأخرة وقدرها [  ] ج.م خلال مهلة أقصاها 15 يوماً من تاريخ إعلانه بهذا الإنذار، وإلا فسيضطر المنذر إلى رفع دعوى طرد وإخلاء للغصب وعدم سداد الأجرة وفسخ العقد مع المطالبة بالتعويض وإلزامه بالمصاريف وأتعاب المحاماة.`,
    tags: ['إنذار', 'إيجار', 'تكليف بالوفاء', 'طرد'],
  },
];

/**
 * استرجاع سجل الجلسة الحالي
 */
export function getHistoryEntries(): LegalHistoryEntry[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[LegalHistoryStorage] Failed to read storage:', err);
  }

  // حفظ واسترجاع البذور الافتراضية للجلسة
  saveHistoryEntries(INITIAL_SEED_ENTRIES);
  return INITIAL_SEED_ENTRIES;
}

/**
 * حفظ قائمة السجل في وسائط التخزين وبث حدث التحديث
 */
export function saveHistoryEntries(entries: LegalHistoryEntry[]): void {
  try {
    const serialized = JSON.stringify(entries);
    sessionStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(STORAGE_KEY, serialized);
    window.dispatchEvent(new CustomEvent(HISTORY_EVENT_NAME, { detail: entries }));
  } catch (err) {
    console.error('[LegalHistoryStorage] Failed to save history:', err);
  }
}

/**
 * إضافة إدخال جديد للسجل (استشارة أو مسودة)
 */
export function addHistoryEntry(
  entryData: Omit<CaseQueryEntry, 'id' | 'timestamp' | 'formattedDate'> | Omit<DraftDocumentEntry, 'id' | 'timestamp' | 'formattedDate'>
): LegalHistoryEntry {
  const entries = getHistoryEntries();
  const now = new Date();
  const id = `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const formattedDate = now.toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newEntry: LegalHistoryEntry = {
    ...entryData,
    id,
    timestamp: now.toISOString(),
    formattedDate,
  } as LegalHistoryEntry;

  const updated = [newEntry, ...entries];
  saveHistoryEntries(updated);
  return newEntry;
}

/**
 * تحديث إدخال موجود
 */
export function updateHistoryEntry(id: string, updates: Partial<LegalHistoryEntry>): boolean {
  const entries = getHistoryEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return false;

  entries[index] = {
    ...entries[index],
    ...updates,
  } as LegalHistoryEntry;

  saveHistoryEntries(entries);
  return true;
}

/**
 * تبديل حالة التمييز بنجمة
 */
export function toggleStarEntry(id: string): boolean {
  const entries = getHistoryEntries();
  const item = entries.find((e) => e.id === id);
  if (!item) return false;

  item.isStarred = !item.isStarred;
  saveHistoryEntries(entries);
  return true;
}

/**
 * حذف إدخال محدد
 */
export function deleteHistoryEntry(id: string): boolean {
  const entries = getHistoryEntries();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;

  saveHistoryEntries(filtered);
  return true;
}

/**
 * مسح السجل بالكامل
 */
export function clearAllHistory(): void {
  saveHistoryEntries([]);
}

/**
 * استعادة البذور الافتراضية
 */
export function resetToSeedHistory(): void {
  saveHistoryEntries(INITIAL_SEED_ENTRIES);
}

/**
 * استيراد سجل من ملف JSON
 */
export function importHistoryFromJSON(jsonString: string): { success: boolean; count?: number; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    const candidateEntries: LegalHistoryEntry[] = Array.isArray(data)
      ? data
      : Array.isArray(data.entries)
      ? data.entries
      : [];

    if (!Array.isArray(candidateEntries) || candidateEntries.length === 0) {
      return { success: false, error: 'الملف لا يحتوي على سجل قضايا أو مسودات صالح.' };
    }

    const current = getHistoryEntries();
    // دمج السجلات مع تفادي التكرار بناءً على الـ ID
    const currentIds = new Set(current.map((e) => e.id));
    const newItems = candidateEntries.filter((e) => e.id && !currentIds.has(e.id));
    const merged = [...newItems, ...current];

    saveHistoryEntries(merged);
    return { success: true, count: newItems.length };
  } catch (err: any) {
    return { success: false, error: err.message || 'فشل في تحليل ملف JSON.' };
  }
}

/**
 * إعداد بيانات التصدير الإجمالية
 */
export function buildExportPayload(): LegalHistoryExportData {
  const entries = getHistoryEntries();
  const queries = entries.filter((e) => e.type === 'case_query');
  const drafts = entries.filter((e) => e.type === 'draft_document');

  const branchesCount: Record<string, number> = {};
  entries.forEach((e) => {
    branchesCount[e.branchLabel] = (branchesCount[e.branchLabel] || 0) + 1;
  });

  return {
    appName: 'عبقرينو — المستشار عطيه الهلباوي',
    counselorName: 'المستشار عطيه الهلباوي (محامٍ بالنقض والدستورية العليا)',
    exportedAt: new Date().toISOString(),
    sessionDuration: 'جلسة عمل نشطة',
    stats: {
      totalEntries: entries.length,
      totalQueries: queries.length,
      totalDrafts: drafts.length,
      branchesCount,
    },
    entries,
  };
}

/**
 * تصدير السجل إلى ملف JSON قابل للتنزيل
 */
export function exportHistoryToJSON(): void {
  const payload = buildExportPayload();
  const json = JSON.stringify(payload, null, 2);
  downloadBlob(json, `سجل_قضايا_ومسودات_المستشار_عطيه_الهلباوي_${Date.now()}.json`, 'application/json');
}

/**
 * تصدير السجل إلى ملف Markdown منسق
 */
export function exportHistoryToMarkdown(): void {
  const payload = buildExportPayload();
  const dateFormatted = new Date().toLocaleString('ar-EG');

  let md = `# محضر سجل الجلسة القضائي — المستشار عطيه الهلباوي\n\n`;
  md += `**المنصة**: عبقرينو — المنظومة الملكية الذكية لإدارة المحاماة والاستشارات\n`;
  md += `**الصفة**: محامٍ بالنقض والدستورية العليا ومجلس الدولة\n`;
  md += `**تاريخ التصدير**: ${dateFormatted}\n`;
  md += `**إجمالي المسائل المسجلة**: ${payload.stats.totalEntries} (الاستشارات: ${payload.stats.totalQueries} • المسودات: ${payload.stats.totalDrafts})\n\n`;
  md += `---\n\n`;

  payload.entries.forEach((entry, idx) => {
    md += `## [${idx + 1}] ${entry.title}\n\n`;
    md += `- **النوع**: ${entry.type === 'case_query' ? 'استشارة وقضية موضوعية' : 'مسودة محرر قانوني'}\n`;
    md += `- **الفرع القضائي**: ${entry.branchLabel}\n`;
    md += `- **الحالة الإجرائية**: ${entry.status}\n`;
    md += `- **التاريخ**: ${entry.formattedDate}\n\n`;

    if (entry.type === 'case_query') {
      md += `### ❓ واقعة الاستفسار والمطروح:\n${entry.query}\n\n`;
      md += `### ⚖️ التكييف القضائي السليم:\n${entry.characterization}\n\n`;
      md += `### 💡 الرأي القانوني وخلاصة الفتوى:\n${entry.directAnswer}\n\n`;

      if (entry.statutoryBasis && entry.statutoryBasis.length > 0) {
        md += `### 📜 الأسانيد التشريعية المستند إليها:\n`;
        entry.statutoryBasis.forEach((s) => {
          md += `- **${s.lawName} (${s.articleNumber})**: ${s.summary}\n`;
        });
        md += `\n`;
      }

      if (entry.cassationPrinciple) {
        md += `### 🏛️ قضاء محكمة النقض:\n> «${entry.cassationPrinciple}»\n\n`;
      }

      if (entry.recommendedSteps && entry.recommendedSteps.length > 0) {
        md += `### 📋 خطة التحرك الإجرائي:\n`;
        entry.recommendedSteps.forEach((st, sIdx) => {
          md += `${sIdx + 1}. ${st}\n`;
        });
        md += `\n`;
      }
    } else {
      md += `- **تصنيف المحرر**: ${entry.documentCategory}\n`;
      md += `- **عدد الكلمات**: ${entry.wordCount} كلمة • **عدد البنود**: ${entry.clausesCount} بنداً\n`;
      if (entry.governingLaw) md += `- **القانون الحاكم**: ${entry.governingLaw}\n`;
      md += `\n### 📄 نص المسودة القانونية:\n\n${entry.content}\n\n`;
    }

    md += `---\n\n`;
  });

  downloadBlob(md, `سجل_قضايا_ومسودات_المستشار_عطيه_الهلباوي_${Date.now()}.md`, 'text/markdown');
}

/**
 * تصدير السجل إلى ملف نصي خالص (TXT)
 */
export function exportHistoryToText(): void {
  const payload = buildExportPayload();
  const dateFormatted = new Date().toLocaleString('ar-EG');

  let txt = `مكتب المستشار عطيه الهلباوي — محامٍ بالنقض والدستورية العليا\n`;
  txt += `سجل استفسارات القضايا ومسودات العقود في الجلسة\n`;
  txt += `تاريخ التصدير: ${dateFormatted}\n`;
  txt += `======================================================================\n\n`;

  payload.entries.forEach((entry, idx) => {
    txt += `[${idx + 1}] ${entry.title}\n`;
    txt += `النوع: ${entry.type === 'case_query' ? 'استشارة وقضية' : 'مسودة محرر'}\n`;
    txt += `الفرع: ${entry.branchLabel} | الحالة: ${entry.status} | التاريخ: ${entry.formattedDate}\n`;
    txt += `----------------------------------------------------------------------\n`;

    if (entry.type === 'case_query') {
      txt += `الواقعة:\n${entry.query}\n\n`;
      txt += `التكييف القضائي:\n${entry.characterization}\n\n`;
      txt += `الرأي المباشر:\n${entry.directAnswer}\n\n`;
      if (entry.cassationPrinciple) {
        txt += `مبدأ النقض: ${entry.cassationPrinciple}\n\n`;
      }
    } else {
      txt += `التصنيف: ${entry.documentCategory} | الكلمات: ${entry.wordCount}\n\n`;
      txt += `نص المسودة:\n${entry.content}\n\n`;
    }

    txt += `======================================================================\n\n`;
  });

  downloadBlob(txt, `سجل_قضايا_ومسودات_المستشار_عطيه_الهلباوي_${Date.now()}.txt`, 'text/plain');
}

/**
 * دالة مساعدة لتنزيل Blob كملف
 */
function downloadBlob(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
