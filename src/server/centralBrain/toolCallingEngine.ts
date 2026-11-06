/**
 * ABQARYNO CENTRAL BRAIN — TOOL CALLING ENGINE
 * محرك استدعاء الأدوات والوظائف التنفيذية القضائية
 */

import { ToolCallRequest, ToolCallResult, DraftState } from './types.ts';
import { CentralBrainDocumentEngine } from './documentEngine.ts';
import { CentralBrainMemoryEngine } from './memoryEngine.ts';

export class CentralBrainToolCallingEngine {
  private documentEngine: CentralBrainDocumentEngine;
  private memoryEngine: CentralBrainMemoryEngine;

  constructor(docEngine: CentralBrainDocumentEngine, memEngine: CentralBrainMemoryEngine) {
    this.documentEngine = docEngine;
    this.memoryEngine = memEngine;
  }

  /**
   * تنفيذ أداة محددة وإرجاع النتيجة
   */
  public executeTool(request: ToolCallRequest): ToolCallResult {
    switch (request.name) {
      case 'draft_apartment_sale': {
        const draft = this.documentEngine.generateApartmentSaleDraft(request.parameters);
        return {
          toolName: request.name,
          success: true,
          output: draft,
          message: 'تم إنشاء مسودة عقد بيع وحدة سكنية متكاملة ببنودها العشرة بنجاح.',
        };
      }

      case 'modify_clause': {
        const { currentDraft, instruction, clauseIndex } = request.parameters;
        if (!currentDraft) {
          return { toolName: request.name, success: false, output: null, message: 'لا توجد مسودة نشطة لتعديلها.' };
        }
        const result = this.documentEngine.modifyClause(currentDraft, instruction, clauseIndex);
        return {
          toolName: request.name,
          success: true,
          output: result,
          message: result.changeSummary,
        };
      }

      case 'calculate_appeal_deadline': {
        const { judgmentDate, courtType } = request.parameters;
        let days = 40; // مدني استئناف افتراضي
        if (courtType === 'criminal' || courtType === 'جنح') days = 10;
        else if (courtType === 'labor') days = 40;
        else if (courtType === 'urgent' || courtType === 'مستعجل') days = 15;
        else if (courtType === 'cassation' || courtType === 'نقض') days = 60;

        return {
          toolName: request.name,
          success: true,
          output: {
            days,
            statutoryBasis: 'المادة 227 مرافعات أو المادة 406 إجراءات جنائية',
            deadlineNote: `ميعاد الطعن بالاستئناف هو ${days} يوماً تبدأ من اليوم التالي للنطق بالحكم أو إعلانه.`,
          },
        };
      }

      case 'save_draft_to_memory': {
        const { userId, draft } = request.parameters;
        this.memoryEngine.saveDraft(userId || 'default_user', draft);
        return {
          toolName: request.name,
          success: true,
          output: true,
          message: 'تم حفظ المسودة بنجاح في سجل القضية وذاكرة المكتب الدائمة.',
        };
      }

      default:
        return {
          toolName: request.name,
          success: false,
          output: null,
          message: `الأداة ${request.name} غير معروفة.`,
        };
    }
  }
}
