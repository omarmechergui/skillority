import { test, expect } from '@playwright/test';

test.describe('Module 1A: Student Onboarding Form & Session Sync E2E', () => {
  test('Complete Student Onboarding Flow: Validation, API Submission, Session Sync, and Dashboard Redirect', async ({ page }) => {
    const initialUser = {
      id: 'student_e2e_123',
      email: 'alex.student@test.com',
      role: 'STUDENT',
      profile: {
        firstName: 'Alex',
        lastName: 'Rivera',
        university: null,
        major: null,
      },
    };

    const completedProfile = {
      id: 'prof_e2e_123',
      userId: 'student_e2e_123',
      firstName: 'Alex',
      lastName: 'Rivera',
      university: 'Stanford University',
      major: 'Computer Science',
      graduationYear: 2026,
      skills: ['React', 'Node.js', 'TypeScript'],
      learningGoals: 'Master scalable web architecture',
    };

    let onboardingApiCalled = false;
    let submittedPayload = null;

    // 1. Intercept Auth & Onboarding APIs
    await page.route('**/api/auth/me', async (route) => {
      if (onboardingApiCalled) {
        // Return completed profile after onboarding
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              user: {
                ...initialUser,
                profile: completedProfile,
              },
            },
          }),
        });
      } else {
        // Return incomplete student profile initially
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { user: initialUser },
          }),
        });
      }
    });

    await page.route('**/api/auth/onboarding/student', async (route) => {
      onboardingApiCalled = true;
      submittedPayload = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Student onboarding completed successfully',
          data: { profile: completedProfile },
        }),
      });
    });

    // Mock dashboard initial APIs to prevent errors on dashboard arrival
    await page.route('**/api/profiles/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { profile: completedProfile } }),
      });
    });

    await page.route('**/api/wallet', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { balance: 100 } }),
      });
    });

    await page.route('**/api/courses**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    // 2. Pre-seed initial incomplete student auth session
    await page.addInitScript((user) => {
      localStorage.setItem('skillority_user', JSON.stringify(user));
      localStorage.setItem('skillority_token', 'mock_jwt_test_token');
    }, initialUser);

    // 3. Navigate to Student Onboarding page
    await page.goto('/onboarding/student');

    // Verify form headings & inputs
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Complete student profile/i })).toBeVisible();
    const universityInput = page.locator('input#university');
    const majorInput = page.locator('input#major');
    const gradYearSelect = page.locator('select#graduationYear');
    const skillsInput = page.locator('input#skills');
    const goalsTextarea = page.locator('textarea#learningGoals');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(universityInput).toBeVisible();
    await expect(majorInput).toBeVisible();
    await expect(gradYearSelect).toBeVisible();
    await expect(skillsInput).toBeVisible();
    await expect(goalsTextarea).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // 4. Fill in onboarding details
    await universityInput.fill('Stanford University');
    await majorInput.fill('Computer Science');
    await gradYearSelect.selectOption('2026');
    await skillsInput.fill('React, Node.js, TypeScript');
    await goalsTextarea.fill('Master scalable web architecture');

    // 5. Submit the onboarding form
    await submitBtn.click();

    // 6. Verify submission payload
    await expect.poll(() => onboardingApiCalled).toBe(true);
    expect(submittedPayload).not.toBeNull();
    expect(submittedPayload.university).toBe('Stanford University');
    expect(submittedPayload.major).toBe('Computer Science');
    expect(submittedPayload.graduationYear).toBe(2026);
    expect(submittedPayload.skills).toEqual(['React', 'Node.js', 'TypeScript']);
    expect(submittedPayload.learningGoals).toBe('Master scalable web architecture');

    // 7. Verify navigation to Student Dashboard
    await page.waitForURL(/\/student\/dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('/student/dashboard');

    // 8. Verify OnboardingGuard prevents completed student from returning to /onboarding/student
    await page.goto('/onboarding/student');
    await page.waitForURL(/\/student\/dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('/student/dashboard');
  });
});
