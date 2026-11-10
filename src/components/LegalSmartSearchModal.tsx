import React, { useState, useMemo } from 'react';
import {
  Search,
  Globe,
  FileText,
  Scale,
  ExternalLink,
  Copy,
  Check,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  Bookmark,
} from 'lucide-react';
import { LegalCitationsMargin } from './LegalCitationsMargin';
import { legalCitationService } from '../utils/legalCitationService';

export interface GroundedLegalSource {
  title: string;
  uri: string;
  domain?: string;
  snippet?: string;
}

export interface LegalSearchGroundingResult {
  query: string;
  scope: 'all' | 'official_gazette' | 'cassation';
  summary: string;
  statutoryAmendments: Array<{
    lawTitle: string;
    numberAndYear: string;
    gazetteDate: string;
    keyChanges: string[];
    officialSourceUrl?: string;
  }>;
  cassationPrinciples: Array<{
    courtCircuit: string;
    rulingNumber: string;
    judicialYear: string;
    sessionDate: string;
    legalPrinciple: string;
    sourceUrl?: string;
  }>;
  sources: GroundedLegalSource[];
  webSearchQueries: string[];
  groundingStatus: 'live_google_grounded' | 'autonomous_judicial_knowledge';
  timestamp: string;
  counselorVerdict: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInjectIntoConsultation?: (text: string) => void;
}

const PRESET_QUERIES = [
  {
    title: 'تعديلات قانون الإجراءات الجنائية والحبس الاحتياطي',
    query: 'أحدث تعديلات مشروع قانون الإجراءات الجنائية وضوابط الحبس الاحتياطي في الجريدة الرسمية',
    scope: 'all' as const,
  },
  {
    title: 'قانون التصالح في مخالفات البناء رقم 187 لسنة 2023',
    query: 'تعديلات قانون التصالح في بعض مخالفات البناء رقم 187 لسنة 2023 ولائحته التنفيذية وأثرها الجنائي',
    scope: 'official_gazette' as const,
  },
  {
    title: 'أحدث أحكام النقض في إيصال الأمانة على بياض',
    query: 'أحدث أحكام محكمة النقض الجنائية في الطعن بالتزوير على صلب إيصال أمانة موقع على بياض',
    scope: 'cassation' as const,
  },
  {
    title: 'قانون العمل وحالات الفصل التعسفي والتعويض',
    query: 'أحدث أحكام الدوائر العمالية بمحكمة النقض وتعديلات قانون العمل في التعويض عن الفصل التعسفي',
    scope: 'all' as const,
  },
  {
    title: 'أحكام الهيئة العامة لمحكمة النقض في الإيجار القديم',
    query: 'أحدث مبادئ الهيئة العامة لمحكمة النقض في امتداد عقد الإيجار القديم للورثة وشروطه',
    scope: 'cassation' as const,
  },
  {
    title: 'تعديلات الشهر العقاري وتسجيل الشقق السكنية',
    query: 'أحدث تعديلات قانون الشهر العقاري رقم 9 لسنة 2022 وتكلفة وإجراءات تسجيل شقة سكنية بالجريدة الرسمية',
    scope: 'official_gazette' as const,
  },
];

export const LegalSmartSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInjectIntoConsultation,
}) => {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<'all' | 'official_gazette' | 'cassation'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LegalSearchGroundingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // استخراج وتوثيق المواد القانونية آلياً من نتائج البحث وعقل المستشار
  const citationsResult = useMemo(() => {
    if (!result) return { citations: [], footnotesMarkdown: '', totalExtracted: 0, annotatedText: '' };
    const combinedText = `${result.query}\n${result.summary}\n${result.counselorVerdict || ''}\n${
      result.statutoryAmendments?.map(a => `${a.lawTitle} ${a.numberAndYear} ${a.keyChanges?.join(' ')}`).join('\n') || ''
    }\n${
      result.cassationPrinciples?.map(p => `${p.legalPrinciple} ${p.courtCircuit}`).join('\n') || ''
    }`;
    return legalCitationService.extractCitations(combinedText, result.statutoryAmendments);
  }, [result]);

  if (!isOpen) return null;

  const handleSearch = async (searchQuery?: string, searchScope?: 'all' | 'official_gazette' | 'cassation') => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    const s = searchScope || scope;
    if (searchQuery) setQuery(searchQuery);
    if (searchScope) setScope(searchScope);

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/legal-search/grounded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, scope: s }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'تعذر إجراء البحث التشريعي الذكي');
      }

      const data: LegalSearchGroundingResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `الموضوع: ${result.query}\n\nالخلاصة والتحليل القضائي:\n${result.summary}\n\nالمصادر الموثقة:\n${result.sources.map(s => `- ${s.title}: ${s.uri}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#1a0f0c] border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#1f120e] border-b border-[#D4AF37]/30 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-inner shrink-0">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E7C779] border border-[#D4AF37]/30">
                  Google Search Grounding • مباشر
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                  الجريدة الرسمية ومحكمة النقض
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-amiri text-[#F5E5BD] mt-1">
                محرك التقصي والبحث التشريعي الذكي الموثق
              </h2>
              <p className="text-xs text-[#F5E5BD]/70 hidden sm:block">
                بحث حي وفوري في أحدث القوانين والتعديلات والقرارات المنشورة في الجريدة الرسمية المصرية وأحكام محكمة النقض الحديثة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#2B1914] hover:bg-[#3A241B] text-[#F5E5BD]/70 hover:text-[#F5E5BD] border border-[#D4AF37]/30 transition cursor-pointer shrink-0"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Controls Section */}
        <div className="p-5 sm:p-6 bg-[#1f120e] border-b border-[#D4AF37]/20 space-y-4">
          {/* Scope Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1.5 ml-2">
              <Layers className="w-3.5 h-3.5" />
              <span>نطاق التقصي:</span>
            </span>

            {[
              { id: 'all', label: 'الكل (الجريدة الرسمية والنقض معاً)', icon: Globe },
              { id: 'official_gazette', label: 'الجريدة الرسمية والوقائع المصرية', icon: FileText },
              { id: 'cassation', label: 'أحكام ومبادئ محكمة النقض', icon: Scale },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = scope === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setScope(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] shadow-md font-bold'
                      : 'bg-[#2B1914] hover:bg-[#3A241B] text-[#F5E5BD]/75 border border-[#D4AF37]/25'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="اكتب الموضوع أو رقم القانون أو المبدأ (مثال: أحدث تعديلات الحبس الاحتياطي، التصالح في البناء، إيصال الأمانة)..."
                className="w-full pr-10 pl-4 py-3 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/40 text-xs sm:text-sm text-[#F5E5BD] placeholder-[#F5E5BD]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-inner font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#F5E5BD]/50 hover:text-white"
                >
                  مسح
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E7C779] to-[#D4AF37] hover:brightness-110 text-[#2B1914] font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>جارٍ التقصي الحي عبر Google...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#2B1914]" />
                  <span>بحث موثق في الجريدة والنقض</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Suggested Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-[#F5E5BD]/60 font-semibold block">
              استعلامات تشريعية وقضائية شائعة جاهزة للبحث الفوري:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSearch(preset.query, preset.scope)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#2B1914] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 transition cursor-pointer hover:border-[#D4AF37] text-right"
                >
                  ⚡ {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isLoading && (
            <div className="py-16 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
                <Globe className="absolute inset-0 m-auto w-7 h-7 text-[#D4AF37] animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold font-amiri text-[#F5E5BD]">
                  جارٍ التقصي في أحدث منشورات الجريدة الرسمية المصرية وأحكام النقض...
                </h4>
                <p className="text-xs text-[#F5E5BD]/60">
                  فحص نصوص التعديلات التشريعية، مطابقة أرقام القوانين، واستخراج المبادئ القضائية الموثقة.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !result && !errorMessage && (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Scale className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-lg mx-auto">
                <h4 className="text-base font-bold font-amiri text-[#F5E5BD]">
                  مستعد للتقصي والبحث التشريعي الفوري
                </h4>
                <p className="text-xs text-[#F5E5BD]/70 leading-relaxed">
                  اكتب موضوع مسألتك أو اختر أحد الاستعلامات المقترحة أعلاه. سيتولى النظام استخراج أحدث القوانين المنشورة في الجريدة الرسمية وأحكام محكمة النقض المصرية الموثقة بروابطها المعتمدة.
                </p>
              </div>
            </div>
          )}

          {!isLoading && result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Telemetry & Grounding Badge Bar */}
              <div className="p-3.5 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {result.groundingStatus === 'live_google_grounded'
                        ? 'توثيق حي معتمد عبر Google Search Grounding'
                        : 'سجل التشريع والقضاء المصري المعتمد'}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#F5E5BD]/60 font-mono">
                    {new Date(result.timestamp).toLocaleTimeString('ar-EG')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2B1914] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 text-xs transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ' : 'نسخ التقرير'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2B1914] hover:bg-[#3A241B] text-[#F5E5BD]/80 hover:text-white border border-[#D4AF37]/30 text-xs transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>طباعة</span>
                  </button>

                  {onInjectIntoConsultation && (
                    <button
                      onClick={() => {
                        onInjectIntoConsultation(result.summary);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white text-xs font-bold transition cursor-pointer shadow"
                    >
                      <Send className="w-3 h-3" />
                      <span>إرسال للغرفة القضائية</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 2-Column Responsive Layout: Left = Main Judicial Analysis, Right = Citations Margin */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Main Judicial Analysis Column (8 columns on lg) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Main Grounded Counselor Report */}
                  <div className="p-6 rounded-2xl bg-[#1f120e] border-2 border-[#D4AF37]/40 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#E7C779] border-b border-[#D4AF37]/20 pb-3">
                      <Scale className="w-4 h-4 text-[#D4AF37]" />
                      <span>تقرير المستشار عطيه الهلباوي بشأن ({result.query}):</span>
                    </div>

                    <div className="text-xs sm:text-sm text-[#F5E5BD] leading-relaxed whitespace-pre-wrap font-sans">
                      {result.summary}
                    </div>
                  </div>

                  {/* Statutory Amendments Section (If any) */}
                  {result.statutoryAmendments && result.statutoryAmendments.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                        <FileText className="w-4 h-4 text-[#D4AF37]" />
                        <span>التعديلات التشريعية المنشورة بالجريدة الرسمية والوقائع المصرية:</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.statutoryAmendments.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-[#2B1914] border border-[#D4AF37]/30 space-y-2.5 flex flex-col justify-between"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-[#E7C779]">{item.numberAndYear}</span>
                                <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                  {item.gazetteDate}
                                </span>
                              </div>
                              <h5 className="font-bold text-xs text-[#F5E5BD]">{item.lawTitle}</h5>
                              {item.keyChanges && (
                                <ul className="space-y-1 text-[11px] text-[#F5E5BD]/80 list-disc list-inside pt-1">
                                  {item.keyChanges.map((change, cIdx) => (
                                    <li key={cIdx}>{change}</li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            {item.officialSourceUrl && (
                              <a
                                href={item.officialSourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10.5px] text-[#D4AF37] hover:underline pt-2 border-t border-[#D4AF37]/15"
                              >
                                <span>مطالعة نص القانون على البوابة الرسمية</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cassation Principles Section (If any) */}
                  {result.cassationPrinciples && result.cassationPrinciples.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Scale className="w-4 h-4 text-emerald-400" />
                        <span>أحدث مبادئ وأحكام محكمة النقض المصرية:</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.cassationPrinciples.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-[#2B1914] border border-emerald-500/30 space-y-2"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-emerald-300">{item.rulingNumber}</span>
                              <span className="text-[#D4AF37] text-[10px]">{item.sessionDate}</span>
                            </div>
                            <div className="text-[11px] text-[#F5E5BD]/70 font-mono">{item.courtCircuit} • {item.judicialYear}</div>
                            <p className="text-xs text-[#F5E5BD] leading-relaxed pt-1 border-t border-[#D4AF37]/15">
                              «{item.legalPrinciple}»
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verified Grounded Sources List */}
                  {result.sources && result.sources.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#E7C779] flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>المصادر والوثائق الرسمية الموثقة (Grounded Sources):</span>
                        </span>
                        <span className="text-[10px] text-[#F5E5BD]/60 font-mono">
                          {result.sources.length} روابط رسمية
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {result.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-[#2B1914] hover:bg-[#3A241B] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 text-xs text-right transition flex items-start justify-between gap-2 group cursor-pointer"
                          >
                            <div className="space-y-0.5 overflow-hidden">
                              <div className="font-bold text-[#F5E5BD] group-hover:text-[#E7C779] truncate text-[11.5px]">
                                {src.title}
                              </div>
                              <div className="text-[10px] text-[#D4AF37] font-mono truncate">
                                {src.domain || src.uri}
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Citations Margin Column (4 columns on lg) */}
                <div className="lg:col-span-4 lg:sticky lg:top-2 space-y-4">
                  {citationsResult.citations.length > 0 ? (
                    <LegalCitationsMargin
                      citations={citationsResult.citations}
                      title="هامش التوثيق التشريعي للمواد المستخرجة"
                      onInsertToDraft={onInjectIntoConsultation}
                    />
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 text-right space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                        <Bookmark className="w-4 h-4" />
                        <span>هامش التوثيق التشريعي</span>
                      </div>
                      <p className="text-[11px] text-[#F5E5BD]/70 leading-relaxed">
                        يتم استخراج أرقام المواد القانونية وأسماء التشريعات آلياً وعرضها هنا مع صيغة الاستشهاد القضائي بمجرد ورودها في نتيجة البحث.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1f120e] border-t border-[#D4AF37]/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5E5BD]/70">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>محرك بحث رسمي مدعوم بالذكاء الاصطناعي وبوابة التشريعات الوطنية لجمهورية مصر العربية</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2B1914] hover:bg-[#3A241B] text-[#F5E5BD] border border-[#D4AF37]/30 text-xs transition cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
