/**
 * STEP 5: CITATION & CROSS-LINKING GRAPH ENGINE
 * محرك استخراج الروابط التشريعية والقضائية والربط بين القوانين وتعديلاتها
 */

import { CitationLink } from './types.ts';

export class CitationGraphEngine {
  // Common Egyptian Amendment Patterns
  private static readonly AMENDMENT_PATTERNS = [
    /معدل(?:ة)?\s+ب(?:القانون|موجب\s+القانون)\s+رقم\s+(\d+)\s+لسنة\s+(\d+)/gi,
    /استبدل(?:ت)?\s+ب(?:القانون|موجب\s+القانون)\s+رقم\s+(\d+)\s+لسنة\s+(\d+)/gi,
    /أضيف(?:ت)?\s+ب(?:القانون|موجب\s+القانون)\s+رقم\s+(\d+)\s+لسنة\s+(\d+)/gi,
    /ألغي(?:ت)?\s+ب(?:القانون|موجب\s+القانون)\s+رقم\s+(\d+)\s+لسنة\s+(\d+)/gi,
  ];

  // Article cross-reference patterns (e.g., مادة 147 من القانون المدني)
  private static readonly ARTICLE_REF_PATTERNS = [
    /(?:المادتين|المادتان|المواد|المادة|مادة)\s+(\d+(?:\s*(?:و|,)\s*\d+)*)(?:\s+(?:من\s+)?(القانون\s+المدني|قانون\s+العقوبات|قانون\s+المرافعات|قانون\s+الإثبات|قانون\s+العمل|قانون\s+التجارة|قانون\s+الشهر\s+العقاري))?/gi,
  ];

  // Cassation ruling patterns (e.g., الطعن رقم 2841 لسنة 72 ق)
  private static readonly CASSATION_PATTERNS = [
    /الطعن\s+رقم\s+(\d+)\s+لسنة\s+(\d+)\s*ق(?:\s*[-–]\s*(مدني|جنائي|تجاري|عمال|أحوال\s+شخصية))?/gi,
  ];

  // Official gazette issue patterns
  private static readonly GAZETTE_PATTERNS = [
    /الجريدة\s+الرسمية(?:\s*-\s*|\s+)العدد\s+(\d+(?:\s*مكرر(?:\s*[أ-ي])?)?)(?:\s+بتاريخ\s+([^\n,\.]+))?/gi,
    /الوقائع\s+المصرية(?:\s*-\s*|\s+)العدد\s+(\d+)/gi,
  ];

  /**
   * Extract all citation and cross-links from a legal text
   */
  public extractCitations(documentTitle: string, text: string): CitationLink[] {
    const links: CitationLink[] = [];
    const seenKeys = new Set<string>();

    // 1. Detect Amendments
    for (const pattern of CitationGraphEngine.AMENDMENT_PATTERNS) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        const lawNum = match[1];
        const lawYear = match[2];
        const targetTitle = `القانون رقم ${lawNum} لسنة ${lawYear}`;
        const key = `amend:${lawNum}:${lawYear}`;

        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          links.push({
            id: `link-amend-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            sourceType: 'تشريع',
            sourceTitle: documentTitle,
            targetType: 'تشريع معدل',
            targetTitle,
            targetLawNumber: `${lawNum}/${lawYear}`,
            relationType: 'تعديل تشريعي',
            verificationConfidence: 98,
          });
        }
      }
    }

    // 2. Detect Article Cross-References
    for (const pattern of CitationGraphEngine.ARTICLE_REF_PATTERNS) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        const articleNums = match[1];
        const lawName = match[2] || 'القانون الحاكم';
        const key = `art:${articleNums}:${lawName}`;

        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          links.push({
            id: `link-art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            sourceType: 'مادة',
            sourceTitle: documentTitle,
            targetType: 'مادة مرتبطة',
            targetTitle: `${lawName} (مادة ${articleNums})`,
            targetArticleNumber: articleNums,
            relationType: 'إحالة موضوعية',
            verificationConfidence: 95,
          });
        }
      }
    }

    // 3. Detect Cassation Precedent Citations
    for (const pattern of CitationGraphEngine.CASSATION_PATTERNS) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        const rulingNum = match[1];
        const judicialYear = match[2];
        const circuit = match[3] || 'دوائر النقض';
        const targetTitle = `الطعن رقم ${rulingNum} لسنة ${judicialYear} ق (${circuit})`;
        const key = `cass:${rulingNum}:${judicialYear}`;

        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          links.push({
            id: `link-cass-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            sourceType: 'مادة',
            sourceTitle: documentTitle,
            targetType: 'حكم نقض ملزم',
            targetTitle,
            relationType: 'استناد قضائي',
            verificationConfidence: 99,
          });
        }
      }
    }

    // 4. Detect Official Gazette Citations
    for (const pattern of CitationGraphEngine.GAZETTE_PATTERNS) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        const issueNum = match[1];
        const dateStr = match[2] ? `بتاريخ ${match[2].trim()}` : '';
        const targetTitle = `الجريدة الرسمية عدد ${issueNum} ${dateStr}`.trim();
        const key = `gaz:${issueNum}`;

        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          links.push({
            id: `link-gaz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            sourceType: 'تشريع',
            sourceTitle: documentTitle,
            targetType: 'جريدة رسمية',
            targetTitle,
            relationType: 'تعديل تشريعي',
            verificationConfidence: 97,
          });
        }
      }
    }

    return links;
  }
}

export const citationGraphEngine = new CitationGraphEngine();
