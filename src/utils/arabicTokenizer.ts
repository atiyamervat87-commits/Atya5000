import { TokenAnalysisResult } from '../types/legal';

// Base legal and Arabic vocabulary table for demonstration and tokenization
const LEGAL_SUBWORDS: { [key: string]: number } = {
  '<pad>': 0,
  '<unk>': 1,
  '<s>': 2,
  '</s>': 3,
  'القانون': 100,
  'المدني': 101,
  'المصري': 102,
  'المادة': 103,
  'محكمة': 104,
  'النقض': 105,
  'الاستئناف': 106,
  'الابتدائية': 107,
  'الدعوى': 108,
  'المدعي': 109,
  'المدعى': 110,
  'عليه': 111,
  'المتهم': 112,
  'المجني': 113,
  'عقد': 114,
  'البيع': 115,
  'الإيجار': 116,
  'التعويض': 117,
  'المسؤولية': 118,
  'التقصيرية': 119,
  'العقدية': 120,
  'الضرر': 121,
  'الخطأ': 122,
  'السببية': 123,
  'التقادم': 124,
  'البطلان': 125,
  'الدفوع': 126,
  'الشكلية': 127,
  'الموضوعية': 128,
  'المرافعة': 129,
  'وحيث': 130,
  'بناء': 131,
  'على': 132,
  'ذلك': 133,
  'من': 134,
  'في': 135,
  'إلى': 136,
  'عن': 137,
  'مع': 138,
  'أن': 139,
  'إن': 140,
  'كان': 141,
  'قد': 142,
  'لم': 143,
  'لن': 144,
  'كل': 145,
  'غير': 146,
  'هو': 147,
  'هي': 148,
  'هذا': 149,
  'هذه': 150,
  'التي': 151,
  'الذي': 152,
  'الذين': 153,
  'اللتين': 154,
  'اللتان': 155,
  'والـ': 156,
  'فبالـ': 157,
  'كالـ': 158,
  'لـ': 159,
  'بـ': 160,
  'سنة': 161,
  'رقم': 162,
  'جلسة': 163,
  'حكمت': 164,
  'المحكمة': 165,
  'حضورياً': 166,
  'غيابياً': 167,
  'برفض': 168,
  'بقبول': 169,
  'إلزام': 170,
  'براءة': 171,
  'حبس': 172,
  'سجن': 173,
  'غرامة': 174,
  'جنحة': 175,
  'جناية': 176,
  'مخالفة': 177,
  'مذكرة': 178,
  'دفاع': 179,
  'صحيفة': 180,
  'إنذار': 181,
  'محضر': 182,
  'شهادة': 183,
  'إثبات': 184,
  'يمين': 185,
  'حاسمة': 186,
  'عطية': 200,
  'الهلباوي': 201,
  'المستشار': 202,
  'عقل': 203
};

// Check if a character is an Arabic Tashkeel diacritic
export function isArabicDiacritic(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 0x064b && code <= 0x065f;
}

// Normalize Arabic text while preserving core morphology
export function normalizeArabicText(text: string, stripDiacritics: boolean = false): string {
  let normalized = text;
  // Remove tatweel (kashida)
  normalized = normalized.replace(/\u0640/g, '');

  if (stripDiacritics) {
    // Remove Harakat (fatha, damma, kasra, sukun, shadda, tanween)
    normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, '');
  }

  return normalized;
}

// Tokenize Arabic string with specialized legal subword patterns
export function analyzeArabicTokens(inputText: string): TokenAnalysisResult {
  const rawText = inputText || '';
  const normalizedText = normalizeArabicText(rawText, false);

  const encoder = new TextEncoder();
  const bytesCount = encoder.encode(rawText).length;
  const charCount = rawText.length;

  const tokens: TokenAnalysisResult['tokens'] = [];

  // Match words, diacritics, numbers, punctuations, and english/symbols
  const regex = /([\u064B-\u065F]+|[\u0621-\u064A\u0671-\u06D3]+|[0-9\u0660-\u0669]+|[a-zA-Z]+|[^\s\w\u0621-\u064A\u064B-\u065F]+|\s+)/g;

  let match: RegExpExecArray | null;
  let runningIdCounter = 1000;

  while ((match = regex.exec(rawText)) !== null) {
    const segment = match[0];
    if (segment.trim().length === 0) continue; // Skip pure whitespace

    const isDiacritic = isArabicDiacritic(segment[0]);
    const cleanSegment = normalizeArabicText(segment, true);
    const isLegal = !!LEGAL_SUBWORDS[cleanSegment] || ['مدني', 'جنائي', 'نقض', 'مرافعات', 'استئناف', 'عقد', 'بطلان'].some(k => segment.includes(k));

    let tokenId = LEGAL_SUBWORDS[segment] || LEGAL_SUBWORDS[cleanSegment];
    if (!tokenId) {
      // Deterministic hash ID for out-of-core vocabulary tokens
      let hash = 0;
      for (let i = 0; i < segment.length; i++) {
        hash = (hash * 31 + segment.charCodeAt(i)) % 32000;
      }
      tokenId = 500 + Math.abs(hash);
    }

    tokens.push({
      id: tokenId,
      tokenText: segment,
      isDiacritics: isDiacritic,
      isLegalTerm: isLegal,
      byteLength: encoder.encode(segment).length,
    });
  }

  const tokenCount = tokens.length || 1;
  // Compression ratio: characters per token (higher is more efficient representation)
  const compressionRatio = Number((charCount / tokenCount).toFixed(2));

  return {
    rawText,
    normalizedText,
    tokenCount,
    charCount,
    bytesCount,
    compressionRatio,
    tokens,
  };
}
