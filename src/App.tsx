import React, { useState } from 'react';
import { RoyalNavbar } from './components/RoyalNavbar';
import { HomeScreen } from './components/HomeScreen';
import { PublicConsultationRoom } from './components/PublicConsultationRoom';
import { PrivateConsultationRoom } from './components/PrivateConsultationRoom';
import { OfficeManagementPlatform } from './components/office/OfficeManagementPlatform';
import { SystemCharterModal } from './components/SystemCharterModal';
import { AndroidPackageModal } from './components/AndroidPackageModal';
import { LegalGlossaryModal } from './components/LegalGlossaryModal';
import { LegalSmartSearchModal } from './components/LegalSmartSearchModal';
import { LegalHistory } from './components/LegalHistory';
import { RoyalErrorBoundary } from './components/RoyalErrorBoundary';
import { UserRole } from './types/office';
import { Scale, Phone, ShieldCheck, Award } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'public_consultation' | 'private_consultation' | 'office_management' | 'legal_history'
  >('home');

  const [userRole, setUserRole] = useState<UserRole>('owner');
  const [isCharterOpen, setIsCharterOpen] = useState<boolean>(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#1a0f0c] text-[#F5E5BD] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#E7C779]">
      {/* Luxury Royal Navbar */}
      <RoyalNavbar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenCharter={() => setIsCharterOpen(true)}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenSmartSearch={() => setIsSmartSearchOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 pb-16">
        <RoyalErrorBoundary fallbackTitle="منظومة المستشار القضائية">
          {currentScreen === 'home' && (
            <HomeScreen
              onSelectUnit={(unit) => setCurrentScreen(unit)}
              onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
              onOpenHistory={() => setCurrentScreen('legal_history')}
            />
          )}

          {currentScreen === 'public_consultation' && (
            <PublicConsultationRoom onOpenGlossary={() => setIsGlossaryOpen(true)} />
          )}

          {currentScreen === 'private_consultation' && (
            <PrivateConsultationRoom
              userRole={userRole}
              onOpenGlossary={() => setIsGlossaryOpen(true)}
            />
          )}

          {currentScreen === 'office_management' && (
            <OfficeManagementPlatform
              userRole={userRole}
              onOpenConsultation={() => setCurrentScreen('private_consultation')}
            />
          )}

          {currentScreen === 'legal_history' && (
            <LegalHistory
              onBackToHome={() => setCurrentScreen('home')}
              onOpenConsultation={() => setCurrentScreen('public_consultation')}
            />
          )}
        </RoyalErrorBoundary>
      </main>

      {/* Foundational Charter Modal */}
      <SystemCharterModal
        isOpen={isCharterOpen}
        onClose={() => setIsCharterOpen(false)}
      />

      {/* Android Package & APK Modal */}
      <AndroidPackageModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Legal Glossary Modal */}
      <LegalGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Google Search Grounding for Official Gazette & Cassation Modal */}
      <LegalSmartSearchModal
        isOpen={isSmartSearchOpen}
        onClose={() => setIsSmartSearchOpen(false)}
      />

      {/* Royal Judicial Footer */}
      <footer className="border-t border-[#D4AF37]/25 bg-[#2B1914] py-8 text-xs text-[#F5E5BD]/60 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold font-amiri text-sm sm:text-base text-[#F5E5BD]">
                المستشار عطيه الهلباوي — محامٍ بالنقض والدستورية العليا ومجلس الدولة
              </div>
              <div className="text-[11px] text-[#D4AF37] mt-0.5">
                عبقرينو — المنصة الملكية الذكية لإدارة مكاتب المحاماة والاستشارات القضائية • الإصدار 2.0
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#F5E5BD]/70">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>المحفظة الرسمية: 01153747612</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>السرية والمصادقة الصارمة</span>
            </span>
            <span>•</span>
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="text-[#E7C779] hover:underline cursor-pointer"
            >
              تطبيق Android (APK)
            </button>
            <span>•</span>
            <button
              onClick={() => setIsCharterOpen(true)}
              className="text-[#E7C779] hover:underline cursor-pointer"
            >
              الوثيقة التأسيسية
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
