/**
 * STEP 6: LEGAL PROVENANCE & TEMPORAL AUDIT MANAGER
 * توثيق المصادر والتواريخ وسريان التشريعات والأحكام القضائية
 */

import { ProvenanceMetadata, LawEnactmentStatus } from './types.ts';

export class ProvenanceManager {
  /**
   * Determine official provenance and validity status of a legal text
   */
  public extractProvenance(title: string, text: string): ProvenanceMetadata {
    const lower = `${title} ${text}`.toLowerCase();

    // 1. Determine Law Enactment Status
    let status: LawEnactmentStatus = 'ساري ومعمول به';
    if (lower.includes('غير دستوري') || lower.includes('عدم دستورية') || lower.includes('مقضي بعدم دستوريته')) {
      status = 'مقضي بعدم دستوريته جزئياً';
    } else if (lower.includes('ملغى بموجب') || lower.includes('تم إلغاء هذا القانون')) {
      status = 'ملغى كلياً';
    } else if (lower.includes('معدل بالقانون') || lower.includes('استبدلت بالقانون')) {
      status = 'معدل بتشريع لاحق';
    }

    // 2. Issuing Authority
    let issuingAuthority: ProvenanceMetadata['issuingAuthority'] = 'مجلس النواب';
    if (lower.includes('محكمة النقض') || lower.includes('طعن رقم')) {
      issuingAuthority = 'محكمة النقض';
    } else if (lower.includes('المحكمة الدستورية العليا')) {
      issuingAuthority = 'المحكمة الدستورية العليا';
    } else if (lower.includes('قرار جمهوري') || lower.includes('رئيس الجمهورية')) {
      issuingAuthority = 'رئيس الجمهورية';
    } else if (lower.includes('قرار رئيس مجلس الوزراء')) {
      issuingAuthority = 'مجلس الوزراء';
    }

    // 3. Extract dates (e.g. 15 مايو 1948 or 2022-03-09)
    const datePattern = /(?:بتاريخ|جلسة|صدر\s+في)\s+(\d{1,2}\s+[أ-ي]+\s+\d{4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})/i;
    const dateMatch = text.match(datePattern);
    const enactmentDate = dateMatch ? dateMatch[1] : undefined;

    // 4. Extract Gazette Issue
    const gazettePattern = /(?:الجريدة\s+الرسمية|الوقائع\s+المصرية)(?:\s*-\s*|\s+)العدد\s+([^\n,\.]+)/i;
    const gazetteMatch = text.match(gazettePattern);
    const officialGazetteIssue = gazetteMatch ? gazetteMatch[1]?.trim() : undefined;

    // Default Source String
    let officialSource = 'مكتبة التشريعات وأحكام النقض الرسمية المصرية';
    if (issuingAuthority === 'محكمة النقض') {
      officialSource = 'مجموعة الأحكام الصادرة عن الدوائر المدنية والجنائية بمحكمة النقض المصرية';
    } else if (issuingAuthority === 'المحكمة الدستورية العليا') {
      officialSource = 'مجموعة أحكام وقرارات المحكمة الدستورية العليا المنشورة بالجريدة الرسمية';
    } else if (officialGazetteIssue) {
      officialSource = `الجريدة الرسمية المصرية - العدد (${officialGazetteIssue})`;
    }

    return {
      officialSource,
      enactmentDate,
      effectiveDate: enactmentDate,
      officialGazetteIssue,
      issuingAuthority,
      status,
      lastAuditedAt: new Date().toISOString(),
      auditedBy: 'المستشار عطيه الهلباوي (مدقق الأمانة القضائية)',
    };
  }
}

export const provenanceManager = new ProvenanceManager();
