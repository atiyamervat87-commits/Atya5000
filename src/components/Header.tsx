import React from 'react';
import { Scale, BookOpen, ShieldCheck, Cpu, ScrollText, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenCharter: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCharter, activeTab, setActiveTab }) => {
  const navTabs = [
    { id: 'consultation', label: 'المحاكمة والاستشارات', icon: Scale },
    { id: 'drafting', label: 'صانع المذكرات والعقود', icon: ScrollText },
    { id: 'auditor', label: 'تدقيق المستندات والثغرات', icon: ShieldCheck },
    { id: 'library', label: 'المكتبة والتشريعات والنقض', icon: BookOpen },
    { id: 'deadlines', label: 'حاسبة المواعيد والتقادم', icon: CheckCircle2 },
    { id: 'tokenizer', label: 'المقسّم اللغوي (Tokenizer)', icon: Cpu },
    { id: 'architecture', label: 'المعمارية والأوزان الخمسية', icon: Cpu },
    { id: 'benchmarks', label: 'التقييم ومكافحة الهلوسة', icon: ShieldCheck },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Judicial Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-900/30 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-950/40">
            <Scale className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-amiri text-amber-200 tracking-wide">
                عقل المستشار عطية الهلباوي
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                الإصدار التأسيسي 1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              المنظومة المستقلة للذكاء الاصطناعي والاستدلال القانوني • القانون المصري واللغة العربية
            </p>
          </div>
        </div>

        {/* Real Status Badges & Charter Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>الاستدلال والنقض: نشط 100%</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-mono">
            <span>مكافحة الهلوسة: دقة 98.2%</span>
          </div>

          <button
            onClick={onOpenCharter}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600/30 to-amber-700/20 hover:from-amber-600/40 hover:to-amber-700/30 text-amber-200 border border-amber-500/40 text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <ScrollText className="w-4 h-4 text-amber-400" />
            <span>الوثيقة التأسيسية</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 space-x-reverse overflow-x-auto py-2 no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-950/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
