import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Scale,
  Building2,
  DollarSign,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Printer,
  Sparkles,
  Search,
  Users,
  Briefcase,
  Flame,
  FileText
} from 'lucide-react';
import { LegalCase, Hearing, CaseStatus } from '../../types/office';

interface VisualCasesAnalyticsDashboardProps {
  cases: LegalCase[];
  hearings: Hearing[];
  onSelectCase?: (caseItem: LegalCase) => void;
  onOpenNewCase?: () => void;
  onOpenNewHearing?: () => void;
}

export const VisualCasesAnalyticsDashboard: React.FC<VisualCasesAnalyticsDashboardProps> = ({
  cases,
  hearings,
  onSelectCase,
  onOpenNewCase,
  onOpenNewHearing,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedCourtFilter, setSelectedCourtFilter] = useState<string>('all');
  const [selectedHearingTimeframe, setSelectedHearingTimeframe] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Status mapping and luxury color definitions
  const STATUS_CONFIG: Record<CaseStatus, { label: string; color: string; bg: string; border: string }> = {
    'متداولة': { label: 'متداولة بالمحكمة', color: '#10b981', bg: 'bg-emerald-950/70', border: 'border-emerald-500/40' },
    'مؤجلة': { label: 'مؤجلة لإجراء / مستندات', color: '#f59e0b', bg: 'bg-amber-950/70', border: 'border-amber-500/40' },
    'محكوم فيها': { label: 'محكوم فيها لصالحنا', color: '#3b82f6', bg: 'bg-blue-950/70', border: 'border-blue-500/40' },
    'قيد الاستئناف': { label: 'قيد الطعن بالاستئناف', color: '#8b5cf6', bg: 'bg-purple-950/70', border: 'border-purple-500/40' },
    'قيد النقض': { label: 'قيد الطعن بالنقض', color: '#06b6d4', bg: 'bg-cyan-950/70', border: 'border-cyan-500/40' },
    'منتهية': { label: 'منتهية بالصلح / التنفيذ', color: '#64748b', bg: 'bg-slate-900/70', border: 'border-slate-500/40' },
  };

  // 1. Calculate Case Status Distribution for the Donut Chart
  const statusStats = useMemo(() => {
    const counts: Record<string, number> = {
      'متداولة': 0,
      'مؤجلة': 0,
      'محكوم فيها': 0,
      'قيد الاستئناف': 0,
      'قيد النقض': 0,
      'منتهية': 0,
    };

    cases.forEach((c) => {
      if (counts[c.status] !== undefined) {
        counts[c.status]++;
      } else {
        counts['متداولة']++;
      }
    });

    const total = cases.length || 1;
    let accumulatedAngle = 0;

    const slices = Object.entries(counts).map(([status, count]) => {
      const percentage = (count / total) * 100;
      const angle = (count / total) * 360;
      const startAngle = accumulatedAngle;
      accumulatedAngle += angle;
      const config = STATUS_CONFIG[status as CaseStatus] || {
        label: status,
        color: '#D4AF37',
        bg: 'bg-[#2B1914]',
        border: 'border-[#D4AF37]',
      };

      return {
        status: status as CaseStatus,
        count,
        percentage: Math.round(percentage),
        startAngle,
        angle,
        config,
      };
    });

    return { counts, total: cases.length, slices };
  }, [cases]);

  // 2. Classify Upcoming Hearings by urgency
  const hearingTimeBuckets = useMemo(() => {
    const now = new Date();
    // Normalize to midnight
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const buckets = {
      urgent48h: [] as Hearing[],
      thisWeek: [] as Hearing[],
      thisMonth: [] as Hearing[],
      later: [] as Hearing[],
    };

    hearings.forEach((h) => {
      const hDate = new Date(h.date);
      const diffMs = hDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 2) {
        buckets.urgent48h.push(h);
      } else if (diffDays > 2 && diffDays <= 7) {
        buckets.thisWeek.push(h);
      } else if (diffDays > 7 && diffDays <= 30) {
        buckets.thisMonth.push(h);
      } else if (diffDays > 30) {
        buckets.later.push(h);
      }
    });

    // Sort by date ascending
    const sorter = (a: Hearing, b: Hearing) => new Date(a.date).getTime() - new Date(b.date).getTime();
    buckets.urgent48h.sort(sorter);
    buckets.thisWeek.sort(sorter);
    buckets.thisMonth.sort(sorter);
    buckets.later.sort(sorter);

    return buckets;
  }, [hearings]);

  // 3. Court Circuit Breakdown
  const courtBreakdown = useMemo(() => {
    const mapping: Record<string, { count: number; casesList: LegalCase[] }> = {
      'محاكم مدنية وتجارية': { count: 0, casesList: [] },
      'محاكم الجنايات والجنح': { count: 0, casesList: [] },
      'محاكم الأسرة (أحوال شخصية)': { count: 0, casesList: [] },
      'القضاء الإداري ومجلس الدولة': { count: 0, casesList: [] },
      'المحاكم الاقتصادية': { count: 0, casesList: [] },
    };

    cases.forEach((c) => {
      const type = (c.type + ' ' + c.court).toLowerCase();
      if (type.includes('أسرة') || type.includes('احوال') || type.includes('أحوال') || type.includes('خلع') || type.includes('نفقة')) {
        mapping['محاكم الأسرة (أحوال شخصية)'].count++;
        mapping['محاكم الأسرة (أحوال شخصية)'].casesList.push(c);
      } else if (type.includes('جنائ') || type.includes('جنح') || type.includes('جناي') || type.includes('عقوبات') || type.includes('أمانة')) {
        mapping['محاكم الجنايات والجنح'].count++;
        mapping['محاكم الجنايات والجنح'].casesList.push(c);
      } else if (type.includes('إدار') || type.includes('مجلس الدولة') || type.includes('تأديب')) {
        mapping['القضاء الإداري ومجلس الدولة'].count++;
        mapping['القضاء الإداري ومجلس الدولة'].casesList.push(c);
      } else if (type.includes('اقتصاد')) {
        mapping['المحاكم الاقتصادية'].count++;
        mapping['المحاكم الاقتصادية'].casesList.push(c);
      } else {
        mapping['محاكم مدنية وتجارية'].count++;
        mapping['محاكم مدنية وتجارية'].casesList.push(c);
      }
    });

    return mapping;
  }, [cases]);

  // 4. Financial Claims Total
  const financialTotals = useMemo(() => {
    let totalClaim = 0;
    cases.forEach((c) => {
      if (c.claimAmount) totalClaim += c.claimAmount;
    });
    return {
      totalClaim,
      totalClaimFormatted: totalClaim.toLocaleString('ar-EG'),
      casesCountWithClaims: cases.filter((c) => (c.claimAmount || 0) > 0).length,
    };
  }, [cases]);

  // Filtered Cases List according to visual selections
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (selectedStatusFilter !== 'all' && c.status !== selectedStatusFilter) return false;
      if (selectedCourtFilter !== 'all') {
        const text = (c.type + ' ' + c.court).toLowerCase();
        if (selectedCourtFilter === 'family' && !text.includes('أسرة') && !text.includes('أحوال') && !text.includes('خلع')) return false;
        if (selectedCourtFilter === 'criminal' && !text.includes('جنائ') && !text.includes('جنح')) return false;
        if (selectedCourtFilter === 'civil' && (text.includes('أسرة') || text.includes('جنائ') || text.includes('جنح'))) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.caseNumber.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.clientName.toLowerCase().includes(q) ||
          c.court.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [cases, selectedStatusFilter, selectedCourtFilter, searchQuery]);

  // Helper to generate SVG Donut Slice Path
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#2B1914] border-2 border-[#D4AF37]/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-inner shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                لوحة المتابعة البصرية والتحليل الإجرائي للقضايا والجلسات
              </h2>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                تفاعلي بالكامل (Interactive)
              </span>
            </div>
            <p className="text-xs text-[#F5E5BD]/70 mt-0.5">
              رسوم بيانية حية لحالات القضايا، ورادار الجلسات العاجلة بالأجندة، وتوزيع الدوائر والمحاكم
            </p>
          </div>
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center gap-2 text-xs flex-wrap self-end md:self-auto">
          {onOpenNewHearing && (
            <button
              onClick={onOpenNewHearing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-semibold transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>إدراج جلسة عاجلة</span>
            </button>
          )}

          {onOpenNewCase && (
            <button
              onClick={onOpenNewCase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold transition hover:brightness-110 cursor-pointer shadow-md"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>قيد دعوى جديدة</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B1914] hover:bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/30 font-semibold transition cursor-pointer"
            title="طباعة التقرير البصري"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Quick KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-[#F5E5BD]/70">
            <span>إجمالي القضايا المقيدة</span>
            <Scale className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#D4AF37]">{cases.length}</div>
          <div className="text-[10px] text-emerald-400">
            {statusStats.counts['متداولة']} متداولة حالياً بالمحاكم
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1f120e] border border-amber-500/30 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-[#F5E5BD]/70">
            <span>جلسات عاجلة (خلال 48 ساعة)</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {hearingTimeBuckets.urgent48h.length}
          </div>
          <div className="text-[10px] text-amber-300">
            تتطلب تجهيز مذكرات ومستندات فوراً
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1f120e] border border-blue-500/30 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-[#F5E5BD]/70">
            <span>جلسات هذا الشهر بالأجندة</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-300">
            {hearingTimeBuckets.urgent48h.length + hearingTimeBuckets.thisWeek.length + hearingTimeBuckets.thisMonth.length}
          </div>
          <div className="text-[10px] text-blue-200">
            موزعة على محاكم القاهرة والجيزة والأسرة
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1f120e] border border-emerald-500/30 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-[#F5E5BD]/70">
            <span>إجمالي المطالبات القضائية</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {financialTotals.totalClaimFormatted} ج.م
          </div>
          <div className="text-[10px] text-emerald-300">
            في {financialTotals.casesCountWithClaims} دعاوى ذات شق مالي
          </div>
        </div>
      </div>

      {/* Main Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: Interactive Donut Chart for Case Status (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2.5">
            <h3 className="font-bold text-sm text-[#F5E5BD] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#D4AF37]" />
              <span>توزيع القضايا حسب الحالة الإجرائية</span>
            </h3>
            <span className="text-[10px] font-mono text-[#D4AF37]">
              انقر على الحالة للتصفية
            </span>
          </div>

          {/* Donut SVG Visual + Center Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-[#2B1914]"
                  strokeWidth="15"
                  fill="none"
                />

                {/* Slices */}
                {statusStats.slices.map((slice, index) => {
                  if (slice.count === 0) return null;
                  const strokeDasharray = `${(slice.angle / 360) * (2 * Math.PI * 38)} ${(2 * Math.PI * 38)}`;
                  const strokeDashoffset = -((slice.startAngle / 360) * (2 * Math.PI * 38));
                  const isHovered = hoveredSlice === slice.status;
                  const isSelected = selectedStatusFilter === slice.status;

                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="38"
                      stroke={slice.config.color}
                      strokeWidth={isSelected || isHovered ? "18" : "15"}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      fill="none"
                      className="transition-all duration-300 cursor-pointer hover:opacity-90"
                      onMouseEnter={() => setHoveredSlice(slice.status)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() => {
                        setSelectedStatusFilter(selectedStatusFilter === slice.status ? 'all' : slice.status);
                      }}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] text-[#F5E5BD]/60 font-medium">الإجمالي</span>
                <span className="text-2xl font-bold font-mono text-[#D4AF37]">
                  {statusStats.total}
                </span>
                <span className="text-[9px] text-emerald-400 font-mono">
                  {hoveredSlice ? `${statusStats.counts[hoveredSlice] || 0} ${hoveredSlice}` : 'قضية ودعوى'}
                </span>
              </div>
            </div>

            {/* Slices Legend / Clickable Chips */}
            <div className="flex-1 space-y-1.5 w-full">
              {statusStats.slices.map((slice, i) => {
                const isSelected = selectedStatusFilter === slice.status;
                const isHovered = hoveredSlice === slice.status;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedStatusFilter(isSelected ? 'all' : slice.status);
                    }}
                    onMouseEnter={() => setHoveredSlice(slice.status)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer text-right border ${
                      isSelected
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5E5BD] font-bold shadow-sm'
                        : isHovered
                        ? 'bg-[#2B1914] border-[#D4AF37]/40 text-[#F5E5BD]'
                        : 'bg-[#1a0f0c] border-[#D4AF37]/15 text-[#F5E5BD]/80 hover:bg-[#2B1914]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: slice.config.color }}
                      />
                      <span className="truncate">{slice.config.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-[#F5E5BD]">{slice.count}</span>
                      <span className="text-[10px] text-[#D4AF37]/80">({slice.percentage}%)</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedStatusFilter !== 'all' && (
            <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-amber-300">
              <span>تصفية نشطة: عرض قضايا ({selectedStatusFilter})</span>
              <button
                onClick={() => setSelectedStatusFilter('all')}
                className="underline hover:text-amber-200 cursor-pointer text-[11px]"
              >
                إلغاء التصفية
              </button>
            </div>
          )}
        </div>

        {/* CHART 2: Upcoming Hearings Urgency Radar & Timeline Bars (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-bold text-sm text-[#F5E5BD]">
                رادار تواريخ الجلسات القادمة بالأجندة القضائية
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {hearings.length} جلسات مجدولة
            </span>
          </div>

          {/* Timeframe Urgency Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Urgent 48h */}
            <div
              onClick={() => setSelectedHearingTimeframe(selectedHearingTimeframe === 'urgent' ? 'all' : 'urgent')}
              className={`p-3 rounded-xl border transition cursor-pointer text-center space-y-1 ${
                selectedHearingTimeframe === 'urgent'
                  ? 'bg-rose-950/80 border-rose-500 shadow-md'
                  : 'bg-[#2B1914] border-rose-500/30 hover:border-rose-500/60'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[11px] text-rose-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>خلال 48 ساعة</span>
              </div>
              <div className="text-2xl font-bold font-mono text-rose-400">
                {hearingTimeBuckets.urgent48h.length}
              </div>
              <div className="text-[10px] text-rose-300/80">عاجلة جداً</div>
            </div>

            {/* This Week */}
            <div
              onClick={() => setSelectedHearingTimeframe(selectedHearingTimeframe === 'week' ? 'all' : 'week')}
              className={`p-3 rounded-xl border transition cursor-pointer text-center space-y-1 ${
                selectedHearingTimeframe === 'week'
                  ? 'bg-amber-950/80 border-amber-500 shadow-md'
                  : 'bg-[#2B1914] border-amber-500/30 hover:border-amber-500/60'
              }`}
            >
              <div className="text-[11px] text-amber-300 font-semibold">خلال 7 أيام</div>
              <div className="text-2xl font-bold font-mono text-amber-400">
                {hearingTimeBuckets.thisWeek.length}
              </div>
              <div className="text-[10px] text-amber-300/80">أجندة هذا الأسبوع</div>
            </div>

            {/* This Month */}
            <div
              onClick={() => setSelectedHearingTimeframe(selectedHearingTimeframe === 'month' ? 'all' : 'month')}
              className={`p-3 rounded-xl border transition cursor-pointer text-center space-y-1 ${
                selectedHearingTimeframe === 'month'
                  ? 'bg-blue-950/80 border-blue-500 shadow-md'
                  : 'bg-[#2B1914] border-blue-500/30 hover:border-blue-500/60'
              }`}
            >
              <div className="text-[11px] text-blue-300 font-semibold">خلال 30 يوماً</div>
              <div className="text-2xl font-bold font-mono text-blue-400">
                {hearingTimeBuckets.thisMonth.length}
              </div>
              <div className="text-[10px] text-blue-300/80">الشهر الحالي</div>
            </div>

            {/* Later */}
            <div
              onClick={() => setSelectedHearingTimeframe(selectedHearingTimeframe === 'later' ? 'all' : 'later')}
              className={`p-3 rounded-xl border transition cursor-pointer text-center space-y-1 ${
                selectedHearingTimeframe === 'later'
                  ? 'bg-emerald-950/80 border-emerald-500 shadow-md'
                  : 'bg-[#2B1914] border-emerald-500/30 hover:border-emerald-500/60'
              }`}
            >
              <div className="text-[11px] text-emerald-300 font-semibold">مواعيد لاحقة</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {hearingTimeBuckets.later.length}
              </div>
              <div className="text-[10px] text-emerald-300/80">مؤجلات بعيدة</div>
            </div>
          </div>

          {/* Interactive Urgent Hearing Cards Stream */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            <div className="text-[11px] font-bold text-[#D4AF37] flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {selectedHearingTimeframe === 'urgent'
                  ? 'الجلسات العاجلة خلال 48 ساعة:'
                  : selectedHearingTimeframe === 'week'
                  ? 'جلسات هذا الأسبوع:'
                  : selectedHearingTimeframe === 'month'
                  ? 'جلسات هذا الشهر:'
                  : selectedHearingTimeframe === 'later'
                  ? 'الجلسات اللاحقة:'
                  : 'الجلسات القادمة حسب الأسبقية الزمنية:'}
              </span>
            </div>

            {(() => {
              let displayList: Hearing[] = [];
              if (selectedHearingTimeframe === 'urgent') displayList = hearingTimeBuckets.urgent48h;
              else if (selectedHearingTimeframe === 'week') displayList = hearingTimeBuckets.thisWeek;
              else if (selectedHearingTimeframe === 'month') displayList = hearingTimeBuckets.thisMonth;
              else if (selectedHearingTimeframe === 'later') displayList = hearingTimeBuckets.later;
              else displayList = [...hearingTimeBuckets.urgent48h, ...hearingTimeBuckets.thisWeek, ...hearingTimeBuckets.thisMonth, ...hearingTimeBuckets.later];

              if (displayList.length === 0) {
                return (
                  <div className="p-4 rounded-xl bg-[#2B1914]/50 border border-[#D4AF37]/20 text-center text-xs text-[#F5E5BD]/60">
                    لا توجد جلسات مجدولة في هذا النطاق الزمني المحدد.
                  </div>
                );
              }

              return displayList.slice(0, 4).map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F5E5BD]">{h.court}</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#1a0f0c] text-[#D4AF37] font-mono text-[10px] border border-[#D4AF37]/30">
                        قضية {h.caseNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#E7C779] flex items-center gap-1">
                      <span className="text-[#F5E5BD]/60">المطلوب بالجلسة:</span>
                      <span className="font-medium">{h.requirements || h.decision || 'المرافعة وحضور الوكيل'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-mono">
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-lg bg-[#3A241B] text-[#D4AF37] font-bold block border border-[#D4AF37]/30 text-xs">
                        {h.date}
                      </span>
                      {h.time && <span className="text-[10px] text-[#F5E5BD]/50 block mt-0.5">{h.time}</span>}
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* CHART 3: Court Circuit Breakdown (Jurisdiction Analysis) */}
      <div className="p-5 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2.5">
          <h3 className="font-bold text-sm text-[#F5E5BD] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#D4AF37]" />
            <span>توزيع القضايا حسب نوع المحكمة والاختصاص القضائي</span>
          </h3>
          <span className="text-xs text-[#D4AF37] font-mono">
            {Object.keys(courtBreakdown).length} جهات وهيئات قضائية
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(courtBreakdown).map(([courtName, data], idx) => {
            const percentage = cases.length > 0 ? Math.round((data.count / cases.length) * 100) : 0;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition flex flex-col justify-between space-y-2"
              >
                <div>
                  <span className="text-xs font-bold text-[#F5E5BD] block truncate">
                    {courtName}
                  </span>
                  <div className="text-xl font-bold font-mono text-[#D4AF37] mt-1">
                    {data.count} <span className="text-xs font-normal text-[#F5E5BD]/60">قضية</span>
                  </div>
                </div>

                {/* Progress Mini Bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 rounded-full bg-[#1a0f0c] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-[#D4AF37]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#F5E5BD]/60 font-mono">
                    <span>نسبة التداول</span>
                    <span>{percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTERED CASES TABLE / DETAILS VIEW */}
      <div className="p-5 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-bold text-sm text-[#F5E5BD]">
              جدول القضايا والدعاوى النشطة وفق التصفية البصرية ({filteredCases.length})
            </h3>
          </div>

          {/* Search in cases */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث برقم القضية، الموكل، أو المحكمة..."
              className="w-full bg-[#1a0f0c] border border-[#D4AF37]/40 rounded-xl pr-9 pl-4 py-2 text-xs text-[#F5E5BD] placeholder-[#F5E5BD]/40 focus:outline-none focus:border-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-[#D4AF37]/60 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/20">
          <table className="w-full text-right text-xs text-[#F5E5BD]">
            <thead className="bg-[#2B1914] text-[#D4AF37] border-b border-[#D4AF37]/30 font-semibold">
              <tr>
                <th className="p-3">رقم وسنة القضية</th>
                <th className="p-3">المحكمة والدائرة</th>
                <th className="p-3">موضوع الدعوى</th>
                <th className="p-3">الموكل</th>
                <th className="p-3">الخصم</th>
                <th className="p-3">حالة الدعوى</th>
                <th className="p-3">الجلسة القادمة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10 bg-[#1a0f0c]/60">
              {filteredCases.map((c) => {
                const badge = STATUS_CONFIG[c.status] || {
                  label: c.status,
                  color: '#D4AF37',
                  bg: 'bg-[#2B1914]',
                  border: 'border-[#D4AF37]',
                };

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCase && onSelectCase(c)}
                    className="hover:bg-[#2B1914]/60 transition cursor-pointer"
                  >
                    <td className="p-3 font-mono font-bold text-[#E7C779]">
                      {c.caseNumber} / {c.year}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-[#F5E5BD]">{c.court}</div>
                      <div className="text-[10px] text-[#F5E5BD]/60">{c.circuit}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-[#F5E5BD] max-w-xs truncate">{c.title}</div>
                      <div className="text-[10px] text-[#D4AF37]">{c.type}</div>
                    </td>
                    <td className="p-3 text-[#F5E5BD] font-medium">{c.clientName}</td>
                    <td className="p-3 text-[#F5E5BD]/80">{c.opponentName}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.border}`}
                        style={{ color: badge.color }}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      {c.nextHearingDate ? (
                        <span className="px-2 py-0.5 rounded bg-[#2B1914] text-[#D4AF37] border border-[#D4AF37]/30 text-[11px] font-bold">
                          {c.nextHearingDate}
                        </span>
                      ) : (
                        <span className="text-[#F5E5BD]/40 text-[10px]">غير محدد</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
