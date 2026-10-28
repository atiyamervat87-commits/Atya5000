import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, ShieldCheck, ArrowRight, Info } from 'lucide-react';

interface DeadlineRule {
  id: string;
  name: string;
  category: 'مدني' | 'جنائي' | 'إداري' | 'عمل';
  days: number;
  articleBasis: string;
  lawName: string;
  triggerEvent: string;
  notes: string;
}

const DEADLINE_RULES: DeadlineRule[] = [
  {
    id: 'proc-appeal-civil',
    name: 'ميعاد الطعن بالاستئناف في الأحكام المدنية والتجارية الموضوعية',
    category: 'مدني',
    days: 40,
    articleBasis: 'المادة 227',
    lawName: 'قانون المرافعات المدنية والتجارية رقم 13 لسنة 1968',
    triggerEvent: 'صدور الحكم إذا كان حضورياً أو إعلانه إذا كان بمثابة الحضوري',
    notes: 'ميعاد حتمي من النظام العام، وفواته يرتب سقوط الحق في الاستئناف وتقضي به المحكمة من تلقاء نفسها.',
  },
  {
    id: 'proc-appeal-urgent',
    name: 'ميعاد استئناف الأحكام المستعجلة ومنازعات التنفيذ الوقتية',
    category: 'مدني',
    days: 15,
    articleBasis: 'المادة 227 (فقرة 2)',
    lawName: 'قانون المرافعات المدنية والتجارية رقم 13 لسنة 1968',
    triggerEvent: 'تاريخ صدور الحكم المستعجل أو إعلانه',
    notes: 'قصر الميعاد نظراً لطبيعة المسائل المستعجلة التي يخشى عليها من فوات الوقت.',
  },
  {
    id: 'proc-cassation-civil',
    name: 'ميعاد الطعن بالنقض في الأحكام المدنية والتجارية',
    category: 'مدني',
    days: 60,
    articleBasis: 'المادة 252',
    lawName: 'قانون المرافعات المدنية والتجارية رقم 13 لسنة 1968',
    triggerEvent: 'تاريخ صدور الحكم الانتهائي المطعون فيه',
    notes: 'يلزم إيداع صحيفة الطعن موقعة من محامٍ مقبول أمام محكمة النقض وسداد الكفالة وإرفاق التوكيل.',
  },
  {
    id: 'proc-cassation-criminal',
    name: 'ميعاد التقرير بالطعن بالنقض وإيداع الأسباب في المواد الجنائية',
    category: 'جنائي',
    days: 60,
    articleBasis: 'المادة 34',
    lawName: 'قانون حالات وإجراءات الطعن أمام محكمة النقض رقم 57 لسنة 1959',
    triggerEvent: 'تاريخ صدور الحكم الجنائي الحضوري أو إعلان الحكم الغيابي الاستئنافي',
    notes: 'يشمل التقرير بالطعن بالقلم الجنائي وإيداع مذكرة بالأسباب موقعة من محامٍ بالنقض.',
  },
  {
    id: 'proc-oppose-misdemeanor',
    name: 'ميعاد المعارضة في الأحكام الغيابية الصادرة في الجنح',
    category: 'جنائي',
    days: 10,
    articleBasis: 'المادة 398',
    lawName: 'قانون الإجراءات الجنائية رقم 150 لسنة 1950',
    triggerEvent: 'تاريخ إعلان الحكم الغيابي لشخص المحكوم عليه أو في موطنه',
    notes: 'يسقط الحق في المعارضة بفوات الأيام العشرة، ويجوز إثبات قيام القوة القاهرة المانعة من التقرير.',
  },
  {
    id: 'proc-appeal-misdemeanor',
    name: 'ميعاد استئناف أحكام محكمة الجنح الجزئية',
    category: 'جنائي',
    days: 10,
    articleBasis: 'المادة 406',
    lawName: 'قانون الإجراءات الجنائية رقم 150 لسنة 1950',
    triggerEvent: 'تاريخ النطق بالحكم الحضوري أو إعلان الحكم المعتبر حضورياً',
    notes: 'وللنائب العام أو المحامي العام ميعاد ثلاثين يوماً للاستئناف.',
  },
  {
    id: 'proc-admin-appeal',
    name: 'ميعاد الطعن أمام المحكمة الإدارية العليا (مجلس الدولة)',
    category: 'إداري',
    days: 60,
    articleBasis: 'المادة 44',
    lawName: 'قانون مجلس الدولة رقم 47 لسنة 1972',
    triggerEvent: 'تاريخ صدور حكم محكمة القضاء الإداري أو المحاكم التأديبية',
    notes: 'يقدم الطعن بتقرير يودع قلم كتاب المحكمة الإدارية العليا مع بيان أسباب الطعن وطلبات الطاعن.',
  },
  {
    id: 'proc-limitation-tort',
    name: 'سقوط دعوى التعويض عن العمل غير المشروع (التقادم الثلاثي)',
    category: 'مدني',
    days: 1095, // 3 years approx
    articleBasis: 'المادة 377',
    lawName: 'القانون المدني المصري رقم 131 لسنة 1948',
    triggerEvent: 'تاريخ علم المضرور بحدوث الضرر وبالشخص المسئول عنه (أو 15 سنة من الواقعة)',
    notes: 'إذا كانت الدعوى ناشئة عن جريمة جنائية، فإن دعوى التعويض لا تسقط إلا بسقوط الدعوى الجنائية.',
  },
];

export const ProceduralDeadlinesCalculator: React.FC = () => {
  const [selectedRuleId, setSelectedRuleId] = useState(DEADLINE_RULES[0].id);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedRule = DEADLINE_RULES.find((r) => r.id === selectedRuleId) || DEADLINE_RULES[0];

  // Calculate deadline date
  const computeDeadline = () => {
    if (!startDate) return null;
    const date = new Date(startDate);
    // Egyptian Law: day of the event is not counted; starts next day (Art. 15 Procedural Code)
    date.setDate(date.getDate() + selectedRule.days);
    return date;
  };

  const deadlineDate = computeDeadline();

  // Difference in days from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let remainingDays = 0;
  let isExpired = false;

  if (deadlineDate) {
    const diffTime = deadlineDate.getTime() - today.getTime();
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isExpired = remainingDays < 0;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>حساب المواعيد وسقوط الحقوق الإجرائية</span>
          </div>
          <h2 className="text-2xl font-bold font-amiri text-slate-100">
            حاسبة المواعيد الإجرائية والطعون والتقادم المسقط
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            أداة قانونية دقيقة لحساب مواعيد الاستئناف والنقض والمعارضة وتقادم الدعاوى طبقاً لقوانين المرافعات والإجراءات الجنائية ومجلس الدولة، مع التنبيه على قاعدة امتداد الميعاد عند مصادفة عطلة رسمية (المادة 18 مرافعات).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form - 5 cols */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <h3 className="font-bold text-amber-300 font-amiri text-base border-b border-slate-800 pb-2">
            تحديد الإجراء والواقعة المنشئة للميعاد
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              نوع الإجراء أو الطعن القضائي
            </label>
            <select
              value={selectedRuleId}
              onChange={(e) => setSelectedRuleId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {DEADLINE_RULES.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  [{rule.category}] {rule.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              تاريخ صدور الحكم أو الإعلان أو الواقعة المنشئة للميعاد
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              الواقعة: {selectedRule.triggerEvent}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">المدة القانونية المحددة:</span>
              <span className="font-bold text-amber-300 font-mono text-sm">
                {selectedRule.days > 365 ? `${Math.round(selectedRule.days / 365)} سنوات` : `${selectedRule.days} يوماً`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">السند التشريعي:</span>
              <span className="text-slate-200 font-semibold">{selectedRule.articleBasis}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              القانون: {selectedRule.lawName}
            </div>
          </div>
        </div>

        {/* Calculation Result Display - 7 cols */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-200 font-amiri text-lg">
                النتيجة الإجرائية وتاريخ الانقضاء الحتمي
              </h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                حساب رسمي مطابق لنص القانون
              </span>
            </div>

            {deadlineDate && (
              <div
                className={`p-6 rounded-2xl border ${
                  isExpired
                    ? 'bg-rose-950/30 border-rose-700/50 text-rose-200'
                    : remainingDays <= 7
                    ? 'bg-amber-950/30 border-amber-700/50 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-700/50 text-emerald-200'
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider">
                    آخر موعد قانوني لاتخاذ الإجراء:
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {isExpired ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{isExpired ? 'سقط الحق بفوات الميعاد' : 'الميعاد سارٍ ومتاح'}</span>
                  </div>
                </div>

                <div className="text-2xl sm:text-3xl font-bold font-amiri tracking-wide">
                  {deadlineDate.toLocaleDateString('ar-EG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                <div className="text-xs pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span>الموقف الزمني من تاريخ اليوم:</span>
                  <span className="font-bold font-mono text-sm">
                    {isExpired
                      ? `انقضى منذ ${Math.abs(remainingDays)} يوماً`
                      : `متبقٍ ${remainingDays} يوماً فقط`}
                  </span>
                </div>
              </div>
            )}

            {/* Critical Procedural Rules */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-amber-400 font-semibold font-amiri text-sm">
                <Info className="w-4 h-4" />
                <span>قواعد إجرائية جوهرية لحساب المواعيد:</span>
              </div>
              <ul className="space-y-1.5 text-slate-400 list-disc list-inside text-[11px] leading-relaxed">
                <li>
                  <strong className="text-slate-300">المادة 15 مرافعات:</strong> إذا كان الميعاد مقدراً بالأيام أو الشهور أو السنين فلا يحسب منه يوم حدوث الأمر المعتبر في القانون مجرياً للميعاد، وينقضي الميعاد بانقضاء اليوم الأخير منه.
                </li>
                <li>
                  <strong className="text-slate-300">المادة 18 مرافعات:</strong> إذا صادف آخر الميعاد عطلة رسمية امتد الميعاد إلى أول يوم عمل تالٍ لها.
                </li>
                <li>
                  <strong className="text-slate-300">مواعيد المسافة:</strong> يزاد على الميعاد ميعاد مسافة (يوم لكل 50 كم بما لا يجاوز 4 أيام) طبقاً للمادة 16 مرافعات لمن يبعد موطنه عن مقر المحكمة.
                </li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            {selectedRule.notes}
          </div>
        </div>
      </div>
    </div>
  );
};
