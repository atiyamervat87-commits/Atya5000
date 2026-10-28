import React from 'react';
import {
  Scale,
  MessageSquare,
  Lock,
  Briefcase,
  Smartphone,
  ScrollText,
  ShieldCheck,
  UserCheck,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../types/office';

interface RoyalNavbarProps {
  currentScreen: 'home' | 'public_consultation' | 'private_consultation' | 'office_management';
  setCurrentScreen: (screen: 'home' | 'public_consultation' | 'private_consultation' | 'office_management') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenCharter: () => void;
  onOpenAndroidModal: () => void;
}

export const RoyalNavbar: React.FC<RoyalNavbarProps> = ({
  currentScreen,
  setCurrentScreen,
  userRole,
  setUserRole,
  onOpenCharter,
  onOpenAndroidModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#2B1914]/95 border-b border-[#D4AF37]/30 backdrop-blur-md shadow-lg shadow-black/40">
      {/* Top Royal Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/15">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2.5 group cursor-pointer text-right"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 via-[#3A241B] to-[#1f120e] border border-[#D4AF37]/50 flex items-center justify-center shadow-md shadow-black/50 group-hover:border-[#E7C779] transition-all">
              <Scale className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold font-amiri text-[#F5E5BD] tracking-wide">
                  عبقرينو — المستشار عطيه الهلباوي
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#E7C779] border border-[#D4AF37]/35 font-mono font-semibold">
                  المنصة الملكية
                </span>
              </div>
              <p className="text-[11px] text-[#F5E5BD]/60 hidden sm:block">
                محامٍ بالنقض والدستورية العليا • إدارة المكتب والاستشارات القضائية
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* User Role Selector */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#1f120e] border border-[#D4AF37]/25 text-xs">
            <span className="text-[10px] text-[#F5E5BD]/60 px-1.5 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-[#D4AF37]" />
              الصلاحية:
            </span>
            <button
              onClick={() => setUserRole('owner')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                userRole === 'owner'
                  ? 'bg-[#D4AF37] text-[#2B1914] shadow-sm'
                  : 'text-[#F5E5BD]/70 hover:text-white'
              }`}
            >
              المالك
            </button>
            <button
              onClick={() => setUserRole('staff')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                userRole === 'staff'
                  ? 'bg-[#D4AF37] text-[#2B1914] shadow-sm'
                  : 'text-[#F5E5BD]/70 hover:text-white'
              }`}
            >
              الموظف
            </button>
          </div>

          {/* Android APK Modal Button */}
          <button
            onClick={onOpenAndroidModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37]/20 to-[#3A241B] hover:from-[#D4AF37]/30 hover:to-[#3A241B]/80 text-[#E7C779] border border-[#D4AF37]/40 text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-semibold">تطبيق Android (APK)</span>
          </button>

          {/* Charter Button */}
          <button
            onClick={onOpenCharter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD]/80 hover:text-[#F5E5BD] border border-[#D4AF37]/20 text-xs transition cursor-pointer"
          >
            <ScrollText className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">الوثيقة التأسيسية</span>
          </button>
        </div>
      </div>

      {/* Main Units Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 space-x-reverse overflow-x-auto py-2 no-scrollbar">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
              currentScreen === 'home'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
                : 'text-[#F5E5BD]/75 hover:bg-[#3A241B] hover:text-[#F5E5BD]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>الشاشة الرئيسية (الاستقبال)</span>
          </button>

          <button
            onClick={() => setCurrentScreen('public_consultation')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
              currentScreen === 'public_consultation'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
                : 'text-[#F5E5BD]/75 hover:bg-[#3A241B] hover:text-[#F5E5BD]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>الوحدة الأولى: الاستشارة العامة</span>
          </button>

          <button
            onClick={() => setCurrentScreen('private_consultation')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
              currentScreen === 'private_consultation'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
                : 'text-[#F5E5BD]/75 hover:bg-[#3A241B] hover:text-[#F5E5BD]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>الوحدة الثانية: الاستشارة الخاصة (200 ج.م)</span>
          </button>

          <button
            onClick={() => setCurrentScreen('office_management')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
              currentScreen === 'office_management'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-md shadow-black/40'
                : 'text-[#F5E5BD]/75 hover:bg-[#3A241B] hover:text-[#F5E5BD]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>الوحدة الثالثة: برنامج إدارة المحاماة</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
