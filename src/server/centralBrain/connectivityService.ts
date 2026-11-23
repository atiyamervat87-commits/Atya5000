import { centralBrainEngine } from './brainEngine.ts';

export interface PingTestResult {
  status: 'CONNECTED' | 'DISCONNECTED' | 'TIMEOUT' | 'ERROR';
  latencyMs: number;
  engineName: string;
  responsePreview: string;
  timestamp: string;
}

export const connectivityService = {
  async pingLocalBrain(): Promise<PingTestResult> {
    const startTime = Date.now();
    try {
      const result = await Promise.race([
        centralBrainEngine.processTurn('ping-session', 'Ping: اختبار الاتصال بالعقل المستقل', 'public'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 8000)),
      ]) as any;

      const latencyMs = Date.now() - startTime;
      return {
        status: 'CONNECTED',
        latencyMs,
        engineName: 'ATTYA LEGAL MIND MASTER 1000K (' + (result.sourceEngine || 'autonomous_reasoning_core') + ')',
        responsePreview: (result.text || '').substring(0, 150) + '...',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const status = err.message === 'TIMEOUT' ? 'TIMEOUT' : 'ERROR';
      return {
        status,
        latencyMs,
        engineName: 'ATTYA LEGAL MIND MASTER 1000K',
        responsePreview: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  },
};
