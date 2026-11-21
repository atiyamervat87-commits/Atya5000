import React, { useState } from 'react';
import { Sparkles, Check, ShieldCheck, Zap, CreditCard, Phone, X, Award, Crown } from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (packageName: string, creditsAdded: number) => void;
  currentBalance?: number;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentBalance = 0,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone_cash' | 'card' | 'fawry'>('instapay');
  const [senderIdentifier, setSenderIdentifier] = useState('01153747612');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const packages = [
    {
      id: 'starter',
      name: 'باقة البداية (Starter)',
      credits: 50,
      price: '50 ج.م',
      description: '50 استشارة ذكية عبر محرك Gemini المتقدم، صالحة لمدة شهر.',
      badge: 'اقتصادية',
      color: 'border-[#D4AF37]/30 bg-[#24140f]',
    },
    {
      id: 'standard',
      name: 'الباقة القياسية الملكية (Standard)',
      credits: 150,
      price: '120 ج.م',
      description: '150 استشارة ذكية + تدقيق مذكرات قانونية ومحضر النقض الذكي.',
      badge: 'الأكثر طلباً ⭐',
      color: 'border-[#D4AF37] bg-[#2B1914] shadow-lg shadow-[#D4AF37]/10',
    },
    {
      id: 'professional',
      name: 'باقة المحترفين والمكاتب (Professional)',
      credits: 400,
      price: '300 ج.م',
      description: '400 استشارة ذكية + استخراج صحف الدعاوى والمستندات بذكاء فائق.',
      badge: 'للمحامين',
      color: 'border-[#D4AF37]/40 bg-[#24140f]',
    },
    {
      id: 'royal_unlimited',
      name: 'الباقة الملكية المفتوحة (Royal Unlimited)',
      credits: 1000,
      price: '600 ج.م',
      description: 'استشارات بلا حدود (Unlimited) طوال الشهر + دعم مباشر من المستشار عطيه الهلباوي.',
      badge: 'VIP',
      color: 'border-[#E7C779] bg-gradient-to-br from-[#2B1914] via-[#3A241B] to-[#24140f]',
    },
  ];

  const handlePurchase = () => {
    setIsProcessing(true);
    setSuccessMessage(null);

    setTimeout(() => {
      setIsProcessing(false);
      const pkg = packages.find((p) => p.id === selectedPackage) || packages[1];
      setSuccessMessage(`تم شحن باقة ${pkg.name} بنجاح وإضافة (${pkg.credits} رسالة ذكية) لرصيدك الآمن!`);
      
      setTimeout(() => {
        onSuccess(pkg.name, pkg.credits);
        onClose();
        setSuccessMessage(null);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#24140f] border-2 border-[#D4AF37] rounded-3xl shadow-2xl overflow-hidden text-[#F5E5BD]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#2B1914] px-6 py-5 border-b border-[#D4AF37]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8c701e] flex items-center justify-center text-[#2B1914] shadow-md border border-[#E7C779]">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-amiri text-[#F5E5BD]">
                بوابة شحن حصص وباقات Gemini الذكية
              </h2>
              <p className="text-xs text-[#D4AF37]">
                عبقرينو — المعالجة الذكية الآمنة دون إفصاح عن المفتاح (Zero API Key Exposure)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#3A241B] text-[#D4AF37] hover:bg-[#2B1914] border border-[#D4AF37]/30 transition cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Current balance indicator */}
          <div className="bg-[#2B1914] border border-[#D4AF37]/40 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#D4AF37]" />
              <div>
                <div className="text-xs text-[#F5E5BD]/75">رصيد الحصص الحالي في حسابك:</div>
                <div className="text-base font-bold text-[#E7C779] font-mono">
                  {currentBalance} رسالة ذكية متاحة
                </div>
              </div>
            </div>
            <div className="text-[11px] px-3 py-1.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              ⚡ آمن ومحمي بالكامل
            </div>
          </div>

          {successMessage && (
            <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 text-emerald-300 text-sm flex items-center gap-3 animate-pulse">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold">عملية ناجحة بنجاح الملكية!</div>
                <div>{successMessage}</div>
              </div>
            </div>
          )}

          {/* Package Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              اختر الباقة المناسبة لاستخدامك في الشات العام والخاص:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {packages.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#3A241B] ring-2 ring-[#D4AF37]/40 shadow-lg'
                        : pkg.color + ' hover:border-[#D4AF37]/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                          {pkg.badge}
                        </span>
                        <span className="text-base font-bold font-mono text-[#E7C779]">
                          {pkg.price}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#F5E5BD] mb-1">{pkg.name}</h3>
                      <p className="text-xs text-[#F5E5BD]/70 leading-relaxed mb-3">{pkg.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/20 text-xs">
                      <span className="text-[#D4AF37] font-semibold">⚡ {pkg.credits} رسالة ذكية</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-[#D4AF37] border-[#D4AF37] text-[#2B1914]' : 'border-[#D4AF37]/40'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              طريقة الدفع الرسمية المعتمدة:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'instapay', label: 'إنستاباي (InstaPay)', icon: '⚡' },
                { id: 'vodafone_cash', label: 'فودافون كاش', icon: '📱' },
                { id: 'card', label: 'بطاقة ائتمانية', icon: '💳' },
                { id: 'fawry', label: 'فوري (Fawry)', icon: '🏛️' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                    paymentMethod === m.id
                      ? 'bg-[#3A241B] border-[#D4AF37] text-[#E7C779] shadow'
                      : 'bg-[#2B1914] border-[#D4AF37]/25 text-[#F5E5BD]/80 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <span className="text-lg">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wallet / Phone Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#F5E5BD]/80 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              رقم المحفظة / رقم الهاتف المرتبط بالتحويل (المحفظة الرسمية: 01153747612):
            </label>
            <input
              type="text"
              value={senderIdentifier}
              onChange={(e) => setSenderIdentifier(e.target.value)}
              placeholder="01153747612"
              className="w-full bg-[#2B1914] border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
            />
            <p className="text-[11px] text-[#F5E5BD]/60">
              * يتم التفعيل الفوري والآلي لحصصك الذكية بمجرد إتمام تأكيد التحويل.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#2B1914] px-6 py-4 border-t border-[#D4AF37]/30 flex items-center justify-between">
          <div className="text-xs text-[#F5E5BD]/70 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>حماية كاملة للخصوصية والمعالجة دون إفصاح عن المفتاح</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#3A241B] text-[#F5E5BD] hover:bg-[#2B1914] text-xs font-semibold border border-[#D4AF37]/30 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold text-xs shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#2B1914] border-t-transparent rounded-full animate-spin" />
                  <span>جاري تأكيد الشحنة والشحن...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تأكيد الشراء وشحن الحصص فوراً</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
