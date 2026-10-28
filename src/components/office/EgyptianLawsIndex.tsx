import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Scale,
  FileText,
  Filter,
  Copy,
  Check,
  Printer,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Tag,
  Calendar,
  Layers,
  Award,
  BookMarked,
  FileCheck,
} from 'lucide-react';
import {
  MAJOR_EGYPTIAN_LAWS,
  EGYPTIAN_LEGAL_ARTICLES,
  CASSATION_RULINGS,
  EgyptianLawOverview,
} from '../../data/egyptianLaws';
import { LegalArticle, LegalBranch } from '../../types/legal';

interface EgyptianLawsIndexProps {
  onSelectArticleForMemo?: (article: LegalArticle) => void;
}

export const EgyptianLawsIndex: React.FC<EgyptianLawsIndexProps> = ({
  onSelectArticleForMemo,
}) => {
  // Navigation View: 'laws_index' | 'articles_search' | 'cassation_rulings'
  const [viewMode, setViewMode] = useState<'laws_index' | 'articles_search' | 'cassation_rulings'>('laws_index');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLawId, setSelectedLawId] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);
  const [selectedArticleModal, setSelectedArticleModal] = useState<LegalArticle | null>(null);

  // Quick helper to switch to search filtered by a specific law
  const handleBrowseLawArticles = (law: EgyptianLawOverview) => {
    setSelectedLawId(law.name);
    setViewMode('articles_search');
    setSearchQuery('');
  };

  // Filtered Articles calculation
  const filteredArticles = useMemo(() => {
    return EGYPTIAN_LEGAL_ARTICLES.filter((article) => {
      // Law filter
      if (selectedLawId !== 'all' && article.lawName !== selectedLawId) {
        return false;
      }

      // Branch filter
      if (selectedBranch !== 'all' && article.branch !== selectedBranch) {
        return false;
      }

      // Search query
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
  }, [searchQuery, selectedLawId, selectedBranch]);

  // Copy article text to clipboard
  const handleCopyArticle = (article: LegalArticle) => {
    const textToCopy = `【السند القانوني - ${article.lawName}】
المادة رقم (${article.articleNumber})${article.title ? ` - ${article.title}` : ''}:
"${article.content}"
${article.cassationPrinciples && article.cassationPrinciples.length > 0 ? `\nمبادئ محكمة النقض المرتبطة:\n${article.cassationPrinciples.map((p) => `• ${p}`).join('\n')}` : ''}
(من وثائق منصة المستشار عطيه الهلباوي - المحامي بالنقض)`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedArticleId(article.id);
    setTimeout(() => setCopiedArticleId(null), 2500);
  };

  // Print Article
  const handlePrintArticle = (article: LegalArticle) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <title>السند القانوني - مادة ${article.articleNumber} ${article.lawName}</title>
        <style>
          body { font-family: 'Amiri', 'Times New Roman', serif; padding: 40px; color: #1c1917; line-height: 1.8; }
          .header { border-bottom: 2px solid #b45309; padding-bottom: 15px; margin-bottom: 25px; text-align: center; }
          .title { font-size: 20px; font-weight: bold; color: #78350f; }
          .article-box { background: #fafaf9; border: 1px solid #d6d3d1; padding: 25px; border-radius: 8px; margin-bottom: 20px; }
          .article-num { font-size: 18px; font-weight: bold; color: #92400e; margin-bottom: 10px; }
          .content { font-size: 16px; text-align: justify; }
          .principles { margin-top: 20px; border-top: 1px dashed #d6d3d1; padding-top: 15px; }
          .footer { margin-top: 40px; font-size: 12px; text-align: center; color: #78716c; border-top: 1px solid #e7e5e4; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>مكتب المستشار عطيه الهلباوي</h2>
          <p>المحامي بالنقض والدستورية العليا والإدارية العليا — الموسوعة التشريعية المعتمدة</p>
          <div class="title">${article.lawName} (رقم ${article.lawNumber} لسنة ${article.lawYear})</div>
        </div>
        <div class="article-box">
          <div class="article-num">مادة (${article.articleNumber})${article.title ? ` : ${article.title}` : ''} [${article.status}]</div>
          <div class="content">${article.content}</div>
          ${
            article.modifications
              ? `<p style="color: #b45309; font-size: 14px; margin-top: 10px;"><strong>التعديل التشريعي:</strong> ${article.modifications}</p>`
              : ''
          }
          ${
            article.cassationPrinciples && article.cassationPrinciples.length > 0
              ? `
              <div class="principles">
                <strong>مبادئ وقضاء محكمة النقض المستقرة:</strong>
                <ul>
                  ${article.cassationPrinciples.map((p) => `<li>${p}</li>`).join('')}
                </ul>
              </div>
            `
              : ''
          }
        </div>
        <div class="footer">
          تم استخراج هذا السند القانوني الرسمي بواسطة منصة عبقرينو الملكية الذكية لإدارة المحاماة — المستشار عطيه الهلباوي
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Component Header with Royal Styling */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#2B1914] border-2 border-[#D4AF37]/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-inner shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#F5E5BD]">
                فهرس القوانين والتشريعات المصرية الرئيسية
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E7C779] border border-[#D4AF37]/40 font-mono font-bold">
                الموسوعة القضائية المعتمدة
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#F5E5BD]/75 mt-1">
              استعراض شامل لفهرس القوانين المصرية (المدني، الجنائي، المرافعات، الإثبات، العمل، التجارة) مع محرك بحث فوري في النصوص ومبادئ النقض
            </p>
          </div>
        </div>

        {/* Quick Stat Badges */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <div className="px-3.5 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-center">
            <div className="text-[10px] text-[#F5E5BD]/60">القوانين الرئيسية</div>
            <div className="text-lg font-bold font-mono text-[#D4AF37]">{MAJOR_EGYPTIAN_LAWS.length}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-center">
            <div className="text-[10px] text-[#F5E5BD]/60">المواد المفهرسة</div>
            <div className="text-lg font-bold font-mono text-[#D4AF37]">{EGYPTIAN_LEGAL_ARTICLES.length}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-center">
            <div className="text-[10px] text-[#F5E5BD]/60">سوابق النقض</div>
            <div className="text-lg font-bold font-mono text-[#D4AF37]">{CASSATION_RULINGS.length}</div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D4AF37]/30 pb-3 flex-wrap">
        <button
          onClick={() => setViewMode('laws_index')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            viewMode === 'laws_index'
              ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
              : 'bg-[#2B1914] text-[#F5E5BD]/80 hover:bg-[#3A241B] hover:text-[#F5E5BD] border border-[#D4AF37]/30'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>فهرس القوانين والتشريعات ({MAJOR_EGYPTIAN_LAWS.length})</span>
        </button>

        <button
          onClick={() => setViewMode('articles_search')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            viewMode === 'articles_search'
              ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
              : 'bg-[#2B1914] text-[#F5E5BD]/80 hover:bg-[#3A241B] hover:text-[#F5E5BD] border border-[#D4AF37]/30'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>البحث في النصوص والمواد ({filteredArticles.length})</span>
        </button>

        <button
          onClick={() => setViewMode('cassation_rulings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            viewMode === 'cassation_rulings'
              ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
              : 'bg-[#2B1914] text-[#F5E5BD]/80 hover:bg-[#3A241B] hover:text-[#F5E5BD] border border-[#D4AF37]/30'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>مبادئ محكمة النقض المستقرة ({CASSATION_RULINGS.length})</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* VIEW 1: MAJOR LAWS INDEX DIRECTORY                   */}
      {/* ==================================================== */}
      {viewMode === 'laws_index' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base sm:text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#D4AF37]" />
              <span>دليل التشريعات والقوانين المصرية الكبرى</span>
            </h3>
            <span className="text-xs text-[#F5E5BD]/60">انقر على أي قانون لاستعراض نصوصه ومواده فوراً</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MAJOR_EGYPTIAN_LAWS.map((law) => {
              const articleCount = EGYPTIAN_LEGAL_ARTICLES.filter((a) => a.lawName === law.name).length;
              return (
                <div
                  key={law.id}
                  className="p-5 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition shadow-lg hover:shadow-2xl flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#E7C779] border border-[#D4AF37]/30">
                            قانون رقم {law.number} لسنة {law.year}
                          </span>
                          <span className="text-[11px] text-[#F5E5BD]/50 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-[#D4AF37]" />
                            {law.promulgationDate}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold font-amiri text-[#F5E5BD] group-hover:text-[#D4AF37] transition mt-1">
                          {law.name}
                        </h4>
                      </div>
                      <div className="text-left shrink-0">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/30">
                          {articleCount} مادة مفهرسة
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#F5E5BD]/80 leading-relaxed">
                      {law.description}
                    </p>

                    {/* Key themes */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {law.keyThemes.map((theme, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#1f120e] text-[#F5E5BD]/70 border border-[#D4AF37]/20"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between">
                    <button
                      onClick={() => handleBrowseLawArticles(law)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#2B1914] bg-[#D4AF37] hover:bg-[#E7C779] px-3.5 py-1.5 rounded-lg transition cursor-pointer shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>تصفح وبحث في نصوص القانون</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedLawId(law.name);
                        setViewMode('articles_search');
                      }}
                      className="text-xs font-semibold text-[#E7C779] hover:text-[#F5E5BD] flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>عرض المواد ({articleCount})</span>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 2: SEARCH ACROSS LEGAL ARTICLES                 */}
      {/* ==================================================== */}
      {viewMode === 'articles_search' && (
        <div className="space-y-6">
          {/* Advanced Search & Filtering Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/40 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Text Search Bar */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-[#D4AF37] absolute right-3 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث برقم المادة (مثال: 147 أو 304)، أو بالكلمة (العقد، النصب، التقادم، التعويض)..."
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

              {/* Law Selector Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedLawId}
                  onChange={(e) => setSelectedLawId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="all">كافة القوانين المصرية (الكل)</option>
                  {MAJOR_EGYPTIAN_LAWS.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name} ({l.number}/{l.year})
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Filter */}
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
            </div>

            {/* Quick Keyword Pills for Instant Search */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
              <span className="text-[11px] text-[#F5E5BD]/60 flex items-center gap-1 font-semibold">
                <Tag className="w-3 h-3 text-[#D4AF37]" />
                موضوعات شائعة للبحث السريع:
              </span>
              {[
                'العقد شريعة المتعاقدين',
                'المسؤولية التقصيرية',
                'التقادم المسقط',
                'الدفوع الشكلية',
                'البراءة والشك',
                'خيانة الأمانة',
                'النصب',
                'الفصل التعسفي',
                'حصانة المحامي',
                'الشيك',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                    searchQuery === term
                      ? 'bg-[#D4AF37] text-[#2B1914] font-bold'
                      : 'bg-[#1f120e] text-[#E7C779] hover:bg-[#3A241B] border border-[#D4AF37]/30'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-[#F5E5BD]/70 px-1">
            <span>
              تم العثور على <strong className="text-[#D4AF37] font-mono text-sm">{filteredArticles.length}</strong> نصاً ومادة قانونية
              {selectedLawId !== 'all' && ` في [${selectedLawId}]`}
            </span>
            {(searchQuery || selectedLawId !== 'all' || selectedBranch !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLawId('all');
                  setSelectedBranch('all');
                }}
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                إلغاء الفلاتر واستعراض الكل
              </button>
            )}
          </div>

          {/* Articles Cards Grid */}
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#2B1914]/60 border border-[#D4AF37]/30 space-y-3">
              <Search className="w-10 h-10 text-[#D4AF37]/40 mx-auto" />
              <h4 className="text-base font-bold text-[#F5E5BD]">لم يتم العثور على نصوص قانونية مطابقة</h4>
              <p className="text-xs text-[#F5E5BD]/60 max-w-md mx-auto">
                جرب البحث برقم المادة فقط (مثال: 147، 304، 336، 69) أو بمصطلح قانوني عام مثل (التقادم، التعويض، العقد، البطلان).
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => {
                const isCopied = copiedArticleId === article.id;
                return (
                  <div
                    key={article.id}
                    className="p-5 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition shadow-lg space-y-4"
                  >
                    {/* Article Top Bar */}
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

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopyArticle(article)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/30 transition cursor-pointer"
                          title="نسخ السند القانوني"
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
                          onClick={() => handlePrintArticle(article)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/30 transition cursor-pointer"
                          title="طباعة رسمية للسند"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>طباعة</span>
                        </button>

                        {onSelectArticleForMemo && (
                          <button
                            onClick={() => onSelectArticleForMemo(article)}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E7C779] text-[#2B1914] font-bold transition cursor-pointer"
                            title="إدراج في مذكرة الدعوى"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>إدراج بالمذكرة</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Article Official Text */}
                    <div className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/20 text-[#F5E5BD] leading-relaxed text-sm font-amiri select-text">
                      <p className="indent-4 text-justify">{article.content}</p>
                    </div>

                    {/* Legislative modifications note */}
                    {article.modifications && (
                      <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/30 text-amber-200 text-xs flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>التعديلات التشريعية: </strong>
                          <span>{article.modifications}</span>
                        </div>
                      </div>
                    )}

                    {/* Cassation Precedents (مبادئ محكمة النقض) */}
                    {article.cassationPrinciples && article.cassationPrinciples.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#251511] border border-[#D4AF37]/30 space-y-2">
                        <div className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 font-amiri">
                          <Scale className="w-4 h-4 text-[#D4AF37]" />
                          <span>قضاء محكمة النقض المستقر المرتبط بنص المادة:</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#F5E5BD]/90">
                          {article.cassationPrinciples.map((principle, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
                              <span className="leading-relaxed">{principle}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Keywords Tagging */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
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
      {/* VIEW 3: CASSATION COURT PRINCIPLES                   */}
      {/* ==================================================== */}
      {viewMode === 'cassation_rulings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base sm:text-lg font-amiri text-[#F5E5BD] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <span>مبادئ وأحكام محكمة النقض المصرية المعتمدة</span>
            </h3>
            <span className="text-xs text-[#F5E5BD]/60">المبادئ القضائية المستقرة الصادرة عن الدوائر المدنية والجنائية والعمالية</span>
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
                          setViewMode('articles_search');
                        }}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1f120e] hover:bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/30 transition cursor-pointer"
                        title="البحث عن هذه المادة"
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
                    الدائرة: {ruling.branch === 'civil' ? 'المدنية والتجارية' : ruling.branch === 'criminal' ? 'الجنائية' : 'العمالية'}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`【مبدأ نقض - ${ruling.court}】\nالطعن رقم ${ruling.rulingNumber} لسنة ${ruling.judicialYear} - جلسة ${ruling.sessionDate}:\n"${ruling.principle}"\nالمواد المرتبطة: ${ruling.relatedArticles.join(', ')}`);
                      alert('تم نسخ مبدأ محكمة النقض بنجاح.');
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
