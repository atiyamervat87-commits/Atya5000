import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Scale,
  FileText,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  Tag,
  Calendar,
  Layers,
  Award,
  BookMarked,
  SlidersHorizontal,
  FolderOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  MAJOR_EGYPTIAN_LAWS,
  EGYPTIAN_LEGAL_ARTICLES,
  CASSATION_RULINGS,
  EgyptianLawOverview,
} from '../../data/egyptianLaws';
import { LegalArticle, LegalBranch } from '../../types/legal';

interface LegalIndexDisplayProps {
  onSelectArticle?: (article: LegalArticle) => void;
  initialLawId?: string;
  onClose?: () => void;
}

export const LegalIndexDisplay: React.FC<LegalIndexDisplayProps> = ({
  onSelectArticle,
  initialLawId,
  onClose,
}) => {
  // Active Tab View: 'cards' (بطاقات القوانين) | 'search' (بحث المواد) | 'cassation' (مبادئ النقض)
  const [activeTab, setActiveTab] = useState<'cards' | 'search' | 'cassation'>('cards');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedLawName, setSelectedLawName] = useState<string>(initialLawId || 'all');
  const [expandedLawId, setExpandedLawId] = useState<string | null>(null);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered Laws based on branch and search query
  const filteredLaws = useMemo(() => {
    return MAJOR_EGYPTIAN_LAWS.filter((law) => {
      if (selectedBranch !== 'all' && law.branch !== selectedBranch) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.trim().toLowerCase();
      const matchName = law.name.toLowerCase().includes(q);
      const matchNumber = law.number.includes(q) || law.year.includes(q);
      const matchDesc = law.description.toLowerCase().includes(q);
      const matchThemes = law.keyThemes.some((t) => t.toLowerCase().includes(q));

      // Also check if any article under this law matches the query
      const matchAnyArticle = EGYPTIAN_LEGAL_ARTICLES.some(
        (art) =>
          art.lawName === law.name &&
          (art.articleNumber.includes(q) ||
            (art.title && art.title.toLowerCase().includes(q)) ||
            art.content.toLowerCase().includes(q) ||
            art.keywords.some((k) => k.toLowerCase().includes(q)))
      );

      return matchName || matchNumber || matchDesc || matchThemes || matchAnyArticle;
    });
  }, [searchQuery, selectedBranch]);

  // Filtered Articles based on search query, law, and branch
  const filteredArticles = useMemo(() => {
    return EGYPTIAN_LEGAL_ARTICLES.filter((article) => {
      if (selectedLawName !== 'all' && article.lawName !== selectedLawName) {
        return false;
      }
      if (selectedBranch !== 'all' && article.branch !== selectedBranch) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.trim().toLowerCase();
      const matchNum = article.articleNumber === q || article.articleNumber.includes(q);
      const matchTitle = article.title ? article.title.toLowerCase().includes(q) : false;
      const matchContent = article.content.toLowerCase().includes(q);
      const matchLaw = article.lawName.toLowerCase().includes(q);
      const matchKeywords = article.keywords.some((k) => k.toLowerCase().includes(q));
      const matchPrecedents = article.cassationPrinciples
        ? article.cassationPrinciples.some((p) => p.toLowerCase().includes(q))
        : false;

      return matchNum || matchTitle || matchContent || matchLaw || matchKeywords || matchPrecedents;
    });
  }, [searchQuery, selectedLawName, selectedBranch]);

  // Copy handler
  const handleCopy = (article: LegalArticle) => {
    const text = `【سند قانوني - ${article.lawName}】\nالمادة (${article.articleNumber})${article.title ? ` - ${article.title}` : ''}:\n"${article.content}"\n${
      article.cassationPrinciples && article.cassationPrinciples.length > 0
        ? `\nمبادئ محكمة النقض المرتبطة:\n${article.cassationPrinciples.map((p) => `• ${p}`).join('\n')}`
        : ''
    }\n(منصة المستشار عطيه الهلباوي - المحامي بالنقض والدستورية العليا)`;

    navigator.clipboard.writeText(text);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Print handler
  const handlePrint = (article: LegalArticle) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <title>سند قانوني - مادة ${article.articleNumber} ${article.lawName}</title>
        <style>
          body { font-family: 'Amiri', 'Times New Roman', serif; padding: 40px; color: #1c1917; line-height: 1.8; }
          .header { border-bottom: 2px solid #b45309; padding-bottom: 15px; margin-bottom: 25px; text-align: center; }
          .title { font-size: 20px; font-weight: bold; color: #78350f; }
          .article-box { background: #fafaf9; border: 1px solid #d6d3d1; padding: 25px; border-radius: 8px; }
          .article-num { font-size: 18px; font-weight: bold; color: #92400e; margin-bottom: 10px; }
          .content { font-size: 16px; text-align: justify; }
          .principles { margin-top: 20px; border-top: 1px dashed #d6d3d1; padding-top: 15px; }
          .footer { margin-top: 40px; font-size: 12px; text-align: center; color: #78716c; border-top: 1px solid #e7e5e4; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>مكتب المستشار عطيه الهلباوي</h2>
          <p>المحامي بالنقض والدستورية العليا — فهرس القوانين المصرية المعتمد</p>
          <div class="title">${article.lawName} (رقم ${article.lawNumber} لسنة ${article.lawYear})</div>
        </div>
        <div class="article-box">
          <div class="article-num">مادة (${article.articleNumber})${article.title ? ` : ${article.title}` : ''} [${article.status}]</div>
          <div class="content">${article.content}</div>
          ${
            article.cassationPrinciples && article.cassationPrinciples.length > 0
              ? `
              <div class="principles">
                <strong>مبادئ محكمة النقض المستقرة:</strong>
                <ul>${article.cassationPrinciples.map((p) => `<li>${p}</li>`).join('')}</ul>
              </div>`
              : ''
          }
        </div>
        <div class="footer">
          تم استخراج السند من مكون فهرس القوانين المصرية (LegalIndexDisplay) — منصة عبقرينو الملكية
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const branchLabels: Record<LegalBranch, string> = {
    civil: 'القانون المدني',
    commercial: 'القانون التجاري',
    criminal: 'القانون الجنائي والإجراءات',
    administrative: 'القضاء الإداري',
    procedural: 'المرافعات والإثبات',
    labor: 'قانون العمل',
    personal_status: 'الأحوال الشخصية',
    real_estate: 'الشهر العقاري',
    intellectual_property: 'الملكية الفكرية',
    constitutional: 'القانون الدستوري',
  };

  return (
    <div className="space-y-6">
      {/* Component Banner with Royal Gold Styling */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#2B1914] border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-inner shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#F5E5BD]">
                فهرس القوانين المصرية (LegalIndexDisplay)
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/25 text-[#E7C779] border border-[#D4AF37]/40 font-mono font-bold">
                مكتب إدارة المحاماة
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#F5E5BD]/75 mt-1">
              واجهة بطاقات منظمة لاستعراض التشريعات المصرية (المدني، الإجراءات الجنائية، العقوبات، المرافعات، الإثبات، العمل) مع محرك بحث نصي فوري في المواد ومبادئ النقض
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <div className="px-3.5 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-center">
            <div className="text-[10px] text-[#F5E5BD]/60">التشريعات الكبرى</div>
            <div className="text-base sm:text-lg font-bold font-mono text-[#D4AF37]">
              {MAJOR_EGYPTIAN_LAWS.length}
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-center">
            <div className="text-[10px] text-[#F5E5BD]/60">المواد المفهرسة</div>
            <div className="text-base sm:text-lg font-bold font-mono text-[#E7C779]">
              {EGYPTIAN_LEGAL_ARTICLES.length}
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-center">
            <div className="text-[10px] text-[#F5E5BD]/60">سوابق النقض</div>
            <div className="text-base sm:text-lg font-bold font-mono text-[#D4AF37]">
              {CASSATION_RULINGS.length}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
                : 'bg-[#2B1914] text-[#F5E5BD]/80 hover:bg-[#3A241B] hover:text-[#F5E5BD] border border-[#D4AF37]/30'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>بطاقات القوانين المصرية ({filteredLaws.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'search'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
                : 'bg-[#2B1914] text-[#F5E5BD]/80 hover:bg-[#3A241B] hover:text-[#F5E5BD] border border-[#D4AF37]/30'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>البحث النصي في المواد ({filteredArticles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cassation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'cassation'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
                : 'bg-[#2B1914] text-[#F5E5BD]/80 hover:bg-[#3A241B] hover:text-[#F5E5BD] border border-[#D4AF37]/30'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>مبادئ محكمة النقض ({CASSATION_RULINGS.length})</span>
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-[#F5E5BD]/60 hover:text-[#F5E5BD] flex items-center gap-1 cursor-pointer"
          >
            <span>إغلاق الفهرس</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Global Search & Branch Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/40 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#D4AF37] absolute right-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم المادة (مثل: 147 أو 304) أو بالكلمات (العقد، النصب، التقادم، التعويض، الشك)..."
              className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-xs sm:text-sm text-[#F5E5BD] placeholder-[#F5E5BD]/40 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-xs text-[#F5E5BD]/60 hover:text-[#F5E5BD] cursor-pointer"
              >
                مسح
              </button>
            )}
          </div>

          {/* Law Branch Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">كافة الفروع القانونية</option>
              <option value="civil">القانون المدني</option>
              <option value="criminal">القانون الجنائي والإجراءات</option>
              <option value="procedural">المرافعات والإثبات</option>
              <option value="labor">قانون العمل</option>
              <option value="commercial">القانون التجاري</option>
            </select>
          </div>

          {/* Specific Law Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedLawName}
              onChange={(e) => setSelectedLawName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">كافة القوانين المصرية (الكل)</option>
              {MAJOR_EGYPTIAN_LAWS.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-[11px] text-[#F5E5BD]/60 flex items-center gap-1 font-semibold">
            <Tag className="w-3 h-3 text-[#D4AF37]" />
            أشهر نصوص وموضوعات التقاضي:
          </span>
          {[
            { label: 'العقد شريعة المتعاقدين (م 147 مدني)', q: '147' },
            { label: 'البراءة والشك (م 304 إجراءات)', q: '304' },
            { label: 'الدفوع الشكلية (م 108 مرافعات)', q: '108' },
            { label: 'المسؤولية التقصيرية (م 163 مدني)', q: '163' },
            { label: 'جريمة النصب (م 336 عقوبات)', q: '336' },
            { label: 'خيانة الأمانة (م 341 عقوبات)', q: '341' },
            { label: 'الفصل التعسفي (م 69 عمل)', q: '69' },
            { label: 'الشيك البنكي (م 472 تجارة)', q: '472' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(item.q);
                setActiveTab('search');
              }}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-[#1f120e] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 transition cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. CARDS VIEW: ORGANIZED LAW CARDS GRID              */}
      {/* ==================================================== */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-amiri text-[#F5E5BD] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#D4AF37]" />
              <span>فهرس بطاقات التشريعات المصرية الرئيسية ({filteredLaws.length})</span>
            </h3>
            <span className="text-xs text-[#F5E5BD]/60">
              اضغط على بطاقة القانون لعرض مواده ونصوصه تفصيلياً
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLaws.map((law) => {
              const lawArticles = EGYPTIAN_LEGAL_ARTICLES.filter((a) => a.lawName === law.name);
              const isExpanded = expandedLawId === law.id;

              return (
                <div
                  key={law.id}
                  className={`p-5 rounded-2xl bg-[#2B1914] border-2 transition shadow-xl space-y-4 ${
                    isExpanded ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50' : 'border-[#D4AF37]/35 hover:border-[#D4AF37]'
                  }`}
                >
                  {/* Law Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E7C779] border border-[#D4AF37]/40">
                          قانون رقم {law.number} لسنة {law.year}
                        </span>
                        <span className="text-[11px] text-[#F5E5BD]/50 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-[#D4AF37]" />
                          {law.promulgationDate}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold font-amiri text-[#F5E5BD]">
                        {law.name}
                      </h4>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#1f120e] text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
                      {lawArticles.length} مادة مسجلة
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#F5E5BD]/80 leading-relaxed text-justify">
                    {law.description}
                  </p>

                  {/* Key Themes Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {law.keyThemes.map((theme, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#1f120e] text-[#F5E5BD]/70 border border-[#D4AF37]/20"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setExpandedLawId(isExpanded ? null : law.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#2B1914] bg-[#D4AF37] hover:bg-[#E7C779] px-3.5 py-1.5 rounded-lg transition cursor-pointer shadow-sm"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>طي المواد</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>استعراض مواد القانون ({lawArticles.length})</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedLawName(law.name);
                        setActiveTab('search');
                      }}
                      className="text-xs text-[#E7C779] hover:text-[#F5E5BD] flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>البحث في نصوصه</span>
                    </button>
                  </div>

                  {/* Expandable Articles Section within Law Card */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[#D4AF37]/30 space-y-3 animate-fadeIn">
                      <div className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                        <FolderOpen className="w-4 h-4 text-[#D4AF37]" />
                        <span>نصوص المواد المفهرسة بالقانون:</span>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {lawArticles.map((art) => (
                          <div
                            key={art.id}
                            className="p-3.5 rounded-xl bg-[#1f120e] border border-[#D4AF37]/25 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#D4AF37] font-mono">
                                  مادة ({art.articleNumber})
                                </span>
                                {art.title && (
                                  <span className="font-bold text-[#F5E5BD] font-amiri">
                                    {art.title}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleCopy(art)}
                                  className="text-[10px] px-2 py-0.5 rounded bg-[#2B1914] text-[#E7C779] hover:text-white border border-[#D4AF37]/20 cursor-pointer flex items-center gap-1"
                                >
                                  {copiedId === art.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-300">تم النسخ</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>نسخ</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handlePrint(art)}
                                  className="text-[10px] px-2 py-0.5 rounded bg-[#2B1914] text-[#E7C779] hover:text-white border border-[#D4AF37]/20 cursor-pointer flex items-center gap-1"
                                >
                                  <Printer className="w-3 h-3" />
                                  <span>طباعة</span>
                                </button>
                              </div>
                            </div>

                            <p className="text-[#F5E5BD]/90 leading-relaxed font-amiri text-justify">
                              {art.content}
                            </p>

                            {art.cassationPrinciples && art.cassationPrinciples.length > 0 && (
                              <div className="text-[11px] text-[#D4AF37]/90 bg-[#251511] p-2 rounded-lg border border-[#D4AF37]/20">
                                <strong>مبدأ النقض: </strong>
                                <span>{art.cassationPrinciples[0]}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. SEARCH VIEW: FULL ARTICLES TEXT SEARCH            */}
      {/* ==================================================== */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#F5E5BD]/70 px-1">
            <span>
              تم العثور على <strong className="text-[#D4AF37] font-mono text-sm">{filteredArticles.length}</strong> نصاً ومادة قانونية
              {selectedLawName !== 'all' && ` في [${selectedLawName}]`}
            </span>
            {(searchQuery || selectedLawName !== 'all' || selectedBranch !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLawName('all');
                  setSelectedBranch('all');
                }}
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                إلغاء الفلاتر وعرض كافة المواد
              </button>
            )}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#2B1914]/60 border border-[#D4AF37]/30 space-y-3">
              <Search className="w-10 h-10 text-[#D4AF37]/40 mx-auto" />
              <h4 className="text-base font-bold text-[#F5E5BD]">لا توجد نصوص مطابقة للبحث</h4>
              <p className="text-xs text-[#F5E5BD]/60 max-w-md mx-auto">
                جرب البحث برقم المادة فقط (مثل: 147، 304، 336، 108، 69) أو بمصطلح مثل (التقادم، التعويض، العقد، البطلان).
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => {
                const isCopied = copiedId === article.id;
                return (
                  <div
                    key={article.id}
                    className="p-5 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition shadow-xl space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#D4AF37] text-[#2B1914]">
                            مادة ({article.articleNumber})
                          </span>
                          <span className="text-xs font-semibold text-[#E7C779]">
                            {article.lawName} (رقم {article.lawNumber} لسنة {article.lawYear})
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              article.status === 'ساري'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {article.status}
                          </span>
                        </div>
                        {article.title && (
                          <h4 className="text-base font-bold font-amiri text-[#F5E5BD] pt-1">
                            {article.title}
                          </h4>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopy(article)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/30 transition cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300 font-bold">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>نسخ السند</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handlePrint(article)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/30 transition cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>طباعة</span>
                        </button>

                        {onSelectArticle && (
                          <button
                            onClick={() => onSelectArticle(article)}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E7C779] text-[#2B1914] font-bold transition cursor-pointer"
                          >
                            <span>إدراج بمذكرة</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/20 text-[#F5E5BD] leading-relaxed text-sm font-amiri text-justify select-text">
                      <p className="indent-4">{article.content}</p>
                    </div>

                    {/* Modification note */}
                    {article.modifications && (
                      <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/30 text-amber-200 text-xs">
                        <strong>التعديل التشريعي: </strong>
                        <span>{article.modifications}</span>
                      </div>
                    )}

                    {/* Cassation principles */}
                    {article.cassationPrinciples && article.cassationPrinciples.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#251511] border border-[#D4AF37]/30 space-y-1.5">
                        <div className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 font-amiri">
                          <Scale className="w-4 h-4 text-[#D4AF37]" />
                          <span>مبادئ محكمة النقض المرتبطة بالنص:</span>
                        </div>
                        <ul className="space-y-1 text-xs text-[#F5E5BD]/90">
                          {article.cassationPrinciples.map((p, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#D4AF37] font-bold">•</span>
                              <span className="leading-relaxed">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Keywords */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                      <span className="text-[10px] text-[#F5E5BD]/50 font-mono">الكلمات الدالة:</span>
                      {article.keywords.map((kw, i) => (
                        <button
                          key={i}
                          onClick={() => setSearchQuery(kw)}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#1f120e] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/20 transition cursor-pointer"
                        >
                          #{kw}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. CASSATION TAB: COURT PRECEDENTS                   */}
      {/* ==================================================== */}
      {activeTab === 'cassation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-amiri text-[#F5E5BD] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <span>مبادئ محكمة النقض المصرية المعتمدة ({CASSATION_RULINGS.length})</span>
            </h3>
            <span className="text-xs text-[#F5E5BD]/60">المبادئ القضائية المستقرة في المسائل المدنية والجنائية والعمالية</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {CASSATION_RULINGS.map((ruling) => (
              <div
                key={ruling.id}
                className="p-5 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37]/40 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E7C779] border border-[#D4AF37]/40">
                      الطعن رقم {ruling.rulingNumber} لسنة {ruling.judicialYear}
                    </span>
                    <h4 className="text-base font-bold font-amiri text-[#F5E5BD] mt-1">
                      {ruling.court} — جلسة {ruling.sessionDate}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {ruling.relatedArticles.map((art, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(art.split(' ')[0]);
                          setActiveTab('search');
                        }}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1f120e] hover:bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/30 transition cursor-pointer"
                      >
                        سند: {art}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/20 text-[#F5E5BD] leading-relaxed text-sm font-amiri text-justify">
                  «{ruling.principle}»
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#F5E5BD]/60">
                    الدائرة:{' '}
                    {ruling.branch === 'civil'
                      ? 'المدنية والتجارية'
                      : ruling.branch === 'criminal'
                      ? 'الجنائية'
                      : 'العمالية'}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `【مبدأ نقض - ${ruling.court}】\nالطعن رقم ${ruling.rulingNumber} لسنة ${ruling.judicialYear} - جلسة ${ruling.sessionDate}:\n"${ruling.principle}"\nالمواد: ${ruling.relatedArticles.join(', ')}`
                      );
                      alert('تم نسخ مبدأ النقض بنجاح.');
                    }}
                    className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#E7C779] font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ المبدأ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
