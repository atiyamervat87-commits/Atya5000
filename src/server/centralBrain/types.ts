/**
 * ABQARYNO CENTRAL BRAIN ENGINE — TYPES & INTERFACES
 * عقل المستشار عطيه الهلباوي الموحد — النواة المركزية
 */

export type TurnRole = 'user' | 'model';

export interface ConsultationTurn {
  role: TurnRole;
  text: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export type BrainIntentType =
  | 'DRAFT_DOCUMENT'          // طلب صياغة عقد أو محرر أو مذكرة
  | 'MODIFY_DRAFT'           // تعديل بند أو إضافة شرط في المسودة السابقة
  | 'LEGAL_INQUIRY'          // استشارة قانونية موضوعية أو نزاع قضائي
  | 'MISSING_INFO_PROMPT'    // استفسار غامض أو ناقص يحتاج استيضاح ذكي
  | 'COLLOQUIAL_CHECKIN'     // اطمئنان عام بالعامية المصرية (إيه الدنيا، إيه الأخبار، يا باشا)
  | 'CELEBRATION_INVITATION' // مناسبات ودعوات اجتماعية وأفراح
  | 'CONFIDENTIAL_PERSONAL'  // حديث خاص أو إنساني بعيد عن التقاضي
  | 'INTRO_PROFILE'          // تعريف بالهوية والصفة والمكانة والتعارف
  | 'CONGRATULATIONS'        // تهنئة بالمنصة أو المكتب
  | 'GRATITUDE'              // شكر وثناء
  | 'PERMISSION'             // استئذان لطرح مسألة
  | 'ZERO_HALLUCINATION'     // سؤال عن مواد أو أحكام وهمية
  | 'GENERAL_CONVERSATION';  // حوار عام

export interface ContractClause {
  number: number;
  title: string;
  content: string;
  key?: string;
  isModified?: boolean;
}

export interface DraftState {
  id: string;
  documentType: string;
  title: string;
  preamble: string;
  parties: {
    firstParty?: { label: string; name?: string; nationalId?: string; address?: string };
    secondParty?: { label: string; name?: string; nationalId?: string; address?: string };
    [key: string]: any;
  };
  propertyDetails?: {
    type?: string;
    description?: string;
    address?: string;
    area?: string;
    price?: string;
    paymentTerms?: string;
    deliveryDate?: string;
  };
  clauses: ContractClause[];
  missingFields: string[];
  status: 'drafting' | 'reviewing' | 'finalized';
  lastModifiedClauseNumber?: number;
}

export interface UserMemory {
  clientName?: string;
  caseTopic?: string;
  extractedFacts: Array<{ key: string; value: string; timestamp: string }>;
  savedDrafts: DraftState[];
  preferences: {
    tone: 'royal_reassuring' | 'formal_academic' | 'practical_actionable';
  };
}

export interface ConsultationContext {
  sessionId: string;
  roomType: 'public' | 'private' | 'office';
  turns: ConsultationTurn[];
  activeDraft?: DraftState;
  memory: UserMemory;
  lastIntent?: BrainIntentType;
}

export interface ToolCallRequest {
  name: string;
  parameters: Record<string, any>;
}

export interface ToolCallResult {
  toolName: string;
  success: boolean;
  output: any;
  message?: string;
}

export interface LegalStatute {
  lawName: string;
  articleNumber: string | number;
  text: string;
  summary: string;
  officialReference: string;
}

export interface LegalCassation {
  court: string;
  rulingNumber: string;
  judicialYear: string;
  sessionDate: string;
  principle: string;
}

export interface ReasoningResult {
  detectedProblem: string;
  characterization: string; // التكييف القضائي
  directAnswer?: string; // الجواب المباشر الحاسم والمخصص لسؤال المستشير
  statutoryBasis: LegalStatute[];
  cassationBasis: LegalCassation[];
  recommendedSteps: string[];
  risksAndWarnings: string[];
  missingCrucialFacts: string[];
  isConceptualOrHistorical?: boolean;
  detailedAnalysis?: string;
  customAdvice?: string;
}

export interface BrainEngineResponse {
  text: string;
  intent: BrainIntentType;
  toolsInvoked?: ToolCallResult[];
  draftState?: DraftState;
  suggestedFollowUps?: string[];
  statutesReferenced?: string[];
  confidenceScore: number;
  sourceEngine: 'gemini_flash' | 'autonomous_reasoning_core';
}

export interface IntentAnalysis {
  intent: BrainIntentType;
  confidence: number;
  normalizedText: string;
  extractedEntities: {
    contractType?: string;
    firstParty?: string;
    secondParty?: string;
    price?: string;
    location?: string;
    clauseIndexToModify?: number;
    modificationInstruction?: string;
  };
  requiresClarification: boolean;
  clarificationQuestions?: string[];
}
