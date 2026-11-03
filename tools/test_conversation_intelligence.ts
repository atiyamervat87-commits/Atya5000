/**
 * ABQARYNO — NATURAL CONVERSATION INTELLIGENCE
 * Automated Test Suite for Real Live Responses
 */

async function runTests() {
  const baseUrl = 'http://localhost:3000/api/consultation/public';

  const testCases = [
    {
      id: 'TC-1',
      title: 'تحية مجردة (السلام عليكم)',
      message: 'السلام عليكم',
      history: [],
      forbiddenKeywords: ['المواد', 'أحكام النقض', 'خدماتنا', 'استشاراتنا', 'التكييف القضائي', 'القانون المدني'],
    },
    {
      id: 'TC-2',
      title: 'اطمئنان وسؤال اجتماعي (عامل إيه؟)',
      message: 'عامل إيه؟',
      history: [],
      forbiddenKeywords: ['المواد', 'أحكام النقض', 'خدماتنا', 'استشاراتنا', 'التكييف القضائي', 'القانون المدني'],
    },
    {
      id: 'TC-3',
      title: 'استئذان لطرح سؤال (ممكن أسألك سؤال؟)',
      message: 'ممكن أسألك سؤال؟',
      history: [],
      forbiddenKeywords: ['المواد', 'أحكام النقض', 'خدماتنا', 'استشاراتنا', 'التكييف القضائي'],
    },
    {
      id: 'TC-4',
      title: 'شكر وامتنان (شكراً يا مستشار)',
      message: 'شكراً يا مستشار',
      history: [],
      forbiddenKeywords: ['المواد', 'أحكام النقض', 'خدماتنا', 'التكييف القضائي'],
    },
    {
      id: 'TC-5',
      title: 'طلب صياغة مستند (مطلوب صيغة عقد بيع شقة)',
      message: 'مطلوب صيغة عقد بيع شقة',
      history: [],
      requiredKeywords: ['عقد بيع', 'البائع', 'المشتري', 'الثمن'],
    },
    {
      id: 'TC-6',
      title: 'سؤال متابعة واستفسار لاحق (وماذا لو امتنع المشتري عن سداد باقي الثمن؟)',
      message: 'وماذا لو امتنع المشتري عن سداد باقي الثمن؟',
      history: [
        { role: 'user', text: 'مطلوب صيغة عقد بيع شقة' },
        { role: 'model', text: 'عقد بيع ابتدائي لوحدة سكنية...' },
      ],
      requiredKeywords: ['الثمن', 'امتناع', 'الفسخ', 'المبيع'],
    },
    {
      id: 'TC-7',
      title: 'رسالة مركبة (تحية + استشارة قانونية)',
      message: 'السلام عليكم، عندي مشكلة في عقد البيع البائع رافض يسلم الشقة',
      history: [],
      requiredKeywords: ['التسليم', 'العقد', 'البائع'],
    },
  ];

  console.log('====================================================');
  console.log('بدء اختبارات محرك الفهم الطبيعي وتناسب الردود — ABQARYNO');
  console.log('====================================================\n');

  let passed = 0;
  for (const tc of testCases) {
    console.log(`[اختبار ${tc.id}]: ${tc.title}`);
    console.log(`- المدخل: "${tc.message}"`);
    if (tc.history.length > 0) {
      console.log(`- السياق السابق: ${tc.history.length} رسائل`);
    }

    try {
      const start = Date.now();
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: tc.message, history: tc.history }),
      });
      const data = await res.json();
      const duration = Date.now() - start;

      const reply = data.reply || '';
      console.log(`- زمن الاستجابة: ${duration}ms`);
      console.log(`- المصدر: ${data.source}`);
      console.log(`- نص الرد:\n"""\n${reply}\n"""`);

      let tcPassed = true;
      if (tc.forbiddenKeywords) {
        for (const kw of tc.forbiddenKeywords) {
          if (reply.includes(kw)) {
            console.error(`❌ فشل: الرد تضمن لفظاً محظوراً ("${kw}") يخالف قاعدة التناسب.`);
            tcPassed = false;
          }
        }
      }

      if (tc.requiredKeywords) {
        for (const kw of tc.requiredKeywords) {
          if (!reply.includes(kw)) {
            console.warn(`⚠️ تنبيه: الكلمة المتوقعة ("${kw}") لم تظهر نصاً.`);
          }
        }
      }

      if (tcPassed) {
        console.log(`✅ نتيجة الحالة: ناجح ومطابق لقاعدة التناسب التام.`);
        passed++;
      } else {
        console.log(`❌ نتيجة الحالة: غير مطابق.`);
      }
    } catch (e: any) {
      console.error(`❌ خطأ في الاتصال:`, e.message);
    }
    console.log('----------------------------------------------------\n');
  }

  console.log(`\nالنتيجة النهائية: نجح ${passed} من أصل ${testCases.length} سيناريو.`);
}

runTests();
