/**
 * وحدة المعالجة اللغوية الوسيطة لمنع الاستطراد وضمان الإيجاز
 * Counselor Attia Al-Helbawy: Linguistic Pre-processing & Conciseness Middleware
 *
 * تحلل نية الرسالة (تحية، سؤال، طلب قانوني) قبل إرسالها إلى محرك الذكاء الاصطناعي،
 * وتمنع الاستطراد التلقائي في التحيات أو الأحاديث الاجتماعية،
 * وتضمن الالتزام بقواعد المستشار عطية الهلباوي في الرد المباشر والرصين والمختصر.
 */

import { Request, Response, NextFunction } from 'express';
import {
  detectIntent,
  buildIntentDirective,
  generateCounselorAutonomousResponse,
  IntentType,
  ConsultationTurn,
} from './counselorBrain.ts';

export type IntentCategory = 'GREETING' | 'QUESTION' | 'LEGAL_REQUEST' | 'SOCIAL' | 'DRAFTING';

export interface ConcisenessPolicy {
  maxTokens: number;
  temperature: number;
  enforceDirectAnswer: boolean;
  prohibitUnsolicitedLitigation: boolean;
  allowedLineCount: number;
  antiDigressionPrompt: string;
}

export interface CounselorLinguisticContext {
  rawMessage: string;
  sanitizedMessage: string;
  intent: IntentType;
  intentCategory: IntentCategory;
  isConversationalOnly: boolean;
  shouldBypassAiToPreventDigression: boolean;
  instantReply?: string;
  policy: ConcisenessPolicy;
  directive: string;
}

declare global {
  namespace Express {
    interface Request {
      counselorContext?: CounselorLinguisticContext;
    }
  }
}

/**
 * تحديد سياسة الإيجاز ومنع الاستطراد بناءً على تصنيف النية
 */
function resolveConcisenessPolicy(intent: IntentType): ConcisenessPolicy {
  switch (intent) {
    case 'CELEBRATION_INVITATION':
      return {
        maxTokens: 180,
        temperature: 0.35,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 5,
        antiDigressionPrompt:
          '[سياسة الفرح والتهاني والمناسبات: أجب بأحر وأصدق مشاعر الفرح والبهجة والتهاني والدعاء بالبركة للعروسين والافتخار والاعتزاز بالدعوة الكريمة كأخ وخبير مصري أصيل، ويُحظر تماماً أي استعراض قضائي أو مواد قانونية.]',
      };

    case 'CONGRATULATIONS_PLATFORM':
      return {
        maxTokens: 250,
        temperature: 0.25,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 6,
        antiDigressionPrompt:
          '[سياسة التهنئة بالمنصة والمكتب: اشكر الموكل بتقدير ومودة وأكد تسخير المنصة لمحراب العدالة وتيسير الاستشارات دون أي نصوص زواج أو دفوع قضائية.]',
      };

    case 'COLLOQUIAL_CHECKIN':
      return {
        maxTokens: 140,
        temperature: 0.25,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 4,
        antiDigressionPrompt:
          '[سياسة التفاعل الودي المصري: أجب عن الاطمئنان والعامية المصرية (ايه الدنيا، ايه الاخبار) بدفء وبشاشة ووقار في 3 أسطر، مع إظهار المودة والاستعداد للمساعدة دون أي إقحام لمواد قانونية أو قضايا.]',
      };

    case 'CONFIDENTIAL_PERSONAL':
      return {
        maxTokens: 250,
        temperature: 0.25,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 6,
        antiDigressionPrompt:
          '[سياسة الحديث الشخصي والسرية: رحب بالسائل واحتضن موقفه الأخوي والإنساني بأمانة وسرية تامة وبدون أي قوالب قانونية جامدة أو استعراض عضلات قضائية.]',
      };

    case 'GREETING':
      return {
        maxTokens: 80,
        temperature: 0.15,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 2,
        antiDigressionPrompt:
          '[سياسة الإيجاز الصارمة للمستشار: رُد التحية في سطر أو سطرين بوقار وترحاب. يُحظر حظراً باتاً سرد أي دفوع أو مواد قانونية أو استعراض خدمات غير مطلوبة.]',
      };

    case 'SOCIAL':
      return {
        maxTokens: 120,
        temperature: 0.2,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 3,
        antiDigressionPrompt:
          '[سياسة الإيجاز الصارمة: أجب عن السؤال الاجتماعي بود ووقار ودعاء في سطرين. يُحظر افتعال أي نزاع قضائي أو ذكر مذكرات أو قضايا.]',
      };

    case 'INTRO':
      return {
        maxTokens: 280,
        temperature: 0.3,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 8,
        antiDigressionPrompt:
          '[سياسة الإيجاز الصارمة: عرّف بنفسك (المستشار عطيه الهلباوي محامٍ بالنقض والدستورية ومجلس الدولة) ورحب بالسائل واسأله عما يشغل باله بحرية. يُحظر تماماً افتعال أي نزاع تجاري أو مدني أو سرد إجراءات غير مطلوبة.]',
      };

    case 'PERMISSION':
      return {
        maxTokens: 80,
        temperature: 0.15,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 2,
        antiDigressionPrompt:
          '[سياسة الإيجاز الصارمة: رحب بالسائل واطلب منه طرح سؤاله بالتفصيل وبسرية تامة في سطر واحد فقط دون أي مقدمات مطولة.]',
      };

    case 'GRATITUDE':
      return {
        maxTokens: 80,
        temperature: 0.15,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 2,
        antiDigressionPrompt:
          '[سياسة الإيجاز الصارمة: رُد على الشكر بعبارة موجزة ورصينة تسند الفضل لله وتؤكد الجاهزية لمعاونته، في سطر واحد فقط دون استطراد.]',
      };

    case 'DRAFTING':
      return {
        maxTokens: 1200,
        temperature: 0.25,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: false,
        allowedLineCount: 60,
        antiDigressionPrompt:
          '[سياسة الصياغة المحكمة: حرر مسودة العقد أو المحرر مباشرة بأركانه القانونية الإلزامية دون إطالة إنشائية خارج بنود العقد.]',
      };

    case 'FOLLOW_UP':
      return {
        maxTokens: 700,
        temperature: 0.35,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: false,
        allowedLineCount: 25,
        antiDigressionPrompt:
          '[سياسة الإيجاز والمتابعة: أجب عن الشق التابع مباشرة دون إعادة تكرار تفاصيل ما تم بيانه في الرسائل السابقة.]',
      };

    case 'GENERAL':
      return {
        maxTokens: 350,
        temperature: 0.4,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 10,
        antiDigressionPrompt:
          '[سياسة الإيجاز: حاور السائل بذكاء وتوضيح مباشر لما يطلبه، مع دعوته لبيان الوقائع المحددة إن وجدت دون فرض نزاع وهمي.]',
      };

    case 'MIXED':
      return {
        maxTokens: 800,
        temperature: 0.35,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: false,
        allowedLineCount: 30,
        antiDigressionPrompt:
          '[سياسة التناسب: رُد التحية في نصف سطر، ثم أجب عن المسألة القانونية المطروحة بدقة وتركيز على جوهر النزاع دون استطرادات ثانوية.]',
      };

    case 'ZERO_HALLUCINATION':
      return {
        maxTokens: 350,
        temperature: 0.1,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: true,
        allowedLineCount: 15,
        antiDigressionPrompt:
          '[سياسة الأمانة القضائية الصارمة: ارفض بحسم أي مواد أو أرقام طعون خيالية أو وهمية، ووضح حدود المواد الحقيقية في القانون المصري بالأمانة العلمية التامة دون اختلاق.]',
      };

    case 'MISSING_INFO_PROMPT':
      return {
        maxTokens: 450,
        temperature: 0.25,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: false,
        allowedLineCount: 20,
        antiDigressionPrompt:
          '[سياسة الاستيضاح الذكي: اطرح الأسئلة القانونية الجوهرية لاستيفاء أركان الدعوى (مصدر الالتزام، ركن الخطأ، الضرر، والتقادم) دون مجرد عبارات عامة.]',
      };

    case 'LEGAL':
    default:
      return {
        maxTokens: 950,
        temperature: 0.3,
        enforceDirectAnswer: true,
        prohibitUnsolicitedLitigation: false,
        allowedLineCount: 40,
        antiDigressionPrompt:
          '[سياسة الإيجاز القضائي: ادخل مباشرة في التكييف القانوني للمسألة المطروحة مع ذكر السند التشريعي المباشر والإجراء العملي، وتجنب الحشو والخطب الإنشائية.]',
      };
  }
}

/**
 * تحديد الفئة الكبرى للنية لتسهيل التوجيه
 */
function categorizeIntent(intent: IntentType): IntentCategory {
  if (intent === 'GREETING') return 'GREETING';
  if (
    intent === 'SOCIAL' ||
    intent === 'COLLOQUIAL_CHECKIN' ||
    intent === 'CONFIDENTIAL_PERSONAL' ||
    intent === 'CELEBRATION_INVITATION' ||
    intent === 'INTRO' ||
    intent === 'PERMISSION' ||
    intent === 'GRATITUDE'
  )
    return 'QUESTION';
  if (intent === 'DRAFTING') return 'DRAFTING';
  return 'LEGAL_REQUEST';
}

/**
 * حارس ما بعد المعالجة (Post-Processing Conciseness Guard)
 * يفحص رد الذكاء الاصطناعي ويحذف أي استطراد تلقائي مخالف لسياسة المستشار
 */
export function enforceConcisenessGuard(reply: string, context: CounselorLinguisticContext): string {
  if (!reply || !reply.trim()) return reply;
  let cleaned = reply.trim();

  // إذا كانت الرسالة تحية أو حديثاً اجتماعياً أو استئذاناً
  if (context.isConversationalOnly) {
    // التحقق مما إذا كان النموذج قد أقحم استطرادات قضائية وهمية
    const forbiddenDigressionMarkers = [
      'أولاً: التكييف القضائي الدقيق',
      'تندرج هذه المنازعة في إطار الالتزامات المدنية/التجارية',
      'ثانياً: التحليل التكتيكي للدفوع',
      'الدفع الشكلي: التمسك بسقوط',
      'الدفع الموضوعي: التمسك بانعدام',
      'ثالثاً: الإجراءات الفورية المتعين اتخاذها',
      'عمل توكيل رسمي بالقضايا',
      'توجيه إنذار رسمي على يد محضر لقطع أي مدة تقادم',
    ];

    const hasUnsolicitedLitigation = forbiddenDigressionMarkers.some((marker) => cleaned.includes(marker));

    if (hasUnsolicitedLitigation) {
      console.warn(`[LinguisticMiddleware] Anti-digression guard intercepted unsolicited litigation in a ${context.intent} turn! Trimming to concise autonomous response.`);
      // استبدال الرد فورياً بالرد المنضبط المختصر للمستشار
      if (context.instantReply) {
        return context.instantReply;
      }
      return generateCounselorAutonomousResponse(context.rawMessage, [], {
        isPrivateRoom: true,
      });
    }

    // تقليص الأسطر الفارغة والاستطرادات الزائدة
    const lines = cleaned.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length > context.policy.allowedLineCount + 3) {
      cleaned = lines.slice(0, context.policy.allowedLineCount + 2).join('\n\n');
    }
  }

  return cleaned;
}

/**
 * وحدة المعالجة اللغوية الوسيطة (Express Middleware)
 */
export function counselorLinguisticMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const rawMessage = (req.body?.message || req.body?.question || req.body?.facts || '').trim();
    const history: ConsultationTurn[] = Array.isArray(req.body?.history) ? req.body.history : [];

    const intent = detectIntent(rawMessage, history);
    const category = categorizeIntent(intent);
    const policy = resolveConcisenessPolicy(intent);
    const isConversationalOnly =
      intent === 'GREETING' ||
      intent === 'SOCIAL' ||
      intent === 'COLLOQUIAL_CHECKIN' ||
      intent === 'CONFIDENTIAL_PERSONAL' ||
      intent === 'CELEBRATION_INVITATION' ||
      intent === 'CONGRATULATIONS_PLATFORM' ||
      intent === 'INTRO' ||
      intent === 'PERMISSION' ||
      intent === 'GRATITUDE';

    // إعداد الرد الفوري المباشر لتفادي أي استطراد سحابي أو تأخير غير مبرر
    let instantReply: string | undefined;
    if (isConversationalOnly || intent === 'ZERO_HALLUCINATION' || intent === 'MISSING_INFO_PROMPT' || intent === 'DRAFTING') {
      instantReply = generateCounselorAutonomousResponse(rawMessage, history, {
        isPrivateRoom: req.path.includes('private'),
      });
    }

    // النيات التي تفضل الرد الفوري المباشر لمنع أي استطراد أو هلوسة خيالية
    const shouldBypassAiToPreventDigression =
      intent === 'GREETING' ||
      intent === 'GRATITUDE' ||
      intent === 'PERMISSION' ||
      intent === 'COLLOQUIAL_CHECKIN' ||
      intent === 'CONFIDENTIAL_PERSONAL' ||
      intent === 'CELEBRATION_INVITATION' ||
      intent === 'CONGRATULATIONS_PLATFORM' ||
      intent === 'ZERO_HALLUCINATION' ||
      intent === 'INTRO';

    const directive = `${buildIntentDirective(intent)}\n${policy.antiDigressionPrompt}`;

    req.counselorContext = {
      rawMessage,
      sanitizedMessage: rawMessage,
      intent,
      intentCategory: category,
      isConversationalOnly,
      shouldBypassAiToPreventDigression,
      instantReply,
      policy,
      directive,
    };

    next();
  } catch (error) {
    console.error('[LinguisticMiddleware] Error during linguistic preprocessing:', error);
    next();
  }
}
