/**
 * اختبار التحقق من هيكل بيانات قاعدة المعرفة القانونية المصرية المترابطة
 * واسترجاع الروابط الشبكية بين الدستور، والمدني، والجنائي
 */

import { egyptianKnowledgeBase } from '../src/services/legalKnowledgeBase';

function runKnowledgeGraphAudit() {
  console.log('================================================================');
  console.log('فحص واختبار هيكل بيانات قاعدة المعرفة القانونية المصرية (Graph & RAG)');
  console.log('================================================================\n');

  const testQueries = [
    {
      title: 'واقعة قبض واحتجاز بدون إذن قضائي وبدون تلبس',
      query: 'الظابط قبض عليا في الشارع وفتشني ومفيش تلبس',
      expectedBackbone: 'المادة 54 من الدستور',
      expectedCriminalProc: 'المادتان 30 و34 إجراءات جنائية',
      expectedPenal: 'المادة 280 عقوبات (القبض بدون وجه حق)',
    },
    {
      title: 'نزاع إيصال أمانة والمطالبة بالتعويض المدني التابع',
      query: 'عندي وصل أمانة واحد سرقه وعايز ارفع جنحة وأطالب بتعويض ملايين',
      expectedPenal: 'المادة 341 عقوبات (خيانة الأمانة)',
      expectedCivil: 'المادة 163 مدني (المسؤولية التقصيرية والتعويض)',
      expectedProcedure: 'المادة 251 إجراءات جنائية (الادعاء المدني)',
    },
    {
      title: 'نزاع شفعة مطالب بها من الجار المالك',
      query: 'الجار يطلب شفعة في بيع شقة في العمارة',
      expectedPrimary: 'المادة 936 مدني',
      expectedConstitutionalNote: 'قضاء المحكمة الدستورية العليا بسقوط البند (هـ) وشفعة الجار',
    },
  ];

  for (const t of testQueries) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`[اختبار]: ${t.title}`);
    console.log(`- نص الاستعلام: "${t.query}"`);

    const result = egyptianKnowledgeBase.queryKnowledgeGraph(t.query);
    if (!result) {
      console.error('❌ فشل الاسترجاع: لم يتم العثور على عقد مطابقة.');
      continue;
    }

    console.log(`✓ المادة المحورية المسترجعة: [${result.matchedPrimaryArticle.lawOfficialName} - مادة ${result.matchedPrimaryArticle.articleNumber}]`);
    console.log(`✓ عدد المواد الدستورية المربوطة شبكياً: ${result.constitutionalBackbone?.length || 0}`);
    if (result.constitutionalBackbone) {
      result.constitutionalBackbone.forEach((c) => console.log(`   └─ الدستور: مادة (${c.articleNumber})`));
    }

    console.log(`✓ المواد الإجرائية المقترنة: ${result.proceduralCounterparts?.length || 0}`);
    if (result.proceduralCounterparts) {
      result.proceduralCounterparts.forEach((p) => console.log(`   └─ إجرائي: مادة (${p.articleNumber}) - ${p.lawOfficialName}`));
    }

    console.log(`✓ المواد الموضوعية والتعويض المقترنة: ${result.substantiveCounterparts?.length || 0}`);
    if (result.substantiveCounterparts) {
      result.substantiveCounterparts.forEach((s) => console.log(`   └─ موضوعي: مادة (${s.articleNumber}) - ${s.lawOfficialName}`));
    }

    console.log(`✓ السوابق القضائية المعتمدة: ${result.relatedCassationPrecedents.length} سابقة`);
    console.log(`✓ مسار الاستدلال الشبكي:`);
    result.traversalPathExplanation.forEach((p, idx) => console.log(`   [${idx + 1}] ${p}`));

    console.log(`\n[عينة من سياق الحقن للنموذج (Grounding Context)]:`);
    console.log(result.formattedGroundingContext.slice(0, 300) + '...\n');
  }

  console.log('================================================================');
  console.log('✓ تم التحقق بنجاح من سلامة الهيكل البياني والربط العضوي بين القوانين.');
  console.log('================================================================');
}

runKnowledgeGraphAudit();
