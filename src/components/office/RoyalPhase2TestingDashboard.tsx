import React, { useState, useEffect } from 'react';

interface TestItem {
  testId: number;
  testName: string;
  inputPrompt: string;
  actualOutputPreview: string;
  engineUsed: string;
  latencyMs: number;
  status: 'PASS' | 'PARTIAL' | 'FAIL' | 'NOT TESTED';
  evaluationNote: string;
}

export const RoyalPhase2TestingDashboard: React.FC = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(
    localStorage.getItem('attya_user_email') || 'atiyamervat87@gmail.com'
  );
  const [tests, setTests] = useState<TestItem[]>([]);
  const [running, setRunning] = useState<boolean>(false);
  const [summaryStats, setSummaryStats] = useState<{ pass: number; partial: number; fail: number }>({ pass: 0, partial: 0, fail: 0 });

  const MASTER_EMAIL = 'atiyamervat87@gmail.com';
  const isMaster = currentUserEmail.trim().toLowerCase() === MASTER_EMAIL.toLowerCase();

  const runPhase2Tests = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/royal/phase2-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUserEmail,
        },
      });
      if (!res.ok) {
        alert('تعذر تشغيل اختبارات المرحلة الثانية.');
        setRunning(false);
        return;
      }
      const data = await res.json();
      setTests(data.results);
      
      let p = 0, pt = 0, f = 0;
      for (const item of data.results) {
        if (item.status === 'PASS') p++;
        else if (item.status === 'PARTIAL') pt++;
        else if (item.status === 'FAIL') f++;
      }
      setSummaryStats({ pass: p, partial: pt, fail: f });
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  if (!isMaster) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center bg-[#24140f] border border-rose-500/40 rounded-2xl shadow-2xl mt-12">
        <div className="w-16 h-16 bg-rose-950/80 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-rose-500/50">
          🔒
        </div>
        <h2 className="text-2xl font-bold font-amiri text-rose-200 mb-2">
          منطقة محظورة — اختبار المرحلة الثانية للعقل المستقل
        </h2>
        <p className="text-sm text-[#F5E5BD]/70 mb-6 leading-relaxed">
          هذه الوحدة سرية ومخصصة حصرياً للمالك الرئيسي (Master Owner). يتم تسجيل ومراقبة جميع محاولات الوصول.
        </p>
        <div className="p-4 bg-[#1a0e0b] rounded-xl border border-[#D4AF37]/30 text-left mb-6">
          <label className="block text-xs text-[#D4AF37] mb-1 font-semibold">البريد الإلكتروني للمحاكاة:</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={currentUserEmail}
              onChange={(e) => {
                setCurrentUserEmail(e.target.value);
                localStorage.setItem('attya_user_email', e.target.value);
              }}
              className="flex-1 bg-[#2B1914] border border-[#D4AF37]/40 rounded-lg px-3 py-2 text-xs text-[#F5E5BD] focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              onClick={() => {
                localStorage.setItem('attya_user_email', currentUserEmail);
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#D4AF37] text-[#2B1914] font-bold rounded-lg text-xs hover:bg-[#E7C779] transition"
            >
              تفعيل
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2B1914] via-[#3A241B] to-[#24140f] border-2 border-[#D4AF37]/50 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8c701e] flex items-center justify-center text-[#2B1914] text-2xl shadow-lg border border-[#E7C779]">
            ⚖️
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">مركز القيادة الملكي — المرحلة الثانية</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#F5E5BD]">اختبار القدرات الفعلية للعقل المستقل</h2>
            <p className="text-xs sm:text-sm text-[#F5E5BD]/70">
              تقييم تفصيلي لـ 10 اختبارات جوهرية للمحرك المحلي (ATTYA LEGAL MIND) دون استهلاك رصيد سحابي
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={runPhase2Tests}
            disabled={running}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C779] hover:brightness-110 text-[#2B1914] text-sm font-bold shadow-xl transition flex items-center gap-2 cursor-pointer"
          >
            {running ? '⏳ جاري تنفيذ الاختبارات (10 محاور)...' : '🚀 تشغيل اختبار القدرات الشامل'}
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      {tests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#24140f] border border-[#D4AF37]/30 rounded-2xl p-4 text-center">
            <span className="text-xs text-[#F5E5BD]/70">إجمالي الاختبارات</span>
            <div className="text-2xl font-bold text-[#D4AF37] font-mono mt-1">{tests.length}</div>
          </div>
          <div className="bg-[#24140f] border border-emerald-500/30 rounded-2xl p-4 text-center">
            <span className="text-xs text-emerald-300">نجاح تام (PASS)</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{summaryStats.pass}</div>
          </div>
          <div className="bg-[#24140f] border border-amber-500/30 rounded-2xl p-4 text-center">
            <span className="text-xs text-amber-300">نجاح جزئي (PARTIAL)</span>
            <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{summaryStats.partial}</div>
          </div>
          <div className="bg-[#24140f] border border-rose-500/30 rounded-2xl p-4 text-center">
            <span className="text-xs text-rose-300">إخفاق (FAIL)</span>
            <div className="text-2xl font-bold text-rose-400 font-mono mt-1">{summaryStats.fail}</div>
          </div>
        </div>
      )}

      {/* Test Results Table */}
      <div className="bg-[#24140f] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold font-amiri text-[#D4AF37] flex items-center gap-2">
          📋 نتائج تقييم المحاور العشرة للعقل المستقل
        </h3>
        {tests.length === 0 ? (
          <div className="p-8 text-center bg-[#1a0e0b] rounded-xl border border-[#D4AF37]/20 text-xs text-[#F5E5BD]/60">
            اضغط على زر «تشغيل اختبار القدرات الشامل» أعلى الصفحة لبدء تقييم المحرك المحلي وتوليد النتائج الموثقة.
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((item) => (
              <div key={item.testId} className="p-4 bg-[#1a0e0b] rounded-xl border border-[#D4AF37]/30 space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-xs flex items-center justify-center font-mono">
                      {item.testId}
                    </span>
                    <h4 className="font-bold text-sm text-[#F5E5BD]">{item.testName}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#F5E5BD]/60 font-mono">المحرك: {item.engineUsed}</span>
                    <span className="text-[11px] text-[#D4AF37] font-mono">الزمن: {item.latencyMs}ms</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      item.status === 'PASS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                      item.status === 'PARTIAL' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                      'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#24140f] rounded-lg border border-[#D4AF37]/15">
                    <span className="block text-[10px] text-[#D4AF37] mb-1 font-semibold">المدخلات (Input Prompt):</span>
                    <p className="text-[#F5E5BD]/90 font-mono">{item.inputPrompt}</p>
                  </div>
                  <div className="p-3 bg-[#24140f] rounded-lg border border-[#D4AF37]/15">
                    <span className="block text-[10px] text-emerald-400 mb-1 font-semibold">معاينة المخرجات والتقييم:</span>
                    <p className="text-[#F5E5BD]/90 mb-1">{item.actualOutputPreview}</p>
                    <p className="text-[11px] text-[#E7C779] italic">{item.evaluationNote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
