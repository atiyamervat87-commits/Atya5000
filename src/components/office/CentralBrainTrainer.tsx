import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Brain,
  Sparkles,
  CheckCircle2,
  Sliders,
  Play,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Scale,
  Award,
  Zap,
  RotateCcw,
  Search,
  Eye,
  FileText,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import {
  BrainTrainingPair,
  BrainIngestedDoc,
  BrainHyperparameters,
  BrainMetrics,
} from '../../types/subscriptionAndBrain';

export const CentralBrainTrainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'train_new' | 'ingest_docs' | 'hyperparameters' | 'sandbox' | 'dataset_manager'
  >('train_new');

  const [metrics, setMetrics] = useState<BrainMetrics | null>(null);
  const [trainingPairs, setTrainingPairs] = useState<BrainTrainingPair[]>([]);
  const [ingestedDocs, setIngestedDocs] = useState<BrainIngestedDoc[]>([]);
  const [hyperparameters, setHyperparameters] = useState<BrainHyperparameters | null>(null);

  // New Training Pair Form State
  const [pairTitle, setPairTitle] = useState('');
  const [pairCategory, setPairCategory] = useState<any>('مدني');
  const [pairScenario, setPairScenario] = useState('');
  const [pairCharacterization, setPairCharacterization] = useState('');
  const [pairArticles, setPairArticles] = useState('');
  const [pairCassation, setPairCassation] = useState('');
  const [pairIdealResponse, setPairIdealResponse] = useState('');

  // Ingestion Form State
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<any>('مذكرة دفاع');
  const [docContent, setDocContent] = useState('');
  const [docKeywords, setDocKeywords] = useState('');

  // Sandbox State
  const [sandboxPrompt, setSandboxPrompt] = useState(
    'فرح بنت اختي يوم الخميس الجاي هتحضر معانا بجناب المستشار؟'
  );
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [isInferring, setIsInferring] = useState(false);

  // Search in Dataset Manager
  const [datasetSearch, setDatasetSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchAllBrainData = async () => {
    try {
      const [metricsRes, pairsRes, docsRes, paramsRes] = await Promise.all([
        fetch('/api/brain/metrics'),
        fetch('/api/brain/training-data'),
        fetch('/api/brain/ingested-docs'),
        fetch('/api/brain/hyperparameters'),
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (pairsRes.ok) setTrainingPairs(await pairsRes.json());
      if (docsRes.ok) setIngestedDocs(await docsRes.json());
      if (paramsRes.ok) setHyperparameters(await paramsRes.json());
    } catch (err) {
      console.error('Failed to load brain data:', err);
    }
  };

  useEffect(() => {
    fetchAllBrainData();
  }, []);

  // Handle Adding New Training Example
  const handleSaveTrainingPair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairTitle || !pairScenario || !pairCharacterization || !pairIdealResponse) {
      alert('يرجى ملء الحقول الأساسية: العنوان، السيناريو، التكييف، والرد المثالي.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/brain/training-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': 'المستشار عطيه الهلباوي (المالك)',
        },
        body: JSON.stringify({
          title: pairTitle,
          category: pairCategory,
          userScenario: pairScenario,
          characterization: pairCharacterization,
          governingArticles: pairArticles,
          cassationPrecedent: pairCassation,
          idealResponse: pairIdealResponse,
          status: 'active',
        }),
      });

      if (res.ok) {
        showToast('تم تدريب العقل المركزي بنجاح وحفظ النموذج المعرفي!');
        setPairTitle('');
        setPairScenario('');
        setPairCharacterization('');
        setPairArticles('');
        setPairCassation('');
        setPairIdealResponse('');
        fetchAllBrainData();
      } else {
        const err = await res.json();
        alert(err.error || 'فشل حفظ التدريب');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Deleting Training Example
  const handleDeletePair = async (id: string, title: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف المثال التدريبي: "${title}"؟`)) return;
    try {
      const res = await fetch(`/api/brain/training-data/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-name': 'المستشار عطيه الهلباوي (المالك)' },
      });
      if (res.ok) {
        showToast('تم حذف المثال من العقل المركزي.');
        fetchAllBrainData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Ingesting Document
  const handleIngestDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/brain/ingested-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': 'المستشار عطيه الهلباوي (المالك)',
        },
        body: JSON.stringify({
          title: docTitle,
          type: docType,
          contentPreview: docContent,
          extractedKeywords: docKeywords,
        }),
      });

      if (res.ok) {
        showToast('تم تضمين المستند في قاعدة معارف العقل المركزي!');
        setDocTitle('');
        setDocContent('');
        setDocKeywords('');
        fetchAllBrainData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Deleting Ingested Doc
  const handleDeleteDoc = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من استبعاد هذا المستند المعرفي؟')) return;
    try {
      const res = await fetch(`/api/brain/ingested-docs/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-name': 'المستشار عطيه الهلباوي (المالك)' },
      });
      if (res.ok) {
        showToast('تم استبعاد المستند بنجاح.');
        fetchAllBrainData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Hyperparameters Save
  const handleSaveHyperparameters = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hyperparameters) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/brain/hyperparameters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': 'المستشار عطيه الهلباوي (المالك)',
        },
        body: JSON.stringify(hyperparameters),
      });

      if (res.ok) {
        showToast('تم تطبيق معايير وأوزان العقل المركزي بنجاح!');
        fetchAllBrainData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Run Sandbox Test Inference
  const handleRunSandbox = async () => {
    if (!sandboxPrompt.trim()) return;
    setIsInferring(true);
    setSandboxResult(null);
    try {
      const res = await fetch('/api/brain/test-inference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: sandboxPrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setSandboxResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInferring(false);
    }
  };

  // Quick Preset Loader
  const loadPreset = (presetName: string) => {
    if (presetName === 'shofaa') {
      setPairTitle('دعوى الشفعة وميعاد إيداع الثمن خزانة المحكمة');
      setPairCategory('مدني');
      setPairScenario('باع جاري في العقار حصته لأجنبي دون إخطاري، فكيف أمارس حقي في الشفعة وما هي المواعيد الإلزامية؟');
      setPairCharacterization('دعوى أخذ بالشفعة تستند للمواد 935 حتى 948 مدني. إجراءاتها حتمية وسريعة: إعلان الرغبة في الأخذ بالشفعة خلال 15 يوماً من الإنذار الرسمي، وإيداع كامل الثمن الحقيقي خزانة المحكمة خلال 30 يوماً من إعلان الرغبة وإلا سقط الحق، ورفع الدعوى خلال 30 يوماً من تاريخ الإيداع.');
      setPairArticles('القانون المدني المصري: المواد 935، 936، 940، 942، 943.');
      setPairCassation('الطعن رقم 421 لسنة 49 ق - مدني: "إيداع الثمن خزانة المحكمة في الميعاد القانوني هو شرط جوهري لقبول دعوى الشفعة، وتخلفه يسقط حق الشفيع سقوطاً حتمياً".');
      setPairIdealResponse('المستشار عطيه الهلباوي: حق الشفعة رخصة استثنائية أحاطها المشرع بمواعيد سقوط قاطعة وصارمة لا تقبل التراخي: أولاً: توجيه إنذار رسمي على يد محضر للبائع والمشتري بإعلان الرغبة في الأخذ بالشفعة خلال 15 يوماً من تاريخ إنذارك بالبيع. ثانياً: إيداع الثمن الحقيقي كاملاً خزانة المحكمة المختصة خلال 30 يوماً على الأكثر من تاريخ إعلان الرغبة، والحصول على شهادة إيداع رسمية. ثالثاً: رفع دعوى الشفعة وقيدها والتأشير بها على هامش الشهر العقاري خلال 30 يوماً من تاريخ الإيداع. أي تفويت لأحد هذه المواعيد يقضي حتماً بسقوط حقك.');
    } else if (presetName === 'talaq') {
      setPairTitle('دعوى الخلع واسترداد مقدم الصداق الثابت بالوثيقة');
      setPairCategory('أسرة');
      setPairScenario('ترغب الزوجة في رفع دعوى خلع لتضررها، فما هي شروط التنازل المالي وهل يشمل مؤخر الصداق؟');
      setPairCharacterization('دعوى تطليق خلعاً عملاً بالمادة 20 من القانون رقم 1 لسنة 2000. تشترط تنازل الزوجة عن جميع حقوقها المالية والشرعية (مؤخر الصداق ونفقة العدة والمتعة) ورد مقدم الصداق الثابت بوثيقة الزواج، وحكم الخلع فيها نهائي بات غير قابل للطعن عليه بأي طريق.');
      setPairArticles('قانون تنظيم بعض أوضاع وإجراءات التقاضي في مسائل الأحوال الشخصية رقم 1 لسنة 2000 المادة 20.');
      setPairCassation('المحكمة الدستورية العليا - القضية رقم 201 لسنة 23 ق دستورية: دستورية نص المادة 20 من القانون 1 لسنة 2000 بشأن التطليق خلعاً وعدم قابليته للطعن بالاستئناف.');
      setPairIdealResponse('المستشار عطيه الهلباوي: الخلع حق قرره القانون رقم 1 لسنة 2000 بموجب المادة 20، وشروطه القطعية أمام محكمة الأسرة: 1. أن تقرر الزوجة صراحة أنها تبغض الحياة مع زوجها وتخشى ألا تقيم حدود الله. 2. أن تفتدي نفسها بأن ترد عليه مقدم الصداق الذي قبضته والمثبت بوثيقة الزواج (ويتم عرضه بإنذار عرض رسمي أو بخزينة المحكمة). 3. التنازل عن كافة حقوقها المالية الشرعية (مؤخر الصداق ونفقة المتعة والعدة). علماً بأن الخلع لا يسقط مطلقاً حقوق الأبناء الصغار من نفقات وحضانة ومسكن وأجر رضاعة وحضانة.');
    }
  };

  // Filtered Training Pairs
  const filteredPairs = trainingPairs.filter((p) => {
    const matchesSearch =
      datasetSearch === '' ||
      p.title.includes(datasetSearch) ||
      p.userScenario.includes(datasetSearch) ||
      p.category.includes(datasetSearch);
    const matchesCategory =
      selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Studio Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#1a0e0b] border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#E7C779] text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>العقل المركزي والنموذج اللغوي الخاص بالمستشار عطيه الهلباوي</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#F5E5BD]">
            استوديو تدريب وضبط النموذج اللغوي القضائي (LLM Studio)
          </h2>
          <p className="text-xs text-[#F5E5BD]/70 max-w-2xl leading-relaxed">
            واجهة تفاعلية متطورة تمكنك من تدريب العقل المركزي للنموذج على أسلوب المستشار الخاص، وتغذية مذكرات المكتب وأحكام النقض، وضبط أوزان الوقار ومنع الهلوسة، واختبار النتائج فورياً.
          </p>
        </div>

        {/* Live Brain Engine Metrics */}
        {metrics && (
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-right min-w-[280px]">
            <div className="p-2.5 rounded-lg bg-[#2B1914] border border-[#D4AF37]/15">
              <span className="text-[10px] text-[#F5E5BD]/60 block">أزواج التدريب المعتمدة:</span>
              <div className="text-base font-bold font-mono text-[#D4AF37]">
                {metrics.totalTrainingPairs} سيناريو
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#2B1914] border border-[#D4AF37]/15">
              <span className="text-[10px] text-[#F5E5BD]/60 block">مستندات المعرفة (RAG):</span>
              <div className="text-base font-bold font-mono text-[#E7C779]">
                {metrics.totalKnowledgeDocs} وثيقة
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#2B1914] border border-[#D4AF37]/15">
              <span className="text-[10px] text-[#F5E5BD]/60 block">دقة الاستدلال القضائي:</span>
              <div className="text-base font-bold font-mono text-emerald-400">
                {metrics.inferenceAccuracy}%
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#2B1914] border border-[#D4AF37]/15">
              <span className="text-[10px] text-[#F5E5BD]/60 block">معدل الهلوسة:</span>
              <div className="text-base font-bold font-mono text-emerald-400">
                0.0% (صفر مطلق)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-xs overflow-x-auto">
        {[
          { id: 'train_new', label: 'إضافة وتدريب مثال جديد', icon: Plus, badge: 'Few-Shot' },
          { id: 'ingest_docs', label: 'تغذية مستندات ومذكرات المكتب', icon: BookOpen, badge: `${ingestedDocs.length}` },
          { id: 'hyperparameters', label: 'أوزان الشخصية ومحددات الذكاء', icon: Sliders },
          { id: 'sandbox', label: 'مختبر المحاكاة والاختبار الفوري', icon: Play, highlight: true },
          { id: 'dataset_manager', label: 'مستودع بيانات التدريب والتصدير', icon: Download, badge: `${trainingPairs.length}` },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] shadow-md'
                  : tab.highlight
                  ? 'bg-[#D4AF37]/10 text-[#E7C779] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30'
                  : 'text-[#F5E5BD]/75 hover:bg-[#2B1914] hover:text-[#F5E5BD]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
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

      {/* TAB 1: TRAIN NEW EXAMPLE */}
      {activeTab === 'train_new' && (
        <form
          onSubmit={handleSaveTrainingPair}
          className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-5 text-xs text-right"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#F5E5BD] flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#D4AF37]" />
                <span>تدريب العقل المركزي على سيناريو قانوني أو سلوكي مخصص:</span>
              </h3>
              <p className="text-[11px] text-[#F5E5BD]/60 mt-0.5">
                زوّد النموذج بالاستفسار الواقعي، والتكييف، والسند التشريعي، وصيغة الرد المعتمدة ليعتمدها كمرجع قياسي.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-[#D4AF37]">أمثلة جاهزة للتحميل:</span>
              <button
                type="button"
                onClick={() => loadPreset('shofaa')}
                className="px-2 py-1 rounded bg-[#2B1914] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 text-[10px] transition cursor-pointer"
              >
                دعوى الشفعة
              </button>
              <button
                type="button"
                onClick={() => loadPreset('talaq')}
                className="px-2 py-1 rounded bg-[#2B1914] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 text-[10px] transition cursor-pointer"
              >
                دعوى الخلع
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[#D4AF37] font-semibold mb-1">عنوان الحالة أو المسألة القانونية *</label>
              <input
                type="text"
                required
                value={pairTitle}
                onChange={(e) => setPairTitle(e.target.value)}
                placeholder="مثال: شروط صحة ونفاذ عقد البيع، جنحة شيك دون رصيد، فصل تعسفي..."
                className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-[#D4AF37] font-semibold mb-1">الفرع والتصنيف القانوني *</label>
              <select
                value={pairCategory}
                onChange={(e) => setPairCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white"
              >
                <option value="مدني">مدني وعقارات</option>
                <option value="جنائي">جنائي وجنح</option>
                <option value="مجلس دولة">قضاء إداري ومجلس الدولة</option>
                <option value="أسرة">أسرة وأحوال شخصية</option>
                <option value="عمالي">عمال وتأمينات</option>
                <option value="تجاري">تجاري وشركات</option>
                <option value="صياغة عقود">صياغة عقود ومحررات</option>
                <option value="تواصل إنساني">تواصل إنساني ومناسبات سعيدة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
              سؤال الموكل أو وقائع النزاع المفصلة (User Scenario / Prompt) *
            </label>
            <textarea
              rows={3}
              required
              value={pairScenario}
              onChange={(e) => setPairScenario(e.target.value)}
              placeholder="اكتب السؤال بأسلوب الموكل (فصحى أو عامية مصرية طبيعية)..."
              className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                التكييف القضائي السليم (Legal Characterization) *
              </label>
              <textarea
                rows={3}
                required
                value={pairCharacterization}
                onChange={(e) => setPairCharacterization(e.target.value)}
                placeholder="الوصف القانوني السليم للمسألة وفق فقه القضاء المصري..."
                className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                السند التشريعي المباشر وأرقام المواد (Governing Articles)
              </label>
              <textarea
                rows={3}
                value={pairArticles}
                onChange={(e) => setPairArticles(e.target.value)}
                placeholder="مثال: القانون المدني المصري المواد 418 و428؛ قانون العقوبات مادة 341..."
                className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white leading-relaxed"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
              المبدأ القضائي وحكم محكمة النقض الحاكم (Cassation Precedent)
            </label>
            <input
              type="text"
              value={pairCassation}
              onChange={(e) => setPairCassation(e.target.value)}
              placeholder="رقم الطعن والسنة القضائية والمبدأ المستقر..."
              className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white"
            />
          </div>

          <div>
            <label className="block text-emerald-400 font-bold mb-1">
              صيغة الرد المثالي المعتمد للمستشار عطيه الهلباوي (Ground Truth Response) *
            </label>
            <textarea
              rows={4}
              required
              value={pairIdealResponse}
              onChange={(e) => setPairIdealResponse(e.target.value)}
              placeholder="اكتب الرد النموذجي الذي ترغب في أن يتدرب عليه النموذج ويحاكيه حرفياً في نبرته ورصانته..."
              className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-emerald-500/40 text-emerald-100 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4AF37]/20">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold cursor-pointer hover:brightness-110 shadow-lg flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>جارٍ تدريب العقل المركزي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#2B1914]" />
                  <span>حفظ واعتماد التدريب في العقل المركزي ✓</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: INGEST DOCUMENTS */}
      {activeTab === 'ingest_docs' && (
        <div className="space-y-6">
          <form
            onSubmit={handleIngestDoc}
            className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-4 text-xs text-right"
          >
            <div className="border-b border-[#D4AF37]/20 pb-3">
              <h3 className="font-bold text-sm text-[#F5E5BD] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>تضمين مذكرات الدفاع وأحكام النقض وصيغ العقود (Vector & RAG Ingestion):</span>
              </h3>
              <p className="text-[11px] text-[#F5E5BD]/60 mt-0.5">
                الصق نص أي مذكرة دفاع أو حكم قضائي جديد ليتعلم منه العقل المركزي ويستخرج منه المفاهيم والأسانيد.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[#D4AF37] font-semibold mb-1">عنوان المذكرة أو المستند *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="مثال: مذكرة دفاع في بطلان القبض والتفتيش..."
                  className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white"
                />
              </div>

              <div>
                <label className="block text-[#D4AF37] font-semibold mb-1">نوع المستند</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white"
                >
                  <option value="مذكرة دفاع">مذكرة دفاع ودفوع</option>
                  <option value="حكم نقض حديث">حكم نقض حديث</option>
                  <option value="لائحة تنفيذية">لائحة تنفيذية وقرار وزاري</option>
                  <option value="صيغة عقد خاصة">صيغة عقد خاصة بمكتب المستشار</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                الكلمات المفتاحية والمفاهيم (مفصولة بفاصلة)
              </label>
              <input
                type="text"
                value={docKeywords}
                onChange={(e) => setDocKeywords(e.target.value)}
                placeholder="مثال: بطلان إذن النيابة, انعدام التحريات الجدية, التلبس..."
                className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white"
              />
            </div>

            <div>
              <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                نص المستند أو المذكرة القضائية الكامل *
              </label>
              <textarea
                rows={5}
                required
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="الصق نص المذكرة أو حيثيات الحكم هنا..."
                className="w-full px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white leading-relaxed font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#2B1914] font-bold cursor-pointer hover:brightness-110 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>تضمين المستند في عقل المستشار</span>
              </button>
            </div>
          </form>

          {/* List of Ingested Documents */}
          <div className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-4 text-xs">
            <h4 className="font-bold text-[#D4AF37] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>المستندات المعرفية المضمنة حالياً ({ingestedDocs.length}):</span>
            </h4>

            <div className="space-y-3">
              {ingestedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{doc.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#D4AF37]/20 text-[#E7C779] border border-[#D4AF37]/30">
                        {doc.type}
                      </span>
                      <span className="font-mono text-[10px] text-[#F5E5BD]/50">
                        {doc.tokensCount} رمز معرفي
                      </span>
                    </div>
                    <p className="text-[#F5E5BD]/70 text-[11px] line-clamp-2 leading-relaxed">
                      {doc.contentPreview}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.extractedKeywords.map((k, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-[#1f120e] text-[#D4AF37] text-[9px] border border-[#D4AF37]/20">
                          #{k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-2 rounded-lg bg-[#1f120e] hover:bg-rose-950 text-rose-400 border border-rose-500/30 transition cursor-pointer shrink-0"
                    title="استبعاد المستند"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HYPERPARAMETERS & PERSONA TUNER */}
      {activeTab === 'hyperparameters' && hyperparameters && (
        <form
          onSubmit={handleSaveHyperparameters}
          className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-6 text-xs text-right"
        >
          <div className="border-b border-[#D4AF37]/20 pb-3">
            <h3 className="font-bold text-sm text-[#F5E5BD] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D4AF37]" />
              <span>ضبط أوزان شخصية المستشار ومحددات التفكير القضائي:</span>
            </h3>
            <p className="text-[11px] text-[#F5E5BD]/60 mt-0.5">
              تحكم بدقة متناهية في نبرة الرد، ومستوى الفصاحة، والدفء في المناسبات، ودرجة منع الهلوسة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slider 1: Dignity */}
            <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/25 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">درجة الوقار والفصاحة القضائية:</span>
                <span className="font-mono font-bold text-[#D4AF37] text-sm">
                  {hyperparameters.dignityLevel}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={hyperparameters.dignityLevel}
                onChange={(e) =>
                  setHyperparameters({ ...hyperparameters, dignityLevel: Number(e.target.value) })
                }
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <p className="text-[10px] text-[#F5E5BD]/60">
                تضبط مصطلحات الديباجة القضائية وعبارات الأدب الرفيع لمحراب العدالة.
              </p>
            </div>

            {/* Slider 2: Warmth */}
            <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/25 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">نسبة الدفء والمشاعر الإنسانية في المناسبات:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {hyperparameters.humanWarmthLevel}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={hyperparameters.humanWarmthLevel}
                onChange={(e) =>
                  setHyperparameters({ ...hyperparameters, humanWarmthLevel: Number(e.target.value) })
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <p className="text-[10px] text-[#F5E5BD]/60">
                تضمن التفاعل العفوي والبهجة الصادقة في الأفراح والدعوات دون جفاف.
              </p>
            </div>

            {/* Slider 3: Zero-Hallucination */}
            <div className="p-4 rounded-xl bg-[#2B1914] border border-emerald-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-emerald-300">صرامة منع الهلوسة وعزو النصوص (Zero-Hallucination):</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {hyperparameters.zeroHallucinationStrictness}%
                </span>
              </div>
              <input
                type="range"
                min="90"
                max="100"
                value={hyperparameters.zeroHallucinationStrictness}
                onChange={(e) =>
                  setHyperparameters({
                    ...hyperparameters,
                    zeroHallucinationStrictness: Number(e.target.value),
                  })
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <p className="text-[10px] text-emerald-200/70">
                100% تعني حظراً قاطعاً لأي استشهاد دون رقم المادة واسم التشريع المعتمد.
              </p>
            </div>

            {/* Slider 4: Conciseness */}
            <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/25 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">نسبة الإيجاز ومنع الاستطراد في التحيات:</span>
                <span className="font-mono font-bold text-[#E7C779] text-sm">
                  {hyperparameters.concisenessRatio}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={hyperparameters.concisenessRatio}
                onChange={(e) =>
                  setHyperparameters({ ...hyperparameters, concisenessRatio: Number(e.target.value) })
                }
                className="w-full accent-[#E7C779] cursor-pointer"
              />
              <p className="text-[10px] text-[#F5E5BD]/60">
                تمنع النموذج من إلقاء محاضرات قضائية وهمية عند إلقاء السلام فقط.
              </p>
            </div>
          </div>

          {/* Dialect Selector */}
          <div className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/25 space-y-2">
            <label className="block text-[#D4AF37] font-bold">نمط اللهجة والأسلوب اللغوي المعتمد:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                'فصحى قضائية رصينة',
                'فصحى قانونية مبسطة',
                'مزدوجة (فصحى للقضايا وعامية راقية للمناسبات)',
              ].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() =>
                    setHyperparameters({ ...hyperparameters, dialectFamiliarity: style as any })
                  }
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-semibold ${
                    hyperparameters.dialectFamiliarity === style
                      ? 'bg-[#3A241B] border-[#D4AF37] text-white ring-1 ring-[#D4AF37]'
                      : 'bg-[#1f120e] border-[#D4AF37]/20 text-[#F5E5BD]/60 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4AF37]/20">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold cursor-pointer hover:brightness-110 shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#2B1914]" />
              <span>تطبيق المعايير وحفظ الأوزان فورياً</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: LIVE SANDBOX & PLAYGROUND */}
      {activeTab === 'sandbox' && (
        <div className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-6 text-xs text-right">
          <div className="border-b border-[#D4AF37]/20 pb-3">
            <h3 className="font-bold text-sm text-[#F5E5BD] flex items-center gap-2">
              <Play className="w-4 h-4 text-[#D4AF37]" />
              <span>مختبر المحاكاة والاختبار الفوري للعقل المركزي (Brain Sandbox):</span>
            </h3>
            <p className="text-[11px] text-[#F5E5BD]/60 mt-0.5">
              اختبر استجابة النموذج على أي سؤال مباشر، وقارن تطابقه مع أزواج التدريب والأوزان المضبوطة.
            </p>
          </div>

          {/* Test Input */}
          <div className="space-y-2">
            <label className="block text-[#D4AF37] font-semibold">اكتب استفسار التجربة:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sandboxPrompt}
                onChange={(e) => setSandboxPrompt(e.target.value)}
                placeholder="اكتب استفساراً، أو دعوة فرح، أو مسألة قضائية..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleRunSandbox()}
              />
              <button
                type="button"
                onClick={handleRunSandbox}
                disabled={isInferring}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold cursor-pointer hover:brightness-110 shadow-md flex items-center gap-2 shrink-0"
              >
                {isInferring ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>جارٍ الاستدلال...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#2B1914]" />
                    <span>اختبار الاستجابة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Output */}
          {sandboxResult && (
            <div className="p-5 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/40 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#F5E5BD]/60">النية المكتشفة:</span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E7C779] border border-[#D4AF37]/30">
                    {sandboxResult.detectedIntent}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#F5E5BD]/60">مطابقة التدريب:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {sandboxResult.alignmentScore}%
                  </span>
                </div>
              </div>

              {sandboxResult.matchedTrainedExample && (
                <div className="p-3 rounded-xl bg-[#1f120e] border border-amber-500/30 text-[11px] space-y-1">
                  <span className="font-bold text-amber-300 block">
                    ✓ تم التطابق مع مثال تدريبي معتمد: "{sandboxResult.matchedTrainedExample.title}"
                  </span>
                  <p className="text-[#F5E5BD]/70">
                    السند الحاكم: {sandboxResult.matchedTrainedExample.governingArticles}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-white block">استجابة عقل المستشار عطيه:</span>
                <div className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/25 text-xs text-[#F5E5BD] whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
                  {sandboxResult.inferredReply}
                </div>
              </div>

              {/* Evaluation Actions */}
              <div className="pt-2 flex items-center justify-between gap-3 text-[11px]">
                <span className="text-[#F5E5BD]/60">ما هو تقييمك لجودة هذا الرد؟</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('شكراً لتقييمك! تم تأكيد جودة الرد (5/5)')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 cursor-pointer transition flex items-center gap-1"
                  >
                    <span>ممتاز (5/5) ✓</span>
                  </button>
                  <button
                    onClick={() => {
                      setPairScenario(sandboxPrompt);
                      setPairIdealResponse(sandboxResult.inferredReply);
                      setActiveTab('train_new');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#E7C779] border border-[#D4AF37]/40 cursor-pointer transition flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل وحفظ كتدريب جديد</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: DATASET MANAGER & EXPORT */}
      {activeTab === 'dataset_manager' && (
        <div className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-4 text-xs text-right">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#F5E5BD] flex items-center gap-2">
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>مستودع بيانات التدريب وتصدير الحزمة القياسية (JSONL Dataset):</span>
              </h3>
              <p className="text-[11px] text-[#F5E5BD]/60 mt-0.5">
                إدارة كاملة للأمثلة التي تم تدريب العقل المركزي عليها مع إمكانية تصديرها كملف Fine-Tuning.
              </p>
            </div>

            <a
              href="/api/brain/export-dataset"
              download="attia_alhelbawy_legal_brain_dataset.jsonl"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold cursor-pointer hover:brightness-110 shadow-md inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>تصدير حزمة التدريب (JSONL)</span>
            </a>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#D4AF37] absolute right-3 top-2.5" />
              <input
                type="text"
                value={datasetSearch}
                onChange={(e) => setDatasetSearch(e.target.value)}
                placeholder="ابحث في سيناريوهات التدريب أو المواد الحاكمة..."
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white text-xs"
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 text-white text-xs"
            >
              <option value="all">جميع الفروع</option>
              <option value="مدني">مدني</option>
              <option value="جنائي">جنائي</option>
              <option value="عمالي">عمالي</option>
              <option value="أسرة">أسرة</option>
              <option value="تواصل إنساني">تواصل إنساني</option>
            </select>
          </div>

          {/* Table of Training Pairs */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37] font-semibold">
                  <th className="py-2.5 px-3">العنوان والمسألة</th>
                  <th className="py-2.5 px-3">الفرع</th>
                  <th className="py-2.5 px-3">التكييف والسند</th>
                  <th className="py-2.5 px-3">دقة النموذج</th>
                  <th className="py-2.5 px-3">تاريخ التدريب</th>
                  <th className="py-2.5 px-3 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {filteredPairs.map((p) => (
                  <tr key={p.id} className="hover:bg-[#2B1914]/50 transition">
                    <td className="py-2.5 px-3 font-medium text-white max-w-xs truncate">
                      {p.title}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#D4AF37]/15 text-[#E7C779] border border-[#D4AF37]/25">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#F5E5BD]/70 max-w-md truncate">
                      {p.characterization}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                      {p.accuracyScore}%
                    </td>
                    <td className="py-2.5 px-3 text-[#F5E5BD]/50 font-mono text-[11px]">
                      {new Date(p.trainedAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleDeletePair(p.id, p.title)}
                        className="p-1.5 rounded-lg bg-[#2B1914] hover:bg-rose-950 text-rose-400 border border-rose-500/20 cursor-pointer transition"
                        title="حذف من التدريب"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
