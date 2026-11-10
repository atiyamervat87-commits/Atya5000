import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  History,
  FileText,
  Scale,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Check,
  Printer,
  Trash2,
  Star,
  Plus,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
  X,
  FileCode,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  LegalHistoryEntry,
  CaseQueryEntry,
  DraftDocumentEntry,
  HistoryItemType,
  LegalBranchType,
  DocumentCategoryType,
} from '../types/legalHistory';
import {
  getHistoryEntries,
  addHistoryEntry,
  updateHistoryEntry,
  deleteHistoryEntry,
  toggleStarEntry,
  clearAllHistory,
  resetToSeedHistory,
  exportHistoryToJSON,
  exportHistoryToMarkdown,
  exportHistoryToText,
  importHistoryFromJSON,
  HISTORY_EVENT_NAME,
  BRANCH_LABELS,
} from '../utils/legalHistoryStorage';

interface LegalHistoryProps {
  onBackToHome?: () => void;
  onOpenConsultation?: () => void;
}

export const LegalHistory: React.FC<LegalHistoryProps> = ({
  onBackToHome,
  onOpenConsultation,
}) => {
  const [entries, setEntries] = useState<LegalHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'queries' | 'drafts' | 'starred'>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<LegalHistoryEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Entry Form State
  const [newType, setNewType] = useState<HistoryItemType>('case_query');
  const [newTitle, setNewTitle] = useState('');
  const [newBranch, setNewBranch] = useState<LegalBranchType>('civil');
  const [newQueryText, setNewQueryText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [newDraftCategory, setNewDraftCategory] = useState<DocumentCategoryType>('عقد');
  const [newDraftContent, setNewDraftContent] = useState('');

  // Load entries on mount & subscribe to changes
  useEffect(() => {
    setEntries(getHistoryEntries());

    const handleStorageChange = () => {
      setEntries(getHistoryEntries());
    };

    window.addEventListener(HISTORY_EVENT_NAME, handleStorageChange);
    return () => {
      window.removeEventListener(HISTORY_EVENT_NAME, handleStorageChange);
    };
  }, []);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      // Tab filter
      if (activeTab === 'queries' && item.type !== 'case_query') return false;
      if (activeTab === 'drafts' && item.type !== 'draft_document') return false;
      if (activeTab === 'starred' && !item.isStarred) return false;

      // Branch filter
      if (selectedBranch !== 'all' && item.branch !== selectedBranch) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inBranch = item.branchLabel.toLowerCase().includes(q);
        const inTags = item.tags?.some((t) => t.toLowerCase().includes(q)) || false;

        if (item.type === 'case_query') {
          const inQuery = item.query.toLowerCase().includes(q);
          const inAnswer = item.directAnswer.toLowerCase().includes(q);
          const inCharacter = item.characterization.toLowerCase().includes(q);
          return inTitle || inBranch || inTags || inQuery || inAnswer || inCharacter;
        } else {
          const inContent = item.content.toLowerCase().includes(q);
          const inCategory = item.documentCategory.toLowerCase().includes(q);
          return inTitle || inBranch || inTags || inContent || inCategory;
        }
      }

      return true;
    });
  }, [entries, activeTab, selectedBranch, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = entries.length;
    const queries = entries.filter((e) => e.type === 'case_query').length;
    const drafts = entries.filter((e) => e.type === 'draft_document').length;
    const starred = entries.filter((e) => e.isStarred).length;
    return { total, queries, drafts, starred };
  }, [entries]);

  // Copy handler
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle star
  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStarEntry(id);
    setEntries(getHistoryEntries());
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry((prev) => (prev ? { ...prev, isStarred: !prev.isStarred } : null));
    }
  };

  // Delete entry
  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('هل تريد بالتأكيد إزالة هذا الإدخال من سجل الجلسة؟')) {
      deleteHistoryEntry(id);
      setEntries(getHistoryEntries());
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    }
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('هل تريد مسح سجل الجلسة بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) {
      clearAllHistory();
      setEntries([]);
      setSelectedEntry(null);
    }
  };

  // Print single entry or full
  const handlePrint = () => {
    window.print();
  };

  // Import file handler
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importHistoryFromJSON(content);
      if (res.success) {
        setEntries(getHistoryEntries());
        setImportStatus(`تم بنجاح استيراد ${res.count || 0} عنصراً إلى سجل الجلسة.`);
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        alert(res.error || 'فشل استيراد الملف');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle New Entry Submission
  const handleCreateNewEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('يرجى إدخال عنوان الإدخال.');
      return;
    }

    if (newType === 'case_query') {
      if (!newQueryText.trim()) {
        alert('يرجى كتابة نص الاستفسار أو الواقعة.');
        return;
      }
      addHistoryEntry({
        type: 'case_query',
        title: newTitle.trim(),
        branch: newBranch,
        branchLabel: BRANCH_LABELS[newBranch] || 'قانون عام',
        status: 'مكتمل',
        query: newQueryText.trim(),
        characterization: `تكييف قضائي لمسألة: ${newTitle.trim()}`,
        directAnswer: newAnswerText.trim() || 'تم تسجيل المسألة للمتابعة القضائية وفحص المواعيد.',
        isStarred: false,
        sourceRoom: 'manual',
        tags: [BRANCH_LABELS[newBranch], 'استشارة يدوية'],
      });
    } else {
      if (!newDraftContent.trim()) {
        alert('يرجى إدخال نص المسودة.');
        return;
      }
      const words = newDraftContent.trim().split(/\s+/).length;
      const clauses = (newDraftContent.match(/البند|المادة/g) || []).length || 3;
      addHistoryEntry({
        type: 'draft_document',
        title: newTitle.trim(),
        documentCategory: newDraftCategory,
        branch: newBranch,
        branchLabel: BRANCH_LABELS[newBranch] || 'قانون عام',
        status: 'مسودة أولية',
        content: newDraftContent.trim(),
        wordCount: words,
        clausesCount: clauses,
        isStarred: false,
        sourceRoom: 'manual',
        tags: [newDraftCategory, BRANCH_LABELS[newBranch]],
      });
    }

    setEntries(getHistoryEntries());
    setIsNewEntryModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewQueryText('');
    setNewAnswerText('');
    setNewDraftContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#352119] to-[#1f120e] border border-[#D4AF37]/35 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 text-right">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-inner">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold font-amiri text-[#F5E5BD]">
                  سجل القضايا والمسودات القضائية
                </h1>
                <span className="text-[11px] text-[#D4AF37] font-mono font-medium">
                  (Legal History Tracker)
                </span>
              </div>
              <p className="text-xs text-[#F5E5BD]/70">
                مكتب المستشار عطيه الهلباوي • تتبع آلي لاستشارات الجلسة، وصياغات العقود، والمذكرات مع إمكانية التصدير المتعدد
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* New Entry Button */}
          <button
            onClick={() => setIsNewEntryModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold shadow-md hover:brightness-105 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل إدخال جديد</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1f120e] hover:bg-[#3A241B] text-[#E7C779] border border-[#D4AF37]/40 font-medium transition cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>تصدير السجل</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isExportMenuOpen && (
              <div
                className="absolute left-0 mt-1.5 w-52 rounded-xl bg-[#2B1914] border border-[#D4AF37]/40 shadow-2xl py-1.5 z-50 text-right text-xs divide-y divide-[#D4AF37]/15"
                onMouseLeave={() => setIsExportMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] text-[#D4AF37] font-semibold">
                  اختر صيغة حفظ وتصدير الجلسة:
                </div>
                <div>
                  <button
                    onClick={() => {
                      exportHistoryToJSON();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-right px-3.5 py-2 hover:bg-[#3A241B] text-[#F5E5BD] flex items-center justify-between cursor-pointer"
                  >
                    <span>تصدير ملف JSON (نسخة احتياطية كاملة)</span>
                    <FileCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                  <button
                    onClick={() => {
                      exportHistoryToMarkdown();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-right px-3.5 py-2 hover:bg-[#3A241B] text-[#F5E5BD] flex items-center justify-between cursor-pointer"
                  >
                    <span>تصدير ملف Markdown (.md)</span>
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                  <button
                    onClick={() => {
                      exportHistoryToText();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-right px-3.5 py-2 hover:bg-[#3A241B] text-[#F5E5BD] flex items-center justify-between cursor-pointer"
                  >
                    <span>تصدير ملف نصي (.txt)</span>
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                  <button
                    onClick={() => {
                      handlePrint();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-right px-3.5 py-2 hover:bg-[#3A241B] text-[#F5E5BD] flex items-center justify-between cursor-pointer"
                  >
                    <span>طباعة السجل بالكامل</span>
                    <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Import Backup JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD]/80 hover:text-[#F5E5BD] border border-[#D4AF37]/25 font-medium transition cursor-pointer"
            title="استيراد سجل جلسة محفوظ مسبقاً (JSON)"
          >
            <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">استيراد جلسة</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json,application/json"
            className="hidden"
          />

          {/* Seed Reset */}
          <button
            onClick={resetToSeedHistory}
            className="p-2 rounded-xl bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD]/60 hover:text-[#D4AF37] border border-[#D4AF37]/20 transition cursor-pointer"
            title="استعادة نماذج القضايا الافتراضية"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Clear All */}
          {entries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 rounded-xl bg-[#1f120e] hover:bg-rose-950/40 text-rose-300/70 hover:text-rose-200 border border-transparent hover:border-rose-800 transition cursor-pointer"
              title="مسح سجل الجلسة بالكامل"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Import feedback banner */}
      {importStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Metrics Strip (Tabular Figures) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
        <div className="p-3.5 rounded-xl bg-[#2B1914]/80 border border-[#D4AF37]/25 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#F5E5BD]/60">إجمالي المسائل</div>
            <div className="text-xl font-bold font-mono text-[#F5E5BD] tabular-nums mt-0.5">
              {stats.total}
            </div>
          </div>
          <Layers className="w-5 h-5 text-[#D4AF37]/60" />
        </div>

        <div className="p-3.5 rounded-xl bg-[#2B1914]/80 border border-[#D4AF37]/25 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#F5E5BD]/60">استشارات وقضايا</div>
            <div className="text-xl font-bold font-mono text-amber-300 tabular-nums mt-0.5">
              {stats.queries}
            </div>
          </div>
          <Scale className="w-5 h-5 text-amber-400/60" />
        </div>

        <div className="p-3.5 rounded-xl bg-[#2B1914]/80 border border-[#D4AF37]/25 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#F5E5BD]/60">مسودات ومحررات</div>
            <div className="text-xl font-bold font-mono text-emerald-300 tabular-nums mt-0.5">
              {stats.drafts}
            </div>
          </div>
          <FileText className="w-5 h-5 text-emerald-400/60" />
        </div>

        <div className="p-3.5 rounded-xl bg-[#2B1914]/80 border border-[#D4AF37]/25 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#F5E5BD]/60">المفضلة والمميزة</div>
            <div className="text-xl font-bold font-mono text-[#D4AF37] tabular-nums mt-0.5">
              {stats.starred}
            </div>
          </div>
          <Star className="w-5 h-5 text-[#D4AF37]/60" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#2B1914]/80 border border-[#D4AF37]/25 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Functional Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#1a0e0b] border border-[#D4AF37]/20 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-sm'
                : 'text-[#F5E5BD]/70 hover:text-[#F5E5BD]'
            }`}
          >
            الكل ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'queries'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-sm'
                : 'text-[#F5E5BD]/70 hover:text-[#F5E5BD]'
            }`}
          >
            الاستشارات ({stats.queries})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'drafts'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-sm'
                : 'text-[#F5E5BD]/70 hover:text-[#F5E5BD]'
            }`}
          >
            المسودات ({stats.drafts})
          </button>
          <button
            onClick={() => setActiveTab('starred')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'starred'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-sm'
                : 'text-[#F5E5BD]/70 hover:text-[#F5E5BD]'
            }`}
          >
            <Star className="w-3 h-3 text-[#D4AF37]" />
            <span>المميزة ({stats.starred})</span>
          </button>
        </div>

        {/* Search input & Branch filter */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#F5E5BD]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الوقائع، التكييف، المواد، أو بنود العقود..."
              className="w-full pr-9 pl-3 py-1.5 rounded-lg bg-[#1a0e0b] border border-[#D4AF37]/25 text-xs text-[#F5E5BD] placeholder-[#F5E5BD]/40 focus:outline-none focus:border-[#D4AF37] transition font-sans"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#1a0e0b] border border-[#D4AF37]/25 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] transition"
          >
            <option value="all">جميع الفروع</option>
            <option value="civil">مدني وعقود</option>
            <option value="criminal">جنائي وإجراءات</option>
            <option value="labor">عمالي وتأمينات</option>
            <option value="tenancy">إيجارات وإخلاء</option>
            <option value="commercial">تجاري وشركات</option>
            <option value="administrative">مجلس دولة</option>
            <option value="personal_status">أحوال شخصية</option>
            <option value="real_estate">شهر عقاري</option>
          </select>
        </div>
      </div>

      {/* Main Content View: Split Master-Detail or Cards Grid */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#2B1914]/50 border border-[#D4AF37]/20 space-y-3">
          <BookOpen className="w-10 h-10 text-[#D4AF37]/50 mx-auto" />
          <h3 className="text-base font-bold font-amiri text-[#F5E5BD]">
            لا توجد استشارات أو مسودات مطابقة للبحث
          </h3>
          <p className="text-xs text-[#F5E5BD]/60 max-w-md mx-auto">
            {searchQuery
              ? 'جرّب البحث بكلمات أخرى أو اختر فرعاً قانونياً مختلفاً.'
              : 'سجل الجلسة فارغ حالياً. يمكنك طرح استشارة جديدة من غرفة الاستشارات أو تسجيل مسودة يدوياً.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBranch('all');
                  setActiveTab('all');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#3A241B] text-xs text-[#F5E5BD] hover:bg-[#D4AF37]/20 transition cursor-pointer"
              >
                إعادة ضبط الفلاتر
              </button>
            )}
            <button
              onClick={resetToSeedHistory}
              className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs text-[#E7C779] hover:bg-[#D4AF37]/30 transition cursor-pointer"
            >
              تحميل أمثلة القضايا
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List of Entries (Left side in LTR, Right side in RTL) */}
          <div className={`space-y-3 ${selectedEntry ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
            {filteredEntries.map((item) => {
              const isSelected = selectedEntry?.id === item.id;
              const isQuery = item.type === 'case_query';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEntry(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-right space-y-2 relative group ${
                    isSelected
                      ? 'bg-[#3A241B] border-[#D4AF37] shadow-lg shadow-black/40'
                      : 'bg-[#2B1914]/85 border-[#D4AF37]/25 hover:border-[#D4AF37]/50 hover:bg-[#321c16]'
                  }`}
                >
                  {/* Top Line: Branch, Date, Star, Actions */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Unboxed Metadata with · separator */}
                    <div className="flex items-center gap-2 text-xs text-[#F5E5BD]/70 font-sans">
                      <span className="font-semibold text-[#D4AF37]">{item.branchLabel}</span>
                      <span aria-hidden="true" className="text-[#D4AF37]/40">·</span>
                      <span className="font-mono tabular-nums text-[11px] text-[#F5E5BD]/60">
                        {item.formattedDate}
                      </span>
                      <span aria-hidden="true" className="text-[#D4AF37]/40">·</span>
                      <span className="text-[11px] text-[#F5E5BD]/60">
                        {isQuery ? 'استشارة' : (item as DraftDocumentEntry).documentCategory}
                      </span>
                    </div>

                    {/* Quick item actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleToggleStar(item.id, e)}
                        className={`p-1 rounded hover:bg-[#1a0e0b] transition cursor-pointer ${
                          item.isStarred ? 'text-[#D4AF37]' : 'text-[#F5E5BD]/30 hover:text-[#D4AF37]'
                        }`}
                        title={item.isStarred ? 'إزالة من المميزة' : 'إضافة إلى المفضلة'}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const copyContent =
                            item.type === 'case_query'
                              ? `${item.title}\n\nالتكييف القضائي:\n${item.characterization}\n\nالرأي المباشر:\n${item.directAnswer}`
                              : (item as DraftDocumentEntry).content;
                          handleCopyText(copyContent, item.id);
                        }}
                        className="p-1 rounded text-[#F5E5BD]/50 hover:text-[#E7C779] hover:bg-[#1a0e0b] transition cursor-pointer"
                        title="نسخ المحتوى"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1 rounded text-[#F5E5BD]/30 hover:text-rose-400 hover:bg-[#1a0e0b] transition cursor-pointer opacity-0 group-hover:opacity-100"
                        title="حذف من السجل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold font-amiri text-[#F5E5BD] group-hover:text-[#E7C779] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Body Preview */}
                  <p className="text-xs text-[#F5E5BD]/75 line-clamp-2 leading-relaxed font-sans">
                    {isQuery
                      ? (item as CaseQueryEntry).directAnswer
                      : (item as DraftDocumentEntry).content.slice(0, 180)}
                  </p>

                  {/* Bottom Line: Tags & Status (Unboxed text) */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#D4AF37]/10 text-[11px] text-[#F5E5BD]/60">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37]/80 font-medium">الحالة: {item.status}</span>
                      {!isQuery && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {(item as DraftDocumentEntry).wordCount} كلمة
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold">
                      <span>عرض التفاصيل</span>
                      <ArrowRight className="w-3 h-3 rotate-180" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Inspection Drawer (When an entry is selected) */}
          {selectedEntry && (
            <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/40 shadow-2xl space-y-5 text-right sticky top-24">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[#D4AF37]/20 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-sans mb-1">
                    <span>{selectedEntry.branchLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{selectedEntry.formattedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedEntry.status}</span>
                  </div>
                  <h2 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                    {selectedEntry.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleToggleStar(selectedEntry.id, e)}
                    className={`p-2 rounded-lg bg-[#1a0e0b] hover:bg-[#3A241B] transition cursor-pointer ${
                      selectedEntry.isStarred ? 'text-[#D4AF37]' : 'text-[#F5E5BD]/40 hover:text-[#D4AF37]'
                    }`}
                    title="تمييز بنجمة"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => {
                      const textToCopy =
                        selectedEntry.type === 'case_query'
                          ? `# ${selectedEntry.title}\n\n## التكييف القضائي:\n${(selectedEntry as CaseQueryEntry).characterization}\n\n## الرأي المباشر:\n${(selectedEntry as CaseQueryEntry).directAnswer}`
                          : (selectedEntry as DraftDocumentEntry).content;
                      handleCopyText(textToCopy, selectedEntry.id);
                    }}
                    className="p-2 rounded-lg bg-[#1a0e0b] hover:bg-[#3A241B] text-[#F5E5BD]/70 hover:text-[#E7C779] transition cursor-pointer"
                    title="نسخ المحتوى كاملاً"
                  >
                    {copiedId === selectedEntry.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 rounded-lg bg-[#1a0e0b] hover:bg-[#3A241B] text-[#F5E5BD]/50 hover:text-[#F5E5BD] transition cursor-pointer"
                    title="إغلاق المعاينة"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specific Content for Case Queries */}
              {selectedEntry.type === 'case_query' && (
                <div className="space-y-4 text-xs font-sans">
                  {/* Facts / Query */}
                  <div className="p-3.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/20 space-y-1">
                    <span className="text-[11px] font-semibold text-[#D4AF37] block">
                      واقعة الاستفسار المطروحة:
                    </span>
                    <p className="text-[#F5E5BD]/85 leading-relaxed font-sans">
                      {(selectedEntry as CaseQueryEntry).query}
                    </p>
                  </div>

                  {/* Characterization */}
                  <div className="p-3.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/20 space-y-1">
                    <span className="text-[11px] font-semibold text-[#D4AF37] flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" />
                      <span>التكييف القضائي السليم:</span>
                    </span>
                    <p className="text-[#F5E5BD] font-medium leading-relaxed">
                      {(selectedEntry as CaseQueryEntry).characterization}
                    </p>
                  </div>

                  {/* Direct Answer */}
                  <div className="p-3.5 rounded-xl bg-[#352119] border border-[#D4AF37]/30 space-y-1.5">
                    <span className="text-[11px] font-bold text-[#E7C779] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>الرأي القانوني وخلاصة الفتوى القضائية:</span>
                    </span>
                    <p className="text-[#F5E5BD] leading-relaxed whitespace-pre-wrap">
                      {(selectedEntry as CaseQueryEntry).directAnswer}
                    </p>
                  </div>

                  {/* Statutory Basis */}
                  {(selectedEntry as CaseQueryEntry).statutoryBasis &&
                    (selectedEntry as CaseQueryEntry).statutoryBasis!.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/20 space-y-2">
                        <span className="text-[11px] font-semibold text-[#D4AF37] flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>الأسانيد والنصوص التشريعية المصرية الحاكمة:</span>
                        </span>
                        <div className="space-y-1.5">
                          {(selectedEntry as CaseQueryEntry).statutoryBasis!.map((stat, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-2 rounded bg-[#2B1914] border border-[#D4AF37]/15 text-[11px]"
                            >
                              <div className="font-semibold text-[#E7C779]">
                                {stat.lawName} — {stat.articleNumber}
                              </div>
                              <div className="text-[#F5E5BD]/70 mt-0.5">{stat.summary}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Cassation Ruling */}
                  {(selectedEntry as CaseQueryEntry).cassationPrinciple && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-[#D4AF37]/30 text-amber-200/90 text-xs">
                      <span className="font-bold text-[#D4AF37] block mb-1">
                        🏛️ قضاء محكمة النقض المستقر في الواقعة:
                      </span>
                      <blockquote className="italic font-amiri text-sm leading-relaxed text-[#F5E5BD]">
                        «{(selectedEntry as CaseQueryEntry).cassationPrinciple}»
                      </blockquote>
                    </div>
                  )}

                  {/* Recommended Steps */}
                  {(selectedEntry as CaseQueryEntry).recommendedSteps &&
                    (selectedEntry as CaseQueryEntry).recommendedSteps!.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/20 space-y-2">
                        <span className="text-[11px] font-semibold text-[#D4AF37]">
                          📋 خطة التحرك الإجرائي والدفاع العملي:
                        </span>
                        <ol className="list-decimal list-inside space-y-1 text-[#F5E5BD]/85 text-xs">
                          {(selectedEntry as CaseQueryEntry).recommendedSteps!.map((step, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                </div>
              )}

              {/* Specific Content for Draft Documents */}
              {selectedEntry.type === 'draft_document' && (
                <div className="space-y-4 text-xs font-sans">
                  {/* Document Meta Strip */}
                  <div className="p-3 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3 text-xs text-[#F5E5BD]/70">
                    <div>
                      <span>تصنيف المحرر: </span>
                      <span className="font-semibold text-[#E7C779]">
                        {(selectedEntry as DraftDocumentEntry).documentCategory}
                      </span>
                    </div>
                    <div>
                      <span>الحجم: </span>
                      <span className="font-mono tabular-nums text-[#F5E5BD]">
                        {(selectedEntry as DraftDocumentEntry).wordCount} كلمة
                      </span>
                    </div>
                    <div>
                      <span>البنود: </span>
                      <span className="font-mono tabular-nums text-[#F5E5BD]">
                        {(selectedEntry as DraftDocumentEntry).clausesCount} بنداً
                      </span>
                    </div>
                  </div>

                  {/* Full Document Draft Preview */}
                  <div className="p-4 rounded-xl bg-[#1a0e0b]/90 border border-[#D4AF37]/25 text-xs text-[#F5E5BD] leading-relaxed whitespace-pre-wrap font-sans max-h-96 overflow-y-auto selection:bg-[#D4AF37]/30">
                    {(selectedEntry as DraftDocumentEntry).content}
                  </div>

                  {/* Confidential Legal Disclaimer */}
                  <div className="p-3 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/15 text-[11px] text-[#F5E5BD]/60 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>
                      المسودة محفوظة ومحمية ضمن سياق الجلسة المشفر لمكتب المستشار عطيه الهلباوي.
                    </span>
                  </div>
                </div>
              )}

              {/* Footer actions inside detail */}
              <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/15">
                <button
                  onClick={() => handleDelete(selectedEntry.id)}
                  className="px-3 py-1.5 rounded-lg text-rose-300 hover:bg-rose-950/40 text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الإدخال</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text =
                        selectedEntry.type === 'case_query'
                          ? (selectedEntry as CaseQueryEntry).directAnswer
                          : (selectedEntry as DraftDocumentEntry).content;
                      handleCopyText(text, selectedEntry.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#3A241B] hover:bg-[#D4AF37]/20 text-[#E7C779] text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedId === selectedEntry.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>نسخ</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة المحرر</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add New Entry to Session History */}
      {isNewEntryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-[#2B1914] border border-[#D4AF37]/50 shadow-2xl p-6 text-right space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <h3 className="text-lg font-bold font-amiri text-[#F5E5BD]">
                تسجيل استشارة أو مسودة جديدة في سجل الجلسة
              </h3>
              <button
                onClick={() => setIsNewEntryModalOpen(false)}
                className="p-1 rounded text-[#F5E5BD]/60 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewEntry} className="space-y-4 text-xs font-sans">
              {/* Type selector */}
              <div>
                <label className="block text-[#F5E5BD]/80 font-semibold mb-1.5">
                  نوع الإدخال:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewType('case_query')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                      newType === 'case_query'
                        ? 'bg-[#D4AF37] text-[#2B1914] border-[#D4AF37]'
                        : 'bg-[#1a0e0b] text-[#F5E5BD]/70 border-[#D4AF37]/25 hover:bg-[#321c16]'
                    }`}
                  >
                    استشارة وقضية موضوعية
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('draft_document')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                      newType === 'draft_document'
                        ? 'bg-[#D4AF37] text-[#2B1914] border-[#D4AF37]'
                        : 'bg-[#1a0e0b] text-[#F5E5BD]/70 border-[#D4AF37]/25 hover:bg-[#321c16]'
                    }`}
                  >
                    مسودة محرر أو عقد قانوني
                  </button>
                </div>
              </div>

              {/* Title & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                    عنوان المسألة أو المحرر:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: نزاع عقد مقاولة، أو مسودة عقد بيع أرض..."
                    className="w-full px-3 py-2 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] transition font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                    الفرع القانوني:
                  </label>
                  <select
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value as LegalBranchType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] transition font-sans"
                  >
                    <option value="civil">القانون المدني والعقود</option>
                    <option value="criminal">القانون الجنائي والإجراءات</option>
                    <option value="labor">قانون العمل والتأمينات</option>
                    <option value="tenancy">الإيجارات وإخلاء الأماكن</option>
                    <option value="commercial">القانون التجاري والشركات</option>
                    <option value="administrative">مجلس الدولة والقضاء الإداري</option>
                    <option value="personal_status">الأحوال الشخصية والأسرة</option>
                    <option value="real_estate">الشهر العقاري والتسجيل</option>
                  </select>
                </div>
              </div>

              {/* Conditional Fields */}
              {newType === 'case_query' ? (
                <>
                  <div>
                    <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                      سرد الواقعة أو الاستفسار:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newQueryText}
                      onChange={(e) => setNewQueryText(e.target.value)}
                      placeholder="اكتب وقائع القضية أو السؤال المطروح بالتفصيل..."
                      className="w-full p-2.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] transition font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                      الرأي القانوني المباشر أو التوجيه (اختياري):
                    </label>
                    <textarea
                      rows={3}
                      value={newAnswerText}
                      onChange={(e) => setNewAnswerText(e.target.value)}
                      placeholder="خلاصة الحل القضائي، أو الإجراءات المنصوح بها..."
                      className="w-full p-2.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] transition font-sans"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                      تصنيف المحرر:
                    </label>
                    <select
                      value={newDraftCategory}
                      onChange={(e) => setNewDraftCategory(e.target.value as DocumentCategoryType)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] transition font-sans"
                    >
                      <option value="عقد">عقد اتفاق أو بيع أو إيجار</option>
                      <option value="مذكرة دفاع">مذكرة دفاع ودفوع قضائية</option>
                      <option value="صحيفة دعوى">صحيفة افتتاح دعوى</option>
                      <option value="إنذار رسمي">إنذار رسمي على يد محضر</option>
                      <option value="إيصال أمانة">إيصال أمانة ومخالصة مالية</option>
                      <option value="طلب قضائي">طلب قضائي وأمر على عريضة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#F5E5BD]/80 font-semibold mb-1">
                      نص المسودة القانونية (Markdown):
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={newDraftContent}
                      onChange={(e) => setNewDraftContent(e.target.value)}
                      placeholder="اكتب بنود العقد أو مذكرة الدفاع بأركانها القانونية..."
                      className="w-full p-2.5 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37] transition font-mono leading-relaxed"
                    />
                  </div>
                </>
              )}

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => setIsNewEntryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1a0e0b] text-[#F5E5BD]/70 hover:text-white transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold shadow-md hover:brightness-105 transition cursor-pointer"
                >
                  حفظ في سجل الجلسة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
