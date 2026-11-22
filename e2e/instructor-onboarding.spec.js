import { test, expect } from '@playwright/test';

test.describe('Module 1C: Instructor Onboarding Form & Session Sync E2E', () => {
  test('Complete Instructor Onboarding Flow: Step 1, Step 2, API Submission, Session Sync, and Dashboard Redirect', async ({
    page,
  }) => {
    const initialInstructorUser = {
      id: 'inst_e2e_123',
      email: 'sarah.jenkins@mit.test',
      role: 'INSTRUCTOR',
      profile: {
        firstName: 'Sarah',
        lastName: 'Jenkins',
        experience: null,
        expertise: [],
        bio: null,
      },
    };

    const completedInstructorProfile = {
      id: 'prof_inst_e2e_123',
      userId: 'inst_e2e_123',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      experience: 'Principal Systems Architect',
      expertise: ['Web Development', 'Distributed Systems', 'Next.js'],
      bio: '10+ years engineering high-scale distributed systems.',
    };

    let onboardingApiCalled = false;
    let submittedPayload = null;

    // 1. Intercept Auth & Onboarding APIs
    await page.route('**/api/auth/me', async (route) => {
      if (onboardingApiCalled) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              user: {
                ...initialInstructorUser,
                profile: completedInstructorProfile,
              },
            },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { user: initialInstructorUser },
          }),
        });
      }
    });

    await page.route('**/api/auth/onboarding/instructor', async (route) => {
      onboardingApiCalled = true;
      submittedPayload = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Instructor onboarding completed successfully',
          data: { profile: completedInstructorProfile },
        }),
      });
    });

    // Mock dashboard initial APIs
    await page.route('**/api/courses**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    // 2. Pre-seed initial incomplete instructor auth session
    await page.addInitScript((user) => {
      localStorage.setItem('skillority_user', JSON.stringify(user));
      localStorage.setItem('skillority_token', 'mock_instructor_jwt_token');
    }, initialInstructorUser);

    // 3. Navigate to Instructor Onboarding page
    await page.goto('/onboarding/instructor');
    await expect(page).toHaveURL(/.*\/onboarding\/instructor/);

    // 4. Verify Step 1 fields
    await expect(page.locator('h1')).toContainText('Instructor Onboarding');
    await expect(page.getByText('Step 1 of 2')).toBeVisible();

    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill('Dr. Sarah Jenkins');

    const headlineInput = page.locator('input[name="headline"]');
    await headlineInput.fill('Principal Systems Architect');

    const expertiseInput = page.locator('input[name="expertise"]');
    await expertiseInput.fill('Web Development, Distributed Systems, Next.js');

    // 5. Click "Continue to Course Setup" to advance to Step 2
    const continueBtn = page.getByRole('button', { name: /Continue to Course Setup/i });
    await continueBtn.click();

    // 6. Verify Step 2 is shown
    await expect(page.getByText('Step 2 of 2')).toBeVisible();

    const bioInput = page.locator('textarea[name="bio"]');
    await bioInput.fill('10+ years engineering high-scale distributed systems.');

    const courseIdeaInput = page.locator('input[name="courseIdea"]');
    await courseIdeaInput.fill('Building Enterprise Micro-Frontends with React 19');

    // 7. Submit Step 2 ("Complete Setup & Go to Hub")
    const submitBtn = page.getByRole('button', { name: /Complete Setup & Go to Hub/i });
    await submitBtn.click();

    // 8. Wait for dashboard redirect
    await page.waitForURL('**/instructor/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/instructor\/dashboard/);

    // 9. Verify API was called with normalized payload
    expect(onboardingApiCalled).toBe(true);
    expect(submittedPayload).not.toBeNull();
    expect(submittedPayload.name).toBe('Dr. Sarah Jenkins');
    expect(submittedPayload.headline).toBe('Principal Systems Architect');
    expect(submittedPayload.expertise).toEqual([
      'Web Development',
      'Distributed Systems',
      'Next.js',
    ]);
    expect(submittedPayload.bio).toBe('10+ years engineering high-scale distributed systems.');
    expect(submittedPayload.courseIdea).toBe(
      'Building Enterprise Micro-Frontends with React 19'
    );

    // 10. Re-navigation guard verification: Attempting to visit /onboarding/instructor redirects to dashboard
    await page.goto('/onboarding/instructor');
    await page.waitForURL('**/instructor/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/instructor\/dashboard/);
  });
});
