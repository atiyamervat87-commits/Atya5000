export type IntentCategory =
  | 'Greeting'
  | 'SelfIntroduction'
  | 'CapabilityInquiry'
  | 'HelpRequest'
  | 'Social'
  | 'LegalConsultation'
  | 'FollowUp';

export interface IntentAnalysisResult {
  category: IntentCategory;
  confidence: number;
  matchedPattern: string;
  timestamp: string;
}

export function analyzeUserIntent(message: string): IntentAnalysisResult {
  const text = (message || '').trim().toLowerCase();
  const timestamp = new Date().toISOString();

  // 1. Self Introduction & Identity
  if (
    text.includes('عرف نفسك') ||
    text.includes('مين انت') ||
    text.includes('أنت مين') ||
    text.includes('من أنت') ||
    text.includes('عرفنا بنفسك') ||
    text.includes('ما هو عقل') ||
    text.includes('هل أنت gemini') ||
    text.includes('هل انت gemini') ||
    text.includes('الفرق بينك وبين')
  ) {
    return {
      category: 'SelfIntroduction',
      confidence: 0.98,
      matchedPattern: 'self_introduction_keywords',
      timestamp,
    };
  }

  // 2. Capability Inquiry
  if (
    text.includes('تقدر') ||
    text.includes('إيه اللي تقدر') ||
    text.includes('مهامك') ||
    text.includes('قدراتك') ||
    text.includes('تساعدني في') ||
    text.includes('هل بتحتفظ') ||
    text.includes('هل تفهم')
  ) {
    return {
      category: 'CapabilityInquiry',
      confidence: 0.95,
      matchedPattern: 'capability_inquiry_keywords',
      timestamp,
    };
  }

  // 3. Greeting
  if (
    text === 'السلام عليكم' ||
    text === 'مرحبا' ||
    text === 'أهلاً' ||
    text === 'اهلا' ||
    text === 'صباح الخير' ||
    text === 'مساء الخير' ||
    text.startsWith('السلام عليكم')
  ) {
    return {
      category: 'Greeting',
      confidence: 0.99,
      matchedPattern: 'greeting_patterns',
      timestamp,
    };
  }

  // 4. Social
  if (
    text.includes('عامل إيه') ||
    text.includes('إيه الاخبار') ||
    text.includes('كيف حالك') ||
    text.includes('ازيك') ||
    text.includes('أخبار المكتب')
  ) {
    return {
      category: 'Social',
      confidence: 0.92,
      matchedPattern: 'social_checkin_patterns',
      timestamp,
    };
  }

  // 5. Help Request
  if (
    text.includes('محتاج مساعدة') ||
    text.includes('عندي مشكلة') ||
    text.includes('أريد مساعدة') ||
    text.includes('ساعدني')
  ) {
    return {
      category: 'HelpRequest',
      confidence: 0.90,
      matchedPattern: 'help_request_keywords',
      timestamp,
    };
  }

  // 6. Follow Up
  if (
    text.includes('وبعدين') ||
    text.includes('طيب و') ||
    text.includes('وماذا عن') ||
    text.includes('بخصوص ما سبق')
  ) {
    return {
      category: 'FollowUp',
      confidence: 0.88,
      matchedPattern: 'follow_up_patterns',
      timestamp,
    };
  }

  // 7. Default to Legal Consultation (Core domain)
  return {
    category: 'LegalConsultation',
    confidence: 0.85,
    matchedPattern: 'default_legal_consultation',
    timestamp,
  };
}
