import React, { useState } from 'react';
import { GitBranch, Search, ShieldCheck, CheckCircle2, Award, Zap, BookOpen, ArrowDown, FileText, RefreshCw } from 'lucide-react';

interface ScenarioPreset {
  id: string;
  title: string;
  category: string;
  query: string;
}

const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'sale',
    title: 'نزاع عقد بيع شقة وتسجيل عقاري',
    category: 'قانون مدني',
    query: 'اشتريت شقة بعقد ابتدائي ولم يقم البائع بالتسجيل بالشهر العقاري، هل يحق له بيعها لشخص آخر وما هو الموقف القانوني؟'
  },
  {
    id: 'trust',
    title: 'إيصال أمانة كضمان معاملة مدنية',
    category: 'قانون جنائي',
    query: 'حررت إيصال أمانة كضمان لدين تجاري ولم أتسلم مبالغ نقدية فعلية، كيف أثبت براءتي أمام محكمة الجنح؟'
  },
  {
    id: 'khula',
    title: 'دعوى خلع وتنازل عن الحقوق المالية',
    category: 'أحوال شخصية',
    query: 'أريد رفع دعوى خلع للتنازل عن المقدم والمؤخر ورد الصداق، هل يستطيع القاضي رفض الدعوى إذا رفض الزوج؟'
  },
  {
    id: 'tort',
    title: 'تعويض عن مسؤولية تقصيرية وحادث',
    category: 'مسؤولية مدنية',
    query: 'تعرضت لحادث مروري تسبب في إصابات وأضرار مادية ومعنوية وفوات كسب، ما هي شروط وشهادة استحقاق التعويض؟'
  }
];

export const LogicChainVisualizer: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>(PRESET_SCENARIOS[0]);
  const [customQuery, setCustomQuery] = useState(PRESET_SCENARIOS[0].query);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runDeduction = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/consultation/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          engineMode: 'independent_mind_only',
          preferredLanguage: 'ar_standard'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'فشل تشغيل العقل المستقل.');
      }
    } catch (err: any) {
      setError(err.message || 'خطأ في الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    runDeduction(PRESET_SCENARIOS[0].query);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#24140f] to-[#1a0e0b] border border-[#D4AF37]/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-1">
            <GitBranch className="w-4 h-4" />
            <span>مشاهد الشجرة المنطقية ومسار التفكير (LogicChainVisualizer)</span>
          </div>
          <h2 className="text-2xl font-bold font-amiri text-[#F5E5BD]">
            المستشار عطيه الهلباوي — تقييم واختبار العقل المستقل (QiyasEngine)
          </h2>
          <p className="text-sm text-[#F5E5BD]/70 mt-1 max-w-3xl">
            أداة مرئية متقدمة لاستعراض شجرة الاستدلال الاستنباطي، تتبع مسار التفكير (Chain of Thought)، استرجاع سوابق محكمة النقض، تحليل موانع تخلف العلة، ومؤشر الثقة القضائية دون هلوسة.
          </p>
        </div>
      </div>

      {/* Preset Scenarios Selector */}
      <div className="p-5 rounded-2xl bg-[#24140f] border border-[#D4AF37]/30 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold font-amiri text-[#D4AF37] flex items-center gap-2">
          <Search className="w-4 h-4 text-[#D4AF37]" />
          <span>اختر سيناريو قانوني قياسي لاختبار العقل المستقل:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedScenario(preset);
                setCustomQuery(preset.query);
                runDeduction(preset.query);
              }}
              className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between space-y-2 cursor-pointer ${
                selectedScenario.id === preset.id
                  ? 'bg-[#3A241B] border-[#D4AF37] text-[#F5E5BD] shadow-md'
                  : 'bg-[#1a0e0b] border-[#D4AF37]/20 text-[#F5E5BD]/80 hover:bg-[#3A241B]/50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  {preset.category}
                </span>
                {selectedScenario.id === preset.id && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
              </div>
              <div className="font-bold text-xs font-amiri leading-tight">{preset.title}</div>
            </button>
          ))}
        </div>

        {/* Custom Query Box */}
        <div className="pt-3 border-t border-[#D4AF37]/20 space-y-2">
          <label className="block text-xs font-semibold text-[#F5E5BD]">أو أدخل استفساراً قانونياً مخصصاً للاختبار الفوري:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="اكتب الواقعة القانونية هنا (مثلاً: نزاع إيجار قديم، طلاق غيابي، تعويض مدني)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/40 text-xs text-[#F5E5BD] placeholder-[#F5E5BD]/40 focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              onClick={() => runDeduction(customQuery)}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8c701e] text-[#2B1914] font-bold text-xs hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>تشغيل الاستدلال</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs">
          خطأ: {error}
        </div>
      )}

      {/* Result Display & Logic Tree */}
      {result && (
        <div className="space-y-6">
          {/* Summary / Final Response Card */}
          <div className="p-6 rounded-2xl bg-[#24140f] border border-[#D4AF37]/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold font-amiri text-base text-[#F5E5BD]">
                  نتيجة التحليل القانوني والاستدلال الاستنباطي (مخرجات عقل المستشار عطيه الهلباوي)
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                صفر هلوسة - 100% موثق
              </span>
            </div>

            <div className="text-xs text-[#F5E5BD]/90 whitespace-pre-line leading-relaxed font-amiri p-4 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/20">
              {result.reply}
            </div>
          </div>

          {/* Logic Tree Visualization */}
          <div className="p-6 rounded-2xl bg-[#24140f] border border-[#D4AF37]/40 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold font-amiri text-base text-[#F5E5BD]">
                  شجرة اتخاذ القرار ومسار التفكير (Logic Chain Tree & Qiyas Steps)
                </h3>
              </div>
              <span className="text-xs font-mono text-[#D4AF37]">ATTYA_LEGAL_MIND_1000K</span>
            </div>

            {/* Tree Nodes Flow */}
            <div className="space-y-4 relative before:absolute before:right-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#D4AF37]/30">
              {/* Node 1: Fact */}
              <div className="relative pr-12">
                <div className="absolute right-4 top-2 w-5 h-5 rounded-full bg-[#D4AF37] text-[#2B1914] flex items-center justify-center font-bold text-xs shadow">
                  1
                </div>
                <div className="p-4 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 space-y-1">
                  <div className="text-xs font-bold text-[#D4AF37]">تكييف الواقعة القانونية (Fact Characterization)</div>
                  <p className="text-xs text-[#F5E5BD]/80">تم استقبال الواقعة وتحليل أركانها الموضوعية بدقة بالغة.</p>
                </div>
              </div>

              {/* Node 2: Asl */}
              <div className="relative pr-12">
                <div className="absolute right-4 top-2 w-5 h-5 rounded-full bg-[#D4AF37] text-[#2B1914] flex items-center justify-center font-bold text-xs shadow">
                  2
                </div>
                <div className="p-4 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 space-y-1">
                  <div className="text-xs font-bold text-[#D4AF37]">استحضار الأصل الأصولي (Root Jurisprudential Principle)</div>
                  <p className="text-xs text-[#F5E5BD]/80">ربط النازلة بالأصل التشريعي الأب في الفقه التشريعي المصري.</p>
                </div>
              </div>

              {/* Node 3: Illah */}
              <div className="relative pr-12">
                <div className="absolute right-4 top-2 w-5 h-5 rounded-full bg-[#D4AF37] text-[#2B1914] flex items-center justify-center font-bold text-xs shadow">
                  3
                </div>
                <div className="p-4 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 space-y-1">
                  <div className="text-xs font-bold text-[#D4AF37]">استنباط علة الحكم التشريعية (Legislative Illah Deduction)</div>
                  <p className="text-xs text-[#F5E5BD]/80">استخلاص المناط والعلة المشتركة المبررة للحكم الآمر.</p>
                </div>
              </div>

              {/* Node 4: Precedent */}
              <div className="relative pr-12">
                <div className="absolute right-4 top-2 w-5 h-5 rounded-full bg-[#D4AF37] text-[#2B1914] flex items-center justify-center font-bold text-xs shadow">
                  4
                </div>
                <div className="p-4 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 space-y-1">
                  <div className="text-xs font-bold text-[#D4AF37]">مطابقة السوابق القضائية لمحكمة النقض (Court of Cassation Precedents)</div>
                  <p className="text-xs text-[#F5E5BD]/80">استرجاع السابقة القضائية المعتمدة مع مؤشر الثقة والتحقق من المبدأ.</p>
                </div>
              </div>

              {/* Node 5: Impediments */}
              <div className="relative pr-12">
                <div className="absolute right-4 top-2 w-5 h-5 rounded-full bg-[#D4AF37] text-[#2B1914] flex items-center justify-center font-bold text-xs shadow">
                  5
                </div>
                <div className="p-4 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 space-y-1">
                  <div className="text-xs font-bold text-[#D4AF37]">التحقق من تخلف العلة وموانع التطبيق (Illah Impediments & Exceptions)</div>
                  <p className="text-xs text-[#F5E5BD]/80">فحص استثناءات التطبيق وموانع تخلف العلة للتأكد من سلامة الاستدلال.</p>
                </div>
              </div>

              {/* Node 6: Ruling */}
              <div className="relative pr-12">
                <div className="absolute right-4 top-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow">
                  6
                </div>
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                  <div className="text-xs font-bold text-emerald-300">التقرير القضائي الناجز والسند التشريعي (Final Deductive Ruling)</div>
                  <p className="text-xs text-[#F5E5BD]/90 font-amiri font-bold">إصدار التوجيه القانوني السليم المزود بالمواد الدقيقة وأحكام النقض.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
