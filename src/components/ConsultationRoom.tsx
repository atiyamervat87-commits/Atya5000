import React, { useState } from 'react';
import { Scale, Sparkles, Send, Copy, Check, AlertTriangle, FileText, ArrowLeft, Clock, ShieldAlert, BookOpen, Layers } from 'lucide-react';

const PRESET_CASES = [
  {
    title: 'نزاع عقد بيع شقة وتأخر في الاستلام مع شرط جزائي',
    branch: 'civil',
    goal: 'إلزام البائع بالتسليم وسداد غرامة التأخير التعاقدية',
    facts: `اشترى موكلي شقة سكنية بالقاهرة الجديدة بموجب عقد بيع ابتدائي مؤرخ 2022/1/10 بقيمة إجمالية 2,000,000 جنيه مصري، سدد منها 1,500,000 جنيه نقداً بموجب إيصالات، والباقي مستحق عند الاستلام.
نص البند الرابع بالعقد على التزام الشركة البائعة بالتسليم في موعد غايته 2023/6/30، وبغرامة تأخير قدرها 5000 جنيه عن كل شهر تأخير.
حتى الآن لم يتم تسليم الشقة رغم توجيه إنذار رسمي على يد محضر في 2023/10/1، وتتذرع الشركة بارتفاع أسعار مواد البناء وتطالب بزيادة الثمن 30% وإلا سيتم فسخ العقد.`,
    question: 'ما هو الموقف القانوني السليم للمشتري؟ وهل يحق للشركة البائعة تعديل الثمن أو الامتناع عن التسليم؟ وما هي الدفوع والطلبات الواجب صياغتها في الدعوى؟',
  },
  {
    title: 'جنحة خيانة أمانة (إيصال أمانة على بياض بين شركاء)',
    branch: 'criminal',
    goal: 'الدفع بمدنية النزاع وبطلان التسليم وانتفاء القصد الجنائي',
    facts: `أقام الشاكي جنحة مباشرة ضد موكلي متهماً إياه بتبديد مبلغ 750,000 جنيه بموجب إيصال أمانة منسوب توقيعه للمتهم.
الواقع أن الطرفين كانا شريكين في محل تجاري بموجب عقد شركة تضامن مؤرخ 2021/3/1، وتوقيع الإيصال كان ضماناً لحسابات الشركة على بياض ولم يتسلم المتهم أي مبالغ نقدية على سبيل الوديعة أو الأمانة المنصوص عليها بالمادة 341 عقوبات، وتوجد مراسلات واتساب وحسابات بنكية تثبت تصفية الشركة ووجود حساب جارٍ بينهما.`,
    question: 'كيف نتصرف أمام محكمة الجنح؟ وما هي الدفوع الشكلية والموضوعية، وطلبات الإحالة للطب الشرعي أو التحقيق لسماع الشهود؟',
  },
  {
    title: 'فصل تعسفي لعامل ومطالبة بمستحقات وإنهاء خدمة',
    branch: 'labor',
    goal: 'إثبات الفصل التعسفي والمطالبة بالتعويض ومهلة الإخطار ورصيد الإجازات',
    facts: `عمل موكلي مديراً للمبيعات بإحدى الشركات الخاصة بعقد غير محدد المدة منذ 7 سنوات براتب شهري 18,000 جنيه.
بتاريخ 2024/2/1 فوجئ بمنعه من دخول مقر العمل وتغيير بصمة الحضور دون إجراء أي تحقيق معه ودون توجيه إنذارات بالغياب، وعند مطالبته بحقوقه أبلغوه بإنهاء خدمته بداعي إعادة هيكلة الشركة دون الرجوع للمحكمة العمالية المختصة.`,
    question: 'ما هي الإجراءات القانونية والمواعيد المقررة لتقديم الشكوى لمكتب العمل ورفع الدعوى العمالية؟ وما هي عناصر التعويض الجابر للضرر طبقاً للمادتين 69 و71 من قانون العمل 12 لسنة 2003؟',
  },
];

export const ConsultationRoom: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [facts, setFacts] = useState('');
  const [question, setQuestion] = useState('');
  const [desiredGoal, setDesiredGoal] = useState('');
  const [branch, setBranch] = useState('civil');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    analysis: string;
    source: string;
    retrievedArticles: any[];
    retrievedPrecedents: any[];
    confidence: number;
    status: string;
  } | null>(null);

  const handleApplyPreset = (index: number) => {
    setSelectedPreset(index);
    const p = PRESET_CASES[index];
    setFacts(p.facts);
    setQuestion(p.question);
    setDesiredGoal(p.goal);
    setBranch(p.branch);
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question && !facts) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/legal/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          facts,
          desiredGoal,
          branch,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'فشلت معالجة الاستشارة');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.analysis) return;
    navigator.clipboard.writeText(result.analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Introduction banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>محرك الاستدلال والمحاكمة المعرفية القضائية</span>
          </div>
          <h2 className="text-2xl font-bold font-amiri text-slate-100">
            غرفة الاستشارات والتحليل القضائي متعدد المراحل
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            يقوم «عقل المستشار عطية الهلباوي» بفرز الوقائع زمناً وأدلة، وفصل الادعاءات عن الحقائق الثابتة، والبحث في القوانين المصرية وأحكام محكمة النقض، وترتيب الدفوع الشكلية والموضوعية.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-300/80 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>مطابق للمادة (108 مرافعات) والترتيب الإجرائي</span>
        </div>
      </div>

      {/* Preset real-world cases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>نماذج قضايا واقعية جاهزة للتحليل الفوري:</span>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_CASES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(idx)}
              className={`p-3.5 rounded-xl text-right transition-all border text-xs space-y-1.5 cursor-pointer ${
                selectedPreset === idx
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="font-bold text-amber-300 font-amiri text-sm">{preset.title}</div>
              <div className="text-[11px] text-slate-400 line-clamp-2">{preset.facts}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Consultation Form */}
      <form onSubmit={handleConsult} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              الفرع القانوني للنزاع
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
            >
              <option value="civil">القانون المدني المصري والعقود</option>
              <option value="procedural">قانون المرافعات والإثبات والمواعيد</option>
              <option value="criminal">القانون الجنائي والإجراءات الجنائية</option>
              <option value="labor">قانون العمل المصري والتأمينات</option>
              <option value="commercial">القانون التجاري والشركات والأوراق المالية</option>
              <option value="administrative">مجلس الدولة والقضاء الإداري</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              الهدف المرجو من الاستشارة أو المسألة القضائية
            </label>
            <input
              type="text"
              value={desiredGoal}
              onChange={(e) => setDesiredGoal(e.target.value)}
              placeholder="مثال: إثبات بطلان التزام، أو حساب تعويض، أو استخراج دفوع شكلية..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span>سرد الوقائع المادية وتواريخها (Chronological Facts):</span>
            <span className="text-[11px] text-slate-500">كلما كانت التواريخ والمبالغ والأدلة دقيقة كلما كان التحليل أكثر إحكاماً</span>
          </label>
          <textarea
            rows={4}
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            placeholder="اكتب وقائع القضية بالتفصيل: التواريخ، العقود، المبالغ المسددة، الإنذارات، الإجراءات التي تمت..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition leading-relaxed font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            المسألة القانونية أو السؤال المطلوب إجابته:
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="مثال: هل يسقط الحق بالتقادم؟ ما هي الدفوع الجوهرية الواجب إبداؤها في الجلسة الأولى؟"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>نظام التدقيق ضد الهلوسة وفحص سريان المواد القانونية نشط</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!facts && !question)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-amber-950/40 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>جاري البحث والاستدلال القضائي...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>إجراء المحاكمة والاستشارة القضائية</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis Results Display */}
      {result && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-6 shadow-2xl">
          {/* Header of analysis */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-amiri text-amber-200">
                  تقرير الرأي والاستدلال القضائي
                </h3>
                <span className="text-xs text-slate-400">
                  المصدر: {result.source} • معامل الثقة المنهجي: {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ التقرير'}</span>
              </button>
            </div>
          </div>

          {/* Retrieved Grounding Context Articles */}
          {result.retrievedArticles && result.retrievedArticles.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>النصوص التشريعية المصرية المرجعية المسترجعة والمحققة:</span>
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {result.retrievedArticles.map((art: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>مادة ({art.articleNumber}) - {art.lawName}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                        {art.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">{art.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Judicial Analysis Content */}
          <div className="p-6 rounded-xl bg-slate-950/50 border border-slate-800/80 font-sans text-slate-200 leading-relaxed text-sm whitespace-pre-wrap selection:bg-amber-600/30">
            {result.analysis}
          </div>

          {/* Professional legal disclaimer as required by decree */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/80 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              تنبيه مهني طبقاً للوثيقة التأسيسية: هذا الاستدلال القضائي محكم ومبني على نصوص القانون المصري وأحكام محكمة النقض بهدف مساعدة السادة القضاة والمحامين والباحثين، ولا يغني عن المراجعة الإجرائية والفحص الميداني لملفات القضايا لدى المحامي المختص.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
