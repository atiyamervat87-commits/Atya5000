/**
 * Sovereign Acceptance Test Suite for ABQARYNO CENTRAL BRAIN ENGINE
 */

import { centralBrainEngine } from './src/server/centralBrain/brainEngine.ts';
import { detectIntent, generateCounselorAutonomousResponse } from './src/server/counselorBrain.ts';

async function runAcceptanceTests() {
  console.log('====================================================');
  console.log('STARTING SOVEREIGN ACCEPTANCE TESTS FOR CENTRAL BRAIN');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Drafting query with "صيغه" (with "ه")
  const test1Query = 'صيغه عقد بيع شقة سكنية';
  const test1Intent = detectIntent(test1Query);
  const test1Result = await centralBrainEngine.processTurn('session_test_1', test1Query, 'public');

  console.log(`[TEST 1] Query: "${test1Query}"`);
  console.log(`- Detected Intent: ${test1Intent}`);
  console.log(`- Has draftState: ${Boolean(test1Result.draftState)}`);
  console.log(`- Clauses Count: ${test1Result.draftState?.clauses.length}`);
  console.log(`- Mentions 131 لسنة 1948: ${test1Result.text.includes('131 لسنة 1948')}`);
  console.log(`- Boilerplate Absence Check (Does NOT contain "تندرج هذه المنازعة"): ${!test1Result.text.includes('تندرج هذه المنازعة')}`);

  if (
    test1Intent === 'DRAFTING' &&
    test1Result.draftState &&
    test1Result.draftState.clauses.length >= 8 &&
    !test1Result.text.includes('تندرج هذه المنازعة')
  ) {
    console.log('>>> TEST 1: PASSED ✓\n');
    passed++;
  } else {
    console.error('>>> TEST 1: FAILED ✗\n');
    failed++;
  }

  // Test 2: Multi-turn Clause Modification
  const test2ModQuery = 'عدل البند الثالث وخليه أقساط على سنتين';
  const test2Result = await centralBrainEngine.processTurn('session_test_1', test2ModQuery, 'public');

  console.log(`[TEST 2] Multi-turn Query: "${test2ModQuery}"`);
  console.log(`- Intent: ${test2Result.intent}`);
  console.log(`- Includes installment text (أقساط): ${test2Result.text.includes('أقساط') || test2Result.text.includes('قسط')}`);
  console.log(`- Modified Clause in Draft: ${test2Result.draftState?.clauses[2]?.isModified}`);

  if (
    (test2Result.text.includes('أقساط') || test2Result.text.includes('قسط')) &&
    test2Result.draftState?.clauses[2]?.isModified
  ) {
    console.log('>>> TEST 2: PASSED ✓\n');
    passed++;
  } else {
    console.error('>>> TEST 2: FAILED ✗\n');
    failed++;
  }

  // Test 3: Colloquial check-in "ايه الدنيا"
  const test3Query = 'ايه الدنيا';
  const test3Intent = detectIntent(test3Query);
  const test3Result = await centralBrainEngine.processTurn('session_test_3', test3Query, 'public');

  console.log(`[TEST 3] Colloquial Query: "${test3Query}"`);
  console.log(`- Intent: ${test3Intent}`);
  console.log(`- Warm Egyptian response: ${test3Result.text.includes('الدنيا بخير')}`);

  if (test3Intent === 'COLLOQUIAL_CHECKIN' && test3Result.text.includes('الدنيا بخير')) {
    console.log('>>> TEST 3: PASSED ✓\n');
    passed++;
  } else {
    console.error('>>> TEST 3: FAILED ✗\n');
    failed++;
  }

  // Test 4: Celebration Invitation
  const test4Query = 'فرح بنت اختي يوم الخميس الجاي هتحضر معانا بجناب المستشار؟';
  const test4Intent = detectIntent(test4Query);
  const test4Result = await centralBrainEngine.processTurn('session_test_4', test4Query, 'public');

  console.log(`[TEST 4] Celebration Query: "${test4Query}"`);
  console.log(`- Intent: ${test4Intent}`);
  console.log(`- Congratulations presence: ${test4Result.text.includes('مبروك') || test4Result.text.includes('مبارك')}`);
  console.log(`- No criminal articles: ${!test4Result.text.includes('عقوبات')}`);

  if (test4Intent === 'CELEBRATION_INVITATION' && (test4Result.text.includes('مبروك') || test4Result.text.includes('مبارك'))) {
    console.log('>>> TEST 4: PASSED ✓\n');
    passed++;
  } else {
    console.error('>>> TEST 4: FAILED ✗\n');
    failed++;
  }

  // Test 5: Zero-Hallucination check (Penal Code Art 999)
  const test5Query = 'ما هي عقوبة المادة 999 من قانون العقوبات المصري؟';
  const test5Intent = detectIntent(test5Query);
  const test5Result = await centralBrainEngine.processTurn('session_test_5', test5Query, 'public');

  console.log(`[TEST 5] Hallucination Trap Query: "${test5Query}"`);
  console.log(`- Intent: ${test5Intent}`);
  console.log(`- Denies existence / Mentions Art 395 limit: ${test5Result.text.includes('395') || test5Result.text.includes('غير واردة') || test5Result.text.includes('لا وجود')}`);

  if (test5Intent === 'ZERO_HALLUCINATION' && (test5Result.text.includes('395') || test5Result.text.includes('غير واردة') || test5Result.text.includes('لا وجود'))) {
    console.log('>>> TEST 5: PASSED ✓\n');
    passed++;
  } else {
    console.error('>>> TEST 5: FAILED ✗\n');
    failed++;
  }

  // Test 6: Substantive Homicide / Murder penalties
  const test6Query = 'ما هي عقوبة جريمة القتل العمد في القانون المصري؟';
  const test6Result = await centralBrainEngine.processTurn('session_test_6', test6Query, 'public');

  console.log(`[TEST 6] Murder Penalty Query: "${test6Query}"`);
  console.log(`- Mentions Art 230 / Execution (الإعدام): ${test6Result.text.includes('230') || test6Result.text.includes('الإعدام') || test6Result.text.includes('اعدام')}`);
  console.log(`- Mentions Cassation Court: ${test6Result.text.includes('النقض')}`);

  if (test6Result.text.includes('230') && (test6Result.text.includes('الإعدام') || test6Result.text.includes('اعدام'))) {
    console.log('>>> TEST 6: PASSED ✓\n');
    passed++;
  } else {
    console.error('>>> TEST 6: FAILED ✗\n');
    failed++;
  }

  console.log('====================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
