/**
 * STEP 4 & 8: PIPELINE STORAGE & INVERTED SEARCH INDEX
 * حفظ البيانات المعالجة في هيكل منظم، وبناء فهرس البحث الفعال
 */

import fs from 'fs';
import path from 'path';
import { ProcessedLegalDocument, LegalBranch, PipelineStats } from './types.ts';

export class PipelineStorage {
  private corpusPath: string;
  private documents: Map<string, ProcessedLegalDocument> = new Map();
  // Inverted search index: token -> Array of document IDs with term frequency
  private invertedIndex: Map<string, Map<string, number>> = new Map();

  constructor() {
    this.corpusPath = path.resolve(process.cwd(), 'data', 'processed_legal_corpus.json');
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.corpusPath)) {
        const raw = fs.readFileSync(this.corpusPath, 'utf-8');
        const docs: ProcessedLegalDocument[] = JSON.parse(raw);
        for (const doc of docs) {
          this.documents.set(doc.id, doc);
          this.addToIndex(doc);
        }
      }
    } catch (err) {
      console.warn('[PipelineStorage] Could not read existing corpus file, starting clean:', err);
    }
  }

  public saveToDisk() {
    try {
      const dataDir = path.dirname(this.corpusPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const allDocs = Array.from(this.documents.values());
      fs.writeFileSync(this.corpusPath, JSON.stringify(allDocs, null, 2), 'utf-8');
    } catch (err) {
      console.error('[PipelineStorage] Error saving corpus to disk:', err);
    }
  }

  /**
   * Add a processed document to memory & inverted search index
   */
  public saveDocument(doc: ProcessedLegalDocument): void {
    this.documents.set(doc.id, doc);
    this.addToIndex(doc);
    this.saveToDisk();
  }

  /**
   * Save multiple processed documents in batch
   */
  public saveDocumentsBatch(docs: ProcessedLegalDocument[]): void {
    for (const doc of docs) {
      this.documents.set(doc.id, doc);
      this.addToIndex(doc);
    }
    this.saveToDisk();
  }

  public getDocument(id: string): ProcessedLegalDocument | undefined {
    return this.documents.get(id);
  }

  public getAllDocuments(): ProcessedLegalDocument[] {
    return Array.from(this.documents.values());
  }

  /**
   * Build tokenized inverted index for rapid sub-millisecond search
   */
  private addToIndex(doc: ProcessedLegalDocument) {
    const fullText = `${doc.title} ${doc.cleanedText} ${doc.classification.matchedKeywords.join(' ')} ${doc.classification.primaryBranch}`;
    const tokens = this.tokenizeText(fullText);

    for (const token of tokens) {
      if (!this.invertedIndex.has(token)) {
        this.invertedIndex.set(token, new Map());
      }
      const postings = this.invertedIndex.get(token)!;
      const count = (postings.get(doc.id) || 0) + 1;
      postings.set(doc.id, count);
    }
  }

  private tokenizeText(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\u0621-\u064A0-9a-zA-Z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 2);
  }

  /**
   * Step 4: High Performance Search with Branch Filtering & Scoring
   */
  public search(
    query: string,
    filterBranch?: LegalBranch | 'all',
    limit: number = 20
  ): Array<{
    document: ProcessedLegalDocument;
    score: number;
    matchedTerms: string[];
    highlightSnippet: string;
  }> {
    const queryTokens = this.tokenizeText(query);
    if (queryTokens.length === 0) {
      return this.getAllDocuments()
        .filter((d) => !filterBranch || filterBranch === 'all' || d.classification.primaryBranch === filterBranch)
        .slice(0, limit)
        .map((doc) => ({
          document: doc,
          score: 1.0,
          matchedTerms: [],
          highlightSnippet: doc.cleanedText.slice(0, 180) + '...',
        }));
    }

    const docScores = new Map<string, { score: number; terms: Set<string> }>();

    for (const token of queryTokens) {
      const postings = this.invertedIndex.get(token);
      if (postings) {
        for (const [docId, freq] of postings.entries()) {
          const doc = this.documents.get(docId);
          if (!doc) continue;

          if (filterBranch && filterBranch !== 'all' && doc.classification.primaryBranch !== filterBranch) {
            continue;
          }

          if (!docScores.has(docId)) {
            docScores.set(docId, { score: 0, terms: new Set() });
          }
          const entry = docScores.get(docId)!;
          // TF scoring with title bonus
          const titleBonus = doc.title.toLowerCase().includes(token) ? 5.0 : 1.0;
          entry.score += freq * titleBonus;
          entry.terms.add(token);
        }
      }
    }

    const results = Array.from(docScores.entries())
      .map(([docId, { score, terms }]) => {
        const doc = this.documents.get(docId)!;
        return {
          document: doc,
          score: Number(score.toFixed(2)),
          matchedTerms: Array.from(terms),
          highlightSnippet: this.generateHighlight(doc.cleanedText, Array.from(terms)),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  }

  private generateHighlight(text: string, terms: string[]): string {
    if (terms.length === 0) return text.slice(0, 160) + '...';
    const firstTerm = terms[0];
    const idx = text.toLowerCase().indexOf(firstTerm.toLowerCase());
    if (idx === -1) return text.slice(0, 160) + '...';

    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + 140);
    return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
  }

  public getStats(): PipelineStats {
    const docs = this.getAllDocuments();
    let totalArticlesIndexed = 0;
    let totalCitationLinks = 0;
    let sumFidelity = 0;

    const branchDist: Record<LegalBranch, number> = {
      مدني: 0,
      جنائي: 0,
      تجاري: 0,
      'عمل وتأمينات': 0,
      'إداري ومجلس دولة': 0,
      'أحوال شخصية وأسرة': 0,
      'مرافعات وإثبات': 0,
      'شهر عقاري وتوثيق': 0,
      دستوري: 0,
      'عامة وقضائية': 0,
    };

    for (const d of docs) {
      totalArticlesIndexed += d.extractedArticles.length;
      totalCitationLinks += d.citationLinks.length;
      sumFidelity += d.qualityFidelityScore;
      if (branchDist[d.classification.primaryBranch] !== undefined) {
        branchDist[d.classification.primaryBranch] += 1;
      }
    }

    return {
      totalProcessedDocs: docs.length,
      totalArticlesIndexed,
      totalCitationLinks,
      branchDistribution: branchDist,
      latestRunAt: new Date().toISOString(),
      overallFidelityScore: docs.length > 0 ? Number((sumFidelity / docs.length).toFixed(1)) : 100,
    };
  }

  public exportJsonl(): string {
    return Array.from(this.documents.values())
      .map((d) => JSON.stringify(d))
      .join('\n');
  }
}

export const pipelineStorage = new PipelineStorage();
