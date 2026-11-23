/**
 * طبقة التعاطف الإنساني والاستشعار العاطفي (Empathy & Emotional Sensing Layer)
 * تجمع بين الرصانة القانونية الصارمة والتعاطف الإنساني الموجه لرفع ثقة المستخدم واطمئنانه.
 */

export type EmotionalTone = 'anxious' | 'urgent' | 'distressed' | 'curious' | 'neutral';

export interface EmotionalAnalysis {
  tone: EmotionalTone;
  requiresWarmth: boolean;
  detectedEmotionKeywords: string[];
}

export function senseUserEmotion(text: string): EmotionalAnalysis {
  const t = (text || '').toLowerCase();

  const anxiousKeywords = ['خايف', 'قلقان', 'مرعوب', 'مش عارف', 'مصيبة', 'مشكلة كبيرة', 'الحقوني', 'يا رب', 'خايفة', 'قلقة'];
  const urgentKeywords = ['بسرعة', 'ضروري', 'بكرة', 'الحق', 'جلسة بكره', 'محكمة بكره', 'النهارده', 'فوري'];
  const distressedKeywords = ['مظلوم', 'ظلموني', 'ضيعوا', 'تعبوني', 'حسبي الله', 'ناصبين', 'سرقوني', 'طردوني'];

  const matchedAnxious = anxiousKeywords.filter(k => t.includes(k));
  const matchedUrgent = urgentKeywords.filter(k => t.includes(k));
  const matchedDistressed = distressedKeywords.filter(k => t.includes(k));

  if (matchedDistressed.length > 0) {
    return { tone: 'distressed', requiresWarmth: true, detectedEmotionKeywords: matchedDistressed };
  }
  if (matchedAnxious.length > 0) {
    return { tone: 'anxious', requiresWarmth: true, detectedEmotionKeywords: matchedAnxious };
  }
  if (matchedUrgent.length > 0) {
    return { tone: 'urgent', requiresWarmth: true, detectedEmotionKeywords: matchedUrgent };
  }

  return { tone: 'curious', requiresWarmth: false, detectedEmotionKeywords: [] };
}

export function applyEmpathyLayer(rawResponse: string, userText: string): string {
  const analysis = senseUserEmotion(userText);

  let empathyPrefix = '';

  if (analysis.tone === 'anxious') {
    empathyPrefix = `أهلاً ومرحباً بحضرتك يا فندم.. استمعت إليك بقلب الخبير وعين الحريص على مصلحتك، واطمئن تماماً ولا تقلق؛ فلكل عقد حل ولكل مشكلة قانونية مخرج آمن بعون الله. دعنا نضع الأمور في نصابها الصحيح بهدوء وثقة:\n\n`;
  } else if (analysis.tone === 'distressed') {
    empathyPrefix = `أهلاً بك يا فندم، وأشعر بكل كلمة ذكرتها وحجم الظلم أو الضغط الواقع عليك. اعلم أن القانون المصري وقضاء النقض يقفان بالمرصاد لصون الحقوق ورد المظالم. لن نترك حقاً يضيع طالما كنا معاً على بصيرة:\n\n`;
  } else if (analysis.tone === 'urgent') {
    empathyPrefix = `أهلاً بك يا فندم، وأقدر تماماً ضيق الوقت وحساسية الموقف الإجرائي. إليك الرأي الفوري وخطة التحرك السريعة للتعامل مع الميعاد دون إبطاء:\n\n`;
  } else {
    empathyPrefix = `أهلاً ومرحباً بحضرتك يا فندم في رحاب المستشار عطيه الهلباوي. لقد فحصت مسألتك بكل اهتمام وعناية مهنية:\n\n`;
  }

  // If the response already starts with a greeting or preamble, replace or prepend appropriately
  let cleanResponse = rawResponse;
  if (cleanResponse.startsWith('أهلاً ومرحباً') || cleanResponse.startsWith('أهلاً وسهلاً') || cleanResponse.startsWith('بسم الله الرحمن الرحيم')) {
    // Keep the Basmala if present, then inject empathy
    if (cleanResponse.startsWith('بسم الله الرحمن الرحيم')) {
      const parts = cleanResponse.split('بسم الله الرحمن الرحيم');
      return `بسم الله الرحمن الرحيم\n\n${empathyPrefix}${parts[1] ? parts[1].trim() : cleanResponse}`;
    }
  }

  return `${empathyPrefix}${cleanResponse}`;
}
