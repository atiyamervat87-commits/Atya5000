/**
 * ABQARYNO CENTRAL BRAIN — LLM CORE
 * محرك الربط بالنموذج اللغوي الكبير (Gemini 2.5 Flash عبر @google/genai)
 * مع إدارة الاتصال والحصص ومفاتيح API المعرفة من المنصة
 */

import { GoogleGenAI } from '@google/genai';
import { ConsultationTurn } from './types.ts';
import { AL_HELBAWY_SYSTEM_INSTRUCTION } from '../../system_instructions.ts';

export class CentralBrainLLMCore {
  private aiClient: GoogleGenAI | null = null;
  private currentApiKey: string = '';
  private isQuotaExceeded: boolean = false;
  private quotaResetTime: number = 0;

  constructor() {
    this.initClient(process.env.GEMINI_API_KEY || '');
  }

  public initClient(apiKey: string): boolean {
    if (!apiKey || apiKey.trim() === '') {
      this.aiClient = null;
      this.currentApiKey = '';
      return false;
    }
    try {
      this.currentApiKey = apiKey.trim();
      this.aiClient = new GoogleGenAI({
        apiKey: this.currentApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-abqaryno-central-brain',
          },
        },
      });
      this.isQuotaExceeded = false;
      return true;
    } catch (err) {
      console.error('[LLMCore] Failed to initialize GoogleGenAI client:', err);
      this.aiClient = null;
      return false;
    }
  }

  public hasActiveKey(): boolean {
    return Boolean(this.aiClient && this.currentApiKey);
  }

  public isQuotaBlocked(): boolean {
    if (this.isQuotaExceeded && Date.now() < this.quotaResetTime) {
      return true;
    }
    if (this.isQuotaExceeded && Date.now() >= this.quotaResetTime) {
      this.isQuotaExceeded = false;
    }
    return false;
  }

  /**
   * فحص الاتصال واختبار صحة مفتاح API
   */
  public async testHealth(): Promise<{ success: boolean; latencyMs: number; message: string }> {
    if (!this.aiClient) {
      return { success: false, latencyMs: 0, message: 'مفتاح API غير معين حالياً (يعمل المحرك الذاتي الداخلي).' };
    }
    const start = Date.now();
    try {
      const response = await this.aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'قل كلمة واحدة فقط: متصل',
      });
      const latencyMs = Date.now() - start;
      const text = response.text || '';
      return {
        success: true,
        latencyMs,
        message: `تم التحقق بنجاح من اتصال النموذج اللغوي السحابي (Gemini 2.5 Flash). زمن الاستجابة: ${latencyMs}ms. الرد: ${text.trim()}`,
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        message: `تعذر الاتصال بالنموذج السحابي: ${err?.message || String(err)}`,
      };
    }
  }

  /**
   * توليد استجابة لغوية ذكية باستخدام Gemini 2.5 Flash
   */
  public async generateTurn(
    userMessage: string,
    history: ConsultationTurn[] = [],
    customDirective?: string
  ): Promise<string | null> {
    if (!this.aiClient || this.isQuotaBlocked()) {
      return null;
    }

    try {
      // إعداد سجل المحادثة بتنسيق متعدد الأدوار
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // إضافة آخر 10 أدوار فقط لترشيد التوكنز والحفاظ على السياق
      const recentTurns = history.slice(-10);
      for (const t of recentTurns) {
        contents.push({
          role: t.role === 'model' ? 'model' : 'user',
          parts: [{ text: t.text }],
        });
      }

      // توجيه إضافي محدد للنية الحالية إذا وجد
      let finalPrompt = userMessage;
      if (customDirective) {
        finalPrompt = `${userMessage}\n\n[توجيه قضائي داخلي ملزم للعقل]: ${customDirective}`;
      }

      contents.push({
        role: 'user',
        parts: [{ text: finalPrompt }],
      });

      const response = await this.aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: AL_HELBAWY_SYSTEM_INSTRUCTION,
          temperature: 0.3,
          maxOutputTokens: 2500,
        },
      });

      return response.text || null;
    } catch (err: any) {
      const errMsg = String(err?.message || err || '');
      if (err?.status === 429 || errMsg.includes('429') || errMsg.includes('QUOTA') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        this.isQuotaExceeded = true;
        this.quotaResetTime = Date.now() + 60 * 1000;
        console.warn('[LLMCore] Gemini Quota hit. Fallback to Autonomous Engine active for 60s.');
      } else {
        console.error('[LLMCore] Gemini generation failed:', err);
      }
      return null;
    }
  }
}
