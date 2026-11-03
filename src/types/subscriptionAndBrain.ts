export type SubscriptionTier = 'trial' | 'pro' | 'royal';
export type BillingCycle = 'monthly' | 'annually';
export type PaymentGateway = 'instapay' | 'vodafone_cash' | 'card' | 'fawry';

export interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  planName: string;
  amount: number;
  date: string;
  billingCycle: BillingCycle;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'cancelled';
}

export interface UserSubscription {
  tier: SubscriptionTier;
  tierName: string;
  status: 'active' | 'trialing' | 'expired' | 'paused';
  billingCycle: BillingCycle;
  startDate: string;
  trialEndDate: string;
  renewalDate: string;
  pricePerMonth: number;
  autoRenew: boolean;
  paymentMethod: PaymentGateway;
  walletOrCardNumber?: string;
  features: {
    unlimitedAiConsultations: boolean;
    contractTemplatesAccess: boolean;
    maxContractsPerMonth: number;
    brainTrainingAccess: boolean;
    cloudStorageGb: number;
    teamMembersLimit: number;
    fullCassationLibrary: boolean;
    cameraAndVoiceRoom: boolean;
    dedicatedVipSupport: boolean;
  };
  invoices: SubscriptionInvoice[];
}

export interface BrainTrainingPair {
  id: string;
  title: string;
  category: 'مدني' | 'جنائي' | 'مجلس دولة' | 'أسرة' | 'عمالي' | 'تجاري' | 'صياغة عقود' | 'تواصل إنساني';
  userScenario: string;
  characterization: string;
  governingArticles: string;
  cassationPrecedent?: string;
  idealResponse: string;
  status: 'active' | 'draft' | 'under_review';
  trainedAt: string;
  addedBy: string;
  accuracyScore: number;
}

export interface BrainIngestedDoc {
  id: string;
  title: string;
  type: 'مذكرة دفاع' | 'حكم نقض حديث' | 'لائحة تنفيذية' | 'صيغة عقد خاصة' | 'أخرى';
  contentPreview: string;
  extractedKeywords: string[];
  ingestedAt: string;
  tokensCount: number;
}

export interface BrainHyperparameters {
  dignityLevel: number; // 1-100
  humanWarmthLevel: number; // 1-100
  zeroHallucinationStrictness: number; // 1-100
  concisenessRatio: number; // 1-100
  mandatoryCassationCitation: boolean;
  dialectFamiliarity: 'فصحى قضائية رصينة' | 'فصحى قانونية مبسطة' | 'مزدوجة (فصحى للقضايا وعامية راقية للمناسبات)';
}

export interface BrainMetrics {
  totalTrainingPairs: number;
  totalKnowledgeDocs: number;
  estimatedKnowledgeTokens: number;
  inferenceAccuracy: number;
  hallucinationRate: number;
  lastTrainedAt: string;
}
