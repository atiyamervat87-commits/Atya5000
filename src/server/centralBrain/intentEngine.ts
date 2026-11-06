/**
 * ABQARYNO CENTRAL BRAIN — INTENT ENGINE
 * محرك الفهم الدلالي للعامية المصرية والفصحى وتطبيع النصوص وتصنيف النوايا بدقة فائقة
 */

import { BrainIntentType, IntentAnalysis, ConsultationContext } from './types.ts';

export class CentralBrainIntentEngine {
  /**
   * تطبيع النص العربي الفصيح والعامي
   * يوحد الهمزات، التاء المربوطة والهاء، الياء والألف المقصورة، ويزيل التشكيل والتكرار
   */
  public normalizeArabic(text: string): string {
    if (!text) return '';
    let s = text.trim();

    // إزالة التشكيل والتطويل
    s = s.replace(/[\u064B-\u065F\u0670\u0640]/g, '');

    // توحيد الهمزات والألف
    s = s.replace(/[أإآ]/g, 'ا');

    // توحيد الياء والألف المقصورة
    s = s.replace(/ى/g, 'ي');

    // إزالة تكرار الحروف المبالغ فيه (مثلاً: سلااااام -> سلام)
    s = s.replace(/(.)\1{2,}/g, '$1');

    return s.toLowerCase();
  }

  /**
   * كاشف الفخاخ والهلوسة التشريعية
   */
  private isHallucinationTrap(normalized: string): boolean {
    // قانون العقوبات المصري ينتهي بالمادة 395
    if (normalized.includes('عقوبات') && (
      normalized.includes('999') ||
      normalized.includes('888') ||
      normalized.includes('777') ||
      normalized.includes('600') ||
      normalized.includes('500') ||
      normalized.includes('450') ||
      normalized.includes('400')
    )) {
      return true;
    }
    // أرقام طعون وهمية
    if (
      normalized.includes('999999') ||
      normalized.includes('111111') ||
      normalized.includes('888888') ||
      (normalized.includes('طعن') && (normalized.includes('99999') || normalized.includes('00000')))
    ) {
      return true;
    }
    return false;
  }

  /**
   * كشف أوامر تعديل المسودة الحالية (Multi-turn Document Modification)
   */
  private isDraftModification(normalized: string, context?: ConsultationContext): { isMod: boolean; clauseIndex?: number; instruction?: string } {
    const hasActiveDraft = Boolean(context?.activeDraft);

    // حتى لو لم تكن المسودة في السياق، عبارات تعديل البنود واضحة
    const modRegex = /(?:عدل|غير|شيل|احذف|استبدل|ضيف|زود|خليه|خلي|بدل)\s+(?:في\s+)?(?:البند|الشرط|الفقرة|المادة)?\s*(الاول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|\d+)?/i;
    const match = normalized.match(modRegex);

    const hasClauseWord = normalized.includes('بند') || normalized.includes('الشرط الجزائي') || normalized.includes('اقساط') || normalized.includes('طريقة السداد') || normalized.includes('التسليم');

    if (match || (hasActiveDraft && hasClauseWord)) {
      let clauseIndex: number | undefined;
      const term = match ? match[1] : undefined;
      if (term) {
        if (term === 'الاول' || term === '1') clauseIndex = 1;
        else if (term === 'الثاني' || term === '2') clauseIndex = 2;
        else if (term === 'الثالث' || term === '3') clauseIndex = 3;
        else if (term === 'الرابع' || term === '4') clauseIndex = 4;
        else if (term === 'الخامس' || term === '5') clauseIndex = 5;
        else if (term === 'السادس' || term === '6') clauseIndex = 6;
        else if (term === 'السابع' || term === '7') clauseIndex = 7;
        else if (term === 'الثامن' || term === '8') clauseIndex = 8;
        else if (term === 'التاسع' || term === '9') clauseIndex = 9;
        else if (term === 'العاشر' || term === '10') clauseIndex = 10;
        else if (!isNaN(parseInt(term, 10))) clauseIndex = parseInt(term, 10);
      }
      return { isMod: true, clauseIndex, instruction: normalized };
    }

    return { isMod: false };
  }

  /**
   * فحص طلبات الصياغة والمحررات (يدعم صيغة / صيغه / اكتبلي / مسودة / نموذج)
   */
  private isDraftRequest(normalized: string): boolean {
    // معالجة مرنة للتاء المربوطة والهاء: صيغة أو صيغه
    const draftingRegex = /(?:صيغ[ةه]|نموذج|مسود[ةه]|تحرير|كتاب[ةه]|صياغ[ةه]|اكتبلي|اكتب\s*لي|عايز\s*عقد|عاوز\s*عقد|محتاج\s*عقد|ابغي\s*عقد|صيغ[ةه]\s*عقد|صيغ[ةه]\s*ايصال|صيغ[ةه]\s*انذار|صيغ[ةه]\s*توكيل|صيغ[ةه]\s*دعوى|صيغ[ةه]\s*مذكر[ةه])/i;
    
    if (draftingRegex.test(normalized)) {
      return true;
    }

    // إذا احتوى على صيغه/صيغة متبوعة ببيع أو شقة أو إيجار أو عمل
    if ((normalized.includes('صيغه') || normalized.includes('صيغة') || normalized.includes('مسوده') || normalized.includes('مسودة')) &&
        (normalized.includes('بيع') || normalized.includes('شقه') || normalized.includes('شقة') || normalized.includes('ايجار') || normalized.includes('ارض') || normalized.includes('سيار'))) {
      return true;
    }

    // طلبات مباشرة مثل "عقد بيع شقة" بدون كلمة صيغة إذا لم تكن في سياق نزاع
    if (normalized.startsWith('عقد بيع') || normalized.startsWith('عقد ايجار') || normalized.startsWith('عقد عمل') || normalized.startsWith('عقد مقاول')) {
      if (!normalized.includes('بطلان') && !normalized.includes('فسخ') && !normalized.includes('نزاع') && !normalized.includes('مشكلة')) {
        return true;
      }
    }

    return false;
  }

  /**
   * استخراج الكيانات القانونية الأساسية من النص
   */
  public extractEntities(normalized: string) {
    let contractType = 'عقد بيع وحدة سكنية (شقة)';
    if (normalized.includes('ايجار') || normalized.includes('اجار')) contractType = 'عقد إيجار وحدة سكنية';
    else if (normalized.includes('عمل') || normalized.includes('توظيف')) contractType = 'عقد عمل محدد المدة';
    else if (normalized.includes('ارض')) contractType = 'عقد بيع قطعة أرض';
    else if (normalized.includes('سيار')) contractType = 'عقد بيع سيارة';
    else if (normalized.includes('ايصال') || normalized.includes('امانه')) contractType = 'إيصال أمانة قانوني';
    else if (normalized.includes('انذار')) contractType = 'إنذار رسمي على يد محضر';
    else if (normalized.includes('مذكر')) contractType = 'مذكرة دفاع قانونية';

    let firstParty: string | undefined;
    const p1Match = normalized.match(/(?:البائع|المؤجر|الطرف الاول|طرف اول)\s*(?:هو|السيد)?\s*([^\n،,؛.]+)/);
    if (p1Match && p1Match[1] && p1Match[1].trim().length > 2) {
      firstParty = p1Match[1].trim();
    }

    let secondParty: string | undefined;
    const p2Match = normalized.match(/(?:المشتري|المستاجر|المستأجر|الطرف الثاني|طرف ثاني)\s*(?:هو|السيد)?\s*([^\n،,؛.]+)/);
    if (p2Match && p2Match[1] && p2Match[1].trim().length > 2) {
      secondParty = p2Match[1].trim();
    }

    let price: string | undefined;
    const priceMatch = normalized.match(/(?:بثمن|نظير مبلغ|مقابل|بسعر|بمبلغ)\s*([\d,.]+|\w+\s+جنيه)/);
    if (priceMatch && priceMatch[1]) {
      price = priceMatch[1].trim();
    }

    return { contractType, firstParty, secondParty, price };
  }

  /**
   * التصنيف الرئيسي للنية
   */
  public analyze(message: string, context?: ConsultationContext): IntentAnalysis {
    const raw = (message || '').trim();
    const normalized = this.normalizeArabic(raw);

    // 1. فحص الهلوسة والأرقام الوهمية
    if (this.isHallucinationTrap(normalized)) {
      return {
        intent: 'ZERO_HALLUCINATION',
        confidence: 0.99,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: false,
      };
    }

    // 2. فحص أوامر تعديل المسودة الحالية (Multi-turn Clause Modification)
    const modCheck = this.isDraftModification(normalized, context);
    if (modCheck.isMod) {
      return {
        intent: 'MODIFY_DRAFT',
        confidence: 0.95,
        normalizedText: normalized,
        extractedEntities: {
          clauseIndexToModify: modCheck.clauseIndex,
          modificationInstruction: modCheck.instruction,
        },
        requiresClarification: false,
      };
    }

    // 3. فحص طلبات الصياغة والمحررات (DRAFT_DOCUMENT)
    if (this.isDraftRequest(normalized)) {
      const entities = this.extractEntities(normalized);
      return {
        intent: 'DRAFT_DOCUMENT',
        confidence: 0.98,
        normalizedText: normalized,
        extractedEntities: entities,
        requiresClarification: false,
      };
    }

    // 4. فحص الاستفسارات القانونية الناقصة التي تحتاج لاستيضاح ذكي
    const vagueClaims = [
      'عايز ارفع دعوى تعويض', 'عايز ارفع قضية تعويض', 'ارفع دعوى تعويض ازاي',
      'عاوز تعويض', 'عايز تعويض', 'ارفع قضية ازاي', 'ازاي اخد حقي', 'عايز اشتكي',
      'عايز ارفع قضية', 'ارفع دعوى ازاي'
    ];
    if (vagueClaims.some(vc => normalized === vc || (normalized.startsWith(vc) && normalized.length < 40))) {
      return {
        intent: 'MISSING_INFO_PROMPT',
        confidence: 0.92,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: true,
        clarificationQuestions: [
          'ما هو أساس الضرر (فعل ضار أو خطأ تقصيري، أم إخلال بالتزام عقدي)؟',
          'هل تم تحرير محضر شرطة رسمي أو إثبات حالة بالواقعة؟',
          'ما هي طبيعة الضرر الواقع (مادي كتلف أموال، أم أدبي ومعنوي) وقيمته التقديرية؟'
        ],
      };
    }

    // 5. تهنئة على المنصة والمكتب
    const isCongrats = (normalized.includes('مبروك') || normalized.includes('مبارك') || normalized.includes('تهاني')) &&
      (normalized.includes('منصه') || normalized.includes('منصة') || normalized.includes('موقع') || normalized.includes('مكتب') || normalized.includes('تطبيق') || normalized.includes('برنامج') || normalized.includes('يا مستشار') || normalized.includes('يا باشا'));
    if (isCongrats && !normalized.includes('عقد') && !normalized.includes('قضيه') && !normalized.includes('حبس')) {
      return {
        intent: 'CONGRATULATIONS',
        confidence: 0.95,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: false,
      };
    }

    // 6. أفراح ومناسبات ودعوات عائلية
    const celebrationKeywords = ['فرح', 'عرس', 'زفاف', 'خطوب', 'كتب كتاب', 'سبوع', 'عقيق', 'معزوم', 'عازمك', 'عقبال عندك'];
    if (celebrationKeywords.some(k => normalized.includes(k)) && !normalized.includes('عقد بيع') && !normalized.includes('قتل') && !normalized.includes('طلاق')) {
      return {
        intent: 'CELEBRATION_INVITATION',
        confidence: 0.94,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: false,
      };
    }

    // 7. حديث خاص أو شخصي بعيد عن التقاضي
    const confidentialKeywords = ['حاجه خاصه', 'حاجه شخصيه', 'موضوع خاص', 'موضوع شخصي', 'فضفضه', 'بعيد عن القانون', 'مش قانون', 'بيني وبينك'];
    if (confidentialKeywords.some(k => normalized.includes(k))) {
      return {
        intent: 'CONFIDENTIAL_PERSONAL',
        confidence: 0.93,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: false,
      };
    }

    // 8. اطمئنان بالعامية المصرية (COLLOQUIAL_CHECKIN)
    const checkinPatterns = [
      'ايه الدنيا', 'الدنيا ايه', 'الدنيا عامله ايه', 'ايه الاخبار', 'اخبارك ايه',
      'طمني عليك', 'طمنا عليك', 'طمني عنك', 'كله تمام', 'عامل ايه', 'ازيك يا مستشار', 'يا باشا'
    ];
    if (checkinPatterns.some(p => normalized === p || (normalized.includes(p) && normalized.length < 35))) {
      return {
        intent: 'COLLOQUIAL_CHECKIN',
        confidence: 0.95,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: false,
      };
    }

    // 9. بطاقة الهوية والتعارف والصفة (INTRO_PROFILE)
    const introKeywords = ['مين حضرتك', 'من انت', 'عرفني بيك', 'عرفني بنفسك', 'سيرتك الذاتيه', 'معلومات عنك', 'ممكن نتعرف', 'اتعرف عليك', 'حابب اتعرف'];
    if (introKeywords.some(k => normalized.includes(k))) {
      return {
        intent: 'INTRO_PROFILE',
        confidence: 0.96,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: false,
      };
    }

    // 10. شكر وثناء (GRATITUDE)
    const thanksKeywords = ['شكرا', 'متشكر', 'جزاك الله خيرا', 'تسلم', 'الله يباركلك', 'كتر خيرك'];
    if (thanksKeywords.some(k => normalized === k || (normalized.includes(k) && normalized.length < 30))) {
      return {
        intent: 'GRATITUDE',
        confidence: 0.95,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: false,
      };
    }

    // 11. استئذان لطرح مسألة (PERMISSION)
    const permKeywords = ['ممكن استشيرك', 'ينفع اسال', 'عايز اسال', 'استفسار بسيط', 'سؤال بعد اذنك', 'عندي سؤال'];
    if (permKeywords.some(k => normalized.includes(k) && normalized.length < 40)) {
      return {
        intent: 'PERMISSION',
        confidence: 0.92,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: false,
      };
    }

    // 12. استشارة قانونية موضوعية أو نزاع (LEGAL_INQUIRY)
    const legalKeywords = [
      'قتل', 'سرق', 'نصب', 'شيك', 'ايصال', 'امانه', 'جنح', 'جناي', 'حبس', 'سجن', 'اعدام',
      'عقوب', 'فصل', 'عمل', 'ميراث', 'تركه', 'طلاق', 'نفق', 'ايجار', 'طرد', 'اخلاء', 'محكم',
      'نياب', 'دعوى', 'قضي', 'استئناف', 'نقض', 'تقادم', 'شفعه', 'تعويض', 'رشوه', 'اختلاس',
      'ضرب', 'عاهه', 'مخدرات', 'سلاح', 'تهديد', 'ابتزاز', 'سب', 'قذف', 'تحرش', 'دفاع شرعي'
    ];
    if (legalKeywords.some(k => normalized.includes(k))) {
      return {
        intent: 'LEGAL_INQUIRY',
        confidence: 0.9,
        normalizedText: normalized,
        extractedEntities: {},
        requiresClarification: false,
      };
    }

    // نية عامة
    return {
      intent: 'GENERAL_CONVERSATION',
      confidence: 0.7,
      normalizedText: normalized,
      extractedEntities: {},
      requiresClarification: false,
    };
  }
}
