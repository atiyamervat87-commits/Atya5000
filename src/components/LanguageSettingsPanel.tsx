import React, { useState, useEffect } from 'react';
import { Globe, Check, Sliders, ShieldCheck, Sparkles, X, Languages } from 'lucide-react';

export interface UserLanguageSettings {
  autoDetect: boolean;
  preferredLanguage: 'ar_standard' | 'ar_egyptian' | 'en' | 'fr';
  preserveLegalTerminology: boolean;
  dialectAdaptation: boolean;
}

const DEFAULT_SETTINGS: UserLanguageSettings = {
  autoDetect: true,
  preferredLanguage: 'ar_standard',
  preserveLegalTerminology: true,
  dialectAdaptation: true,
};

const STORAGE_KEY = 'attya_language_settings';

export function getStoredLanguageSettings(): UserLanguageSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Error reading language settings from localStorage:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredLanguageSettings(settings: UserLanguageSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Dispatch window event so listening components update without refresh
    window.dispatchEvent(new CustomEvent('attya_language_settings_updated', { detail: settings }));
  } catch (err) {
    console.error('Error saving language settings to localStorage:', err);
  }
}

interface LanguageSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: UserLanguageSettings) => void;
}

export const LanguageSettingsPanel: React.FC<LanguageSettingsPanelProps> = ({
  isOpen,
  onClose,
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState<UserLanguageSettings>(getStoredLanguageSettings());
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getStoredLanguageSettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateSettings = (partial: Partial<UserLanguageSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveStoredLanguageSettings(updated);
    if (onSettingsChange) {
      onSettingsChange(updated);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const LANGUAGE_OPTIONS = [
    {
      id: 'ar_standard',
      title: 'العربية الفصحى القضائية',
      subtitle: 'الصياغة الأصولية الرصينة المعتمدة في المذكرات وأحكام محكمة النقض',
      badge: 'الافتراضية',
      sample: '«وحيث إنه إعمالاً للمادة 163 من القانون المدني...»',
    },
    {
      id: 'ar_egyptian',
      title: 'العامية المصرية (اللغة الدارجة)',
      subtitle: 'أسلوب تبسيطي يفهم النزاعات العائلية وعقود البيع والتعاملات اليومية',
      badge: 'مفضلة للاستشارات',
      sample: '«حقك مضمون قانوناً، وبخصوص الفلوس اللي تحت المخدة...»',
    },
    {
      id: 'en',
      title: 'English (الإنجليزية)',
      subtitle: 'International Commercial Law, FIDIC contracts & Corporate drafting',
      badge: 'International',
      sample: '"Pursuant to the Egyptian Civil Code, Article 147..."',
    },
    {
      id: 'fr',
      title: 'Français (الفرنسية)',
      subtitle: 'Droit civil comparé, doctrine juridique & arbitrage international',
      badge: 'Juridique',
      sample: '"Conformément aux principes généraux du droit civil..."',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-[#231410] border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden flex flex-col text-right font-sans"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#D4AF37]/25 bg-gradient-to-l from-[#2B1914] to-[#1e100c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-amiri text-[#F5E5BD]">
                إعدادات اللغة واللهجات ومحرك الاستجابة
              </h2>
              <p className="text-xs text-[#F5E5BD]/60 mt-0.5">
                تخصيص الكشف التلقائي للغة وربطه بمحرك Gemini والعقل اللغوي المستقل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#F5E5BD]/60 hover:text-[#F5E5BD] hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Auto-Detection Toggle */}
          <div className="p-4 rounded-xl bg-[#2e1a14] border border-[#D4AF37]/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold text-sm text-[#F5E5BD]">
                  الكشف التلقائي الفوري للغة (Auto-Detection)
                </span>
              </div>
              <p className="text-xs text-[#F5E5BD]/70 leading-relaxed">
                يقوم النظام بتحليل لغة ولهجة المستشير تلقائياً (فصحى، عامية مصرية، لهجات عربية، إنجليزي، فرنسي) وصياغة الرد بذات الأسلوب مع صون الدقة القانونية.
              </p>
            </div>

            <button
              onClick={() => updateSettings({ autoDetect: !settings.autoDetect })}
              className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                settings.autoDetect ? 'bg-[#D4AF37]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#1a0f0c] shadow-md absolute top-1 transition-transform ${
                  settings.autoDetect ? 'right-1' : 'right-7'
                }`}
              />
            </button>
          </div>

          {/* Preferred Language Radio Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#E7C779] flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>اللغة المفضلة للرد والاستشارات:</span>
              </label>
              <span className="text-[11px] text-[#F5E5BD]/50">تطبق عند تثبيت لغة محددة</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = settings.preferredLanguage === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => updateSettings({ preferredLanguage: opt.id as any })}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#3A241B] border-[#D4AF37] shadow-md shadow-black/40'
                        : 'bg-[#1e100c]/80 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-[#281510]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold font-amiri ${isSelected ? 'text-[#D4AF37]' : 'text-[#F5E5BD]'}`}>
                          {opt.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#E7C779] border border-[#D4AF37]/30">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#F5E5BD]/70">{opt.subtitle}</p>
                      <div className="text-[11px] text-[#E7C779]/80 font-mono pt-1">
                        عينة الرد: {opt.sample}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-[#2B1914]'
                          : 'border-[#F5E5BD]/30 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Precision Guard Checks */}
          <div className="p-4 rounded-xl bg-[#1e100c] border border-[#D4AF37]/20 space-y-3">
            <div className="text-xs font-semibold text-[#E7C779] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>ضوابط الأمانة اللغوية والقضائية:</span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-[#F5E5BD]/85">
              <input
                type="checkbox"
                checked={settings.preserveLegalTerminology}
                onChange={(e) => updateSettings({ preserveLegalTerminology: e.target.checked })}
                className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
              />
              <span>الحفاظ الصارم على المصطلحات القانونية المصرية الرسمية دون ترجمة مشوهة</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-[#F5E5BD]/85">
              <input
                type="checkbox"
                checked={settings.dialectAdaptation}
                onChange={(e) => updateSettings({ dialectAdaptation: e.target.checked })}
                className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
              />
              <span>تكييف الاستفسارات الشعبية والدارجة وتحويلها تلقائياً للمواد القانونية المنظمة</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D4AF37]/25 bg-[#1a0f0c] flex items-center justify-between">
          <div className="text-xs text-[#D4AF37]">
            {savedNotice ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Check className="w-4 h-4" />
                <span>تم حفظ الإعدادات بنجاح وربطها بالمحرك!</span>
              </span>
            ) : (
              <span>يتم الحفظ تلقائياً في التخزين المحلي (localStorage)</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold text-xs hover:brightness-110 shadow-lg transition cursor-pointer"
          >
            إتمام وتطبيق
          </button>
        </div>
      </div>
    </div>
  );
};
