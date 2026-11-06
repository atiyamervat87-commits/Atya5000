import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Scale,
  Award,
  X,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { EGYPTIAN_LEGAL_GLOSSARY, LegalTerm } from '../data/legalGlossary';

interface LegalGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const LegalGlossaryModal: React.FC<LegalGlossaryModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'جميع المصطلحات' },
    { id: 'مدني وعقود', label: 'مدني وعقود' },
    { id: 'جنائي وعقوبات', label: 'جنائي وعقوبات' },
    { id: 'مرافعات وإجراءات', label: 'مرافعات وإجراءات' },
    { id: 'قضاء إداري', label: 'قضاء إداري' },
    { id: 'أسرة وأحوال شخصية', label: 'أحوال شخصية' },
    { id: 'إثبات وطعون', label: 'إثبات وطعون' },
  ];

  const filteredTerms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return EGYPTIAN_LEGAL_GLOSSARY.filter((term) => {
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      const matchesQuery =
        !q ||
        term.term.toLowerCase().includes(q) ||
        term.briefDefinition.toLowerCase().includes(q) ||
        term.detailedDefinition.toLowerCase().includes(q) ||
        term.statutoryBasis.toLowerCase().includes(q) ||
        (term.cassationPrinciple && term.cassationPrinciple.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (term: LegalTerm) => {
    const textToCopy = `المصطلح القانوني: ${term.term}\nالفرع: ${term.category}\nالتعريف: ${term.briefDefinition}\nالشرح القضائي: ${term.detailedDefinition}\nالسند التشريعي: ${term.statutoryBasis}\n${term.cassationPrinciple ? `مبدأ محكمة النقض: ${term.cassationPrinciple}\n` : ''}${term.practicalNote ? `تنبيه عملي: ${term.practicalNote}` : ''}\n\n[معجم المصطلحات القانونية — مكتب المستشار عطيه الهلباوي]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(term.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#2B1914] via-[#1f120e] to-[#160c09] border-2 border-[#D4AF37]/50 shadow-2xl shadow-black/80 overflow-hidden text-right text-xs">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#D4AF37]/25 flex items-center justify-between gap-4 bg-[#231410]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4AF37]/25 to-[#3A241B] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-inner shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-amiri text-[#F5E5BD]">
                  معجم المصطلحات والمفاهيم القانونية المصرية
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E7C779] border border-[#D4AF37]/30 font-bold hidden sm:inline-block">
                  مكتب المستشار عطيه الهلباوي
                </span>
              </div>
              <p className="text-[11px] text-[#F5E5BD]/70 mt-0.5">
                دليل المفاهيم الفقهية، والتكييفات القضائية، وأسانيد الدستور والقانون وأحكام محكمة النقض الحاكمة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#1a0e0b] hover:bg-[#3A241B] text-[#F5E5BD]/70 hover:text-white border border-[#D4AF37]/30 flex items-center justify-center transition cursor-pointer shrink-0"
            title="إغلاق المعجم"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/15 bg-[#1c100d]/90 space-y-3">
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#D4AF37] absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أي مصطلح قانوني (مثل: الشفعة، خيانة أمانة، صحة ونفاذ، الشرط الفاسخ، استئناف)..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/35 text-white placeholder:text-[#F5E5BD]/40 text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-[#F5E5BD]/50 hover:text-white cursor-pointer text-xs"
              >
                مسح
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] text-[#2B1914] font-bold shadow-sm'
                    : 'bg-[#2B1914] text-[#F5E5BD]/70 hover:text-white border border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Count & Note */}
          <div className="flex items-center justify-between text-[11px] text-[#F5E5BD]/60 px-1 pt-0.5">
            <span>عدد النتائج المطابقة: <strong>{filteredTerms.length}</strong> مصطلحاً معتمداً</span>
            <span className="hidden sm:inline">انقر على أي مصطلح لعرض الشرح الفقهي وحكم النقض الحاكم</span>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 custom-scrollbar">
          {filteredTerms.length === 0 ? (
            <div className="p-12 text-center text-[#F5E5BD]/60 space-y-3">
              <Scale className="w-8 h-8 text-[#D4AF37]/50 mx-auto" />
              <p className="text-sm font-semibold">لم يتم العثور على مصطلح يطابق: "{searchQuery}"</p>
              <p className="text-[11px] text-[#F5E5BD]/50">
                يمكنكم البحث بمرادفات أخرى أو طرح السؤال مباشرة في غرفة الاستشارة للمستشار عطيه الهلباوي.
              </p>
            </div>
          ) : (
            filteredTerms.map((term) => {
              const isExpanded = expandedTermId === term.id;
              const isCopied = copiedId === term.id;
              return (
                <div
                  key={term.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'bg-[#2B1914] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10'
                      : 'bg-[#231410]/80 border-[#D4AF37]/25 hover:border-[#D4AF37]/50 hover:bg-[#281712]'
                  }`}
                >
                  {/* Term Header Card */}
                  <div
                    onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                    className="p-4 sm:p-4.5 cursor-pointer flex items-center justify-between gap-4 select-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold font-amiri text-[#F5E5BD] hover:text-[#E7C779] transition">
                          {term.term}
                        </h3>
                        <span className="text-[10px] text-[#D4AF37] font-semibold">
                          · {term.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#F5E5BD]/80 leading-relaxed">
                        {term.briefDefinition}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(term);
                        }}
                        className="p-2 rounded-lg bg-[#1f120e] hover:bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/30 transition cursor-pointer"
                        title="نسخ التعريف والسند"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <div className="w-7 h-7 rounded-lg bg-[#1f120e] flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details View */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-2 border-t border-[#D4AF37]/15 space-y-3.5 bg-[#1c0f0c]/60 text-xs">
                      {/* Detailed Definition */}
                      <div className="space-y-1">
                        <span className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5" />
                          <span>الشرح والتكييف القضائي المفصل:</span>
                        </span>
                        <p className="text-[#F5E5BD]/90 leading-relaxed pl-2 font-sans bg-[#261510] p-3 rounded-xl border border-[#D4AF37]/15">
                          {term.detailedDefinition}
                        </p>
                      </div>

                      {/* Statutory Basis */}
                      <div className="space-y-1">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>السند في التشريع المصري:</span>
                        </span>
                        <div className="text-[#F5E5BD] font-mono text-[11px] bg-[#1a0e0b] p-2.5 rounded-lg border border-[#D4AF37]/20">
                          {term.statutoryBasis}
                        </div>
                      </div>

                      {/* Cassation Precedent */}
                      {term.cassationPrinciple && (
                        <div className="space-y-1">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>مبدأ محكمة النقض / المحكمة الدستورية العليا:</span>
                          </span>
                          <blockquote className="text-emerald-100/90 italic bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 leading-relaxed font-sans">
                            {term.cassationPrinciple}
                          </blockquote>
                        </div>
                      )}

                      {/* Practical Lawyer Note */}
                      {term.practicalNote && (
                        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-[11px] flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-amber-300 mb-0.5">تنبيه قضائي عملي:</span>
                            <p className="leading-relaxed">{term.practicalNote}</p>
                          </div>
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/15 text-[11px]">
                        <span className="text-[#F5E5BD]/50 font-mono">
                          مرجع معتمد • مكتب المستشار عطيه الهلباوي
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(term)}
                            className="px-3 py-1.5 rounded-lg bg-[#2B1914] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 transition cursor-pointer flex items-center gap-1.5"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>تم النسخ بنجاح</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>نسخ المصطلح</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#D4AF37]/20 bg-[#231410] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#F5E5BD]/70">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#D4AF37]" />
            <span>المعجم محدث وفق أحدث تعديلات القوانين المصرية وأحكام محكمة النقض 2024 / 2026</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#2B1914] font-bold hover:brightness-110 transition cursor-pointer"
          >
            إغلاق المعجم
          </button>
        </div>
      </div>
    </div>
  );
};
