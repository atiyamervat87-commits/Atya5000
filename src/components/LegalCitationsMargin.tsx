import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  Scale,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { LegalCitation } from '../types/citation';

interface LegalCitationsMarginProps {
  citations: LegalCitation[];
  title?: string;
  className?: string;
  mode?: 'sidebar' | 'footer' | 'compact';
  onInsertToDraft?: (citationText: string) => void;
}

export const LegalCitationsMargin: React.FC<LegalCitationsMarginProps> = ({
  citations,
  title = 'هامش التوثيق المرجعي للمواد القانونية (Citations)',
  className = '',
  mode = 'sidebar',
  onInsertToDraft,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterBranch, setFilterBranch] = useState<string>('all');

  if (!citations || citations.length === 0) {
    return null;
  }

  const handleCopyCitation = (c: LegalCitation) => {
    const textToCopy = `«${c.formalCitationText}» — المنشور في: ${c.officialGazette || 'الجريدة الرسمية'}.`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const branches = Array.from(new Set(citations.map((c) => c.branch).filter(Boolean))) as string[];
  const filteredCitations = filterBranch === 'all'
    ? citations
    : citations.filter((c) => c.branch === filterBranch);

  return (
    <aside
      className={`rounded-2xl bg-[#1f120e] border-2 border-[#D4AF37]/35 shadow-xl overflow-hidden text-right font-sans ${className}`}
      aria-label="هامش التوثيق القضائي"
    >
      {/* Header */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#1f120e] border-b border-[#D4AF37]/25 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-inner shrink-0">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold font-amiri text-[#F5E5BD] flex items-center gap-2">
              <span>{title}</span>
              <span className="px-2 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#E7C779] text-[10px] font-mono font-bold border border-[#D4AF37]/30">
                {citations.length} {citations.length === 1 ? 'مادة موثقة' : 'مواد موثقة'}
              </span>
            </h4>
            <p className="text-[10.5px] text-[#F5E5BD]/60 hidden sm:block">
              اسم التشريع ورقم المادة وصيغة التوثيق القضائي المعتمدة للمذكرات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">مطابق للجريدة الرسمية</span>
        </div>
      </div>

      {/* Filter by legal branch if multiple */}
      {branches.length > 1 && (
        <div className="px-3 py-2 bg-[#2B1914]/60 border-b border-[#D4AF37]/15 flex items-center gap-1.5 overflow-x-auto text-[10.5px]">
          <span className="text-[#D4AF37] text-[10px] whitespace-nowrap">الفرع:</span>
          <button
            onClick={() => setFilterBranch('all')}
            className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
              filterBranch === 'all'
                ? 'bg-[#D4AF37] text-[#2B1914] font-bold'
                : 'bg-[#1f120e] text-[#F5E5BD]/70 hover:text-white'
            }`}
          >
            الكل ({citations.length})
          </button>
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setFilterBranch(b)}
              className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                filterBranch === b
                  ? 'bg-[#D4AF37] text-[#2B1914] font-bold'
                  : 'bg-[#1f120e] text-[#F5E5BD]/70 hover:text-white'
              }`}
            >
              {b} ({citations.filter((c) => c.branch === b).length})
            </button>
          ))}
        </div>
      )}

      {/* Citations List in the Margin */}
      <div className="p-3 sm:p-3.5 space-y-2.5 max-h-[600px] overflow-y-auto">
        {filteredCitations.map((c, idx) => {
          const isExpanded = expandedId === c.id;
          const isCopied = copiedId === c.id;

          return (
            <div
              key={c.id || idx}
              className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition space-y-2 shadow-sm group"
            >
              {/* Top Row: Article Number & Legislation Name */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* رقم المادة */}
                    <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-950 to-[#3A241B] text-emerald-300 border border-emerald-500/40 text-[11px] font-bold font-mono shadow-sm">
                      {c.articleNumber}
                    </span>

                    {/* الفرع القضائي */}
                    {c.branch && (
                      <span className="px-1.5 py-0.2 rounded bg-[#1f120e] text-[#D4AF37] text-[9.5px] border border-[#D4AF37]/20 font-sans">
                        {c.branch}
                      </span>
                    )}

                    <span className="text-[10px] text-[#F5E5BD]/50 font-mono">
                      {c.marker}
                    </span>
                  </div>

                  {/* اسم التشريع الصريح */}
                  <h5 className="font-bold text-xs sm:text-[13px] text-[#F5E5BD] group-hover:text-[#E7C779] transition pt-1 leading-snug">
                    {c.lawName}
                  </h5>
                </div>

                {/* Copy Citation Button */}
                <button
                  onClick={() => handleCopyCitation(c)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1f120e] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/30 text-[10.5px] transition cursor-pointer shrink-0 shadow-sm"
                  title="نسخ صيغة التوثيق القضائي للمذكرات"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#D4AF37]" />
                      <span>نسخ التوثيق</span>
                    </>
                  )}
                </button>
              </div>

              {/* Official Gazette reference */}
              {c.officialGazette && (
                <div className="text-[10.5px] text-[#D4AF37]/90 bg-[#1f120e] p-1.5 rounded-lg border border-[#D4AF37]/15 flex items-start gap-1.5 leading-relaxed font-mono">
                  <FileText className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E7C779]">السند والنشر:</strong> {c.officialGazette}
                  </div>
                </div>
              )}

              {/* Formal Judicial Citation Preview */}
              <div className="text-[11px] text-[#F5E5BD]/85 bg-[#180d0a] p-2 rounded-lg border border-[#D4AF37]/20 leading-relaxed font-serif">
                <span className="text-[#D4AF37] text-[10px] block font-sans font-semibold mb-0.5">
                  صيغة الاستشهاد في المذكرات وصحف الدعاوى:
                </span>
                «{c.formalCitationText}»
              </div>

              {/* Collapsible details for Summary and Cassation */}
              {c.summary && (
                <div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    className="flex items-center gap-1 text-[10px] text-[#D4AF37] hover:underline cursor-pointer pt-0.5"
                  >
                    <span>{isExpanded ? 'إخفاء مضمون المادة' : 'عرض نص ومضمون المادة الحاكمة'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-1.5 p-2 rounded-lg bg-[#1f120e] border border-[#D4AF37]/20 text-[11px] text-[#F5E5BD]/80 leading-relaxed font-sans space-y-1 animate-fadeIn">
                      <div className="text-[#E7C779] font-bold text-[10.5px]">{c.articleTitle}</div>
                      <p className="whitespace-pre-wrap">{c.summary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action: Insert directly to draft if available */}
              {onInsertToDraft && (
                <div className="pt-1 border-t border-[#D4AF37]/15 flex justify-end">
                  <button
                    onClick={() => onInsertToDraft(`سنداً للمادة (${c.articleNumber}) من ${c.lawName}`)}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>إدراج في مسودة المذكرة</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Margin Footer */}
      <div className="p-2.5 bg-[#1a0f0c] border-t border-[#D4AF37]/20 flex items-center justify-between text-[10px] text-[#F5E5BD]/60 px-3">
        <span>* موثق آلياً وفق مضابط الجريدة الرسمية المصرية.</span>
        <span className="text-[#D4AF37] font-mono">عقل المستشار عطيه الهلباوي</span>
      </div>
    </aside>
  );
};
