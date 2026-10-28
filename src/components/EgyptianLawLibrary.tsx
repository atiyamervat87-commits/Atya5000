import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, ShieldCheck, Bookmark, ExternalLink, PlusCircle, Check } from 'lucide-react';
import { LegalArticle, CassationRuling } from '../types/legal';

export const EgyptianLawLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [articles, setArticles] = useState<LegalArticle[]>([]);
  const [precedents, setPrecedents] = useState<CassationRuling[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'precedents' | 'upload'>('articles');
  const [isLoading, setIsLoading] = useState(false);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('مذكرات ودراسات خاصة');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchLibrary = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedBranch && selectedBranch !== 'all') params.append('branch', selectedBranch);

      const res = await fetch(`/api/library/search?${params.toString()}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setPrecedents(data.precedents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [searchTerm, selectedBranch]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadContent) return;

    try {
      const res = await fetch('/api/library/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          category: uploadCategory,
          content: uploadContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUploadSuccess(true);
        setUploadTitle('');
        setUploadContent('');
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('فشل حفظ المستند في المكتبة');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>الموسوعة التشريعية والقضائية المصرية الرقمية</span>
          </div>
          <h2 className="text-2xl font-bold font-amiri text-slate-100">
            المكتبة القانونية، التشريعات، ومبادئ محكمة النقض
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            قاعدة معرفية مفهرسة تضم أمهات القوانين المصرية (المدني، المرافعات، العقوبات، الإثبات، العمل) ومبادئ محكمة النقض الرسمية مع التحقق من سريان النصوص والتعديلات التشريعية.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم المادة (مثل: 147)، أو اسم القانون، أو الكلمة المفتاحية (مثل: التعويض، التقادم، الصورية، الشيك)..."
              className="w-full pr-10 pl-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">جميع الفروع القانونية</option>
              <option value="civil">القانون المدني</option>
              <option value="procedural">المرافعات والإثبات</option>
              <option value="criminal">العقوبات والإجراءات الجنائية</option>
              <option value="labor">قانون العمل</option>
              <option value="commercial">القانون التجاري</option>
            </select>
          </div>
        </div>

        {/* Inner sub-tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المواد التشريعية المقننة ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('precedents')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'precedents'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مبادئ وأحكام محكمة النقض ({precedents.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'upload'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إيداع مستند جديد في المكتبة</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Articles View */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <div
              key={art.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-xs">
                      {art.articleNumber}
                    </span>
                    <h3 className="font-bold text-slate-100 text-sm font-amiri">
                      {art.lawName} رقم {art.lawNumber} لسنة {art.lawYear}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      art.status === 'ساري'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : art.status === 'معدل'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                        : 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                    }`}
                  >
                    {art.status}
                  </span>
                </div>

                {art.title && (
                  <div className="text-xs font-semibold text-amber-300/90">{art.title}</div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  {art.content}
                </p>

                {art.modifications && (
                  <div className="text-[11px] text-amber-300/80 bg-amber-950/20 p-2 rounded-lg border border-amber-900/30">
                    <span className="font-semibold">تاريخ التعديل: </span>
                    {art.modifications}
                  </div>
                )}

                {art.cassationPrinciples && art.cassationPrinciples.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400">تطبيق محكمة النقض:</span>
                    {art.cassationPrinciples.map((cp, idx) => (
                      <p key={idx} className="text-[11px] text-slate-400 italic bg-slate-950/30 p-2 rounded border border-slate-900">
                        "{cp}"
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                {art.keywords.map((k, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400">
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {articles.length === 0 && !isLoading && (
            <div className="col-span-2 text-center py-16 text-slate-500 text-sm">
              لم يتم العثور على مواد مطابقة لمعايير البحث. جرب كلمة بحث أخرى أو رقم مادة مختلف.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Precedents View */}
      {activeTab === 'precedents' && (
        <div className="space-y-4">
          {precedents.map((prec) => (
            <div
              key={prec.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-200 text-sm font-amiri">
                    {prec.court} • الطعن رقم ({prec.rulingNumber}) لسنة ({prec.judicialYear})
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">جلسة: {prec.sessionDate}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-amiri text-base">
                "{prec.principle}"
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>المواد المرتبطة:</span>
                {prec.relatedArticles.map((artRef, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[11px] font-mono">
                    {artRef}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Upload Custom Document to Library */}
      {activeTab === 'upload' && (
        <form onSubmit={handleUploadSubmit} className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-amber-300 font-amiri text-lg">
              إيداع مستند أو بحث قانوني في ذاكرة المكتبة المحلية
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              يتيح لك هذا القسم إدخال أحكام أو دراسات أو صيغ عقود خاصة لتكون قابلة للاسترجاع والبحث الفوري أثناء الاستشارات.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">عنوان المستند</label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="مثال: حكم استئناف طنطا في بطلان الحيازة..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">التصنيف القانوني</label>
            <input
              type="text"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">محتوى المستند أو النص</label>
            <textarea
              rows={6}
              value={uploadContent}
              onChange={(e) => setUploadContent(e.target.value)}
              placeholder="الصق نصوص المواد أو مذكرة البحث هنا لتفهرس..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
            />
          </div>

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>تم إيداع وفهرسة المستند في مكتبة المشروع بنجاح.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            حفظ وإيداع في المكتبة
          </button>
        </form>
      )}
    </div>
  );
};
