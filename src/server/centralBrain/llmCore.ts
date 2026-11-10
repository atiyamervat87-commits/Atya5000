/**
 * ABQARYNO CENTRAL BRAIN — LLM CORE
 * محرك الربط بالنموذج اللغوي الكبير (Gemini 3.8 Flash عبر @google/genai)
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
            'User-Agent': 'aistudio-build',
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
        model: 'gemini-3.8-flash',
        contents: 'قل كلمة واحدة فقط: متصل',
      });
      const latencyMs = Date.now() - start;
      const text = response.text || '';
      return {
        success: true,
        latencyMs,
        message: `تم التحقق بنجاح من اتصال النموذج اللغوي السحابي (Gemini 3.8 Flash). زمن الاستجابة: ${latencyMs}ms. الرد: ${text.trim()}`,
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
   * توليد استجابة لغوية ذكية باستخدام Gemini 3.8 Flash مع مهلة أمان قصوى
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
      // إعداد سجل المحادثة بتنسيق متعدد الأدوار مع التحقق الصارم من تناوب الأدوار (user -> model)
      const sanitizedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      let expectedRole: 'user' | 'model' = 'user';

      // فحص آخر 8 أدوار مع ضمان عدم تكرار دورين متتاليين لنفس الطرف
      const recentTurns = (history || []).slice(-8);
      for (const t of recentTurns) {
        const text = (t.text || '').trim();
        if (!text) continue;
        const role: 'user' | 'model' = t.role === 'model' ? 'model' : 'user';

        if (role === expectedRole) {
          sanitizedContents.push({
            role,
            parts: [{ text }],
          });
          expectedRole = expectedRole === 'user' ? 'model' : 'user';
        }
      }

      // إذا انتهى السجل المحفوظ بدور user، نحذفه لكي يحل محله prompt المستخدم الحالي بالتوجيه الملزم
      if (sanitizedContents.length > 0 && sanitizedContents[sanitizedContents.length - 1].role === 'user') {
        sanitizedContents.pop();
      }

      // توجيه إضافي محدد للنية الحالية إذا وجد
      let finalPrompt = userMessage;
      if (customDirective) {
        finalPrompt = `${userMessage}\n\n[توجيه قضائي داخلي ملزم للعقل]: ${customDirective}`;
      }

      sanitizedContents.push({
        role: 'user',
        parts: [{ text: finalPrompt }],
      });

      // مهلة أمان قصوى 10 ثوانٍ لمنع أي تعليق على اتصال السحابة
      const response = await Promise.race([
        this.aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: sanitizedContents,
          config: {
            systemInstruction: AL_HELBAWY_SYSTEM_INSTRUCTION,
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('LLM_GENERATION_TIMEOUT')), 10000)
        ),
      ]);

      return response.text || null;
    } catch (err: any) {
      const errMsg = String(err?.message || err || '');
      if (err?.status === 429 || errMsg.includes('429') || errMsg.includes('QUOTA') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        this.isQuotaExceeded = true;
        this.quotaResetTime = Date.now() + 60 * 1000;
        console.warn('[LLMCore] Gemini Quota hit. Fallback to Autonomous Engine active for 60s.');
      } else if (errMsg.includes('LLM_GENERATION_TIMEOUT')) {
        console.warn('[LLMCore] Gemini call timed out after 10s. Seamlessly falling back to Autonomous Engine.');
      } else {
        console.error('[LLMCore] Gemini generation failed:', err);
      }
      return null;
    }
  }
}
