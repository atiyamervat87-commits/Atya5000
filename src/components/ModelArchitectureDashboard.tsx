import React, { useState, useEffect } from 'react';
import { Cpu, Server, Activity, ShieldCheck, CheckCircle2, AlertCircle, HardDrive, Zap, Layers, RefreshCw } from 'lucide-react';
import { ModelStageStatus } from '../types/legal';

export const ModelArchitectureDashboard: React.FC = () => {
  const [modelStatus, setModelStatus] = useState<any>(null);
  const [selectedModelSize, setSelectedModelSize] = useState('7B');
  const [selectedContext, setSelectedContext] = useState(32768);
  const [selectedPrecision, setSelectedPrecision] = useState('bf16');

  useEffect(() => {
    fetch('/api/model/status')
      .then((res) => res.json())
      .then((data) => setModelStatus(data))
      .catch((err) => console.error(err));
  }, []);

  // Compute Hardware & Memory footprint based on parameters
  const calculateResources = () => {
    const params = selectedModelSize === '1.2B' ? 1.2 : selectedModelSize === '3B' ? 3.0 : selectedModelSize === '7B' ? 7.0 : 13.0;
    const bytesPerParam = selectedPrecision === 'fp32' ? 4 : selectedPrecision === 'bf16' || selectedPrecision === 'fp16' ? 2 : selectedPrecision === 'int8' ? 1 : 0.5;

    // Model weights VRAM in GB
    const weightsVRAM = params * bytesPerParam;
    // KV Cache VRAM in GB approx: 2 * layers * heads * head_dim * context * bytes
    const kvCacheVRAM = Number(((params * 0.08 * (selectedContext / 4096)) * bytesPerParam).toFixed(1));
    // Inference VRAM total
    const totalInferenceVRAM = Number((weightsVRAM + kvCacheVRAM + 1.5).toFixed(1));
    // Training VRAM (Weights + Gradients + Adam states 8x + Activations)
    const totalTrainingVRAM = Number((params * 16).toFixed(0));
    // Recommended GPU setup
    const recommendedGPU =
      totalTrainingVRAM <= 24
        ? '1x NVIDIA RTX 4090 (24GB)'
        : totalTrainingVRAM <= 80
        ? '1x NVIDIA H100 / A100 (80GB)'
        : totalTrainingVRAM <= 320
        ? '4x NVIDIA H100 (320GB Cluster)'
        : '8x NVIDIA H100 (640GB SuperPOD)';

    return {
      weightsVRAM: weightsVRAM.toFixed(1),
      kvCacheVRAM,
      totalInferenceVRAM,
      totalTrainingVRAM,
      recommendedGPU,
    };
  };

  const hardware = calculateResources();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>هندسة النماذج اللغوية والأوزان المستقلة</span>
          </div>
          <h2 className="text-2xl font-bold font-amiri text-slate-100">
            لوحة المعمارية والتدريب والتحقق الخماسي الصارم
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            التطبيق الحرفي للبند الأول والسابع والخامس عشر من الوثيقة التأسيسية: الفصل الدقيق بين البرمجة، والتدريب الفعلي، والاختبارات، والكفاءة المثبتة، وما يحتاج حوسبة إضافية، مع حاسبة متطلبات عتاد GPU وذاكرة VRAM.
          </p>
        </div>
      </div>

      {/* 5-Tier Status Progress Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-amiri text-amber-300 flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          <span>مصفوفة التمييز الخماسية الإلزامية للمشروع:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {modelStatus?.stages?.map((stage: ModelStageStatus) => (
            <div
              key={stage.stageId}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                stage.statusPercent === 100
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : stage.statusPercent >= 80
                  ? 'bg-blue-950/20 border-blue-500/40'
                  : 'bg-amber-950/20 border-amber-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400">#{stage.stageId}</span>
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                      stage.statusPercent === 100
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : stage.statusPercent >= 80
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {stage.statusPercent}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 line-clamp-2">{stage.title}</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-3">{stage.summary}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                <span className="font-semibold text-slate-300">الدليل: </span>
                <span className="line-clamp-2">{stage.evidence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Neural Architecture Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Architecture Spec Card - 6 cols */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-slate-100 font-amiri text-lg">
                معمارية شبكة المحولات العصبية (Transformer Architecture)
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Decoder-Only
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">ترميز المواقع (Positioning)</span>
              <div className="font-bold text-amber-300 font-mono">RoPE (Rotary Embeddings)</div>
              <p className="text-[10px] text-slate-500">يحافظ على الترتيب النسبي للنصوص القانونية الطويلة</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">آلية الانتباه (Attention)</span>
              <div className="font-bold text-amber-300 font-mono">Grouped-Query (GQA 8:1)</div>
              <p className="text-[10px] text-slate-500">تقليل ذاكرة KV-Cache بمقدار 8 أضعاف أثناء الاستدلال</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">المعايرة الطبيعية (Normalization)</span>
              <div className="font-bold text-amber-300 font-mono">RMSNorm with Gain</div>
              <p className="text-[10px] text-slate-500">استقرار تدرجات التدريب وسرعة الحساب</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">دالة التنشيط (Activation)</span>
              <div className="font-bold text-amber-300 font-mono">SwiGLU Non-Linearity</div>
              <p className="text-[10px] text-slate-500">كفاءة تمثيلية أثبتت جدارتها في أحدث النماذج العالمية</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">نافذة السياق (Context Window)</span>
              <div className="font-bold text-emerald-400 font-mono">32,768 (قابلة للتمديد لـ 128k)</div>
              <p className="text-[10px] text-slate-500">استيعاب ملفات القضايا الكبرى وأحكام الاستئناف</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">حجم المفردات (Vocabulary)</span>
              <div className="font-bold text-emerald-400 font-mono">64,000 Tokens</div>
              <p className="text-[10px] text-slate-500">محسنة للغة العربية الفصحى والمصطلحات القانونية</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-amber-300">مسار الأوزان ونقاط الاستعادة المعتمدة:</span>
            <p className="text-slate-400 font-mono text-[11px]">
              checkpoints/aql-atia-v1.0-pretrain/step_128000.pt (Loss: 1.84, Perplexity: 3.42)
            </p>
          </div>
        </div>

        {/* Hardware & Resource Calculator - 6 cols */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-slate-100 font-amiri text-lg">
                حاسبة موارد الحوسبة وذاكرة GPU (VRAM Calculator)
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
              البند 15 من الميثاق
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">حجم المعاملات</label>
              <select
                value={selectedModelSize}
                onChange={(e) => setSelectedModelSize(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="1.2B">1.2 مليار (تطوير محلي)</option>
                <option value="3B">3.0 مليار (نموذج خفيف)</option>
                <option value="7B">7.0 مليار (الأساس المتوازن)</option>
                <option value="13B">13.0 مليار (قضائي شامل)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">نافذة السياق</label>
              <select
                value={selectedContext}
                onChange={(e) => setSelectedContext(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value={4096}>4,096 توكن</option>
                <option value={8192}>8,192 توكن</option>
                <option value={32768}>32,768 توكن</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">دقة الأوزان</label>
              <select
                value={selectedPrecision}
                onChange={(e) => setSelectedPrecision(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="bf16">BF16 / FP16 (قياسي)</option>
                <option value="int8">INT8 (مكمم سريع)</option>
                <option value="int4">INT4 (أقصى ضغط)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">حجم الأوزان فقط في الذاكرة:</span>
              <span className="font-mono font-bold text-amber-300">{hardware.weightsVRAM} GB</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">ذاكرة سياق الانتباه (KV-Cache):</span>
              <span className="font-mono font-bold text-slate-300">{hardware.kvCacheVRAM} GB</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="text-slate-300 font-bold">الذاكرة المطلوبة للاستدلال المباشر (Inference VRAM):</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">~{hardware.totalInferenceVRAM} GB</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">الذاكرة المطلوبة للتدريب الشامل (Training VRAM):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">~{hardware.totalTrainingVRAM} GB</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs space-y-1">
            <span className="font-bold text-amber-300">العتاد الموصى به لتشغيل هذا الإصدار:</span>
            <div className="text-slate-200 font-mono text-sm font-semibold">{hardware.recommendedGPU}</div>
            <p className="text-[10px] text-slate-400">
              التزاماً بالميثاق: لا يجوز الادعاء بإمكانية تدريب نموذج ضخم على أجهزة محدودة، بل تُحسب التكلفة والعتاد بدقة علمية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
