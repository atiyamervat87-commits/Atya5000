/**
 * ABQARYNO CENTRAL BRAIN — CONTEXT ENGINE
 * محرك إدارة سياق المحادثات متعددة الأدوار وتتبع حالة المحادثة والوثائق الجاري تحريرها
 */

import { ConsultationContext, ConsultationTurn, DraftState, UserMemory, BrainIntentType } from './types.ts';

export class CentralBrainContextEngine {
  private sessions: Map<string, ConsultationContext> = new Map();

  /**
   * جلب سياق الجلسة أو إنشاؤه إن لم يكن موجوداً
   */
  public getContext(sessionId: string, roomType: 'public' | 'private' | 'office' = 'public'): ConsultationContext {
    let ctx = this.sessions.get(sessionId);
    if (!ctx) {
      ctx = {
        sessionId,
        roomType,
        turns: [],
        memory: {
          extractedFacts: [],
          savedDrafts: [],
          preferences: {
            tone: 'royal_reassuring',
          },
        },
      };
      this.sessions.set(sessionId, ctx);
    }
    return ctx;
  }

  /**
   * إضافة دور جديد للمحادثة مع حفظ التاريخ
   */
  public addTurn(sessionId: string, role: 'user' | 'model', text: string, metadata?: Record<string, any>): void {
    const ctx = this.getContext(sessionId);
    ctx.turns.push({
      role,
      text,
      timestamp: new Date().toISOString(),
      metadata,
    });
    // الحفاظ على آخر 30 دوراً فقط لمنع تضخم الذاكرة
    if (ctx.turns.length > 30) {
      ctx.turns = ctx.turns.slice(ctx.turns.length - 30);
    }
  }

  /**
   * تحديث المسودة النشطة
   */
  public setActiveDraft(sessionId: string, draft: DraftState): void {
    const ctx = this.getContext(sessionId);
    ctx.activeDraft = draft;
  }

  /**
   * استرجاع المسودة النشطة
   */
  public getActiveDraft(sessionId: string): DraftState | undefined {
    return this.sessions.get(sessionId)?.activeDraft;
  }

  /**
   * حفظ نية الدور الأخير
   */
  public setLastIntent(sessionId: string, intent: BrainIntentType): void {
    const ctx = this.getContext(sessionId);
    ctx.lastIntent = intent;
  }

  /**
   * تسجيل معلومة أو واقعة في ذاكرة المستخدم
   */
  public recordFact(sessionId: string, key: string, value: string): void {
    const ctx = this.getContext(sessionId);
    const existing = ctx.memory.extractedFacts.find(f => f.key === key);
    if (existing) {
      existing.value = value;
      existing.timestamp = new Date().toISOString();
    } else {
      ctx.memory.extractedFacts.push({ key, value, timestamp: new Date().toISOString() });
    }
  }

  /**
   * مسح الجلسة أو إعادة تهيئتها
   */
  public clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
