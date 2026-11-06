/**
 * ABQARYNO CENTRAL BRAIN — KNOWLEDGE ENGINE (RAG)
 * محرك المعرفة واسترجاع القوانين وأحكام النقض والدستورية دون أي هلوسة
 */

import { EGYPTIAN_LEGAL_ARTICLES, CASSATION_RULINGS } from '../../data/egyptianLaws.ts';
import { LegalStatute, LegalCassation } from './types.ts';

export class CentralBrainKnowledgeEngine {
  /**
   * استرجاع المواد القانونية ذات الصلة بالموضوع
   */
  public queryArticles(keywords: string[]): LegalStatute[] {
    const results: LegalStatute[] = [];
    const normalizedKeywords = keywords.map(k => k.trim().toLowerCase());

    for (const art of EGYPTIAN_LEGAL_ARTICLES) {
      const haystack = `${art.lawName} ${art.articleNumber} ${art.content} ${art.title || ''}`.toLowerCase();
      let score = 0;
      for (const kw of normalizedKeywords) {
        if (haystack.includes(kw)) {
          score += 1;
        }
      }
      if (score > 0) {
        results.push({
          lawName: art.lawName,
          articleNumber: art.articleNumber,
          text: art.content,
          summary: art.title || '',
          officialReference: `المادة (${art.articleNumber}) من ${art.lawName}`,
        });
      }
      if (results.length >= 4) break;
    }

    return results;
  }

  /**
   * استرجاع أحكام محكمة النقض المؤصلة
   */
  public queryCassationRulings(keywords: string[]): LegalCassation[] {
    const results: LegalCassation[] = [];
    const normalizedKeywords = keywords.map(k => k.trim().toLowerCase());

    for (const ruling of CASSATION_RULINGS) {
      const haystack = `${ruling.rulingNumber} ${ruling.principle} ${ruling.circuit || ''}`.toLowerCase();
      let match = false;
      for (const kw of normalizedKeywords) {
        if (haystack.includes(kw)) {
          match = true;
          break;
        }
      }
      if (match) {
        results.push({
          court: ruling.court || 'محكمة النقض المصرية',
          rulingNumber: ruling.rulingNumber,
          judicialYear: ruling.judicialYear || 'قضائية',
          sessionDate: ruling.sessionDate || '',
          principle: ruling.principle,
        });
      }
      if (results.length >= 2) break;
    }

    return results;
  }
}
