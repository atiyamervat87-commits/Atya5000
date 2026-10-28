import React from 'react';
import { X, ScrollText, CheckCircle2, Shield, BookOpen, Award } from 'lucide-react';

interface SystemCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemCharterModal: React.FC<SystemCharterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/50 flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-amiri text-amber-200">
                الوثيقة التأسيسية الشاملة لعقل المستشار عطية الهلباوي
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                الإصدار التأسيسي: 1.0 • ميثاق الاستقلال الهندسي والنزاهة العلمية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm leading-relaxed text-slate-300 font-sans">
          {/* Preamble */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 text-amber-100/90 font-amiri text-base leading-loose">
            <p className="font-bold text-center text-lg text-amber-300 mb-2">
              بسم الله الرحمن الرحيم
            </p>
            <p>
              مشروع إنشاء عقل المستشار عطية الهلباوي (AQL AL-MUSTASHAR ATIA EL-HELBAWY): الوثيقة التأسيسية الشاملة لإنشاء نموذج لغوي مستقل ومنظومة ذكاء اصطناعي عامة ومتخصصة في القانون والمعرفة والاستدلال.
            </p>
          </div>

          {/* Pillars Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold font-amiri text-base">
                <Shield className="w-4 h-4" />
                <span>أولاً: أمر التأسيس والاستقلال الحقيقي</span>
              </div>
              <p className="text-xs text-slate-300">
                بناء نموذج لغوي مستقل يمتلك بنيته وأوزانه ومفرداته وقواعده، رافضاً مجرد تغليف النماذج الجاهزة أو ادعاء الإنجاز بغير برهان تجريبي قابل للتحقق.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold font-amiri text-base">
                <Award className="w-4 h-4" />
                <span>ثانياً: قواعد التمييز الخماسية الصارمة</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>1. ما تم إنشاؤه برمجياً (Engineered Code)</li>
                <li>2. ما تم تدريبه فعلياً (Trained Weights)</li>
                <li>3. ما تم اختباره بنجاح (Empirically Tested)</li>
                <li>4. ما ثبتت كفاءته بالأدلة (Proven Value)</li>
                <li>5. ما يحتاج إلى حوسبة أو بيانات (Compute Needs)</li>
              </ul>
            </div>
          </div>

          {/* Key Articles Breakdown */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-amber-300 font-amiri flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>أبرز الأحكام والواجبات التنفيذية للوثيقة:</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="font-semibold text-amber-200">1. التخصص القانوني المصري المركزي:</span>
                <p className="text-xs text-slate-400 mt-1">
                  الاستيعاب العميق للقانون المدني (131/1948)، المرافعات (13/1968)، العقوبات والإجراءات الجنائية، الإثبات، العمل والتأمينات، والشركات، مع أسانيد محكمة النقض المصرية.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="font-semibold text-amber-200">2. التحقق من المصادر ومكافحة الهلوسة:</span>
                <p className="text-xs text-slate-400 mt-1">
                  حظر اختلاق أرقام مواد أو أحكام قضائية أو تواريخ. والاعتراف بعدم المعرفة عند غياب الأدلة، والتمييز بين النص الساري والمعدل والملغى.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="font-semibold text-amber-200">3. هندسة المقسّم اللغوي العربي (Tokenizer):</span>
                <p className="text-xs text-slate-400 mt-1">
                  تطوير مقسّم لغوي ملائم للغة العربية يراعي التشكيل والسوابق واللواحق والمصطلحات القانونية ونسبة الضغط الحرفي مقابل التوكن.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="font-semibold text-amber-200">4. سرية بيانات الموكلين وميثاق الشرف:</span>
                <p className="text-xs text-slate-400 mt-1">
                  حظر تسريب أو خلط مستندات الموكلين أو بياناتهم الحساسة، والتزام كامل بالمادة 65 من قانون المحاماة وقوانين حماية البيانات.
                </p>
              </div>
            </div>
          </div>

          {/* Closing declaration */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center">
            «المعيار النهائي هو جودة النموذج الحقيقية، واستقلاله، وموثوقيته، وقابليته للتطوير، ونتائج اختباره الفعلية. والله ولي التوفيق.»
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            إغلاق الوثيقة
          </button>
        </div>
      </div>
    </div>
  );
};
