import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { useVoiceToText } from '../hooks/useVoiceToText';

interface VoiceDictationBadgeProps {
  onAppendText: (text: string) => void;
  className?: string;
  buttonLabel?: string;
  fieldLabel?: string;
}

export const VoiceDictationBadge: React.FC<VoiceDictationBadgeProps> = ({
  onAppendText,
  className = '',
  buttonLabel = 'إملاء صوتي',
  fieldLabel = 'الوقائع والملاحظات',
}) => {
  const {
    isListening,
    interimText,
    isSupported,
    error,
    toggleListening,
  } = useVoiceToText({
    lang: 'ar-EG',
    continuous: true,
    interimResults: true,
    onFinalTranscript: (finalChunk) => {
      if (finalChunk.trim()) {
        onAppendText(finalChunk.trim());
      }
    },
  });

  if (!isSupported) {
    return (
      <div className={`text-[11px] text-[#F5E5BD]/40 flex items-center gap-1 ${className}`}>
        <MicOff className="w-3.5 h-3.5 text-stone-500" />
        <span className="hidden sm:inline">التحويل الصوتي يتطلب متصفحاً حديثاً (Chrome / Android)</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md select-none ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse border border-rose-400 ring-2 ring-rose-500/50 shadow-rose-900/50'
              : 'bg-[#2B1914] text-[#D4AF37] hover:bg-[#3A241B] hover:text-[#E7C779] border border-[#D4AF37]/40 shadow-black/40'
          }`}
          title={isListening ? 'اضغط لإيقاف الإملاء الصوتي' : `إملاء صوتي مباشر لـ ${fieldLabel}`}
        >
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <Mic className="w-3.5 h-3.5 text-white" />
              <span>إيقاف الإملاء</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{buttonLabel}</span>
              <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(تحدث باللغة العربية)</span>
            </>
          )}
        </button>

        {isListening && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-200 text-[11px] animate-fadeIn">
            <Volume2 className="w-3.5 h-3.5 animate-pulse text-rose-300" />
            <span>جاري الاستماع... تحدث الآن ليتم تحويل صوتك لنص تلقائياً</span>
          </div>
        )}
      </div>

      {/* Live interim speech preview */}
      {isListening && interimText && (
        <div className="text-[11px] text-[#E7C779] bg-[#1a0e0b]/90 border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-[#D4AF37] animate-spin" />
          <span className="font-semibold text-[#D4AF37]">جارٍ التقاط الكلمات:</span>
          <span className="italic">{interimText}</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="text-[11px] text-rose-300 bg-rose-950/60 border border-rose-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
