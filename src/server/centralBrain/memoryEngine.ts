/**
 * ABQARYNO CENTRAL BRAIN — MEMORY ENGINE
 * محرك الذاكرة القضائية الممتدة للموكلين، القضايا، والمستندات المحفوظة
 */

import { DraftState, UserMemory } from './types.ts';
import { officeDb } from '../db.ts';

export class CentralBrainMemoryEngine {
  private inMemoryDrafts: Map<string, DraftState[]> = new Map();

  /**
   * حفظ مسودة عقد في ذاكرة المستخدم أو ملف القضية
   */
  public saveDraft(userId: string, draft: DraftState): void {
    const list = this.inMemoryDrafts.get(userId) || [];
    const index = list.findIndex(d => d.id === draft.id);
    if (index >= 0) {
      list[index] = draft;
    } else {
      list.push(draft);
    }
    this.inMemoryDrafts.set(userId, list);

    // ربط الحفظ أيضاً بقاعدة بيانات المكتب إذا وجد موكل
    try {
      const clients = officeDb.getClients();
      if (clients && clients.length > 0) {
        const client = clients[0];
        officeDb.addDocument(
          {
            title: draft.title,
            fileName: `${draft.id}.md`,
            clientId: client.id,
            category: 'أخرى',
            fileSize: `${JSON.stringify(draft).length} bytes`,
            fileType: 'draft/legal-contract',
            notes: `تم حفظ المسودة آلياً عبر العقل المركزي لمنصة عبقرينو. البنود: ${draft.clauses.length}`,
          },
          'نظام العقل المركزي'
        );
      }
    } catch (err) {
      console.warn('[MemoryEngine] Warning: Could not persist to officeDb:', err);
    }
  }

  /**
   * استرجاع جميع المسودات الخاصة بالمستخدم
   */
  public getSavedDrafts(userId: string): DraftState[] {
    return this.inMemoryDrafts.get(userId) || [];
  }

  /**
   * البحث في الذاكرة عن وقائع قضائية سابقة
   */
  public findRelevantPastFact(userId: string, keyword: string): string | null {
    const drafts = this.inMemoryDrafts.get(userId) || [];
    for (const d of drafts) {
      for (const clause of d.clauses) {
        if (clause.content.includes(keyword)) {
          return `من واقع مسودة «${d.title}» - ${clause.title}: ${clause.content}`;
        }
      }
    }
    return null;
  }
}
