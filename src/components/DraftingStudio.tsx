import React, { useState } from 'react';
import { ScrollText, Sparkles, Download, Copy, Check, Printer, FileCheck, Layers, BookOpen } from 'lucide-react';

export const DraftingStudio: React.FC = () => {
  const [docType, setDocType] = useState('defense_memo');
  const [courtName, setCourtName] = useState('محكمة القاهرة الجديدة الابتدائية - الدائرة (3) مدني');
  const [caseNumber, setCaseNumber] = useState('1452 لسنة 2024 مدني كلي');
  const [plaintiff, setPlaintiff] = useState('أحمد محمد إبراهيم (المدعي)');
  const [defendant, setDefendant] = useState('محمود علي عبد العال (المدعى عليه)');
  const [factsSummary, setFactsSummary] = useState(
    'أقام المدعي دعواه مطالباً بإلزام المدعى عليه بمبلغ 500,000 جنيه تعويضاً عن الإخلال بتسليم العين المبيعة في الموعد، في حين أن التأخير كان راجعاً للقوة القاهرة ولتأخر المدعي نفسه في سداد الدفعة الثانية المقررة بالعقد.'
  );
  const [claims, setClaims] = useState('أصلياً: رفض الدعوى وإلزام المدعي بالمصروفات. احتياطياً: ندب خبير هندسي وحساب مبالغ التأخير المنسوبة للمدعي.');
  const [defenses, setDefenses] = useState('1. الدفع بعدم قبول الدعوى لرفعها قبل الأوان. 2. الدفع بسقوط الحق في طلب التعويض للإخلال المشترك إعمالاً لنص المادة 161 مدني.');
  const [contractClauses, setContractClauses] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draftedDocument, setDraftedDocument] = useState<string>('');

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/legal/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          courtName,
          caseNumber,
          parties: { plaintiff, defendant },
          factsSummary,
          claims,
          defenses,
          contractClauses,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'فشلت الصياغة');
      }

      setDraftedDocument(data.content);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'حدث خطأ أثناء الصياغة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!draftedDocument) return;
    navigator.clipboard.writeText(draftedDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!draftedDocument) return;
    const blob = new Blob([draftedDocument], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `وثيقة_عقل_المستشار_${docType}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ScrollText className="w-4 h-4" />
            <span>الصياغة القضائية والتعاقدية الرصينة</span>
          </div>
          <h2 className="text-2xl font-bold font-amiri text-slate-100">
            صانع المذكرات وصحف الدعاوى والعقود والإنذارات الرسمية
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            صياغة وثائق قضائية وقانونية منضبطة تلتزم بالديباجة الرسمية المصرية، وتسلسل الوقائع، وتأصيل الدفوع بالأسانيد وأحكام محكمة النقض والطلبات الختامية الجازمة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls - 5 cols */}
        <form onSubmit={handleDraft} className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="font-bold text-amber-300 font-amiri text-base border-b border-slate-800 pb-2">
            محددات الوثيقة القضائية
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">نوع المستند المراد صياغته</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="defense_memo">مذكرة بدفاع (أمام المحكمة الابتدائية أو الاستئناف)</option>
              <option value="lawsuit">صحيفة افتتاح دعوى (مطالبة / صحة ونفاذ / تعويض)</option>
              <option value="cassation_appeal">صحيفة طعن بالنقض (أسباب الطعن ومخالفة القانون)</option>
              <option value="contract">عقد بيع / اتفاق ملزم متوازن الشروط والضمانات</option>
              <option value="formal_notice">إنذار رسمي على يد محضر لقطع التقادم والإعذار</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">المحكمة أو الجهة</label>
              <input
                type="text"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">رقم القضية أو السنة</label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الطرف الأول / المدعي</label>
              <input
                type="text"
                value={plaintiff}
                onChange={(e) => setPlaintiff(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الطرف الثاني / المدعى عليه</label>
              <input
                type="text"
                value={defendant}
                onChange={(e) => setDefendant(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">ملخص الوقائع المادية</label>
            <textarea
              rows={3}
              value={factsSummary}
              onChange={(e) => setFactsSummary(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">الدفوع القانونية المطلوب تركيزها</label>
            <textarea
              rows={2}
              value={defenses}
              onChange={(e) => setDefenses(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">الطلبات الختامية الجازمة</label>
            <input
              type="text"
              value={claims}
              onChange={(e) => setClaims(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>جاري إعداد الصياغة القضائية...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>صياغة الوثيقة القضائية الآن</span>
              </>
            )}
          </button>
        </form>

        {/* Output Workspace - 7 cols */}
        <div className="lg:col-span-7 flex flex-col p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-slate-200 font-amiri text-lg">
                مسودة الوثيقة القضائية المعتمدة
              </h3>
            </div>
            {draftedDocument && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>تحميل</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  <span>طباعة</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[450px] p-6 rounded-xl bg-slate-950/70 border border-slate-800 font-amiri text-base leading-relaxed text-slate-100 whitespace-pre-wrap overflow-y-auto selection:bg-amber-600/30">
            {draftedDocument ? (
              draftedDocument
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3 py-16">
                <ScrollText className="w-12 h-12 text-slate-700 stroke-1" />
                <p className="text-sm">
                  املأ بيانات الخصومة والوقائع واضغط على «صياغة الوثيقة القضائية الآن» لإنشاء مذكرة أو صحيفة دعوى مطابقة لمعايير المحاكم المصرية وأحكام محكمة النقض.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
