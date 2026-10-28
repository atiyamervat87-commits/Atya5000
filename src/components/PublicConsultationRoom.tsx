import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Copy,
  Check,
  Printer,
  Download,
  Scale,
  Sparkles,
  AlertCircle,
  FileText,
  Trash2,
} from 'lucide-react';
import { ChatMessage } from '../types/office';

const QUICK_TOPICS = [
  'ما هي شروط صحة ونفاذ عقد بيع شقة وتكلفة التسجيل؟',
  'ما هو الموقف القانوني في جنحة خيانة أمانة لإيصال على بياض؟',
  'ما هي حقوق العامل عند الفصل التعسفي وميعاد شكوى مكتب العمل؟',
  'ما هو ميعاد الطعن بالاستئناف في الأحكام المدنية وسقوط الحق؟',
];

export const PublicConsultationRoom: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'counselor',
      text: `بسم الله الرحمن الرحيم\n\nأهلاً ومرحباً بحضرتكم في غرفة الاستشارة العامة للمستشار عطيه الهلباوي.\n\nيسعدنا تلقي استفساراتكم ومسائلكم القانونية العامة لبيان التكييف القضائي السليم ونصوص القانون المصري المطبقة وأحكام محكمة النقض.\n\nتفضلوا بكتابة استفساركم في الحقل أدناه والضغط على «إرسال».`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isLoading) return;

    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/consultation/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'تعذر استلام رد المستشار، يرجى إعادة المحاولة.');
      }

      const counselorMessage: ChatMessage = {
        id: `counselor-${Date.now()}`,
        sender: 'counselor',
        text: data.reply || 'تم استلام الاستشارة وجارٍ تدقيق النصوص القانونية.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, counselorMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ في الاتصال بالخادم. يرجى التحقق من الشبكة.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (format: 'txt' | 'md' | 'json') => {
    let fileContent = '';
    let fileName = `استشارة_المستشار_عطيه_الهلباوي_${Date.now()}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      fileContent = JSON.stringify(messages, null, 2);
      fileName += '.json';
      mimeType = 'application/json';
    } else if (format === 'md') {
      fileContent = `# محادثة الاستشارة العامة — المستشار عطيه الهلباوي\n\nتاريخ التصدير: ${new Date().toLocaleString('ar-EG')}\n\n---\n\n` +
        messages.map((m) => `### ${m.sender === 'user' ? 'المستشير' : 'المستشار عطيه الهلباوي'} (${m.timestamp})\n\n${m.text}\n\n---`).join('\n\n');
      fileName += '.md';
      mimeType = 'text/markdown';
    } else {
      fileContent = `محادثة الاستشارة العامة — المستشار عطيه الهلباوي\nتاريخ التصدير: ${new Date().toLocaleString('ar-EG')}\n========================================\n\n` +
        messages.map((m) => `[${m.sender === 'user' ? 'المستشير' : 'المستشار عطيه الهلباوي'} - ${m.timestamp}]:\n${m.text}\n----------------------------------------`).join('\n\n');
      fileName += '.txt';
      mimeType = 'text/plain';
    }

    const blob = new Blob([fileContent], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearChat = () => {
    if (window.confirm('هل تريد مسح سجل المحادثة الحالية وبدء استشارة جديدة؟')) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'counselor',
          text: `أهلاً بكم مجدداً في غرفة الاستشارة العامة للمستشار عطيه الهلباوي. تفضلوا بطرح استفساركم الجديد.`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Judicial Banner */}
      <div className="p-5 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-inner">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-amiri text-[#F5E5BD]">
                غرفة الاستشارة العامة
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-semibold">
                متاحة ومباشرة
              </span>
            </div>
            <p className="text-xs text-[#F5E5BD]/70 mt-0.5">
              مكتب المستشار عطيه الهلباوي • استشارات قانونية فورية باللغة العربية
            </p>
          </div>
        </div>

        {/* Global Chat Tools */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => handleExport('txt')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD] border border-[#D4AF37]/30 transition cursor-pointer"
            title="تصدير المحادثة لملف نصي"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">تصدير (TXT)</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD] border border-[#D4AF37]/30 transition cursor-pointer"
            title="طباعة المحادثة بالكامل"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">طباعة</span>
          </button>
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg bg-[#1f120e] hover:bg-rose-950/50 text-[#F5E5BD]/70 hover:text-rose-300 border border-transparent hover:border-rose-800 transition cursor-pointer"
            title="بدء محادثة جديدة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Topics */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>استشارات شائعة جاهزة للطرح الفوري:</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {QUICK_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic)}
              disabled={isLoading}
              className="p-2.5 text-right rounded-xl bg-[#1f120e] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#2B1914] text-[#F5E5BD]/80 hover:text-[#F5E5BD] transition-all cursor-pointer text-[12px] truncate disabled:opacity-50"
            >
              • {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#1a0e0b]/90 border border-[#D4AF37]/30 shadow-2xl min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 printable-area">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-start' : 'items-end'} space-y-1.5`}
            >
              <div className="flex items-center gap-2 text-[11px] text-[#F5E5BD]/60 px-1">
                <span className="font-semibold text-[#D4AF37]">
                  {isUser ? 'المستشير' : 'المستشار عطيه الهلباوي'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[90%] sm:max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
                  isUser
                    ? 'bg-[#3A241B] text-[#F5E5BD] border border-[#D4AF37]/30 rounded-tr-none'
                    : 'bg-[#2B1914] text-[#F5E5BD] border-2 border-[#D4AF37]/50 rounded-tl-none font-sans'
                }`}
              >
                {msg.text}

                {/* Response Action Tools */}
                {!isUser && (
                  <div className="pt-3 mt-3 border-t border-[#D4AF37]/20 flex items-center justify-between gap-3 text-xs no-print">
                    <span className="text-[10px] text-[#D4AF37]/80">
                      استشارة قضائية معتمدة
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD]/80 hover:text-[#F5E5BD] border border-[#D4AF37]/30 text-[11px] transition cursor-pointer"
                        title="نسخ رد المستشار"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#D4AF37]" />
                            <span>نسخ الرد</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handlePrint}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1f120e] hover:bg-[#3A241B] text-[#F5E5BD]/80 hover:text-[#F5E5BD] border border-[#D4AF37]/30 text-[11px] transition cursor-pointer"
                        title="طباعة هذا الرد"
                      >
                        <Printer className="w-3 h-3 text-[#D4AF37]" />
                        <span>طباعة</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-end space-y-1">
            <div className="text-[11px] text-[#D4AF37] px-1 font-semibold flex items-center gap-1.5">
              <span>المستشار عطيه الهلباوي يدرس الاستشارة...</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#2B1914] border border-[#D4AF37]/40 text-xs text-[#F5E5BD] flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
              <span>جاري استرجاع نصوص القانون وأحكام النقض وصياغة الرأي القضائي...</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field + Send Button ONLY (Mandatory Rule) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37]/40 shadow-xl space-y-3 no-print"
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="اكتب استشارتك القانونية هنا بالتفصيل (مثل: نزاع إيجار، دعوى صحة ونفاذ، شيك، مستحقات عمل)..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#F5E5BD] placeholder-[#F5E5BD]/40 focus:outline-none focus:border-[#D4AF37] transition font-sans"
          />

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:from-[#E7C779] hover:to-[#D4AF37] disabled:opacity-40 text-[#2B1914] font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md shadow-black/40 shrink-0"
          >
            <span>إرسال</span>
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#F5E5BD]/60 px-1">
          <span>* الغرفة العامة مخصصة للإدخال النصي السريع. للأصوات والمستندات والكاميرا، يرجى زيارة الغرفة الخاصة.</span>
          <span>الحد الأقصى: 1000 حرف</span>
        </div>
      </form>
    </div>
  );
};
