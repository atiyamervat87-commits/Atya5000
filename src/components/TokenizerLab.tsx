import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Hash, Binary, RefreshCw, Layers, CheckCircle2, BookOpen } from 'lucide-react';
import { TokenAnalysisResult } from '../types/legal';

const SAMPLE_TEXTS = [
  'العَقْدُ شَرِيعَةُ المُتَعَاقِدِينَ، فَلَا يَجُوزُ نَقْضُهُ وَلَا تَعْدِيلُهُ إِلَّا بِاتِّفَاقِ الطَّرَفَيْنِ.',
  'قضت محكمة النقض المصرية في الطعن رقم 1024 لسنة 52 قضائية بأن الدفع بالبطلان الشكلي يسقط بالتكلم في الموضوع.',
  'وحيث إنه إعمالاً للمادتين 163 و164 من القانون المدني المصري، فإن أركان المسؤولية التقصيرية تشمل الخطأ والضرر والسببية.',
  'عقل المستشار عطية الهلباوي: منظومة الذكاء الاصطناعي والاستدلال اللغوي والقانوني المستقل الإصدار 1.0.',
];

export const TokenizerLab: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_TEXTS[0]);
  const [analysis, setAnalysis] = useState<TokenAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTokenizer = async (textToAnalyze: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tokenizer/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runTokenizer(inputText);
  }, []);

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault();
    runTokenizer(inputText);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>هندسة المعالجة اللغوية الطبيعية العربية</span>
          </div>
          <h2 className="text-2xl font-bold font-amiri text-slate-100">
            مختبر المقسّم اللغوي العربي (Arabic BPE Tokenizer Lab)
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            تطبيق عملي لأحكام البند الثامن من الوثيقة التأسيسية: معالجة فصاحة العربية، التشكيل، السوابق واللواحق، المصطلحات القانونية، وقياس معدل الضغط اللغوي وتوليد معرفات التوكنات (Token IDs).
          </p>
        </div>
      </div>

      {/* Preset samples */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>اختر عينة نصية عربية وقضائية للاختبار:</span>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {SAMPLE_TEXTS.map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(sample);
                runTokenizer(sample);
              }}
              className="p-3 text-right rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 font-amiri text-sm transition cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form onSubmit={handleTest} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            النص العربي المراد تحليله وتقسيمه إلى توكنات:
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب أو الصق نصاً عربياً مشكولاً أو غير مشكول..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 font-amiri text-base leading-relaxed focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            يدعم الحروف العربية المشكولة، المصطلحات القانونية، والترميز الصوتي.
          </span>
          <button
            type="submit"
            disabled={isLoading || !inputText}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>تنفيذ التقسيم اللغوي والتحليل</span>
          </button>
        </div>
      </form>

      {/* Metrics Cards */}
      {analysis && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400">عدد التوكنات (Tokens)</span>
            <div className="text-2xl font-bold font-mono text-amber-300">{analysis.tokenCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400">عدد الحروف (Characters)</span>
            <div className="text-2xl font-bold font-mono text-slate-200">{analysis.charCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400">حجم البايتات (UTF-8 Bytes)</span>
            <div className="text-2xl font-bold font-mono text-slate-200">{analysis.bytesCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400">معدل الضغط (Chars/Token)</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {analysis.compressionRatio} <span className="text-xs font-normal">حرف/توكن</span>
            </div>
          </div>
        </div>
      )}

      {/* Token Badges Visualizer */}
      {analysis && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-slate-200 font-amiri text-base">
                التمثيل المرئي للقطع اللغوية (Subword Visualizer)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>مصطلح قضائي متخصص</span>
              </span>
              <span className="flex items-center gap-1.5 text-blue-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>حركة تشكيل / جزء لغوي</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 p-5 rounded-xl bg-slate-950 border border-slate-800/80 min-h-[120px] items-center">
            {analysis.tokens.map((token, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-lg text-sm font-amiri border transition-all ${
                  token.isLegalTerm
                    ? 'bg-amber-950/50 text-amber-200 border-amber-600/50 shadow-sm'
                    : token.isDiacritics
                    ? 'bg-blue-950/50 text-blue-200 border-blue-600/50'
                    : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
                title={`Token ID: ${token.id} | Bytes: ${token.byteLength}`}
              >
                {token.tokenText}
                <span className="text-[10px] font-mono mr-1.5 opacity-60">#{token.id}</span>
              </span>
            ))}
          </div>

          {/* Tokens Sequence Stream Table */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">
              جدول تسلسل التوكنات ومعرفاتها الرقمية (Token ID Stream):
            </h4>
            <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-800">
              <table className="w-full text-right text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">الموقع (#)</th>
                    <th className="p-2.5">الرمز اللغوي</th>
                    <th className="p-2.5">معرف التوكن (Token ID)</th>
                    <th className="p-2.5">النوع والتصنيف</th>
                    <th className="p-2.5">البايتات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {analysis.tokens.map((tok, i) => (
                    <tr key={i} className="hover:bg-slate-950/40">
                      <td className="p-2.5 text-slate-500">{i + 1}</td>
                      <td className="p-2.5 font-amiri text-sm text-slate-100">{tok.tokenText}</td>
                      <td className="p-2.5 text-amber-300 font-bold">{tok.id}</td>
                      <td className="p-2.5 text-[11px] font-sans">
                        {tok.isLegalTerm ? (
                          <span className="text-amber-400">مصطلح قانوني أصيل</span>
                        ) : tok.isDiacritics ? (
                          <span className="text-blue-400">حركة تشكيل</span>
                        ) : (
                          <span className="text-slate-400">وحدة لغوية فرعية</span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-400">{tok.byteLength} byte</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
