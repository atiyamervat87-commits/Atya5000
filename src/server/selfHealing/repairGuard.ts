import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface WeightIntegrityReport {
  fileName: string;
  expectedHash: string;
  actualHash: string;
  isValid: boolean;
  sizeBytes: number;
}

const PROTECTED_WEIGHTS = [
  {
    name: 'vocabulary.json',
    relativePath: 'ATTYA_LEGAL_MIND/vocabulary.json',
    expectedHash: 'd00040e872432a04ead67862867e86fb406c0abf4aaa238a002532bf3b00e0ed',
  },
  {
    name: 'ATTYA_LEGAL_MIND_MASTER_1000K.pt',
    relativePath: 'ATTYA_LEGAL_MIND_MASTER_1000K.pt',
    expectedHash: '0629a783ba0eb0805991700a922bae486da2a0c18f6161d1129934a9b91d74ee',
  },
];

export const royalRepairGuard = {
  MASTER_EMAIL: 'atiyamervat87@gmail.com',

  verifyMasterAccess(userEmail?: string): boolean {
    if (!userEmail) return false;
    return userEmail.trim().toLowerCase() === this.MASTER_EMAIL.toLowerCase();
  },

  checkWeightsIntegrity(): WeightIntegrityReport[] {
    const reports: WeightIntegrityReport[] = [];
    const rootDir = process.cwd();

    for (const item of PROTECTED_WEIGHTS) {
      const fullPath = path.join(rootDir, item.relativePath);
      try {
        if (!fs.existsSync(fullPath)) {
          reports.push({
            fileName: item.name,
            expectedHash: item.expectedHash,
            actualHash: 'FILE_NOT_FOUND',
            isValid: false,
            sizeBytes: 0,
          });
          continue;
        }

        const fileBuffer = fs.readFileSync(fullPath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const actualHash = hashSum.digest('hex');
        const stats = fs.statSync(fullPath);

        reports.push({
          fileName: item.name,
          expectedHash: item.expectedHash,
          actualHash,
          isValid: actualHash === item.expectedHash,
          sizeBytes: stats.size,
        });
      } catch (err: any) {
        reports.push({
          fileName: item.name,
          expectedHash: item.expectedHash,
          actualHash: `ERROR: ${err.message}`,
          isValid: false,
          sizeBytes: 0,
        });
      }
    }

    return reports;
  },

  protectModification(targetPath: string, userEmail?: string): { allowed: boolean; reason: string } {
    if (!this.verifyMasterAccess(userEmail)) {
      return {
        allowed: false,
        reason: 'مرفوض أمنياً: محاولة تعديل أصول محمية بدون صلاحيات المالك الرئيسي (Master Owner).',
      };
    }

    const normalized = targetPath.replace(/\\/g, '/');
    const isProtected = PROTECTED_WEIGHTS.some((w) => normalized.includes(w.name));
    if (isProtected) {
      return {
        allowed: false,
        reason: 'محظور هندسياً: ملفات الأوزان والمعجم الأساسي مقفلة برمجياً ضد أي تعديل أو حذف حفاظاً على السيادة القانونية العظمى للمنصة.',
      };
    }

    return { allowed: true, reason: 'مصرح به تحت إشراف المالك الرئيسي.' };
  },
};
