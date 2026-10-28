import React, { useEffect, useState } from 'react';
import {
  Scale,
  MessageSquare,
  Lock,
  Briefcase,
  ChevronLeft,
  ShieldCheck,
  Award,
  Clock,
  Phone,
  CreditCard,
  FileText,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HomeScreenProps {
  onSelectUnit: (unit: 'public_consultation' | 'private_consultation' | 'office_management') => void;
  onOpenAndroidModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectUnit, onOpenAndroidModal }) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/office/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Royal Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2B1914] via-[#3A241B] to-[#1a0e0b] border-2 border-[#D4AF37]/40 shadow-2xl p-6 sm:p-10 text-[#F5E5BD]">
        {/* Subtle royal pattern ornament */}
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#E7C779]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#E7C779] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>عبقرينو — المنظومة الملكية الذكية للمحاماة والاستشارات</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-amiri text-[#F5E5BD] leading-tight">
              مكتب المستشار عطيه الهلباوي
            </h1>

            <div className="text-[#D4AF37] font-semibold text-sm sm:text-base font-amiri">
              محامٍ بالنقض والدستورية العليا ومجلس الدولة • خبير الصياغات القضائية والعقود
            </div>

            <p className="text-sm sm:text-base text-[#F5E5BD]/80 leading-relaxed font-sans">
              أهلاً وسهلاً بكم في المنصة الملكية المتكاملة المخصصة لإدارة العمل القضائي وتقديم الاستشارات القانونية وفق أحدث التقنيات وأصول التقاليد القضائية المصرية العريقة، بموجب ترخيص نقابة المحامين العامة.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#F5E5BD]/70">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>السرية المهنية المصونة</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>أسانيد محكمة النقض والدستورية</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>المحفظة الرسمية: 01153747612</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#1f120e]/80 border border-[#D4AF37]/30 shadow-xl text-center space-y-3 min-w-[220px]">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#E7C779] flex items-center justify-center shadow-lg shadow-black/50 text-[#2B1914]">
              <Scale className="w-10 h-10" />
            </div>
            <div>
              <div className="font-bold font-amiri text-lg text-[#F5E5BD]">المستشار عطيه الهلباوي</div>
              <div className="text-[11px] text-[#D4AF37] font-mono">الرمز والختم القضائي</div>
            </div>
            <div className="text-[10px] text-[#F5E5BD]/60 border-t border-[#D4AF37]/20 pt-2 w-full">
              قيد نقابة المحامين: 48215
            </div>
          </div>
        </div>
      </div>

      {/* The Three Core Mandatory Units */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#F5E5BD] flex items-center gap-2">
              <Award className="w-6 h-6 text-[#D4AF37]" />
              <span>الوحدات الرئيسية الثلاث للمنصة الملكية</span>
            </h2>
            <p className="text-xs text-[#F5E5BD]/60 mt-0.5">
              اختر الوحدة المطلوبة للبدء في الاستشارة أو إدارة قضايا وملفات المكتب
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Public Consultation */}
          <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-[#2B1914] to-[#1f120e] border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all shadow-xl hover:shadow-[#D4AF37]/10 space-y-5">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#2B1914] transition-all">
                <MessageSquare className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                  الوحدة الأولى
                </span>
                <h3 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                  غرفة الاستشارة العامة
                </h3>
              </div>

              <p className="text-xs text-[#F5E5BD]/75 leading-relaxed">
                غرفة استشارة فورية ومجانية لطرح الأسئلة القانونية العامة، مع إدخال نصي مباشر واسترجاع نصوص مواد القانون المصري ومبادئ محكمة النقض.
              </p>

              <div className="space-y-1.5 text-[11px] text-[#F5E5BD]/60 pt-2 border-t border-[#D4AF37]/15">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>إدخال نصي سريع وإرسال مباشر</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>أدوات متقدمة: نسخ، طباعة، وتصدير الرد</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>دعم كامل للغة العربية واتجاه RTL</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectUnit('public_consultation')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:from-[#E7C779] hover:to-[#D4AF37] text-[#2B1914] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-black/40 group-hover:gap-3"
            >
              <span>دخول غرفة الاستشارة العامة</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Private Consultation */}
          <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-[#2B1914] to-[#1f120e] border-2 border-[#D4AF37]/50 hover:border-[#E7C779] transition-all shadow-xl hover:shadow-[#D4AF37]/15 space-y-5">
            <div className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E7C779] text-[10px] font-bold font-mono">
              200 ج.م
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#2B1914] transition-all">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                  الوحدة الثانية • مشفرة وخاصة
                </span>
                <h3 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                  بوابة الاستشارة الخاصة
                </h3>
              </div>

              <p className="text-xs text-[#F5E5BD]/75 leading-relaxed">
                جلسة استشارية خاصة وسرية مع المستشار عطيه الهلباوي مع التحقق من سداد الرسوم (200 جنيه)، وتشمل فتح الكاميرا المباشرة، والميكروفون الصوتي، وإرفاق المستندات.
              </p>

              <div className="space-y-1.5 text-[11px] text-[#F5E5BD]/60 pt-2 border-t border-[#D4AF37]/15">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>المحفظة الرسمية: <strong>01153747612</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>تشغيل الكاميرا المباشرة والتقاط الصور</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>تسجيل صوتي وإرفاق ملفات PDF وDOCX</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectUnit('private_consultation')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E7C779] to-[#D4AF37] hover:brightness-110 text-[#2B1914] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-black/40 group-hover:gap-3"
            >
              <span>دخول بوابة الاستشارة الخاصة</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Office Management */}
          <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-[#2B1914] to-[#1f120e] border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all shadow-xl hover:shadow-[#D4AF37]/10 space-y-5">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#2B1914] transition-all">
                <Briefcase className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                  الوحدة الثالثة • النظام المتكامل
                </span>
                <h3 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                  برنامج إدارة المحاماة
                </h3>
              </div>

              <p className="text-xs text-[#F5E5BD]/75 leading-relaxed">
                منظومة متكاملة وشاملة لإدارة قضايا المكتب، الموكلين، الجلسات، الأجندة، الحسابات والأتعاب، والمستندات، والتقارير الذكية باللغة العربية.
              </p>

              <div className="space-y-1.5 text-[11px] text-[#F5E5BD]/60 pt-2 border-t border-[#D4AF37]/15">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>14 قسماً تخصصياً لإدارة العمل القضائي</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>وحدة التقارير الذكية حسب طلب المستخدم</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>النسخ الاحتياطي والاستعادة والطباعة الملكية</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectUnit('office_management')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:from-[#E7C779] hover:to-[#D4AF37] text-[#2B1914] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-black/40 group-hover:gap-3"
            >
              <span>فتح برنامج إدارة المحاماة</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Office Statistics Bar */}
      {stats && (
        <div className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
            <h3 className="font-bold text-[#D4AF37] font-amiri text-base flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>مؤشرات أداء المكتب الحالية (سجلات حقيقية وقابلة للتحقق)</span>
            </h3>
            <span className="text-[11px] text-[#F5E5BD]/60 font-mono">محدث لحظياً</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
              <span className="text-[10px] text-[#F5E5BD]/60 block">إجمالي القضايا</span>
              <span className="text-xl font-bold font-mono text-[#D4AF37]">{stats.totalCases}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
              <span className="text-[10px] text-[#F5E5BD]/60 block">القضايا المتداولة</span>
              <span className="text-xl font-bold font-mono text-[#E7C779]">{stats.activeCases}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
              <span className="text-[10px] text-[#F5E5BD]/60 block">الموكلين المسجلين</span>
              <span className="text-xl font-bold font-mono text-white">{stats.totalClients}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
              <span className="text-[10px] text-[#F5E5BD]/60 block">الجلسات القادمة</span>
              <span className="text-xl font-bold font-mono text-[#D4AF37]">{stats.upcomingHearings}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
              <span className="text-[10px] text-[#F5E5BD]/60 block">المحصل من الأتعاب</span>
              <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                {stats.totalCollected.toLocaleString()} ج.م
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#2B1914] border border-[#D4AF37]/20">
              <span className="text-[10px] text-[#F5E5BD]/60 block">المتبقي للتحصيل</span>
              <span className="text-base sm:text-lg font-bold font-mono text-amber-300">
                {stats.uncollectedFees.toLocaleString()} ج.م
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
