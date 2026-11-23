/**
 * وسيط تحليل وتصنيف النوايا الذكي (Intent Router Middleware)
 * يحلل رسائل المستخدم ويصنفها إلى (Greeting, HelpRequest, LegalFact, Social, FollowUp)
 * لدعم محاور عقل المستشار عطيه الهلباوي بكافة اللهجات واللغات مع طبقة العاطفة والدفء الإنساني.
 */

export type UserIntent = 'Greeting' | 'HelpRequest' | 'LegalFact' | 'Social' | 'FollowUp';

export interface IntentResult {
  intent: UserIntent;
  confidence: number;
  empathyMessage?: string;
}

export function classifyIntent(text: string): IntentResult {
  const t = (text || '').trim();
  const lower = t.toLowerCase();

  // 1. Greeting (تحيات وسلام)
  const greetings = [
    'السلام عليكم', 'سلام عليكم', 'صباح الخير', 'مساء الخير', 'أهلاً', 'اهلا', 'مرحباً', 'مرحبا',
    'ازيك', 'ازي حضرتك', 'كيف حالك', 'شلونك', 'حياك', 'أهلا بحضرتك', 'مرحباً بحضرتك'
  ];
  if (greetings.some(g => lower.includes(g)) && t.length < 45 && !lower.includes('عقد') && !lower.includes('قضية') && !lower.includes('مشكلة')) {
    return {
      intent: 'Greeting',
      confidence: 0.96,
      empathyMessage: 'أهلاً ومرحباً بحضرتك يا فندم في محراب المستشار عطيه الهلباوي. نورتنا وشرفت المنصة الملكية! تفضل، أنا معاك وبكل سعادة أستمع لك.. احكي لي ما يشغل بالك وسنبحثه معاً خطوة بخطوة.'
    };
  }

  // 2. HelpRequest / Hesitation (استئذان، تردد، طلب مساعدة مبدئي)
  const helpRequests = [
    'عندي مشكلة', 'عندي مشكله', 'مش عارف', 'تقدر تساعدني', 'ممكن استشارة', 'عايز استشيرك',
    'تفتكر', 'محتار', 'عيزك', 'عاوزك', 'عندى مشكلة', 'عندى مشكله', 'هل تققدر', 'ممكن أسأل'
  ];
  if (helpRequests.some(h => lower.includes(h))) {
    return {
      intent: 'HelpRequest',
      confidence: 0.92,
      empathyMessage: 'اتفضل يا فندم، احكي لي مشكلتك براحتك خالص، وإن شاء الله نفحصها مع بعض ونشوف نقدر نساعد حضرتك إزاي. مش لازم تصيغ كلامك بطريقة قانونية، احكي لي الموضوع من بدايته باختصار.'
    };
  }

  // 3. LegalFact (واقعة قانونية صريحة أو استفسار قانوني)
  const legalKeywords = [
    'صحة ونفاذ', 'عقد', 'بيع', 'شقة', 'إيصال', 'ايصال', 'أمانة', 'امانة', 'شيك', 'محكمة', 'جنحة',
    'جناية', 'دعوى', 'قضية', 'طلاق', 'نفقة', 'ميراث', 'تركة', 'فصل', 'تعسفي', 'عمل', 'استئناف',
    'طعن', 'نقض', 'إيجار', 'ايجار', 'طرد', 'إخلاء', 'اخلاء', 'محضر', 'شرطة', 'نيابة', 'محامي',
    'تزوير', 'كمبيالة', 'مستحقات', 'تعويض', 'حكم', 'جريمة', 'حبس', 'إعدام', 'سرقة', 'نصب', 'مادة', 'قانون'
  ];
  if (legalKeywords.some(k => lower.includes(k))) {
    return {
      intent: 'LegalFact',
      confidence: 0.94,
    };
  }

  // 4. Social (أحاديث اجتماعية، مجاملات، شكر، تهنئة)
  const socialKeywords = [
    'عامل إيه', 'ازيك', 'مبروك', 'حلوة المنصة', 'شكراً', 'شكرا', 'تسلم', 'الف مبروك',
    'صباح الفل', 'الله يبارك', 'تحياتي', 'ممتاز', 'عظيم', 'تسلم ايدك'
  ];
  if (socialKeywords.some(s => lower.includes(s)) && t.length < 60) {
    return {
      intent: 'Social',
      confidence: 0.9,
      empathyMessage: 'الله يبارك فيك يا فندم، وشكراً لثقتك الغالية في منصة المستشار عطيه الهلباوي. نحن دائماً في خدمتك، فهل لديك مسألة قانونية أو استشارة ترغب في أن نبحثها معاً؟'
    };
  }

  // 5. FollowUp (متابعة أو استكمال)
  const followUpKeywords = ['وماذا لو', 'طب لو', 'ولو', 'وبالنسبة', 'بعد كدة', 'وبعدين'];
  if (followUpKeywords.some(f => lower.includes(f))) {
    return {
      intent: 'FollowUp',
      confidence: 0.85,
    };
  }

  // Fallback for short general queries
  if (t.length < 30 && !t.includes('؟')) {
    return {
      intent: 'Greeting',
      confidence: 0.75,
      empathyMessage: 'أهلاً بحضرتك يا فندم في رحاب المستشار عطيه الهلباوي. تفضل بطرح ما يدور برأسك أو احكي لي مشكلتك وسأكون معك بكل أمانة واهتمام.'
    };
  }

  return {
    intent: 'LegalFact',
    confidence: 0.65,
  };
}
