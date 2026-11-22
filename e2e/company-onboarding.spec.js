import { test, expect } from '@playwright/test';

test.describe('Module 1B: Company Onboarding Form & Session Sync E2E', () => {
  test('Complete Company Onboarding Flow: Validation, API Submission, Session Sync, and Dashboard Redirect', async ({ page }) => {
    const initialCompanyUser = {
      id: 'company_e2e_123',
      email: 'recruiter.e2e@stripe.test',
      role: 'COMPANY',
      profile: {
        firstName: 'Sarah',
        lastName: 'Recruiter',
        companyName: 'Stripe, Inc.',
        industry: null,
        companySize: null,
      },
    };

    const completedCompanyProfile = {
      id: 'prof_comp_e2e_123',
      userId: 'company_e2e_123',
      firstName: 'Sarah',
      lastName: 'Recruiter',
      companyName: 'Stripe, Inc.',
      industry: 'Finance',
      companySize: '201-1000',
      website: 'https://stripe.com',
      companyDescription: 'Financial infrastructure for the internet.',
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
                ...initialCompanyUser,
                profile: completedCompanyProfile,
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
            data: { user: initialCompanyUser },
          }),
        });
      }
    });

    await page.route('**/api/auth/onboarding/company', async (route) => {
      onboardingApiCalled = true;
      submittedPayload = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Company onboarding completed successfully',
          data: { profile: completedCompanyProfile },
        }),
      });
    });

    // Mock dashboard initial APIs to prevent errors on dashboard arrival
    await page.route('**/api/profiles/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { profile: completedCompanyProfile } }),
      });
    });

    await page.route('**/api/careers/applications', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    // 2. Pre-seed initial incomplete company auth session
    await page.addInitScript((user) => {
      localStorage.setItem('skillority_user', JSON.stringify(user));
      localStorage.setItem('skillority_token', 'mock_company_jwt_token');
    }, initialCompanyUser);

    // 3. Navigate to Company Onboarding page
    await page.goto('/onboarding/company');

    // Verify form headings & inputs
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Company profile setup/i })).toBeVisible();
    const companyNameInput = page.locator('input#companyName');
    const industrySelect = page.locator('select#industry');
    const sizeSelect = page.locator('select#companySize');
    const websiteInput = page.locator('input#website');
    const overviewTextarea = page.locator('textarea#description');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(companyNameInput).toBeVisible();
    await expect(industrySelect).toBeVisible();
    await expect(sizeSelect).toBeVisible();
    await expect(websiteInput).toBeVisible();
    await expect(overviewTextarea).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Verify pre-filled companyName from registration
    await expect(companyNameInput).toHaveValue('Stripe, Inc.');

    // 4. Fill in remaining details
    await industrySelect.selectOption('Finance');
    await sizeSelect.selectOption('201-1000');
    await websiteInput.fill('https://stripe.com');
    await overviewTextarea.fill('Financial infrastructure for the internet.');

    // 5. Submit the onboarding form
    await submitBtn.click();

    // 6. Verify submission payload
    await expect.poll(() => onboardingApiCalled).toBe(true);
    expect(submittedPayload).not.toBeNull();
    expect(submittedPayload.companyName).toBe('Stripe, Inc.');
    expect(submittedPayload.industry).toBe('Finance');
    expect(submittedPayload.companySize).toBe('201-1000');
    expect(submittedPayload.website).toBe('https://stripe.com');
    expect(submittedPayload.companyDescription).toBe('Financial infrastructure for the internet.');

    // 7. Verify navigation to Company Dashboard
    await page.waitForURL(/\/company\/dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('/company/dashboard');

    // 8. Verify OnboardingGuard prevents completed company from returning to /onboarding/company
    await page.goto('/onboarding/company');
    await page.waitForURL(/\/company\/dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('/company/dashboard');
  });
});
