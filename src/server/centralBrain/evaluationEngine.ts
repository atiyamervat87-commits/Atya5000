/**
 * ABQARYNO CENTRAL BRAIN — EVALUATION ENGINE
 * محرك تقييم وتدقيق جودة الردود القضائية ومنع الهلوسة وحماية الأمانة العلمية
 */

export class CentralBrainEvaluationEngine {
  /**
   * تدقيق النص قبل خروجه للمستشير
   */
  public evaluateResponse(responseText: string): { isValid: boolean; warnings: string[]; sanitizedText: string } {
    let sanitized = responseText;
    const warnings: string[] = [];

    // 1. فحص الهلوسة في أرقام مواد العقوبات (أقصى مادة هي 395)
    const penalMatch = sanitized.match(/المادة\s*\(?(\d{3,})\)?\s*من\s*قانون\s*العقوبات/g);
    if (penalMatch) {
      for (const m of penalMatch) {
        const num = parseInt(m.replace(/\D/g, ''), 10);
        if (num > 395) {
          warnings.push(`تم رصد مادة عقوبات وهمية (${num})، تم تصحيح العبارة لبيان انتهاء القانون عند المادة 395.`);
          sanitized = sanitized.replace(m, 'نصوص قانون العقوبات المصري (المواد حتى 395)');
        }
      }
    }

    // 2. تنقية الرد من الديباجات الاستهلالية الروتينية العقيمة إن وجدت في غير محلها
    if (sanitized.startsWith('عزيزي المستشير الكريم، بناء على سؤالك الذي طرحته والمتعلق بـ')) {
      sanitized = sanitized.replace('عزيزي المستشير الكريم، بناء على سؤالك الذي طرحته والمتعلق بـ', '');
    }

    return {
      isValid: true,
      warnings,
      sanitizedText: sanitized,
    };
  }
}
