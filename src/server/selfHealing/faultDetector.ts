import { royalRepairGuard, WeightIntegrityReport } from './repairGuard.js';
import { officeDb } from '../db.js';

export interface SystemFault {
  id: string;
  component: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  timestamp: string;
  autoFixable: boolean;
}

export interface SystemHealthStatus {
  healthScore: number; // 0 to 100
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  timestamp: string;
  weightReports: WeightIntegrityReport[];
  activeFaults: SystemFault[];
  databaseStatus: 'CONNECTED' | 'DISCONNECTED';
  geminiQuotaStatus: 'NORMAL' | 'EXHAUSTED_FALLBACK_ACTIVE';
}

export const royalFaultDetector = {
  detectFaults(quotaExceededState: boolean, quotaErrorReason: string): SystemHealthStatus {
    const faults: SystemFault[] = [];
    const weightReports = royalRepairGuard.checkWeightsIntegrity();

    // Check weights
    for (const report of weightReports) {
      if (!report.isValid) {
        faults.push({
          id: `weight-${report.fileName}`,
          component: 'Neural Weights & Lexicon',
          severity: 'CRITICAL',
          title: `اختلاف بصمة الشفرة لملف ${report.fileName}`,
          description: `البصمة الفعلية (${report.actualHash}) لا تتطابق مع البصمة المعتمدة.`,
          timestamp: new Date().toISOString(),
          autoFixable: false,
        });
      }
    }

    // Check Gemini Quota
    if (quotaExceededState) {
      faults.push({
        id: 'gemini-quota-exhausted',
        component: 'Gemini Cloud API',
        severity: 'WARNING',
        title: 'استنفاد حصة السحابة المؤقتة (QUOTA_EXCEEDED)',
        description: quotaErrorReason || 'تم تفعيل المحرك المحلي كبديل تلقائي ضماناً لاستمرار الخدمة.',
        timestamp: new Date().toISOString(),
        autoFixable: true,
      });
    }

    // Check Database
    let dbStatus: 'CONNECTED' | 'DISCONNECTED' = 'CONNECTED';
    try {
      const stats = officeDb.getOfficeStatistics();
      if (!stats) {
        dbStatus = 'DISCONNECTED';
        faults.push({
          id: 'db-connection-error',
          component: 'SQLite Office Database',
          severity: 'CRITICAL',
          title: 'تعذر استعلام قاعدة بيانات المكتب',
          description: 'فشل استرجاع إحصائيات المكتب من قاعدة البيانات المحلية.',
          timestamp: new Date().toISOString(),
          autoFixable: true,
        });
      }
    } catch (err: any) {
      dbStatus = 'DISCONNECTED';
      faults.push({
        id: 'db-connection-error',
        component: 'SQLite Office Database',
        severity: 'CRITICAL',
        title: 'خطأ في اتصال قاعدة البيانات',
        description: err.message,
        timestamp: new Date().toISOString(),
        autoFixable: true,
      });
    }

    // Calculate health score
    let score = 100;
    for (const f of faults) {
      if (f.severity === 'CRITICAL') score -= 35;
      else if (f.severity === 'WARNING') score -= 15;
    }
    if (score < 0) score = 0;

    const status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' =
      score >= 90 ? 'OPTIMAL' : score >= 60 ? 'DEGRADED' : 'CRITICAL';

    return {
      healthScore: score,
      status,
      timestamp: new Date().toISOString(),
      weightReports,
      activeFaults: faults,
      databaseStatus: dbStatus,
      geminiQuotaStatus: quotaExceededState ? 'EXHAUSTED_FALLBACK_ACTIVE' : 'NORMAL',
    };
  },
};
