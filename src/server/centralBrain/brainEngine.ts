/**
 * ABQARYNO CENTRAL BRAIN ENGINE — MASTER UNIFIED COORDINATOR
 * المحرك المركزي الموحد لعقل المستشار عطيه الهلباوي (منظومة الـ 10 محركات)
 */

import { CentralBrainLLMCore } from './llmCore.ts';
import { CentralBrainContextEngine } from './contextEngine.ts';
import { CentralBrainMemoryEngine } from './memoryEngine.ts';
import { CentralBrainIntentEngine } from './intentEngine.ts';
import { CentralBrainReasoningEngine } from './reasoningEngine.ts';
import { CentralBrainToolCallingEngine } from './toolCallingEngine.ts';
import { CentralBrainKnowledgeEngine } from './knowledgeEngine.ts';
import { CentralBrainDocumentEngine } from './documentEngine.ts';
import { CentralBrainResponseEngine } from './responseEngine.ts';
import { CentralBrainEvaluationEngine } from './evaluationEngine.ts';
import { multilingualCounselorEngine } from './multilingualEngine.ts';
import {
  BrainEngineResponse,
  BrainIntentType,
  ConsultationContext,
  DraftState,
} from './types.ts';

export class AbqarynoCentralBrainEngine {
  public llmCore: CentralBrainLLMCore;
  public contextEngine: CentralBrainContextEngine;
  public memoryEngine: CentralBrainMemoryEngine;
  public intentEngine: CentralBrainIntentEngine;
  public knowledgeEngine: CentralBrainKnowledgeEngine;
  public reasoningEngine: CentralBrainReasoningEngine;
  public documentEngine: CentralBrainDocumentEngine;
  public toolCallingEngine: CentralBrainToolCallingEngine;
  public responseEngine: CentralBrainResponseEngine;
  public evaluationEngine: CentralBrainEvaluationEngine;

  constructor() {
    this.llmCore = new CentralBrainLLMCore();
    this.contextEngine = new CentralBrainContextEngine();
    this.memoryEngine = new CentralBrainMemoryEngine();
    this.intentEngine = new CentralBrainIntentEngine();
    this.knowledgeEngine = new CentralBrainKnowledgeEngine();
    this.reasoningEngine = new CentralBrainReasoningEngine(this.knowledgeEngine);
    this.documentEngine = new CentralBrainDocumentEngine();
    this.toolCallingEngine = new CentralBrainToolCallingEngine(this.documentEngine, this.memoryEngine);
    this.responseEngine = new CentralBrainResponseEngine(this.documentEngine);
    this.evaluationEngine = new CentralBrainEvaluationEngine();
  }

  /**
   * المعالجة الشاملة للمحادثة بدقة ChatGPT
   */
  public async processTurn(
    sessionId: string,
    userMessage: string,
    roomType: 'public' | 'private' | 'office' = 'public'
  ): Promise<BrainEngineResponse> {
    const rawMessage = (userMessage || '').trim();
    const context = this.contextEngine.getContext(sessionId, roomType);

    // 1. تحليل النية والفهم الدلالي للعامية والفصحى
    const intentAnalysis = this.intentEngine.analyze(rawMessage, context);
    const intent = intentAnalysis.intent;

    let responseText = '';
    let draftState: DraftState | undefined = context.activeDraft;
    let sourceEngine: 'gemini_flash' | 'autonomous_reasoning_core' = 'autonomous_reasoning_core';
    const toolsInvoked: any[] = [];

    // 2. معالجة أوامر تعديل المسودة الحالية (Multi-turn Clause Modification)
    if (intent === 'MODIFY_DRAFT') {
      let activeDraft = context.activeDraft;
      if (!activeDraft) {
        // إذا لم تكن هناك مسودة منشأة من قبل، ننشئ مسودة عقد بيع فوراً ونطبق التعديل عليها
        activeDraft = this.documentEngine.generateApartmentSaleDraft();
        this.contextEngine.setActiveDraft(sessionId, activeDraft);
      }

      const modResult = this.toolCallingEngine.executeTool({
        name: 'modify_clause',
        parameters: {
          currentDraft: activeDraft,
          instruction: rawMessage,
          clauseIndex: intentAnalysis.extractedEntities.clauseIndexToModify,
        },
      });
      toolsInvoked.push(modResult);

      if (modResult.success && modResult.output) {
        const { updatedDraft, modifiedClause, changeSummary } = modResult.output;
        this.contextEngine.setActiveDraft(sessionId, updatedDraft);
        this.memoryEngine.saveDraft(sessionId, updatedDraft);
        draftState = updatedDraft;

        responseText = this.responseEngine.formatClauseModificationResponse(
          updatedDraft,
          modifiedClause,
          changeSummary
        );
      }
    }

    // 3. معالجة طلبات صياغة العقود والمحررات (DRAFT_DOCUMENT)
    else if (intent === 'DRAFT_DOCUMENT') {
      const toolName = intentAnalysis.extractedEntities.contractType?.includes('ايصال')
        ? 'draft_trust_receipt'
        : 'draft_apartment_sale';

      const draftResult = this.toolCallingEngine.executeTool({
        name: toolName === 'draft_trust_receipt' ? 'draft_apartment_sale' : 'draft_apartment_sale',
        parameters: intentAnalysis.extractedEntities,
      });
      toolsInvoked.push(draftResult);

      const generatedDraft = draftResult.output as DraftState;
      this.contextEngine.setActiveDraft(sessionId, generatedDraft);
      this.memoryEngine.saveDraft(sessionId, generatedDraft);
      draftState = generatedDraft;

      responseText = this.responseEngine.formatDraftResponse(
        generatedDraft,
        intentAnalysis.extractedEntities
      );
    }

    // 4. معالجة الحالات الاجتماعية والإنسانية والترحيب
    else if (
      intent === 'COLLOQUIAL_CHECKIN' ||
      intent === 'CELEBRATION_INVITATION' ||
      intent === 'CONFIDENTIAL_PERSONAL' ||
      intent === 'INTRO_PROFILE' ||
      intent === 'CONGRATULATIONS' ||
      intent === 'GRATITUDE' ||
      intent === 'PERMISSION' ||
      intent === 'ZERO_HALLUCINATION'
    ) {
      responseText = this.responseEngine.formatSocialResponse(intent, rawMessage);
    }

    // 5. استفسارات تحتاج لاستيضاحات جوهرية
    else if (intent === 'MISSING_INFO_PROMPT') {
      const questions = intentAnalysis.clarificationQuestions || [
        'ما هو السند القانوني أو الاتفاق المحرر بين الطرفين؟',
        'هل تتوفر تواريخ محددة للواقعة أو محاضر رسمية؟'
      ];
      responseText = `أهلاً بحضرتك يا فندم. يسعدني تقديم الرأي القضائي السديد في طلبك، ولكن لبيان التكييف الدقيق وحساب المواعيد وتحديد الدفوع اللازمة، أحتاج معرفة الآتي أولاً:\n\n` +
        questions.map((q, i) => `${i + 1}. ${q}`).join('\n') +
        `\n\nبمجرد توضيح هذه النقاط سأضع لحضرتك مذكرة تفصيلية بكافة الإجراءات ونصوص المواد وأحكام النقض المنطبقة.`;
    }

    // 6. الاستشارات القانونية الموضوعية والنزاعات القضائية (LEGAL_INQUIRY / GENERAL)
    else {
      // محاولة استدعاء Gemini السحابي أولاً إن وجد المفتاح وكانت الحصة متاحة
      let geminiResponse: string | null = null;
      if (this.llmCore.hasActiveKey() && !this.llmCore.isQuotaBlocked()) {
        try {
          geminiResponse = await this.llmCore.generateTurn(
            rawMessage,
            context.turns,
            'أجب بصفتك المستشار عطيه الهلباوي وفق نصوص القانون المصري وأحكام محكمة النقض دون هلوسة أو إسهاب غير مبرر.'
          );
          if (geminiResponse && geminiResponse.trim().length > 30) {
            responseText = geminiResponse;
            sourceEngine = 'gemini_flash';
          }
        } catch (err) {
          console.warn('[CentralBrain] Gemini call fallback triggered:', err);
        }
      }

      // إذا لم يتوفر Gemini، يعمل محرك الاستدلال واللغات واللهجات الذاتي المتقدم فوراً
      if (!responseText) {
        const cleanMsg = rawMessage.trim();
        const isPureBareGreeting =
          cleanMsg === 'مرحبا' || cleanMsg === 'أهلا' || cleanMsg === 'اهلا' ||
          cleanMsg === 'سلام' || cleanMsg === 'السلام عليكم' || cleanMsg === 'صباح الخير' ||
          cleanMsg === 'مساء الخير' || cleanMsg === 'الو' || cleanMsg === 'يا هلا' ||
          (cleanMsg.length < 6 && !cleanMsg.includes('؟') && !cleanMsg.includes('?'));

        if (intent === 'GENERAL_CONVERSATION' && isPureBareGreeting) {
          responseText = this.responseEngine.formatSocialResponse('GENERAL_CONVERSATION', rawMessage);
          sourceEngine = 'autonomous_reasoning_core';
        } else {
          // فحص اللغة واللهجة وطبيعة المسألة عبر محرك اللغات واللهجات العالمية
          const dialectAnalysis = multilingualCounselorEngine.analyzeLanguageAndDialect(cleanMsg);

          if (
            dialectAnalysis.language !== 'ar_standard' ||
            dialectAnalysis.isEverydayLifeQuery ||
            dialectAnalysis.isMaritalOrFamily ||
            dialectAnalysis.isFinancialDilemma ||
            dialectAnalysis.isSeekingAdvice ||
            intent === 'GENERAL_CONVERSATION'
          ) {
            responseText = multilingualCounselorEngine.generateResponse(cleanMsg);
            sourceEngine = 'autonomous_reasoning_core';
          } else {
            const reasoning = this.reasoningEngine.analyzeIssue(rawMessage);
            const lowerRaw = rawMessage.toLowerCase();
            reasoning.userRequestedLegislativeExplanation =
              lowerRaw.includes('شرح تشريعي') ||
              lowerRaw.includes('شرحا تشريعيا') ||
              lowerRaw.includes('شرحاً تشريعياً') ||
              lowerRaw.includes('سند تشريعي') ||
              lowerRaw.includes('سندا تشريعيا') ||
              lowerRaw.includes('السند التشريعي') ||
              lowerRaw.includes('نص القانون') ||
              lowerRaw.includes('نصوص القانون') ||
              lowerRaw.includes('المواد القانونية') ||
              lowerRaw.includes('مواد القانون') ||
              lowerRaw.includes('نص المادة') ||
              lowerRaw.includes('نصوص المواد') ||
              lowerRaw.includes('التأصيل التشريعي') ||
              lowerRaw.includes('المواد الحاكمة') ||
              lowerRaw.includes('ما هي المواد') ||
              lowerRaw.includes('ما هى المواد') ||
              lowerRaw.includes('اذكر المادة') ||
              lowerRaw.includes('اذكر النص');

            responseText = this.responseEngine.formatLegalInquiryResponse(reasoning);
            sourceEngine = 'autonomous_reasoning_core';
          }
        }
      }
    }

    // 7. تدقيق الجودة والأمانة القضائية ومنع الهلوسة عبر محرك التقييم
    const evaluation = this.evaluationEngine.evaluateResponse(responseText);
    const finalSanitizedText = evaluation.sanitizedText;

    // 8. حفظ الدور في سياق المحادثة
    this.contextEngine.addTurn(sessionId, 'user', rawMessage);
    this.contextEngine.addTurn(sessionId, 'model', finalSanitizedText);
    this.contextEngine.setLastIntent(sessionId, intent);

    return {
      text: finalSanitizedText,
      intent,
      toolsInvoked,
      draftState,
      suggestedFollowUps: intent === 'DRAFT_DOCUMENT'
        ? ['عدل البند الثالث وخليه أقساط', 'غلظ الشرط الجزائي في البند الثامن', 'احفظ المسودة في ملف القضية']
        : intent === 'LEGAL_INQUIRY'
        ? ['ما هي المواعيد القانونية للطعن؟', 'كيف أثبت انتفاء القصد الجنائي؟', 'ما هي المستندات المطلوبة للشكوى؟']
        : undefined,
      confidenceScore: intentAnalysis.confidence,
      sourceEngine,
    };
  }
}

// تصدير نسخة فريدة عامة للمنظومة
export const centralBrainEngine = new AbqarynoCentralBrainEngine();
