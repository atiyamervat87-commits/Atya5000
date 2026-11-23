import { SystemFault } from './faultDetector.js';

export interface RootCauseAnalysisResult {
  faultId: string;
  rootCause: string;
  recommendedAction: string;
  remediationType: 'ACTIVATE_FALLBACK' | 'RECONNECT_DB' | 'CLEAR_CACHE' | 'ALERT_MASTER' | 'NONE';
}

export const royalRootCauseAnalyzer = {
  analyze(fault: SystemFault): RootCauseAnalysisResult {
    if (fault.id === 'gemini-quota-exhausted') {
      return {
        faultId: fault.id,
        rootCause: 'تجاوز حدود الاستهلاك المسموح بها في واجهة Gemini API (Rate Limit / 429).',
        recommendedAction: 'توجيه الاستشارات تلقائياً إلى المحرك المحلي المعتمد (ATT YA LEGAL MIND) ضماناً لعدم توقف العميل.',
        remediationType: 'ACTIVATE_FALLBACK',
      };
    }

    if (fault.id === 'db-connection-error') {
      return {
        faultId: fault.id,
        rootCause: 'انقطاع المؤشر المؤقت أو تلف مؤشر اتصال ملف SQLite المحلي.',
        recommendedAction: 'إعادة تهيئة جلسة الاتصال بقاعدة البيانات وفحص سلامة الملفات.',
        remediationType: 'RECONNECT_DB',
      };
    }

    if (fault.component === 'Neural Weights & Lexicon') {
      return {
        faultId: fault.id,
        rootCause: 'محاولة عبث أو تلف غير مبرر في ملفات أوزان العقل الاصطناعي أو المعجم اللفظي.',
        recommendedAction: 'تنبيه المالك الرئيسي فوراً وحظر التعديل غير المصرح به.',
        remediationType: 'ALERT_MASTER',
      };
    }

    return {
      faultId: fault.id,
      rootCause: 'خطأ غير مصنف في النظام التشغيلي.',
      recommendedAction: 'إعادة تشغيل الخدمة الفرعية المتاحة وتفريغ الذاكرة المؤقتة.',
      remediationType: 'CLEAR_CACHE',
    };
  },
};
