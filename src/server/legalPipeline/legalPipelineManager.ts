/**
 * MASTER ORCHESTRATOR: EGYPTIAN LEGAL DATA PIPELINE
 * المنسق الرئيسي لخط أنابيب معالجة وهندسة البيانات القانونية المصرية (8 مراحل متكاملة)
 */

import {
  RawLegalInput,
  ProcessedLegalDocument,
  PipelineStats,
  QualityReport,
} from './types.ts';
import { legalTextNormalizer } from './textNormalizer.ts';
import { legalClassifier } from './legalClassifier.ts';
import { citationGraphEngine } from './citationGraphEngine.ts';
import { provenanceManager } from './provenanceManager.ts';
import { pipelineStorage } from './pipelineStorage.ts';
import { qualityAssuranceSuite } from './qualityAssurance.ts';

export class LegalPipelineManager {
  constructor() {
    this.seedDefaultCorpusIfEmpty();
  }

  /**
   * Run the full 8-step pipeline on a single legal input document
   */
  public processDocument(input: RawLegalInput, title?: string): ProcessedLegalDocument {
    const docId = `legaldoc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const effectiveTitle = title || input.fileName || `وثيقة قانونية #${docId.slice(-6)}`;

    // 1. Text Normalization & Cleaning (Step 2)
    const cleanResult = legalTextNormalizer.cleanAndNormalize(input.rawContent);

    // 2. Legal Branch Classification (Step 3)
    const classification = legalClassifier.classify(cleanResult.cleanedText);

    // 3. Citation & Cross-linking (Step 5)
    const citationLinks = citationGraphEngine.extractCitations(effectiveTitle, cleanResult.cleanedText);

    // 4. Provenance & Temporal Audit (Step 6)
    const provenance = provenanceManager.extractProvenance(effectiveTitle, cleanResult.cleanedText);

    // 5. Indexing Tokens & Keywords (Step 4)
    const words = cleanResult.cleanedText.split(/\s+/).filter(Boolean);
    const uniqueTokens = Array.from(new Set(words.map((w) => w.toLowerCase())));

    // 6. Assembling Processed Document Structure (Step 8)
    const processedDoc: ProcessedLegalDocument = {
      id: docId,
      rawInputId: input.id,
      title: effectiveTitle,
      originalFileName: input.fileName,
      rawText: input.rawContent,
      cleanedText: cleanResult.cleanedText,
      charCount: cleanResult.cleanedCharCount,
      wordCount: words.length,
      classification,
      provenance,
      extractedArticles: cleanResult.extractedArticles,
      citationLinks,
      searchIndex: {
        tokens: uniqueTokens.slice(0, 100),
        invertedKeywords: classification.matchedKeywords,
        stemmedIndex: classification.suggestedTopics,
      },
      qualityFidelityScore: cleanResult.qualityCleaningScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 7. Store in Persisted Corpus & Index
    pipelineStorage.saveDocument(processedDoc);

    return processedDoc;
  }

  /**
   * Process multiple files in batch
   */
  public processBatch(inputs: RawLegalInput[]): ProcessedLegalDocument[] {
    return inputs.map((input) => this.processDocument(input));
  }

  /**
   * Run full Quality Assurance Evaluation (Step 7)
   */
  public runQualityAudit(): QualityReport {
    return qualityAssuranceSuite.runFullEvaluation();
  }

  /**
   * Search corpus with branch filtering
   */
  public searchCorpus(query: string, branch?: any, limit?: number) {
    return pipelineStorage.search(query, branch, limit);
  }

  /**
   * Get overall corpus statistics
   */
  public getCorpusStats(): PipelineStats {
    return pipelineStorage.getStats();
  }

  /**
   * Get all processed documents
   */
  public getAllCorpusDocuments(): ProcessedLegalDocument[] {
    return pipelineStorage.getAllDocuments();
  }

  /**
   * Export corpus in JSONL format
   */
  public exportCorpusJsonl(): string {
    return pipelineStorage.exportJsonl();
  }

  /**
   * Pre-seed foundational Egyptian legislation corpus if empty
   */
  private seedDefaultCorpusIfEmpty() {
    const existing = pipelineStorage.getAllDocuments();
    if (existing.length > 0) return;

    const seedDocuments: Array<{ title: string; content: string; fileName: string }> = [
      {
        title: 'القانون المدني المصري رقم 131 لسنة 1948 - العقود والالتزامات',
        fileName: 'egyptian_civil_code_131_1948.txt',
        content: `المادة (147): العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين، أو للأسباب التي يقررها القانون. ومع ذلك إذا طرأت حوادث استثنائية عامة لم يكن في الوسع توقعها وترتب على حدوثها أن تنفيذ الالتزام التعاقدي، وإن لم يصبح مستحيلاً، صار يرهق المدين بحيث يهدده بخسارة فادحة، جاز للقاضي تبعاً للظروف وبعد الموازنة بين مصلحة الطرفين أن يرد الالتزام المرهق إلى الحد المعقول.
المادة (148): يجب تنفيذ العقد طبقاً لما اشتمل عليه وبطريقة تتفق مع ما يوجبه حسن النية. ولا يقتصر العقد على إلزام المتعاقد بما ورد فيه، ولكن يتناول أيضاً ما هو من مستلزماته، وفقاً للقانون والعرف والعدالة بحسب طبيعة الالتزام.
المادة (418): البيع عقد يلتزم به البائع أن ينقل للمشتري ملكية شيء أو حقاً مالياً آخر في مقابل ثمن نقدي.
المادة (431): يلتزم البائع بتسليم المبيع للمشتري بالحالة التي كان عليها وقت البيع.
المادة (935): الشفعة رخصة تجيز في بيع العقار الحلول محل المشتري في حقوقه والتزاماته. ومستندة لأحكام الطعن رقم 1840 لسنة 54 ق مدني.`,
      },
      {
        title: 'قانون العقوبات المصري رقم 58 لسنة 1937 - جرائم الأموال وخيانة الأمانة والقتل',
        fileName: 'egyptian_penal_code_58_1937.txt',
        content: `المادة (230): كل من قتل نفساً عمداً مع سبق الإصرار على ذلك أو الترصد يعاقب بالإعدام.
المادة (234): من قتل نفساً عمداً من غير سبق إصرار ولا ترصد يعاقب بالسجن المشدد أو السجن المؤبد.
المادة (336): يعاقب بالحبس كل من توصل إلى الاستيلاء على نقود أو عروض أو سندات دين أو سندات مخالصة بطرق احتيالية لسلب ثروة الغير أو بعضها.
المادة (341): كل من اختلس أو استعمل أو بدد مبالغ أو أمتعة أو بضائع أو نقوداً أو تذاكر أو كتابات أخرى مشتملة على تمسك أو مخالصة إضراراً بمالكيها أو أصحابها أو واضعي اليد عليها وكانت الأشياء المذكورة لم تسلم له إلا على وجه الوديعة أو الإجارة أو على سبيل عارية الاستعمال أو الرهن أو كانت سلمت له بصفته وكيلاً بأجرة أو مجاناً بقصد عرضها للبيع أو استعمالها في أمر معين لمنفعة المالك لها أو غيره يحكم عليه بالحبس ويجوز أن يزاد عليه غرامة لا تتجاوز مائة جنيه مصري.
مستندة للطعن رقم 2841 لسنة 72 ق جنائي في اشتراط ركن التسليم الحقيقي.`,
      },
      {
        title: 'قانون تنظيم الشهر العقاري رقم 9 لسنة 2022 - قواعد تسجيل العقارات ونقل الملكية',
        fileName: 'real_estate_registry_law_9_2022.txt',
        content: `قانون رقم 9 لسنة 2022 بتعديل بعض أحكام القانون رقم 114 لسنة 1946 بتنظيم الشهر العقاري.
الجريدة الرسمية - العدد 9 مكرر بتاريخ 9 مارس 2022.
المادة (9): لا تنقل الملكية العقارية ولا الحقوق العينية العقارية الأخرى ولا تنشأ ولا تعدل ولا تزول إلا بالتسجيل طبقاً لأحكام هذا القانون.
المادة (21 مكرر): يقدم طلب الشهر العقاري إلكترونياً أو ورقياً مشفوعاً بالمستندات الدالة على الملكية أو وضع اليد المدة المكسبة للملكية 5 سنوات بحسن نية أو 15 سنة، وتفصل مأمورية الشهر العقاري في الطلب خلال ثلاثين يوماً بحد أقصى. وتحدد الرسوم بفئات مقطوعة لا تتجاوز أربعة آلاف جنيه مصري.`,
      },
      {
        title: 'قانون العمل المصري رقم 12 لسنة 2003 - الفصل التعسفي ومنازعات العمل',
        fileName: 'egyptian_labor_law_12_2003.txt',
        content: `المادة (70): إذا نشأ نزاع فردي بين صاحب العمل والعامل في شأن تطبيق أحكام هذا القانون جاز لكل منهما أن يطلب من مكتب العمل المختص خلال عشرة أيام من تاريخ النزاع تسويته ودياً.
المادة (71): إذا لم تتم التسوية الودية خلال واحد وعشرين يوماً يحيل مكتب العمل النزاع إلى المحكمة العمالية المختصة.
المادة (122): إذا أنهى أحد الطرفين العقد دون مبرر مشروع كافٍ، التزم بأن يعوض الطرف الآخر عن الضرر الذي يصيبه من جراء هذا الإنهاء. وإذا كان الإنهاء صادراً من جانب صاحب العمل دون مبرر، جاز للعامل أن يلجأ إلى المحكمة العمالية بطلب التعويض، ولا يجوز أن يقل التعويض عن أجر شهرين عن كل سنة من سنوات الخدمة، فضلاً عن مقابل مهلة الإخطار ورصيد الإجازات السنوية المستحقة.`,
      },
      {
        title: 'قانون المرافعات المدنية والتجارية رقم 13 لسنة 1968 - مواعيد الطعن بالاستئناف والنقض',
        fileName: 'pleadings_law_13_1968.txt',
        content: `المادة (227): ميعاد الاستئناف أربعون يوماً ما لم ينص القانون على غير ذلك، ويكون الميعاد خمسة عشر يوماً في المسائل المستعجلة أياً كانت المحكمة التي أصدرت الحكم.
المادة (252): ميعاد الطعن بالنقض ستون يوماً في الأحكام الصادرة من محاكم الاستئناف العالي.
المادة (215): يترتب على عدم مراعاة مواعيد الطعن في الأحكام سقوط الحق في الطعن وتقضي المحكمة بالسقوط من تلقاء نفسها لتعلق المواعيد بالنظام العام.`,
      },
      {
        title: 'أحكام محاكم الأسرة وقانون الأحوال الشخصية رقم 1 لسنة 2000 - الخلع والنفقات',
        fileName: 'family_court_law_1_2000.txt',
        content: `المادة (20): للزوجين أن يتراضيا فيما بينهما على الخلع، فإن لم يتراضيا عليه وأقامت الزوجة دعواها بطلبه وافتدت نفسها وتنازلت عن جميع حقوقها المالية والشرعية وردت عليه الصداق الذي أعطاه لها، حكمت المحكمة بتطليقها عليه. ولا تحكم المحكمة بالتطليق للخلع إلا بعد محاولة الصلح بين الزوجين وندب حكمين لموالاة مساعي الصلح بينهما خلال مدة لا تجاوز ثلاثة أشهر. ويكون الحكم بالخلع في جميع الأحوال غير قابل للطعن عليه بأي طريق من طرق الطعن.
مستندة للطعن رقم 512 لسنة 71 ق أحوال شخصية في تحديد مشتملات نفقة الصغير ومسكن الحضانة.`,
      },
    ];

    for (const seed of seedDocuments) {
      this.processDocument(
        {
          id: `seed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          fileName: seed.fileName,
          fileType: 'txt',
          rawContent: seed.content,
          uploadedAt: new Date().toISOString(),
        },
        seed.title
      );
    }
  }
}

export const legalPipelineManager = new LegalPipelineManager();
