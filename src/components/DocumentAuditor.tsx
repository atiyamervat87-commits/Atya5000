import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Sparkles, FileText, Upload, Check, Copy } from 'lucide-react';

const CONTRACT_PRESETS = [
  {
    title: 'عقد بيع عقار يتضمن تناقضاً بين المخالصة النقدية والشيكات المؤجلة',
    text: `عقد بيع شقة سكنية
الطرف الأول (البائع): السيد / ممدوح حسن
الطرف الثاني (المشتري): السيد / طارق محمود
تم الاتفاق على ما يلي:
البند الأول: باع الطرف الأول للطرف الثاني الشقة رقم (5) بالعقار الكائن بمدينة نصر.
البند الثاني: تم هذا البيع نظير ثمن إجمالي قدره 3,000,000 جنيه مصري (ثلاثة ملايين جنيه).
البند الثالث: يقر الطرف الأول (البائع) بأنه استلم كامل الثمن المتفق عليه نقداً وعداً بمجلس هذا العقد وأبرأ ذمة الطرف الثاني إبراءً شاملاً وتعتبر هذه مخالصة نهائية تامة وناجزة بسداد كامل الثمن.
البند الرابع: يلتزم الطرف الثاني بسداد مبلغ 1,000,000 جنيه المتبقية على قسطين بموجب شيكين بنكيين يستحق الأول في 2024/6/1 والثاني في 2024/12/1، وفي حالة عدم السداد ينفسخ العقد تلقائياً.
البند الخامس: محاكم القاهرة هي المختصة بنظر أي نزاع.`,
  },
  {
    title: 'عقد عمل يتضمن شرطاً تعسفياً بمصادرة المستحقات وغرامة باطلة',
    text: `عقد عمل محدد المدة
الطرف الأول: شركة الأهرام للخدمات
الطرف الثاني: الموظف / حسام الدين علي
البند الأول: يعمل الطرف الثاني بوظيفة مبرمج براتب شهري قدره 15,000 جنيه.
البند الثاني: مدة العقد سنة تبدأ من 2024/1/1 وتجدد باتفاق الطرفين.
البند الثالث: في حالة رغبة الموظف في الاستقالة قبل نهاية السنة، يلتزم بسداد غرامة تعويضية قدرها 100,000 جنيه لصالح الشركة مع مصادرة رصيد إجازاته وكافة مستحقاته التأمينية والمالية دون اللجوء للقضاء.
البند الرابع: يحظر على الموظف العمل في أي شركة برمجيات بجمهورية مصر العربية لمدة 10 سنوات بعد تركه العمل.`,
  },
];

export const DocumentAuditor: React.FC = () => {
  const [docText, setDocText] = useState(CONTRACT_PRESETS[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docText.trim()) return;

    setIsLoading(true);
    setAuditResult(null);

    try {
      const response = await fetch('/api/legal/audit-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docText,
          documentType: 'عقد ومستند قانوني',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'فشل فحص المستند');
      }

      setAuditResult(data.auditReport);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'حدث خطأ أثناء فحص المستند');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!auditResult) return;
    navigator.clipboard.writeText(auditResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>فحص وتدقيق العقود والمستندات</span>
          </div>
          <h2 className="text-2xl font-bold font-amiri text-slate-100">
            فاحص المستندات وكشف التناقضات والثغرات القانونية
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            أداة دقيقة لفحص العقود والمذكرات ومحاضر الشرطة، لاكتشاف التناقضات بين البنود، والشروط الباطلة قانوناً (مثل القيود التعسفية على العمل أو مصادرة المستحقات)، والشروط الوقائية المفقودة.
          </p>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>نماذج عقود ملغومة بثغرات لاختبار كفاءة الفحص:</span>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONTRACT_PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => {
                setDocText(preset.text);
                setAuditResult(null);
              }}
              className="p-3.5 rounded-xl text-right bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-xs space-y-1 transition cursor-pointer"
            >
              <div className="font-bold text-amber-300 font-amiri text-sm">{preset.title}</div>
              <div className="text-[11px] text-slate-400 line-clamp-2">{preset.text}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input and Result Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Text Area - 6 cols */}
        <form onSubmit={handleAudit} className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-slate-200 font-amiri text-base">
              نص المستند أو العقد المراد تدقيقه
            </h3>
            <span className="text-[11px] text-slate-500">
              {docText.split(/\s+/).filter(Boolean).length} كلمة
            </span>
          </div>

          <textarea
            rows={15}
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            placeholder="الصق نص العقد، أو مذكرة الخصم، أو محضر الشرطة هنا لفحصه وتدقيق ثغراته..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            disabled={isLoading || !docText.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>جاري التدقيق وفحص التعارضات والثغرات...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>بدء الفحص القضائي الشامل للمستند</span>
              </>
            )}
          </button>
        </form>

        {/* Audit Report - 6 cols */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-amber-300 font-amiri text-base">
                تقرير التدقيق ورصد الثغرات والتناقضات
              </h3>
            </div>
            {auditResult && (
              <button
                onClick={handleCopy}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 cursor-pointer transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ التقرير'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[380px] p-5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto selection:bg-amber-600/30">
            {auditResult ? (
              auditResult
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3 py-16">
                <FileText className="w-12 h-12 text-slate-700 stroke-1" />
                <p className="text-xs">
                  اضغط على «بدء الفحص القضائي الشامل للمستند» لتحليل البنود، وكشف التناقضات الصريحة والمستترة، وفحص مدى مطابقتها لقواعد النظام العام وقوانين جمهورية مصر العربية.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
