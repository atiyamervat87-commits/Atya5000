import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function generateArchives() {
  console.log('[GenerateZips] Creating valid ZIP archives with adm-zip...');

  // 1. ATTYA_LEGAL_MIND.zip
  const zipMind = new AdmZip();
  zipMind.addLocalFile(path.resolve(process.cwd(), 'ATTYA_LEGAL_MIND/checkpoints_1m/ATTYA_LEGAL_MIND_MASTER_1000K.pt'), 'ATTYA_LEGAL_MIND/checkpoints_1m');
  zipMind.addLocalFolder(path.resolve(process.cwd(), 'src'), 'src');
  zipMind.addLocalFile(path.resolve(process.cwd(), 'server.ts'), '');
  zipMind.addLocalFile(path.resolve(process.cwd(), 'package.json'), '');
  zipMind.addLocalFile(path.resolve(process.cwd(), 'tsconfig.json'), '');
  
  const mindZipPath = path.resolve(process.cwd(), 'ATTYA_LEGAL_MIND.zip');
  zipMind.writeZip(mindZipPath);
  const mindPublicPath = path.resolve(process.cwd(), 'public/downloads/ATTYA_LEGAL_MIND.zip');
  fs.copyFileSync(mindZipPath, mindPublicPath);
  console.log(`[GenerateZips] Created ATTYA_LEGAL_MIND.zip (${fs.statSync(mindZipPath).size} bytes)`);

  // 2. ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip (Full application & weights)
  const zipApp = new AdmZip();
  zipApp.addLocalFolder(path.resolve(process.cwd(), 'src'), 'src');
  zipApp.addLocalFolder(path.resolve(process.cwd(), 'public'), 'public');
  zipApp.addLocalFolder(path.resolve(process.cwd(), 'ATTYA_LEGAL_MIND'), 'ATTYA_LEGAL_MIND');
  zipApp.addLocalFile(path.resolve(process.cwd(), 'server.ts'), '');
  zipApp.addLocalFile(path.resolve(process.cwd(), 'package.json'), '');
  zipApp.addLocalFile(path.resolve(process.cwd(), 'tsconfig.json'), '');
  zipApp.addLocalFile(path.resolve(process.cwd(), 'index.html'), '');

  const appZipPath = path.resolve(process.cwd(), 'ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip');
  zipApp.writeZip(appZipPath);
  const appPublicPath = path.resolve(process.cwd(), 'public/downloads/ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip');
  fs.copyFileSync(appZipPath, appPublicPath);
  console.log(`[GenerateZips] Created ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip (${fs.statSync(appZipPath).size} bytes)`);

  // 3. Compute SHA-256 Checksums
  const mindBuffer = fs.readFileSync(mindZipPath);
  const mindHash = crypto.createHash('sha256').update(mindBuffer).digest('hex');

  const appBuffer = fs.readFileSync(appZipPath);
  const appHash = crypto.createHash('sha256').update(appBuffer).digest('hex');

  const sumsContent = `${mindHash}  ATTYA_LEGAL_MIND.zip
${appHash}  ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip
${mindHash}  public/downloads/ATTYA_LEGAL_MIND.zip
${appHash}  public/downloads/ATTYA_LEGAL_ADVISOR_MAGIC_MIND.zip
`;

  fs.writeFileSync(path.resolve(process.cwd(), 'FINAL_SHA256SUMS.txt'), sumsContent, 'utf8');
  fs.writeFileSync(path.resolve(process.cwd(), 'public/downloads/FINAL_SHA256SUMS.txt'), sumsContent, 'utf8');
  console.log('[GenerateZips] Successfully updated FINAL_SHA256SUMS.txt with correct cryptographic hashes.');
}

generateArchives();
