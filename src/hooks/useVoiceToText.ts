import { useState, useEffect, useRef, useCallback } from 'react';

// Declaration for Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export interface UseVoiceToTextOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscriptChange?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
}

export const useVoiceToText = (options: UseVoiceToTextOptions = {}) => {
  const {
    lang = 'ar-EG',
    continuous = true,
    interimResults = true,
    onTranscriptChange,
    onFinalTranscript,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const shouldRestartRef = useRef<boolean>(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const transcriptPiece = item[0].transcript;
          if (item.isFinal) {
            currentFinal += transcriptPiece;
          } else {
            currentInterim += transcriptPiece;
          }
        }

        if (currentFinal) {
          setTranscript((prev) => {
            const next = prev ? `${prev} ${currentFinal.trim()}` : currentFinal.trim();
            onTranscriptChange?.(next);
            onFinalTranscript?.(currentFinal.trim());
            return next;
          });
          setInterimText('');
        } else {
          setInterimText(currentInterim);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('تم رفض إذن استخدام الميكروفون. يرجى تفعيل إذن الصوت في المتصفح.');
          setIsListening(false);
          shouldRestartRef.current = false;
        } else if (event.error === 'no-speech') {
          // Normal timeout when silence
        } else if (event.error === 'network') {
          setError('تعذر الاتصال بخدمة التعرف الصوتي (يرجى التحقق من الشبكة).');
        } else {
          setError(`تنبيه صوتي: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // If continuous is true and the user didn't explicitly stop, we can optionally restart
        if (shouldRestartRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
          setInterimText('');
        }
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('Failed to initialize SpeechRecognition:', err);
      setIsSupported(false);
    }

    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [lang, continuous, interimResults]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('ميزة التعرف الصوتي غير مدعومة في هذا المتصفح. استخدم Google Chrome أو Android WebView.');
      return;
    }
    setError(null);
    setInterimText('');
    shouldRestartRef.current = true;

    try {
      recognitionRef.current?.start();
      setIsListening(true);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err: any) {
      // If already started, ignore or restart
      if (err.name !== 'InvalidStateError') {
        console.error('Error starting recognition:', err);
      }
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      // ignore
    }
    setIsListening(false);
    setInterimText('');
    if (navigator.vibrate) {
      navigator.vibrate([30, 30, 30]);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimText('');
  }, []);

  return {
    isListening,
    transcript,
    interimText,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
};
