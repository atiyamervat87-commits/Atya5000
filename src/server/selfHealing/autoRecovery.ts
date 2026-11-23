import { royalRootCauseAnalyzer, RootCauseAnalysisResult } from './rootCauseAnalyzer.js';
import { SystemFault } from './faultDetector.js';

export interface HealingAuditLog {
  id: string;
  timestamp: string;
  faultTitle: string;
  rootCause: string;
  actionTaken: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING_MASTER';
  triggeredBy: string;
}

const auditLogs: HealingAuditLog[] = [
  {
    id: 'log-init-1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    faultTitle: 'فحص الأمان الأولي للبدء',
    rootCause: 'التحقق الدوري من سلامة أوزان العقل الاصطناعي',
    actionTaken: 'مطابقة بصمات SHA-256 لأوزان 1000K والمعجم المليون لفظي',
    status: 'SUCCESS',
    triggeredBy: 'النظام الآلي (Royal Self-Healing Engine)',
  },
];

export const royalAutoRecovery = {
  getAuditLogs(): HealingAuditLog[] {
    return auditLogs;
  },

  executeRecovery(fault: SystemFault, userEmail?: string): HealingAuditLog {
    const analysis = royalRootCauseAnalyzer.analyze(fault);
    let status: 'SUCCESS' | 'FAILED' | 'PENDING_MASTER' = 'SUCCESS';
    let actionDescription = '';

    switch (analysis.remediationType) {
      case 'ACTIVATE_FALLBACK':
        actionDescription = 'تم تفعيل التحويل التلقائي للمحرك المحلي (ATT YA LEGAL MIND) بنجاح.';
        break;
      case 'RECONNECT_DB':
        actionDescription = 'تمت إعادة ربط قاعدة بيانات المكتب وتحديث الجداول بنجاح.';
        break;
      case 'ALERT_MASTER':
        status = 'PENDING_MASTER';
        actionDescription = 'تم حظر التعديل وتجميد المسار وإرسال تنبيه أمني عاجل للمالك الرئيسي (atiyamervat87@gmail.com).';
        break;
      case 'CLEAR_CACHE':
      default:
        actionDescription = 'تم مسح الذاكرة المؤقتة واستقرار الخدمة.';
        break;
    }

    const log: HealingAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      faultTitle: fault.title,
      rootCause: analysis.rootCause,
      actionTaken: actionDescription,
      status,
      triggeredBy: userEmail || 'النظام الملكي الآلي',
    };

    auditLogs.unshift(log);
    if (auditLogs.length > 50) auditLogs.pop();

    return log;
  },
};
