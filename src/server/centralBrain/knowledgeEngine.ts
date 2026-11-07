/**
 * ABQARYNO CENTRAL BRAIN — KNOWLEDGE ENGINE (RAG)
 * محرك المعرفة واسترجاع القوانين وأحكام النقض والدستورية دون أي هلوسة
 */

import { EGYPTIAN_LEGAL_ARTICLES, CASSATION_RULINGS } from '../../data/egyptianLaws.ts';
import { LegalStatute, LegalCassation } from './types.ts';

export class CentralBrainKnowledgeEngine {
  /**
   * استرجاع المواد القانونية ذات الصلة بالموضوع مرتبة بحسب قوة التطابق
   */
  public queryArticles(keywords: string[], preferredBranch?: string): LegalStatute[] {
    const scored: Array<{ statute: LegalStatute; score: number }> = [];
    const normalizedKeywords = keywords
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 1);

    if (normalizedKeywords.length === 0) return [];

    for (const art of EGYPTIAN_LEGAL_ARTICLES) {
      const lawLower = (art.lawName || '').toLowerCase();
      const numLower = (art.articleNumber || '').toLowerCase();
      const contentLower = (art.content || '').toLowerCase();
      const titleLower = (art.title || '').toLowerCase();

      // فلترة صارمة حسب الفرع لمنع خلط المواد الجنائية بالمدنية
      if (preferredBranch === 'criminal') {
        const isCriminalLaw = lawLower.includes('عقوبات') || lawLower.includes('إجراءات جنائية') || lawLower.includes('مخدرات') || lawLower.includes('أسلحة') || lawLower.includes('تقنية المعلومات');
        if (!isCriminalLaw) continue;
      } else if (preferredBranch === 'family') {
        const isFamilyLaw = lawLower.includes('أسرة') || lawLower.includes('أحوال شخصية') || lawLower.includes('طفل') || lawLower.includes('ولاية على المال');
        if (!isFamilyLaw) continue;
      } else if (preferredBranch === 'labor') {
        const isLaborLaw = lawLower.includes('عمل') || lawLower.includes('تأمينات') || lawLower.includes('خدمة مدنية');
        if (!isLaborLaw) continue;
      }

      let score = 0;
      for (const kw of normalizedKeywords) {
        if (numLower.includes(kw)) score += 6;
        if (titleLower.includes(kw)) score += 5;
        if (contentLower.includes(kw)) score += 2;
        if (lawLower.includes(kw)) score += 1;
      }

      // حد أدنى للمطابقة لمنع الحشو غير الدقيق
      if (score >= 4) {
        scored.push({
          score,
          statute: {
            lawName: art.lawName,
            articleNumber: art.articleNumber,
            text: art.content,
            summary: art.title || '',
            officialReference: `المادة (${art.articleNumber}) من ${art.lawName}`,
          }
        });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(item => item.statute);
  }

  /**
   * استرجاع أحكام محكمة النقض المؤصلة مرتبة بالأولوية مع فلترة الفرع
   */
  public queryCassationRulings(keywords: string[], preferredBranch?: string): LegalCassation[] {
    const scored: Array<{ ruling: LegalCassation; score: number }> = [];
    const normalizedKeywords = keywords
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 1);

    if (normalizedKeywords.length === 0) return [];

    for (const ruling of CASSATION_RULINGS) {
      const circuitLower = (ruling.circuit || '').toLowerCase();
      const courtLower = (ruling.court || '').toLowerCase();
      const principleLower = (ruling.principle || '').toLowerCase();
      const numLower = (ruling.rulingNumber || '').toLowerCase();

      // فلترة فرع النقض
      if (preferredBranch === 'criminal') {
        const isCriminalRuling = circuitLower.includes('جنائ') || courtLower.includes('جنائ');
        if (!isCriminalRuling) continue;
      } else if (preferredBranch === 'family') {
        const isFamilyRuling = circuitLower.includes('أحوال') || circuitLower.includes('أسرة') || circuitLower.includes('شرعي');
        if (!isFamilyRuling) continue;
      } else if (preferredBranch === 'labor') {
        const isLaborRuling = circuitLower.includes('عمال');
        if (!isLaborRuling) continue;
      }

      let score = 0;
      for (const kw of normalizedKeywords) {
        if (principleLower.includes(kw)) score += 4;
        if (circuitLower.includes(kw)) score += 2;
        if (numLower.includes(kw)) score += 1;
      }

      // يلزم حد أدنى لمطابقة المبدأ القضائي مع السؤال
      if (score >= 4) {
        scored.push({
          score,
          ruling: {
            court: ruling.court || 'محكمة النقض المصرية',
            rulingNumber: ruling.rulingNumber,
            judicialYear: ruling.judicialYear || 'قضائية',
            sessionDate: ruling.sessionDate || '',
            principle: ruling.principle,
          }
        });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 2).map(item => item.ruling);
  }
}
