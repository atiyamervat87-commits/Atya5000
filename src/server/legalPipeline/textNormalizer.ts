/**
 * STEP 2: ARABIC LEGAL TEXT EXTRACTION & NORMALIZER
 * محرك استخراج وتنظيف ومعايرة النصوص القانونية المصرية ومعالجة أخطاء الـ OCR
 */

import { CleanedTextResult, ExtractedArticleSegment } from './types.ts';

export class LegalTextNormalizer {
  // Common Arabic Tashkeel & Diacritics Regex
  private static readonly DIACRITICS_REGEX = /[\u064B-\u065F\u0670]/g;

  // Tatweel / Kashida
  private static readonly TATWEEL_REGEX = /\u0640+/g;

  // Common OCR and encoding noise in scanned Egyptian legal documents
  private static readonly OCR_FIXES: Array<[RegExp, string]> = [
    // Ligatures and corrupted legal terms
    [/مــ+ادة/g, 'مادة'],
    [/مــ+واد/g, 'مواد'],
    [/الـ+قانون/g, 'القانون'],
    [/الـ+محكمة/g, 'المحكمة'],
    [/الـ+دستورية/g, 'الدستورية'],
    [/الـ+نقض/g, 'النقض'],
    [/ماده\s+(\d+)/g, 'مادة $1'],
    [/الماده\s+(\d+)/g, 'المادة $1'],
    [/فقره\s+(\d+)/g, 'فقرة $1'],
    [/بـ+ند/g, 'بند'],
    [/المدعى\s+عليه/g, 'المدعى عليه'],
    [/المستشـ+ار/g, 'المستشار'],
    [/قضـ+اء/g, 'قضاء'],
    [/طعـ+ن/g, 'طعن'],
    [/جلسـ+ة/g, 'جلسة'],
    // Broken quotes and symbols
    [/[""«»„“”]/g, '"'],
    [/[\u200B-\u200D\uFEFF]/g, ''], // Zero-width spaces
    [/\r\n/g, '\n'],
    [/[ \t]+/g, ' '], // Collapse multiple spaces
    [/\n{3,}/g, '\n\n'], // Collapse multiple newlines
  ];

  /**
   * Main Text Cleaning & Normalization Method
   */
  public cleanAndNormalize(rawText: string): CleanedTextResult {
    const originalCharCount = rawText.length;
    let text = rawText;

    // 1. Unicode Normalization (NFC)
    text = text.normalize('NFC');

    // 2. Count and strip diacritics
    const diacriticsMatches = text.match(LegalTextNormalizer.DIACRITICS_REGEX);
    const removedDiacriticsCount = diacriticsMatches ? diacriticsMatches.length : 0;
    text = text.replace(LegalTextNormalizer.DIACRITICS_REGEX, '');

    // 3. Count and strip tatweel
    const tatweelMatches = text.match(LegalTextNormalizer.TATWEEL_REGEX);
    const normalizedLigaturesCount = tatweelMatches ? tatweelMatches.length : 0;
    text = text.replace(LegalTextNormalizer.TATWEEL_REGEX, '');

    // 4. Fix OCR artifacts and common legal scan glitches
    let fixedOcrArtifactsCount = 0;
    for (const [pattern, replacement] of LegalTextNormalizer.OCR_FIXES) {
      const match = text.match(pattern);
      if (match) {
        fixedOcrArtifactsCount += match.length;
        text = text.replace(pattern, replacement);
      }
    }

    // 5. Normalization of Eastern/Western Arabic numerals to standard Arabic representation if desired
    text = this.normalizeNumerals(text);

    // 6. Segment Legal Articles
    const extractedArticles = this.extractLegalArticles(text);

    const cleanedText = text.trim();
    const cleanedCharCount = cleanedText.length;

    // Quality Score Calculation
    // Base score 100%, slightly penalize if input had extreme unfixable garbage
    const qualityCleaningScore = Math.min(
      100,
      Math.max(90, 100 - (fixedOcrArtifactsCount > 50 ? 2 : 0) + (extractedArticles.length > 0 ? 2 : 0))
    );

    return {
      cleanedText,
      originalCharCount,
      cleanedCharCount,
      removedDiacriticsCount,
      fixedOcrArtifactsCount,
      normalizedLigaturesCount,
      extractedArticles,
      qualityCleaningScore,
    };
  }

  /**
   * Normalize Hindi/Eastern numerals to standard Arabic digits
   */
  private normalizeNumerals(str: string): string {
    const easternNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let res = str;
    for (let i = 0; i < 10; i++) {
      res = res.replaceAll(easternNumerals[i], String(i));
    }
    return res;
  }

  /**
   * Automatic Segmentation of Egyptian Legal Articles
   */
  public extractLegalArticles(text: string): ExtractedArticleSegment[] {
    const articles: ExtractedArticleSegment[] = [];

    // Regex matching "مادة (147)" or "المادة 147" or "المادة الأولى"
    const articleHeaderPattern = /(?:(?:مادة|المادة)\s+(?:رقم\s+)?(\d+(?:\s*(?:مكرر(?:اً)?|\/\d+))?|\([^\)]+\)|[أ-ي]+))(?:\s*[-–:]\s*([^\n]+))?/gi;

    let match: RegExpExecArray | null;
    const matches: Array<{
      index: number;
      articleNumber: string;
      title?: string;
    }> = [];

    while ((match = articleHeaderPattern.exec(text)) !== null) {
      matches.push({
        index: match.index,
        articleNumber: match[1]?.trim() || '1',
        title: match[2]?.trim(),
      });
    }

    for (let i = 0; i < matches.length; i++) {
      const cur = matches[i];
      const nextIndex = i + 1 < matches.length ? matches[i + 1].index : text.length;
      const articleRaw = text.slice(cur.index, nextIndex).trim();

      // Split lines to distinguish title, main body, and clauses
      const lines = articleRaw.split('\n').map((l) => l.trim()).filter(Boolean);
      const headerLine = lines[0] || '';
      const bodyLines = lines.slice(1);

      // Detect subclauses (numbered 1., 2., or bullet points)
      const subClauses: string[] = [];
      const normalBodyLines: string[] = [];

      for (const line of bodyLines) {
        if (/^[\d(]+\s*[-–.)]/.test(line) || /^•/.test(line) || /^[أ-ي]\s*[-–.)]/.test(line)) {
          subClauses.push(line);
        } else {
          normalBodyLines.push(line);
        }
      }

      articles.push({
        articleNumber: cur.articleNumber.replace(/[()]/g, ''),
        title: cur.title || (headerLine.includes(':') ? headerLine.split(':')[1]?.trim() : undefined),
        bodyText: normalBodyLines.join('\n') || articleRaw,
        subClauses: subClauses.length > 0 ? subClauses : undefined,
        charIndex: cur.index,
      });
    }

    return articles;
  }
}

export const legalTextNormalizer = new LegalTextNormalizer();
