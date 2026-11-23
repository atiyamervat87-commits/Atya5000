import React, { useState, useEffect } from 'react';

interface WeightReport {
  fileName: string;
  expectedHash: string;
  actualHash: string;
  isValid: boolean;
  sizeBytes: number;
}

interface Fault {
  id: string;
  component: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  timestamp: string;
  autoFixable: boolean;
}

interface HealthStatus {
  healthScore: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  timestamp: string;
  weightReports: WeightReport[];
  activeFaults: Fault[];
  databaseStatus: 'CONNECTED' | 'DISCONNECTED';
  geminiQuotaStatus: 'NORMAL' | 'EXHAUSTED_FALLBACK_ACTIVE';
}

interface AuditLog {
  id: string;
  timestamp: string;
  faultTitle: string;
  rootCause: string;
  actionTaken: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING_MASTER';
  triggeredBy: string;
}

export const RoyalSelfHealingDashboard: React.FC = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(
    localStorage.getItem('attya_user_email') || 'atiyamervat87@gmail.com'
  );
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [repairingId, setRepairingId] = useState<string | null>(null);

  const MASTER_EMAIL = 'atiyamervat87@gmail.com';
  const isMaster = currentUserEmail.trim().toLowerCase() === MASTER_EMAIL.toLowerCase();

  const fetchHealthStatus = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/self-healing/status', {
        headers: {
          'x-user-email': currentUserEmail,
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          setErrorMsg('وصول مرفوض: وحدة الإصلاح الذاتي سرية ومخصصة للمالك الرئيسي للمنصة فقط.');
        } else {
          setErrorMsg('تعذر الاتصال بخدمة الإصلاح الذاتي.');
        }
        setLoading(false);
        return;
      }
      const data = await res.json();
      setHealthData(data.health);
      setAuditLogs(data.auditLogs);
    } catch (err: any) {
      setErrorMsg(err.message || 'خطأ في الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMaster) {
      fetchHealthStatus();
    } else {
      setLoading(false);
    }
  }, [currentUserEmail]);

  const handleTriggerRepair = async (faultId?: string) => {
    setRepairingId(faultId || 'all');
    try {
      const res = await fetch('/api/self-healing/trigger-repair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUserEmail,
        },
        body: JSON.stringify({ faultId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchHealthStatus();
      } else {
        alert(data.error || 'فشل تنفيذ الإصلاح التلقائي.');
      }
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    } finally {
      setRepairingId(null);
    }
  };

  if (!isMaster) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center bg-[#24140f] border border-rose-500/40 rounded-2xl shadow-2xl mt-12">
        <div className="w-16 h-16 bg-rose-950/80 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-rose-500/50">
          🔒
        </div>
        <h2 className="text-2xl font-bold font-amiri text-rose-200 mb-2">
          منطقة محظورة — وحدة الإصلاح الذاتي الملكي
        </h2>
        <p className="text-sm text-[#F5E5BD]/70 mb-6 leading-relaxed">
          هذه الوحدة سرية ومخصصة حصرياً للمالك الرئيسي (Master Owner). يتم تسجيل ومراقبة جميع محاولات الوصول غير المصرح بها أمنياً.
        </p>
        <div className="p-4 bg-[#1a0e0b] rounded-xl border border-[#D4AF37]/30 text-left mb-6">
          <label className="block text-xs text-[#D4AF37] mb-1 font-semibold">تحويل البريد الإلكتروني للمحاكاة (للاختبار):</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={currentUserEmail}
              onChange={(e) => {
                setCurrentUserEmail(e.target.value);
                localStorage.setItem('attya_user_email', e.target.value);
              }}
              className="flex-1 bg-[#2B1914] border border-[#D4AF37]/40 rounded-lg px-3 py-2 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
              placeholder="atiyamervat87@gmail.com"
            />
            <button
              onClick={() => {
                localStorage.setItem('attya_user_email', currentUserEmail);
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#D4AF37] text-[#2B1914] font-bold rounded-lg text-xs hover:bg-[#E7C779] transition"
            >
              تفعيل الصلاحية
            </button>
          </div>
        </div>
        <p className="text-xs text-[#F5E5BD]/50">البريد المعتمد للمالك: atiyamervat87@gmail.com</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#24140f] border-2 border-[#D4AF37]/50 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8c701e] flex items-center justify-center text-[#2B1914] text-2xl shadow-lg border border-[#E7C779]">
            🛡️
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">مركز القيادة الملكي — وحدة سرية</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#F5E5BD]">وحدة الإصلاح الذاتي الملكي</h2>
            <p className="text-xs sm:text-sm text-[#F5E5BD]/70">
              المراقبة المستمرة، تشخيص الأعطال، حماية الأوزان، والإصلاح التلقائي اللحظي
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchHealthStatus}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-[#3A241B] hover:bg-[#2B1914] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            {loading ? '⏳ جاري الفحص...' : '🔄 تحديث الفحص الشامل'}
          </button>
          <button
            onClick={() => handleTriggerRepair()}
            disabled={repairingId !== null}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:brightness-110 text-[#2B1914] text-xs font-bold shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            ⚡ تشخيص وإصلاح فوري
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/80 border border-rose-500 rounded-xl text-rose-200 text-sm">
          {errorMsg}
        </div>
      )}

      {healthData && (
        <>
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Health Score */}
            <div className="bg-[#24140f] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-[#F5E5BD]/70 mb-1">مؤشر الصحة العامة للنظام</p>
                <div className="text-3xl font-bold font-amiri text-[#D4AF37]">{healthData.healthScore}%</div>
                <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  healthData.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                  healthData.status === 'DEGRADED' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                  'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}>
                  حالة التشغيل: {healthData.status}
                </span>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-[#D4AF37]/40 flex items-center justify-center text-2xl">
                {healthData.status === 'OPTIMAL' ? '🌟' : healthData.status === 'DEGRADED' ? '⚠️' : '🚨'}
              </div>
            </div>

            {/* Database & Quota */}
            <div className="bg-[#24140f] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-lg space-y-2">
              <p className="text-xs text-[#F5E5BD]/70">قاعدة بيانات المكتب والسحابة</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F5E5BD]">قاعدة بيانات SQLite:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">متصلة (Connected)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F5E5BD]">حصة Gemini السحابية:</span>
                <span className={`px-2 py-0.5 rounded font-mono ${
                  healthData.geminiQuotaStatus === 'NORMAL' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                }`}>
                  {healthData.geminiQuotaStatus === 'NORMAL' ? 'طبيعية (Normal)' : 'استنفاد / محلي مفعل'}
                </span>
              </div>
            </div>

            {/* Active Faults Count */}
            <div className="bg-[#24140f] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-[#F5E5BD]/70 mb-1">الأخطاء والمشاكل النشطة</p>
                <div className="text-3xl font-bold font-amiri text-rose-400">{healthData.activeFaults.length}</div>
                <p className="text-[11px] text-[#F5E5BD]/60 mt-1">تتم المراقبة والمعالجة في الوقت الفعلي</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-950/60 text-rose-400 flex items-center justify-center text-xl border border-rose-500/30">
                ⚡
              </div>
            </div>
          </div>

          {/* Active Faults Panel */}
          <div className="bg-[#24140f] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold font-amiri text-[#D4AF37] flex items-center gap-2">
              🚨 رصد الأخطاء وحالة التدخل الآلي
            </h3>
            {healthData.activeFaults.length === 0 ? (
              <div className="p-4 bg-[#1a0e0b] rounded-xl border border-emerald-500/30 text-emerald-300 text-xs text-center">
                ✨ ممتاز! لا توجد أي أخطاء نشطة في الوقت الحالي. المنصة تعمل بكفاءة تامة.
              </div>
            ) : (
              <div className="space-y-3">
                {healthData.activeFaults.map((fault) => (
                  <div key={fault.id} className="p-4 bg-[#1a0e0b] rounded-xl border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 font-bold border border-rose-500/50">
                          {fault.severity}
                        </span>
                        <span className="text-xs text-[#D4AF37] font-semibold">{fault.component}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F5E5BD]">{fault.title}</h4>
                      <p className="text-xs text-[#F5E5BD]/70">{fault.description}</p>
                    </div>
                    {fault.autoFixable && (
                      <button
                        onClick={() => handleTriggerRepair(fault.id)}
                        disabled={repairingId === fault.id}
                        className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E7C779] text-[#2B1914] text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer"
                      >
                        {repairingId === fault.id ? '⏳ جاري الإصلاح...' : '⚡ إصلاح تلقائي'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Neural Weights & SHA-256 Fingerprint Integrity */}
          <div className="bg-[#24140f] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-amiri text-[#D4AF37] flex items-center gap-2">
                🔒 سلامة الأوزان العصبية وبصمات SHA-256
              </h3>
              <span className="text-xs text-emerald-400 font-mono">حماية المالك الرئيسي مفعلة</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37]">
                    <th className="py-2.5 px-3">اسم الملف</th>
                    <th className="py-2.5 px-3">الحجم (بايت)</th>
                    <th className="py-2.5 px-3">بصمة SHA-256 الفعلية</th>
                    <th className="py-2.5 px-3">حالة التحقق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10 text-[#F5E5BD]">
                  {healthData.weightReports.map((report, idx) => (
                    <tr key={idx} className="hover:bg-[#1a0e0b]">
                      <td className="py-3 px-3 font-semibold font-mono">{report.fileName}</td>
                      <td className="py-3 px-3 font-mono text-[#F5E5BD]/70">{report.sizeBytes.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#D4AF37] truncate max-w-xs">{report.actualHash}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          report.isValid ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500'
                        }`}>
                          {report.isValid ? 'VERIFIED (طابق البصمة)' : 'TAMPERED / MISMATCH'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Self-Healing Audit Logs */}
          <div className="bg-[#24140f] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold font-amiri text-[#D4AF37] flex items-center gap-2">
              📜 سجلات عمليات الإصلاح الذاتي والتشخيص (Audit Trail)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37]">
                    <th className="py-2.5 px-3">التوقيت</th>
                    <th className="py-2.5 px-3">الخطأ / الحدث</th>
                    <th className="py-2.5 px-3">الإجراء المتخذ</th>
                    <th className="py-2.5 px-3">الجهة المشغلة</th>
                    <th className="py-2.5 px-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10 text-[#F5E5BD]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#1a0e0b]">
                      <td className="py-3 px-3 font-mono text-[11px] text-[#F5E5BD]/70">
                        {new Date(log.timestamp).toLocaleTimeString('ar-EG')}
                      </td>
                      <td className="py-3 px-3 font-semibold">{log.faultTitle}</td>
                      <td className="py-3 px-3 text-[#F5E5BD]/90">{log.actionTaken}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#D4AF37]">{log.triggeredBy}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                          log.status === 'PENDING_MASTER' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                          'bg-rose-950 text-rose-300 border border-rose-500'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
