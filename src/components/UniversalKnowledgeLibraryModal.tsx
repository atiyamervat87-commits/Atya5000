import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Scale,
  Sparkles,
  Layers,
  ChevronLeft,
  X,
  Download,
  Copy,
  Check,
  Award,
  History,
  Brain,
  ShieldCheck,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import {
  universalKnowledgeLibraryService,
  UNIVERSAL_KNOWLEDGE_FACULTIES,
  FEATURED_KNOWLEDGE_BOOKS,
} from '../services/universalKnowledgeLibraryService';
import { KnowledgeBook, KnowledgeFaculty } from '../types/universalKnowledgeLibrary';

interface UniversalKnowledgeLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniversalKnowledgeLibraryModal: React.FC<UniversalKnowledgeLibraryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<KnowledgeBook | null>(FEATURED_KNOWLEDGE_BOOKS[0]);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  if (!isOpen) return null;

  const overview = universalKnowledgeLibraryService.getOverview();

  const filteredBooks = universalKnowledgeLibraryService.searchBooks(
    searchQuery,
    selectedFacultyId === 'all' ? undefined : selectedFacultyId,
    50
  );

  const handleCopyCitation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans" dir="rtl">
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#231410] border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden flex flex-col text-right max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#D4AF37]/25 bg-gradient-to-l from-[#2B1914] via-[#351d16] to-[#1c0f0b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E7C779] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>مكتبة المعرفة الإنسانية المليونية • ATTYA UNIVERSAL MIND</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#F5E5BD]">
              مكتبة الملايين: الفهرس الأكبر للمصنفات والمراجع القانونية والعلمية
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#F5E5BD]/70">
              <span>إجمالي المجلدات المقدرة: <strong className="text-[#D4AF37] font-mono">{overview.totalEstimatedBooks.toLocaleString('ar-EG')} مجلد</strong></span>
              <span>•</span>
              <span>12 حقلاً معرفياً شاملاً</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono text-[11px]">توثيق معتمد بأصول التحقيق القضائي</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#F5E5BD]/70 hover:text-[#F5E5BD] transition cursor-pointer self-end sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Faculty Filters */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 bg-[#1e100c] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#D4AF37] absolute right-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في ملايين الكتب (العنوان، المؤلف، السنهوري، لسان العرب، مونتسكيو، الطب الشرعي، الذكاء الاصطناعي)..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#2e1a14] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] placeholder-[#F5E5BD]/40 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <select
              value={selectedFacultyId}
              onChange={(e) => setSelectedFacultyId(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#2e1a14] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">كافة الحقول المعرفية (1,390,000+ مجلد)</option>
              {UNIVERSAL_KNOWLEDGE_FACULTIES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.totalVolumesEstimate.toLocaleString('ar-EG')} مجلد)
                </option>
              ))}
            </select>
          </div>

          {/* Quick Faculty Pill Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedFacultyId('all')}
              className={`px-3 py-1 rounded-lg shrink-0 transition cursor-pointer ${
                selectedFacultyId === 'all'
                  ? 'bg-[#D4AF37] text-[#2B1914] font-bold'
                  : 'bg-[#2e1a14] text-[#F5E5BD]/70 hover:text-[#F5E5BD]'
              }`}
            >
              الكل ({overview.totalEstimatedBooks.toLocaleString('ar-EG')})
            </button>
            {UNIVERSAL_KNOWLEDGE_FACULTIES.slice(0, 6).map((fac) => (
              <button
                key={fac.id}
                onClick={() => setSelectedFacultyId(fac.id)}
                className={`px-3 py-1 rounded-lg shrink-0 transition cursor-pointer ${
                  selectedFacultyId === fac.id
                    ? 'bg-[#D4AF37] text-[#2B1914] font-bold'
                    : 'bg-[#2e1a14] text-[#F5E5BD]/70 hover:text-[#F5E5BD]'
                }`}
              >
                {fac.name.split(' ')[0]} {fac.name.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>

        {/* Master-Detail Content Split */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[#D4AF37]/20">
          {/* Books List (5 Cols) */}
          <div className="md:col-span-5 p-4 overflow-y-auto space-y-3 max-h-[60vh] md:max-h-none">
            <div className="text-xs text-[#E7C779] font-semibold flex items-center justify-between">
              <span>أمهات المصنفات المعروضة:</span>
              <span className="font-mono text-[#D4AF37]">{filteredBooks.length} كتاب محقق</span>
            </div>

            <div className="space-y-2.5">
              {filteredBooks.map((book) => {
                const isSelected = selectedBook?.id === book.id;
                return (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer text-right space-y-1.5 ${
                      isSelected
                        ? 'bg-[#3A241B] border-[#D4AF37] shadow-lg shadow-black/40'
                        : 'bg-[#1e100c] border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-[#281510]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm font-amiri text-[#F5E5BD] leading-snug">
                        {book.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#E7C779] border border-[#D4AF37]/30 shrink-0 font-mono">
                        {book.yearPublished}م
                      </span>
                    </div>

                    <div className="text-xs text-[#D4AF37]">{book.author}</div>
                    <div className="text-[11px] text-[#F5E5BD]/60 line-clamp-2">
                      {book.synopsis}
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[10px] text-[#F5E5BD]/50 font-mono">
                      <span>{book.volumesCount} مجلد</span>
                      <span>•</span>
                      <span>{book.pagesCount.toLocaleString('ar-EG')} صفحة</span>
                      <span>•</span>
                      <span className="text-emerald-400">{book.digitizationStatus}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Book Reader / Excerpt Inspector (7 Cols) */}
          <div className="md:col-span-7 p-5 overflow-y-auto space-y-5 bg-[#1a0e0b]">
            {selectedBook ? (
              <div className="space-y-5">
                {/* Book Header Card */}
                <div className="p-5 rounded-2xl bg-[#2e1a14] border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        <span>{selectedBook.subCategory}</span>
                      </div>
                      <h3 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                        {selectedBook.title}
                      </h3>
                      <div className="text-xs text-[#E7C779]">
                        المؤلف: {selectedBook.author} ({selectedBook.authorEra})
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div className="text-xs text-[#F5E5BD]/60">سنة الصدور</div>
                      <div className="text-base font-bold font-mono text-[#D4AF37]">
                        {selectedBook.yearPublished}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#F5E5BD]/80 leading-relaxed">
                    {selectedBook.historicalSignificance}
                  </p>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-[#F5E5BD]/70">
                    <strong className="text-[#D4AF37]">الأثر في عقل المستشار عطيه الهلباوي: </strong>
                    {selectedBook.relevanceToLegalMind}
                  </div>
                </div>

                {/* Verified Excerpts Section */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#E7C779] font-amiri flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#D4AF37]" />
                    <span>المتون والنصوص المحققة المعتمدة من المرجع:</span>
                  </h4>

                  <div className="space-y-3">
                    {selectedBook.verifiedExcerpts.map((exc, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#24130f] border border-[#D4AF37]/25 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between text-xs text-[#D4AF37]">
                          <span className="font-semibold">{exc.chapter}</span>
                          <span className="text-[10px] font-mono text-[#F5E5BD]/50">{exc.pageOrSection}</span>
                        </div>
                        <p className="text-xs text-[#F5E5BD] leading-relaxed font-amiri text-sm bg-black/20 p-3 rounded-lg border-r-2 border-[#D4AF37]">
                          {exc.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Citation Box */}
                <div className="p-4 rounded-xl bg-[#2e1a14] border border-[#D4AF37]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#D4AF37]">صيغة التوثيق والاستشهاد القضائي (Citation):</span>
                    <button
                      onClick={() => handleCopyCitation(selectedBook.citationFormat)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#E7C779] flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedCitation ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ التوثيق</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-[#F5E5BD]/70 font-mono bg-black/40 p-2.5 rounded-lg border border-white/5">
                    {selectedBook.citationFormat}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#F5E5BD]/40 space-y-3">
                <BookOpen className="w-12 h-12 text-[#D4AF37]/30" />
                <p className="text-xs">اختر كتاباً من القائمة الجانبية لتصفح متونه ومصادره المحققة</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D4AF37]/25 bg-[#1e100c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>كافة الكتب والمراجع مفهرسة ومربوطة بمحرك الاستدلال الذكي دون انقطاع</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold text-xs hover:brightness-110 shadow-lg transition cursor-pointer"
          >
            إغلاق المكتبة
          </button>
        </div>
      </div>
    </div>
  );
};
