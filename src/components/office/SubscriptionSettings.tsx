import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  FileText,
  Printer,
  ChevronLeft,
  ArrowRight,
  Zap,
  Building2,
  Phone,
  QrCode,
  Download,
  RotateCcw,
} from 'lucide-react';
import {
  UserSubscription,
  SubscriptionTier,
  BillingCycle,
  PaymentGateway,
  SubscriptionInvoice,
} from '../../types/subscriptionAndBrain';

interface SubscriptionSettingsProps {
  onUpgradeSuccess?: () => void;
}

export const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({ onUpgradeSuccess }) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  // Upgrade Modal State
  const [selectedTierToUpgrade, setSelectedTierToUpgrade] = useState<SubscriptionTier | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('instapay');
  const [paymentPhoneOrCard, setPaymentPhoneOrCard] = useState<string>('01153747612');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Selected Invoice for Receipt Modal
  const [selectedInvoice, setSelectedInvoice] = useState<SubscriptionInvoice | null>(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/account/subscription');
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
        if (data.billingCycle) setBillingCycle(data.billingCycle);
      }
    } catch (err) {
      console.error('Failed to load subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSwitchPlan = async (tier: SubscriptionTier) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/account/subscription/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': 'المستشار عطيه الهلباوي (المالك)',
        },
        body: JSON.stringify({
          tier,
          billingCycle,
          paymentMethod: selectedGateway,
          walletOrCardNumber: paymentPhoneOrCard,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSubscription(updated);
        setSelectedTierToUpgrade(null);
        showToast(
          tier === 'trial'
            ? 'تم تفعيل خطة التجربة الملكية المجانية (شهر كامل) بنجاح!'
            : 'تمت ترقية الاشتراك بنجاح واعتماد خطتكم الجديدة!'
        );
        if (onUpgradeSuccess) onUpgradeSuccess();
      } else {
        const err = await res.json();
        alert(err.error || 'فشلت عملية الترقية');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء معالجة الطلب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('هل أنت متأكد من رغبتك في إيقاف التجديد التلقائي للاشتراك؟ ستظل ميزات خطتك سارية حتى نهاية الفترة الحالية.')) {
      return;
    }
    try {
      const res = await fetch('/api/account/subscription/cancel', {
        method: 'POST',
        headers: { 'x-user-name': 'المستشار عطيه الهلباوي (المالك)' },
      });
      if (res.ok) {
        const updated = await res.json();
        setSubscription(updated);
        showToast('تم إيقاف التجديد التلقائي للخطة بنجاح.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remaining days calculation
  const getRemainingDays = () => {
    if (!subscription) return 0;
    const now = Date.now();
    const end = new Date(subscription.trialEndDate || subscription.renewalDate).getTime();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  };

  const remainingDays = getRemainingDays();

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#F5E5BD]/60 space-y-3">
        <RotateCcw className="w-6 h-6 animate-spin text-[#D4AF37] mx-auto" />
        <p>جارٍ تحميل بيانات خطة الاشتراك والحساب...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#1f120e] border-2 border-[#D4AF37]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#E7C779] text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>خطة الاشتراك وإدارة حساب المكتب</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#F5E5BD]">
            خطة التجربة المجانية والاشتراك المدفوع
          </h2>
          <p className="text-xs text-[#F5E5BD]/70 max-w-2xl leading-relaxed">
            استمتع بشهر تجريبي مجاني بالكامل بكافة الصلاحيات القضائية والذكاء الاصطناعي، ثم انتقل بسلاسة لأحد الخطط الشهرية أو السنوية المناسبة لحجم أعمال مكتبكم.
          </p>
        </div>

        {/* Current Active Plan Badge */}
        <div className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/40 text-right space-y-1.5 shrink-0 min-w-[240px]">
          <span className="text-[10px] text-[#F5E5BD]/60 block font-mono">الخطة النشطة حالياً:</span>
          <div className="text-sm font-bold text-[#E7C779] flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span>{subscription?.tierName}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#D4AF37]/20 text-[11px]">
            <span className="text-[#F5E5BD]/60">الحالة:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded ${
                subscription?.status === 'trialing'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : subscription?.status === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {subscription?.status === 'trialing'
                ? 'فترة تجربة نشطة'
                : subscription?.status === 'active'
                ? 'اشتراك مدفوع معتمد'
                : 'منتهي / متوقف'}
            </span>
          </div>
          {subscription?.tier === 'trial' && (
            <div className="flex items-center justify-between text-[11px] text-[#D4AF37]">
              <span>المتبقي في التجربة:</span>
              <span className="font-bold font-mono text-sm">{remainingDays} يوماً</span>
            </div>
          )}
        </div>
      </div>

      {/* Free Trial Countdown Progress Bar (if in trial) */}
      {subscription?.tier === 'trial' && (
        <div className="p-5 rounded-2xl bg-[#2B1914] border border-amber-500/40 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>أنت تستمتع حالياً بفترة التجربة الملكية المجانية الكاملة (شهر مجاني - 30 يوماً)</span>
            </div>
            <div className="font-mono text-xs text-[#E7C779]">
              متبقي {remainingDays} يوماً من أصل 30 يوماً
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-[#1a0f0c] rounded-full h-2.5 overflow-hidden border border-[#D4AF37]/20">
            <div
              className="bg-gradient-to-r from-amber-500 via-[#D4AF37] to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, (remainingDays / 30) * 100))}%` }}
            ></div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#F5E5BD]/70 pt-1">
            <span>تاريخ بدء التجربة: {new Date(subscription.startDate).toLocaleDateString('ar-EG')}</span>
            <span>تاريخ نهاية التجربة: {new Date(subscription.trialEndDate).toLocaleDateString('ar-EG')}</span>
            <span className="text-emerald-400 font-semibold">
              ✓ لا توجد أي التزامات مالية أو مصاريف خفية أثناء فترة التجربة
            </span>
          </div>
        </div>
      )}

      {/* Billing Cycle Selector Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[#F5E5BD]">دورة السداد والفوترة:</h4>
          <p className="text-[11px] text-[#F5E5BD]/60">وفر 20% واحصل على شهرين مجاناً عند اختيار الاشتراك السنوي</p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#2B1914] border border-[#D4AF37]/40 text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-md'
                : 'text-[#F5E5BD]/70 hover:text-white'
            }`}
          >
            سداد شهري
          </button>
          <button
            onClick={() => setBillingCycle('annually')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annually'
                ? 'bg-[#D4AF37] text-[#2B1914] shadow-md'
                : 'text-[#F5E5BD]/70 hover:text-white'
            }`}
          >
            <span>اشتراك سنوي</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold">خصم 20%</span>
          </button>
        </div>
      </div>

      {/* 3 Subscription Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: FREE TRIAL */}
        <div
          className={`rounded-2xl p-6 flex flex-col justify-between border-2 transition-all space-y-6 ${
            subscription?.tier === 'trial'
              ? 'bg-[#2B1914] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10'
              : 'bg-[#1f120e] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                التجربة الملكية
              </span>
              {subscription?.tier === 'trial' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#2B1914] font-bold">
                  خطتك الحالية
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold font-amiri text-[#F5E5BD]">شهر مجاني كامل</h3>
              <p className="text-xs text-[#F5E5BD]/60 mt-1">
                للتعرف على المنصة واختبار العقل المركزي وكافة الميزات دون أي مصاريف
              </p>
            </div>

            <div className="py-2 border-y border-[#D4AF37]/20 flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono text-[#E7C779]">0</span>
              <span className="text-xs text-[#F5E5BD]/60">جنيه مصري / لمدة 30 يوماً</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#F5E5BD]/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>استشارات قانونية غير محدودة عبر عقل المستشار</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مكتبة العقود الذكية وصياغة حتى 50 عقداً</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>غرفة الاستشارة الخاصة (صوت وكاميرا ومستندات)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>فهرس القوانين المصرية وأحكام محكمة النقض</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مساحة تخزين سحابية حتى 15 جيجابايت</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSwitchPlan('trial')}
            disabled={subscription?.tier === 'trial' && subscription?.status === 'trialing'}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
              subscription?.tier === 'trial' && subscription?.status === 'trialing'
                ? 'bg-[#1f120e] text-[#D4AF37] border border-[#D4AF37]/30 cursor-not-allowed'
                : 'bg-[#3A241B] hover:bg-[#4d3023] text-[#F5E5BD] border border-[#D4AF37]/50'
            }`}
          >
            {subscription?.tier === 'trial' && subscription?.status === 'trialing' ? (
              <span>✓ نشط حالياً (متبقي {remainingDays} يوماً)</span>
            ) : (
              <span>تفعيل شهر التجربة المجاني مجدداً</span>
            )}
          </button>
        </div>

        {/* CARD 2: PRO PLAN */}
        <div
          className={`rounded-2xl p-6 flex flex-col justify-between border-2 transition-all space-y-6 ${
            subscription?.tier === 'pro'
              ? 'bg-[#2B1914] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10'
              : 'bg-[#1f120e] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                الخطة الاحترافية
              </span>
              {subscription?.tier === 'pro' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#2B1914] font-bold">
                  خطتك الحالية
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold font-amiri text-[#F5E5BD]">المحامي المستقل</h3>
              <p className="text-xs text-[#F5E5BD]/60 mt-1">
                مثالية للمحامين الممارسين والمكاتب الفردية لمتابعة حتى 150 قضية
              </p>
            </div>

            <div className="py-2 border-y border-[#D4AF37]/20 flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono text-[#E7C779]">
                {billingCycle === 'annually' ? '415' : '499'}
              </span>
              <span className="text-xs text-[#F5E5BD]/60">
                جنيه مصري / شهرياً {billingCycle === 'annually' && '(تفوتر سنوياً 4,990 ج.م)'}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#F5E5BD]/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>كل ميزات الخطة التجريبية بلا حدود زمنية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>صياغة وتصدير 150 عقداً شهرياً بصيغة PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>أرشفة إلكترونية ومستندات حتى 50 جيجابايت</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>حتى 10 مستخدمين ومعاونين بصلاحيات RBAC</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تحديثات أسبوعية لأحدث أحكام ومبادئ النقض</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setSelectedTierToUpgrade('pro')}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
              subscription?.tier === 'pro'
                ? 'bg-[#1f120e] text-[#D4AF37] border border-[#D4AF37]/30'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] shadow-md hover:brightness-110'
            }`}
          >
            {subscription?.tier === 'pro' ? 'الخطة مفعلة حالياً' : 'الترقية للخطة الاحترافية ←'}
          </button>
        </div>

        {/* CARD 3: ROYAL PLAN (VIP / LAW FIRM) */}
        <div
          className={`rounded-2xl p-6 flex flex-col justify-between border-2 transition-all space-y-6 relative overflow-hidden ${
            subscription?.tier === 'royal'
              ? 'bg-[#2B1914] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 ring-2 ring-[#D4AF37]'
              : 'bg-gradient-to-b from-[#2B1914] to-[#1f120e] border-[#D4AF37]/60 hover:border-[#D4AF37]'
          }`}
        >
          {/* Top highlight ribbon */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-300 text-[#2B1914] text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
            الخيار الأكثر طلباً لكبرى المكاتب
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>الخطة الملكية الشاملة</span>
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold font-amiri text-[#F5E5BD]">كبرى مكاتب وشركات المحاماة</h3>
              <p className="text-xs text-[#F5E5BD]/60 mt-1">
                حل متكامل لإدارة المؤسسات القضائية مع تدريب مخصص للعقل المركزي
              </p>
            </div>

            <div className="py-2 border-y border-[#D4AF37]/20 flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono text-[#E7C779]">
                {billingCycle === 'annually' ? '825' : '990'}
              </span>
              <span className="text-xs text-[#F5E5BD]/60">
                جنيه مصري / شهرياً {billingCycle === 'annually' && '(تفوتر سنوياً 9,900 ج.م)'}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#F5E5BD]/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">عقود وقضايا واستشارات غير محدودة نهائياً</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-amber-300 font-semibold">استوديو تدريب وضبط العقل المركزي والنموذج اللغوي</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تخزين سحابي ضخم حتى 500 جيجابايت</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>حتى 50 حساباً فرعياً ومحامياً بالنقض والاستئناف</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>دعم فني واستشاري VIP مباشر على مدار الساعة</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setSelectedTierToUpgrade('royal')}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
              subscription?.tier === 'royal'
                ? 'bg-[#1f120e] text-[#D4AF37] border border-[#D4AF37]/30'
                : 'bg-gradient-to-r from-amber-400 via-[#D4AF37] to-[#E7C779] text-[#2B1914] shadow-lg hover:brightness-110 font-bold'
            }`}
          >
            {subscription?.tier === 'royal' ? 'الخطة مفعلة حالياً (VIP)' : 'الترقية للخطة الملكية الشاملة ←'}
          </button>
        </div>
      </div>

      {/* Invoices & Billing History Section */}
      <div className="p-6 rounded-2xl bg-[#1f120e] border border-[#D4AF37]/30 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-bold text-sm text-[#F5E5BD]">سجل الفواتير والإيصالات الرقمية للمكتب:</h3>
          </div>
          <span className="text-[11px] text-[#F5E5BD]/60">
            معتمدة محاسبياً وقابلة للطباعة والتصدير
          </span>
        </div>

        {subscription?.invoices && subscription.invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37] font-semibold">
                  <th className="py-2.5 px-3">رقم الفاتورة</th>
                  <th className="py-2.5 px-3">الخطة / الوصف</th>
                  <th className="py-2.5 px-3">المبلغ</th>
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3">طريقة الدفع</th>
                  <th className="py-2.5 px-3">الحالة</th>
                  <th className="py-2.5 px-3 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {subscription.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#2B1914]/50 transition">
                    <td className="py-2.5 px-3 font-mono text-[#E7C779]">{inv.invoiceNumber}</td>
                    <td className="py-2.5 px-3 text-white font-medium">{inv.planName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                      {inv.amount.toLocaleString()} ج.م
                    </td>
                    <td className="py-2.5 px-3 text-[#F5E5BD]/70">
                      {new Date(inv.date).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="py-2.5 px-3 text-[#F5E5BD]/80">{inv.paymentMethod}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        مدفوعة ومصدقة
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 rounded-lg bg-[#2B1914] hover:bg-[#3A241B] text-[#D4AF37] border border-[#D4AF37]/30 transition cursor-pointer inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>معاينة الإيصال</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-[#F5E5BD]/50">
            لا توجد فواتير سابقة حتى الآن.
          </div>
        )}

        {/* Auto-renew switch & cancel controls */}
        <div className="pt-3 border-t border-[#D4AF37]/15 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[#F5E5BD]/80">
              التجديد التلقائي:{' '}
              <strong className={subscription?.autoRenew ? 'text-emerald-400' : 'text-amber-400'}>
                {subscription?.autoRenew ? 'مفعل عند نهاية كل دورة' : 'معطل'}
              </strong>
            </span>
          </div>

          {subscription?.autoRenew && subscription?.tier !== 'trial' && (
            <button
              onClick={handleCancelSubscription}
              className="text-rose-400 hover:text-rose-300 text-[11px] underline cursor-pointer"
            >
              تعطيل التجديد التلقائي للخطة
            </button>
          )}
        </div>
      </div>

      {/* UPGRADE / PLAN PAYMENT MODAL */}
      {selectedTierToUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37] shadow-2xl text-xs space-y-5 text-right">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <h3 className="font-bold font-amiri text-base text-[#F5E5BD] flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#D4AF37]" />
                <span>
                  تأكيد الاشتراك في{' '}
                  {selectedTierToUpgrade === 'pro'
                    ? 'الخطة الاحترافية للمحامين'
                    : 'الخطة الملكية الشاملة لكبرى المكاتب'}
                </span>
              </h3>
              <button
                onClick={() => setSelectedTierToUpgrade(null)}
                className="text-[#F5E5BD]/60 hover:text-white cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Price Summary */}
            <div className="p-3.5 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#F5E5BD]/60 block">إجمالي المستحق للسداد:</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {selectedTierToUpgrade === 'pro'
                    ? billingCycle === 'annually'
                      ? '4,990 ج.م / سنوياً'
                      : '499 ج.م / شهرياً'
                    : billingCycle === 'annually'
                    ? '9,900 ج.م / سنوياً'
                    : '990 ج.م / شهرياً'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-[#D4AF37]/15 text-[#E7C779] border border-[#D4AF37]/35 font-semibold">
                دورة: {billingCycle === 'annually' ? 'سنوية (وفرت 20%)' : 'شهرية'}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-[#D4AF37] font-bold">طريقة الدفع المعتمدة في مصر:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'instapay', label: 'إنستاباي (InstaPay)', desc: 'تحويل لحظي مباشر' },
                  { id: 'vodafone_cash', label: 'فودافون كاش', desc: 'محفظة: 01153747612' },
                  { id: 'card', label: 'بطاقة بنكية', desc: 'ميزة / فيزا / ماستركارد' },
                  { id: 'fawry', label: 'فوري (Fawry)', desc: 'رقم دفع مرجعي' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedGateway(m.id as any)}
                    className={`p-2.5 rounded-xl border text-right transition cursor-pointer ${
                      selectedGateway === m.id
                        ? 'bg-[#3A241B] border-[#D4AF37] text-white ring-1 ring-[#D4AF37]'
                        : 'bg-[#1f120e] border-[#D4AF37]/20 text-[#F5E5BD]/70 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">{m.label}</div>
                    <div className="text-[10px] text-[#F5E5BD]/50 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Account / Phone details input */}
            <div>
              <label className="block text-[#F5E5BD]/80 mb-1">
                {selectedGateway === 'vodafone_cash'
                  ? 'رقم المحفظة المحول منها للتأكيد:'
                  : selectedGateway === 'instapay'
                  ? 'معرف إنستاباي (IPA / Phone):'
                  : selectedGateway === 'card'
                  ? 'رقم بطاقة الدفع (ميزة / فيزا):'
                  : 'رقم الهاتف للتواصل وإرسال الكود:'}
              </label>
              <input
                type="text"
                value={paymentPhoneOrCard}
                onChange={(e) => setPaymentPhoneOrCard(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1f120e] border border-[#D4AF37]/30 text-white font-mono"
              />
            </div>

            {/* Instructions */}
            <div className="p-3 rounded-xl bg-[#1a0e0b] border border-[#D4AF37]/20 text-[11px] text-[#F5E5BD]/70 space-y-1">
              <span className="font-bold text-[#D4AF37] block">تعليمات إتمام السداد:</span>
              <p>
                يتم قيد الفاتورة فورياً وتفعيل ميزات الخطة في نفس اللحظة. في حال التحويل عبر فودافون كاش، يتم التحويل لرقم محفظة المكتب الرسمية: <strong>01153747612</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D4AF37]/20">
              <button
                type="button"
                onClick={() => setSelectedTierToUpgrade(null)}
                className="px-4 py-2 rounded-xl bg-[#1f120e] text-[#F5E5BD]/70 hover:text-white cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSwitchPlan(selectedTierToUpgrade)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] text-[#2B1914] font-bold cursor-pointer hover:brightness-110 shadow-md flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>جارٍ تأكيد الاشتراك...</span>
                  </>
                ) : (
                  <span>تأكيد وتفعيل الاشتراك الآن ✓</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE RECEIPT MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#2B1914] border-2 border-[#D4AF37] shadow-2xl text-xs space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-bold font-amiri text-base text-white">إيصال وفاتورة سداد رقمية</span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-[#F5E5BD]/60 hover:text-white cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#1f120e] border border-[#D4AF37]/20 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#F5E5BD]/60">رقم الإيصال:</span>
                <span className="text-[#D4AF37] font-bold">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F5E5BD]/60">الجهة:</span>
                <span className="text-white">منصة عبقرينو — المستشار عطيه الهلباوي</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F5E5BD]/60">الخطة:</span>
                <span className="text-white">{selectedInvoice.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F5E5BD]/60">تاريخ السداد:</span>
                <span className="text-white">{new Date(selectedInvoice.date).toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F5E5BD]/60">طريقة الدفع:</span>
                <span className="text-white">{selectedInvoice.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#D4AF37]/20 text-sm">
                <span className="text-white font-bold">المبلغ المسدد:</span>
                <span className="text-emerald-400 font-bold">{selectedInvoice.amount.toLocaleString()} ج.م</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#2B1914] font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الإيصال الرسمي</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
