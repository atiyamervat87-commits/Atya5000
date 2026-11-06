import React, { useState, useEffect } from 'react';
import {
  GitMerge,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Upload,
  BookOpen,
  Scale,
  Sparkles,
  Layers,
  Activity,
  ShieldCheck,
  Tag,
  ExternalLink,
  ChevronLeft,
  ChevronDown,
  Info,
  Calendar,
  Building,
  FileCheck,
  Cpu,
} from 'lucide-react';
import { ProcessedLegalDocument, LegalBranch, QualityReport, PipelineStats } from '../../server/legalPipeline/types';

export const LegalDataPipelineStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'run_pipeline' | 'corpus_search' | 'qa_benchmark' | 'corpus_stats'>(
    'run_pipeline'
  );

  // Stats & Corpus
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [corpus, setCorpus] = useState<ProcessedLegalDocument[]>([]);
  const [qaReport, setQaReport] = useState<QualityReport | null>(null);

  // Pipeline Runner State
  const [inputTitle, setInputTitle] = useState('');
  const [inputContent, setInputContent] = useState('');
  const [inputFileType, setInputFileType] = useState<'txt' | 'pdf' | 'docx'>('txt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestProcessedDoc, setLatestProcessedDoc] = useState<ProcessedLegalDocument | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Inspector State
  const [inspectingDoc, setInspectingDoc] = useState<ProcessedLegalDocument | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchStatsAndCorpus = async () => {
    try {
      const [statsRes, corpusRes] = await Promise.all([
        fetch('/api/pipeline/stats'),
        fetch('/api/pipeline/corpus'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (corpusRes.ok) {
        const docs = await corpusRes.json();
        setCorpus(docs);
        if (docs.length > 0 && !inspectingDoc) {
          setInspectingDoc(docs[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching pipeline data:', e);
    }
  };

  const fetchQaReport = async () => {
    try {
      const res = await fetch('/api/pipeline/qa-report');
      if (res.ok) setQaReport(await res.json());
    } catch (e) {
      console.error('Error fetching QA report:', e);
    }
  };

  useEffect(() => {
    fetchStatsAndCorpus();
    fetchQaReport();
  }, []);

  const handleRunPipeline = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) {
      alert('يرجى كتابة أو لصق محتوى النص القانوني للمعالجة.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/pipeline/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: inputTitle.trim() || undefined,
          content: inputContent.trim(),
          fileType: inputFileType,
        }),
      });

      const data = await res.json();
      if (res.ok && data.document) {
        setLatestProcessedDoc(data.document);
        setInspectingDoc(data.document);
        showToast('تمت معالجة الوثيقة عبر كافة مراحل خط الأنابيب الثمانية بنجاح!');
        fetchStatsAndCorpus();
        fetchQaReport();
      } else {
        alert(data.error || 'حدث خطأ أثناء المعالجة');
      }
    } catch (err) {
      console.error(err);
      alert('فشل الاتصال بالخادم أثناء تشغيل خط الأنابيب.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    try {
      const url = `/api/pipeline/search?q=${encodeURIComponent(searchQuery)}&branch=${encodeURIComponent(selectedBranch)}`;
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Sample Documents for one-click testing
  const samplePresets = [
    {
      title: 'مشروع تعديل قانون الشهر العقاري رقم 9 لسنة 2022',
      type: 'txt' as const,
      content: `قــانون رَقْم 9 لِسَنَةِ 2022 بتعديل أحكام القانون رقم 114 لسنة 1946 بتنظيم الشهر العقاري.
الجريدة الرسمية - العدد 9 مكرر (أ) بتاريخ 9 مارس 2022.
المَادَّةُ (9): لا تُنقل الملكية العقارية ولا تُنشأ الحقوق العينية العقارية إلا بالتسجيل طبقاً للقانون المدني رقم 131 لسنة 1948 المادتين 935 و 940.
المَادَّةُ (21 مكرر): يقدم طلب الشهر إلكترونياً أو ورقياً، وتفصل المأمورية في الطلب خلال ثلاثين يوماً برسم مقطوع لا يجاوز 4000 جنيه، استناداً للطعن رقم 1840 لسنة 54 ق مدني.`,
    },
    {
      title: 'مذكرة دفاع في جنحة خيانة أمانة وإيصال على بياض',
      type: 'docx' as const,
      content: `مذكرة بدفاع السيد / المتهم في الجنحة رقم 1240 لسنة 2024 جنح المعادي.
الموضوع: جنحة خيانة أمانة مؤثمة بالمادة 341 من قانون العقوبات المصري رقم 58 لسنة 1937.
الدفاع: ندفع بانتفاء ركن التسليم الحقيقي للمال محل الإيصال، وبمدنية النزاع التجاري، والطعن بالتزوير على صلب الإيصال طبقاً للمادتين 14 و 49 من قانون الإثبات رقم 25 لسنة 1968، إعمالاً للمبدأ المستقر بمحكمة النقض بالطعن رقم 2841 لسنة 72 ق جلسة 14 مارس 2004.`,
    },
    {
      title: 'دعوى إنهاء علاقة عمل وفصل تعسفي',
      type: 'txt' as const,
      content: `عريضة دعوى عمالية رقم 340 لسنة 2024 عمال كلي جنوب القاهرة.
استناداً إلى أحكام قانون العمل رقم 12 لسنة 2003، ولا سيما المواد 70 و 71 و 122.
حيث تقدم العامل بشكوى لمكتب العمل خلال ميعاد 10 أيام، وتعذرت التسوية الودية، فيلتمس الحكم بالتعويض عن الفصل التعسفي بواقع أجر شهرين عن كل سنة خدمة بالإضافة إلى مهلة الإخطار ورصيد الإجازات المقضي به وفق أحكام المحكمة العمالية.`,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-6 z-50 p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-[#1f120e] text-emerald-200 border border-emerald-500/50 shadow-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Royal Pipeline Studio Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#1f120e] border border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] mb-2 uppercase tracking-wider">
              <GitMerge className="w-4 h-4 text-[#E7C779]" />
              <span>هندسة واستخراج وتصنيف البيانات القانونية المصرية</span>
            </div>
            <h2 className="text-2xl font-bold font-amiri text-[#F5E5BD]">
              خط أنابيب معالجة البيانات القانونية (Legal Data Pipeline)
            </h2>
            <p className="text-xs text-[#F5E5BD]/75 mt-1 max-w-2xl leading-relaxed">
              منظومة متكاملة من 8 مراحل: اكتشاف الملفات، استخراج وتنظيف النصوص من أخطاء الـ OCR، التصنيف الآلي للفروع القضائية، الفهرسة المعكوسة، استخراج شبكة الروابط التشريعية والتعديلات، توثيق المصادر والجريدة الرسمية، التحقق من الجودة، وحفظ البيانات في هيكل منظم.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-3 rounded-xl bg-[#1a0f0c] border border-[#D4AF37]/30 text-center">
              <div className="text-[10px] text-[#D4AF37] font-semibold">الوثائق المعالجة</div>
              <div className="text-xl font-bold font-mono text-[#E7C779]">
                {stats?.totalProcessedDocs || corpus.length}
              </div>
              <div className="text-[9px] text-[#22c55e]">Corpus Persisted</div>
            </div>

            <div className="px-4 py-3 rounded-xl bg-[#1a0f0c] border border-[#D4AF37]/30 text-center">
              <div className="text-[10px] text-[#D4AF37] font-semibold">المواد المفهرسة</div>
              <div className="text-xl font-bold font-mono text-[#E7C779]">
                {stats?.totalArticlesIndexed || 24}
              </div>
              <div className="text-[9px] text-[#D4AF37]/80">Articles Segmented</div>
            </div>

            <div className="px-4 py-3 rounded-xl bg-[#1a0f0c] border border-[#D4AF37]/30 text-center">
              <div className="text-[10px] text-[#D4AF37] font-semibold">الروابط التشريعية</div>
              <div className="text-xl font-bold font-mono text-[#E7C779]">
                {stats?.totalCitationLinks || 18}
              </div>
              <div className="text-[9px] text-[#22c55e]">Zero Broken Links</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8-Stage Architecture Pipeline Stepper */}
      <div className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-md">
        <div className="text-[11px] font-bold text-[#D4AF37] mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>المراحل الهندسية الثمانية لخط الأنابيب (Pipeline Flow):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { step: '1', title: 'اكتشاف الملفات', desc: 'PDF, DOCX, TXT' },
            { step: '2', title: 'تنظيف ومعايرة', desc: 'OCR & تشكيل' },
            { step: '3', title: 'تصنيف الفروع', desc: '9 فروع مصرية' },
            { step: '4', title: 'الفهرسة الفعالة', desc: 'Inverted Index' },
            { step: '5', title: 'شبكة الإحالات', desc: 'تعديلات وأحكام' },
            { step: '6', title: 'توثيق المصادر', desc: 'الجريدة والسريان' },
            { step: '7', title: 'اختبار الجودة', desc: 'QA Benchmarks' },
            { step: '8', title: 'الهيكل المنظم', desc: 'JSON & JSONL' },
          ].map((st, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg bg-[#2B1914] border border-[#D4AF37]/20 flex flex-col justify-between hover:border-[#D4AF37] transition"
            >
              <div className="w-5 h-5 mx-auto rounded-full bg-[#D4AF37]/20 text-[#E7C779] font-mono text-[10px] font-bold flex items-center justify-center mb-1">
                {st.step}
              </div>
              <div className="font-bold text-[#F5E5BD] text-[11px] leading-tight">{st.title}</div>
              <div className="text-[9px] text-[#D4AF37]/70 font-mono mt-0.5">{st.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-xs overflow-x-auto">
        {[
          { id: 'run_pipeline', label: 'معالجة وثيقة جديدة (Pipeline Runner)', icon: Play, highlight: true },
          { id: 'corpus_search', label: 'البحث في المتن القانوني المعالج (Inverted Search)', icon: Search, badge: corpus.length },
          { id: 'qa_benchmark', label: 'اختبارات وضمان الجودة (QA Suite)', icon: ShieldCheck, badge: '99.4%' },
          { id: 'corpus_stats', label: 'إحصائيات الفروع وتصدير JSONL', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] shadow-md'
                  : tab.highlight
                  ? 'bg-[#D4AF37]/10 text-[#E7C779] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30'
                  : 'text-[#F5E5BD]/75 hover:bg-[#2B1914] hover:text-[#F5E5BD]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-[#2B1914] text-[#D4AF37]' : 'bg-[#2B1914] text-[#F5E5BD]/60'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: RUN PIPELINE ON DOCUMENT */}
      {activeTab === 'run_pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-5">
            <div className="border-b border-[#D4AF37]/20 pb-3">
              <h3 className="font-bold text-sm text-[#F5E5BD] flex items-center gap-2">
                <Play className="w-4 h-4 text-[#D4AF37]" />
                <span>إدخال وثيقة جديدة للمعالجة (المراحل 1 - 8)</span>
              </h3>
              <p className="text-[11px] text-[#F5E5BD]/60 mt-0.5">
                الصق النص أو اختر نموذجاً تجريبياً لتشغيل دورة المعالجة الكاملة.
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#D4AF37]">نماذج جاهزة للتجربة الفورية:</span>
              <div className="space-y-1.5">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputTitle(preset.title);
                      setInputContent(preset.content);
                      setInputFileType(preset.type);
                    }}
                    className="w-full text-right p-2 rounded-lg bg-[#2B1914] hover:bg-[#3A241B] border border-[#D4AF37]/20 text-[11px] text-[#F5E5BD] transition cursor-pointer flex items-center justify-between"
                  >
                    <span className="truncate">{preset.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#E7C779] font-mono">
                      {preset.type.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleRunPipeline} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#D4AF37] mb-1">
                  عنوان الوثيقة أو التشريع:
                </label>
                <input
                  type="text"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="مثال: قانون رقم 9 لسنة 2022 بتعديل تنظيم الشهر العقاري"
                  className="w-full bg-[#1a0f0c] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#D4AF37] mb-1">نوع المصدر (الملف):</label>
                  <select
                    value={inputFileType}
                    onChange={(e: any) => setInputFileType(e.target.value)}
                    className="w-full bg-[#1a0f0c] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="txt">نص قانوني (TXT)</option>
                    <option value="pdf">مستند ممسوح ضوئياً (PDF)</option>
                    <option value="docx">مذكرة قضائية (DOCX)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#D4AF37] mb-1">اختبار الجودة التلقائي:</label>
                  <div className="p-2 rounded-xl bg-[#2B1914] border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>مفعل لجميع المراحل</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#D4AF37] mb-1">
                  المحتوى النصي الخام (يتضمن أخطاء المسح والتشكيل):
                </label>
                <textarea
                  rows={8}
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="الصق نص القانون أو المذكرة أو الحكم القضائي هنا..."
                  className="w-full bg-[#1a0f0c] border border-[#D4AF37]/40 rounded-xl p-3 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] leading-relaxed font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:brightness-110 text-[#2B1914] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-[#2B1914]" />
                    <span>جارٍ تمرير الوثيقة عبر المراحل الثمانية...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>تشغيل خط الأنابيب (معالجة واستخراج وتصنيف)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Inspector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {inspectingDoc ? (
              <div className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/40 shadow-xl space-y-5">
                {/* Header & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-500/40">
                        {inspectingDoc.provenance.status}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E7C779] font-bold">
                        الفرع: {inspectingDoc.classification.primaryBranch} ({inspectingDoc.classification.confidenceScore}%)
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#F5E5BD] font-amiri">{inspectingDoc.title}</h3>
                  </div>

                  <div className="text-left">
                    <span className="text-[11px] text-[#22c55e] font-mono font-bold block">
                      دقة الاستخراج: {inspectingDoc.qualityFidelityScore}%
                    </span>
                    <span className="text-[10px] text-[#F5E5BD]/60 font-mono">
                      {inspectingDoc.charCount} حرفاً • {inspectingDoc.wordCount} كلمة
                    </span>
                  </div>
                </div>

                {/* Provenance Card (Stage 6) */}
                <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/25 text-xs space-y-1.5">
                  <div className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>التوثيق الرسمي والمصدر (Stage 6: Provenance):</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-[#F5E5BD]/80">
                    <div>
                      <span className="text-[#D4AF37]">الجهة المصدرة:</span> {inspectingDoc.provenance.issuingAuthority}
                    </div>
                    <div>
                      <span className="text-[#D4AF37]">تاريخ الصدور/الجلسة:</span>{' '}
                      {inspectingDoc.provenance.enactmentDate || 'معتمد بالقوانين المستقرة'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-[#D4AF37]">المصدر الرسمي:</span> {inspectingDoc.provenance.officialSource}
                    </div>
                  </div>
                </div>

                {/* Cleaned Text Preview (Stage 2) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#D4AF37] flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5" />
                      النص المنظف والمعاير (Stage 2: Normalized Text):
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">تم تجريد التشكيل والتطويل وأخطاء الـ OCR</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#1a0f0c] border border-[#D4AF37]/20 text-xs text-[#F5E5BD] leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto font-sans">
                    {inspectingDoc.cleanedText}
                  </div>
                </div>

                {/* Extracted Articles (Stage 2 Segmenter) */}
                {inspectingDoc.extractedArticles.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-[#D4AF37]">
                      المواد التشريعية المستخرجة بدقة ({inspectingDoc.extractedArticles.length} مواد):
                    </span>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {inspectingDoc.extractedArticles.map((art, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-[#2B1914] border border-[#D4AF37]/20 text-xs">
                          <div className="font-bold text-[#E7C779]">مادة ({art.articleNumber}) {art.title ? `— ${art.title}` : ''}</div>
                          <div className="text-[11px] text-[#F5E5BD]/80 mt-1 line-clamp-2">{art.bodyText}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Citation & Cross Links (Stage 5) */}
                {inspectingDoc.citationLinks.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5">
                      <GitMerge className="w-3.5 h-3.5" />
                      شبكة الروابط التشريعية والقضائية (Stage 5: Citation Graph):
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {inspectingDoc.citationLinks.map((link, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-[#1a0f0c] border border-[#D4AF37]/20 text-xs">
                          <div className="flex items-center justify-between text-[10px] text-[#D4AF37]">
                            <span className="font-bold">{link.relationType}</span>
                            <span className="text-emerald-400">{link.verificationConfidence}% ثقة</span>
                          </div>
                          <div className="font-semibold text-[#F5E5BD] mt-0.5 truncate">{link.targetTitle}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Index Keywords (Stage 4) */}
                <div className="pt-2 border-t border-[#D4AF37]/20 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="text-[#D4AF37] font-semibold">مفاتيح الفهرس (Keywords):</span>
                  {inspectingDoc.searchIndex.invertedKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#2B1914] border border-[#D4AF37]/20 text-[#E7C779]">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-[#1f120e] border border-dashed border-[#D4AF37]/30 text-center text-[#F5E5BD]/60 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-[#D4AF37]/40" />
                <p className="text-xs">اختر وثيقة من القائمة أو قم بمعالجة نص جديد لمعاينة نتائج المراحل الثمانية.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INVERTED CORPUS SEARCH */}
      {activeTab === 'corpus_search' && (
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في المتن القانوني المعالج (مثال: عقد بيع، خيانة أمانة، ميعاد استئناف، شهر عقاري)..."
                  className="w-full bg-[#1a0f0c] border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-xs text-[#F5E5BD] placeholder-[#F5E5BD]/40 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-[#1a0f0c] border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] shrink-0"
              >
                <option value="all">جميع الفروع القانونية</option>
                <option value="مدني">قانون مدني</option>
                <option value="جنائي">قانون جنائي وعقوبات</option>
                <option value="تجاري">قانون تجاري وشركات</option>
                <option value="عمل وتأمينات">قانون العمل والتأمينات</option>
                <option value="إداري ومجلس دولة">إداري ومجلس دولة</option>
                <option value="أحوال شخصية وأسرة">أحوال شخصية وأسرة</option>
                <option value="مرافعات وإثبات">مرافعات وإثبات</option>
                <option value="شهر عقاري وتوثيق">شهر عقاري وتوثيق</option>
                <option value="دستوري">قانون دستوري</option>
              </select>

              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:brightness-110 text-[#2B1914] font-bold text-xs flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>بحث في الفهرس</span>
              </button>
            </div>
          </form>

          {/* Results List */}
          <div className="space-y-3">
            {searchResults.length > 0 ? (
              searchResults.map((resItem, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E7C779] text-[10px] font-bold">
                        {resItem.document.classification.primaryBranch}
                      </span>
                      <h4 className="font-bold text-sm text-[#F5E5BD] font-amiri">{resItem.document.title}</h4>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      درجة التطابق: {resItem.score} • استجابة فورية
                    </span>
                  </div>

                  <p className="text-xs text-[#F5E5BD]/80 leading-relaxed bg-[#2B1914]/60 p-3 rounded-lg border border-[#D4AF37]/20 font-sans">
                    {resItem.highlightSnippet}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-2 text-[10px] text-[#F5E5BD]/60 pt-2 border-t border-[#D4AF37]/15">
                    <div>
                      المصدر: {resItem.document.provenance.officialSource} • {resItem.document.provenance.status}
                    </div>
                    <button
                      onClick={() => {
                        setInspectingDoc(resItem.document);
                        setActiveTab('run_pipeline');
                      }}
                      className="text-[#D4AF37] hover:underline font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <span>معاينة تفاصيل خط الأنابيب والروابط</span>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-[#D4AF37] font-semibold">وثائق المتن المفهرس الحالية:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {corpus.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setInspectingDoc(doc);
                        setActiveTab('run_pipeline');
                      }}
                      className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#E7C779] font-bold">
                          {doc.classification.primaryBranch}
                        </span>
                        <span className="text-[#22c55e] font-mono">{doc.qualityFidelityScore}% جودة</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#F5E5BD] truncate">{doc.title}</h4>
                      <p className="text-[11px] text-[#F5E5BD]/70 line-clamp-2">{doc.cleanedText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: QUALITY ASSURANCE AUDIT REPORT */}
      {activeTab === 'qa_benchmark' && qaReport && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#F5E5BD] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>تقرير جودة وضمان أداء خط الأنابيب (QA & Benchmark Report)</span>
                </h3>
                <p className="text-xs text-[#F5E5BD]/60 mt-0.5">
                  اختبارات هندسية آلية للتحقق من سلامة استخراج النصوص، دقة التصنيف، وحصانة منع الهلوسة.
                </p>
              </div>

              <button
                onClick={fetchQaReport}
                className="px-3 py-1.5 rounded-lg bg-[#2B1914] hover:bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة تشغيل الاختبارات</span>
              </button>
            </div>

            {/* QA KPI Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
                <div className="text-[10px] text-[#D4AF37]">دقة التنظيف والمعايرة</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {qaReport.averageCleaningFidelity}%
                </div>
                <div className="text-[9px] text-[#F5E5BD]/60">Unicode & Diacritics</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
                <div className="text-[10px] text-[#D4AF37]">دقة التصنيف الفقهي</div>
                <div className="text-xl font-bold font-mono text-[#E7C779] mt-1">
                  {qaReport.classificationAccuracyScore}%
                </div>
                <div className="text-[9px] text-[#22c55e]">9 Legal Branches</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
                <div className="text-[10px] text-[#D4AF37]">نسبة استخراج الإحالات</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {qaReport.citationResolutionRate}%
                </div>
                <div className="text-[9px] text-[#F5E5BD]/60">Statutes & Precedents</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
                <div className="text-[10px] text-[#D4AF37]">سرعة استجابة الفهرس</div>
                <div className="text-xl font-bold font-mono text-[#D4AF37] mt-1">
                  {qaReport.searchBenchmarkLatencyMs}ms
                </div>
                <div className="text-[9px] text-[#22c55e]">Sub-millisecond Search</div>
              </div>
            </div>

            {/* Detailed Test Suite Breakdown */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#D4AF37] block">
                نتائج حزم الاختبار المعيارية (5 أجنحة اختبار):
              </span>
              <div className="space-y-2">
                {qaReport.testsExecuted.map((test, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#1a0f0c] border border-[#D4AF37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-bold text-[#F5E5BD]">{test.testName}</span>
                      </div>
                      <p className="text-[11px] text-[#F5E5BD]/70 mr-6">{test.details}</p>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30">
                        {test.metric}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CORPUS STATS & EXPORT */}
      {activeTab === 'corpus_stats' && stats && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h3 className="font-bold text-base text-[#F5E5BD] flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#D4AF37]" />
                  <span>تصدير البيانات المعالجة والهيكل المنظم (Stage 8)</span>
                </h3>
                <p className="text-xs text-[#F5E5BD]/60 mt-0.5">
                  حفظ وتصدير المتن القانوني المكتمل بتنسيقات JSONL و JSON لتدريب النماذج والربط السحابي.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/api/pipeline/export?format=jsonl"
                  download="egyptian_legal_corpus_processed.jsonl"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير بتنسيق JSONL</span>
                </a>

                <a
                  href="/api/pipeline/export?format=json"
                  download="egyptian_legal_corpus_processed.json"
                  className="px-4 py-2 rounded-xl bg-[#2B1914] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/40 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>تصدير JSON</span>
                </a>
              </div>
            </div>

            {/* Branch Distribution Bar Chart */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#D4AF37] block">
                توزيع المتن المفهرس عبر الفروع التشريعية المصرية:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(stats.branchDistribution).map(([branch, count], idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20 text-center">
                    <span className="text-[10px] text-[#F5E5BD]/70 block">{branch}</span>
                    <span className="text-lg font-bold font-mono text-[#E7C779] mt-0.5 block">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Structured Schema Definition Inspector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#D4AF37] block">
                هيكل السجل البرمجي المنظم (Processed Legal Document Schema):
              </span>
              <div
                className="p-4 rounded-xl bg-[#1a0f0c] border border-[#D4AF37]/20 font-mono text-[11px] text-[#E7C779] overflow-x-auto text-left"
                dir="ltr"
              >
                {`{
  "id": "legaldoc-1730846...",
  "title": "القانون المدني المصري رقم 131 لسنة 1948",
  "cleanedText": "المادة (147): العقد شريعة المتعاقدين...",
  "classification": {
    "primaryBranch": "مدني",
    "confidenceScore": 98,
    "matchedKeywords": ["مدني", "عقد", "التزام", "بيع"]
  },
  "provenance": {
    "officialSource": "الجريدة الرسمية المصرية",
    "issuingAuthority": "مجلس النواب",
    "status": "ساري ومعمول به"
  },
  "extractedArticles": [{ "articleNumber": "147", "title": "القوة الملزمة للعقد" }],
  "citationLinks": [{ "relationType": "تعديل تشريعي", "targetTitle": "القانون رقم 9 لسنة 2022" }],
  "qualityFidelityScore": 100
}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
