import assert from 'assert';
import { careerApi } from '../src/lib/api/careers.js';

async function runCareerFrontendTests() {
  console.log('=== STARTING MODULE 3: CAREER & RECRUITMENT FRONTEND INTEGRATION TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function pass(name) {
    console.log(`[PASS] ${name}`);
    passed++;
  }

  function fail(name, err) {
    console.error(`[FAIL] ${name}:`, err?.message || err);
    failed++;
  }

  // Intercept global fetch
  let interceptedCalls = [];
  globalThis.fetch = async (url, config = {}) => {
    interceptedCalls.push({ url, config });
    return {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: {} }),
    };
  };

  // 1. getCareerPaths
  try {
    interceptedCalls = [];
    await careerApi.getCareerPaths({ category: 'Software Engineering', difficulty: 'INTERMEDIATE' });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/paths?category=Software+Engineering&difficulty=INTERMEDIATE'));
    assert.strictEqual(interceptedCalls[0].config.method, 'GET');
    pass('1. careerApi.getCareerPaths formats query parameters and dispatches public GET /careers/paths');
  } catch (err) {
    fail('1. careerApi.getCareerPaths', err);
  }

  // 2. getCareerPath by slug
  try {
    interceptedCalls = [];
    await careerApi.getCareerPath('frontend-developer');
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/paths/frontend-developer'));
    pass('2. careerApi.getCareerPath dispatches GET /careers/paths/:slug');
  } catch (err) {
    fail('2. careerApi.getCareerPath', err);
  }

  // 3. getMyCareerGoals
  try {
    interceptedCalls = [];
    await careerApi.getMyCareerGoals();
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/goals'));
    assert.strictEqual(interceptedCalls[0].config.method, 'GET');
    pass('3. careerApi.getMyCareerGoals dispatches authenticated GET /careers/goals');
  } catch (err) {
    fail('3. careerApi.getMyCareerGoals', err);
  }

  // 4. setCareerGoal
  try {
    interceptedCalls = [];
    await careerApi.setCareerGoal({ careerPathId: 'path_123', isPrimary: true, notes: 'Targeting frontend roles' });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/goals'));
    assert.strictEqual(interceptedCalls[0].config.method, 'POST');
    const parsedBody = JSON.parse(interceptedCalls[0].config.body);
    assert.strictEqual(parsedBody.careerPathId, 'path_123');
    assert.strictEqual(parsedBody.isPrimary, true);
    pass('4. careerApi.setCareerGoal dispatches POST /careers/goals with target payload');
  } catch (err) {
    fail('4. careerApi.setCareerGoal', err);
  }

  // 5. getCareerProgress
  try {
    interceptedCalls = [];
    await careerApi.getCareerProgress('path_123');
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/progress/path_123'));
    pass('5. careerApi.getCareerProgress dispatches GET /careers/progress/:id');
  } catch (err) {
    fail('5. careerApi.getCareerProgress', err);
  }

  // 6. getOpportunities
  try {
    interceptedCalls = [];
    await careerApi.getOpportunities({ workplaceType: 'REMOTE', type: 'INTERNSHIP' });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/opportunities?workplaceType=REMOTE&type=INTERNSHIP'));
    pass('6. careerApi.getOpportunities formats filters and dispatches GET /careers/opportunities');
  } catch (err) {
    fail('6. careerApi.getOpportunities', err);
  }

  // 7. createOpportunity
  try {
    interceptedCalls = [];
    await careerApi.createOpportunity({
      title: 'Fullstack Intern',
      description: 'Building modern apps',
      location: 'Remote',
      type: 'INTERNSHIP',
      skills: ['React', 'Node.js'],
    });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/opportunities'));
    assert.strictEqual(interceptedCalls[0].config.method, 'POST');
    pass('7. careerApi.createOpportunity dispatches POST /careers/opportunities');
  } catch (err) {
    fail('7. careerApi.createOpportunity', err);
  }

  // 8. closeOpportunity
  try {
    interceptedCalls = [];
    await careerApi.closeOpportunity('opp_999');
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/opportunities/opp_999/close'));
    assert.strictEqual(interceptedCalls[0].config.method, 'POST');
    pass('8. careerApi.closeOpportunity dispatches POST /careers/opportunities/:id/close');
  } catch (err) {
    fail('8. careerApi.closeOpportunity', err);
  }

  // 9. applyToOpportunity
  try {
    interceptedCalls = [];
    await careerApi.applyToOpportunity('opp_999', {
      coverLetter: 'Interested in this role',
      portfolioUrl: 'https://portfolio.dev',
    });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/opportunities/opp_999/apply'));
    assert.strictEqual(interceptedCalls[0].config.method, 'POST');
    const body = JSON.parse(interceptedCalls[0].config.body);
    assert.strictEqual(body.coverLetter, 'Interested in this role');
    assert.strictEqual(body.portfolioUrl, 'https://portfolio.dev');
    pass('9. careerApi.applyToOpportunity dispatches POST /careers/opportunities/:id/apply with portfolio');
  } catch (err) {
    fail('9. careerApi.applyToOpportunity', err);
  }

  // 10. getMyApplications
  try {
    interceptedCalls = [];
    await careerApi.getMyApplications();
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/my-applications'));
    pass('10. careerApi.getMyApplications dispatches GET /careers/my-applications');
  } catch (err) {
    fail('10. careerApi.getMyApplications', err);
  }

  // 11. withdrawApplication
  try {
    interceptedCalls = [];
    await careerApi.withdrawApplication('app_456', 'Accepted another opportunity');
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/applications/app_456/withdraw'));
    assert.strictEqual(interceptedCalls[0].config.method, 'POST');
    const body = JSON.parse(interceptedCalls[0].config.body);
    assert.strictEqual(body.reason, 'Accepted another opportunity');
    pass('11. careerApi.withdrawApplication dispatches POST /careers/applications/:id/withdraw with reason');
  } catch (err) {
    fail('11. careerApi.withdrawApplication', err);
  }

  // 12. getCompanyDashboardMetrics
  try {
    interceptedCalls = [];
    await careerApi.getCompanyDashboardMetrics();
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/company/dashboard'));
    pass('12. careerApi.getCompanyDashboardMetrics dispatches GET /careers/company/dashboard');
  } catch (err) {
    fail('12. careerApi.getCompanyDashboardMetrics', err);
  }

  // 13. getCompanyApplications
  try {
    interceptedCalls = [];
    await careerApi.getCompanyApplications({ status: 'SHORTLISTED' });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/applications?status=SHORTLISTED'));
    pass('13. careerApi.getCompanyApplications dispatches GET /careers/applications with query params');
  } catch (err) {
    fail('13. careerApi.getCompanyApplications', err);
  }

  // 14. evaluateCandidate
  try {
    interceptedCalls = [];
    await careerApi.evaluateCandidate('app_456', { rating: 5, internalNotes: 'High potential candidate' });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/applications/app_456/evaluate'));
    assert.strictEqual(interceptedCalls[0].config.method, 'POST');
    const body = JSON.parse(interceptedCalls[0].config.body);
    assert.strictEqual(body.rating, 5);
    assert.strictEqual(body.internalNotes, 'High potential candidate');
    pass('14. careerApi.evaluateCandidate dispatches POST /careers/applications/:id/evaluate with rating & internal notes');
  } catch (err) {
    fail('14. careerApi.evaluateCandidate', err);
  }

  // 15. updateApplicationStatus
  try {
    interceptedCalls = [];
    await careerApi.updateApplicationStatus('app_456', 'INTERVIEW', 'Moving to technical round');
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/applications/app_456/status'));
    assert.strictEqual(interceptedCalls[0].config.method, 'PATCH');
    pass('15. careerApi.updateApplicationStatus dispatches PATCH /careers/applications/:id/status');
  } catch (err) {
    fail('15. careerApi.updateApplicationStatus', err);
  }

  // 16. scheduleInterview
  try {
    interceptedCalls = [];
    await careerApi.scheduleInterview('app_456', {
      scheduledAt: '2026-12-01T10:00:00.000Z',
      interviewType: 'TECHNICAL',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
    });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/applications/app_456/interviews'));
    assert.strictEqual(interceptedCalls[0].config.method, 'POST');
    pass('16. careerApi.scheduleInterview dispatches POST /careers/applications/:id/interviews');
  } catch (err) {
    fail('16. careerApi.scheduleInterview', err);
  }

  // 17. createOffer
  try {
    interceptedCalls = [];
    await careerApi.createOffer('app_456', {
      title: 'Junior React Intern',
      stipend: '$1,500 / month',
      duration: '6 months',
    });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/applications/app_456/offers'));
    assert.strictEqual(interceptedCalls[0].config.method, 'POST');
    pass('17. careerApi.createOffer dispatches POST /careers/applications/:id/offers');
  } catch (err) {
    fail('17. careerApi.createOffer', err);
  }

  // 18. respondToOffer
  try {
    interceptedCalls = [];
    await careerApi.respondToOffer('offer_789', { status: 'ACCEPTED' });
    assert.strictEqual(interceptedCalls.length, 1);
    assert(interceptedCalls[0].url.includes('/careers/offers/offer_789/respond'));
    assert.strictEqual(interceptedCalls[0].config.method, 'POST');
    const body = JSON.parse(interceptedCalls[0].config.body);
    assert.strictEqual(body.status, 'ACCEPTED');
    pass('18. careerApi.respondToOffer dispatches POST /careers/offers/:id/respond');
  } catch (err) {
    fail('18. careerApi.respondToOffer', err);
  }

  console.log(`\n=== FRONTEND INTEGRATION TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runCareerFrontendTests();
