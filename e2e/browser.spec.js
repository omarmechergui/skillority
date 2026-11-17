import { test, expect } from '@playwright/test';

test.describe('Skillority True Browser E2E — Multi-Role Verification', () => {

  test('1. Authentication — Public Sign-In Page Form & Google Placeholder', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page).toHaveTitle(/Skillority/i);

    // Form inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Verify Google sign-in is disabled placeholder
    const googleBtn = page.locator('button[title*="inactive"], button:has-text("Google")').first();
    await expect(googleBtn).toBeDisabled();
  });

  test('2. Authentication — Public Sign-Up Page & Role Selection', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page).toHaveTitle(/Skillority/i);

    // Form input visibility
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // Role toggle check
    const studentRole = page.locator('button:has-text("Student"), input[value="STUDENT"]').first();
    await expect(studentRole).toBeVisible();
  });

  test('3. Student Dashboard & Navigation UI', async ({ page }) => {
    await page.goto('/student/dashboard');
    // Top student header
    await expect(page.locator('text=Student Workspace')).toBeVisible();
    await expect(page.locator('text=Streak').first()).toBeVisible();
  });

  test('4. Learning Catalog & Course Browsing', async ({ page }) => {
    await page.goto('/student/learn');
    await expect(page.locator('text=Learning Catalog')).toBeVisible();
    // Scope search to the catalog area
    const catalogSearch = page.locator('input[placeholder*="Search courses, instructors"]');
    await expect(catalogSearch).toBeVisible();
    await catalogSearch.fill('Web');
  });

  test('5. Student Wallet & Coin Economy', async ({ page }) => {
    await page.goto('/student/wallet');
    await expect(page.getByRole('heading', { name: /Coins Wallet/i })).toBeVisible();
    await expect(page.getByText(/How Skillority Coins Work/i)).toBeVisible();
  });

  test('6. Student Career Hub & Opportunities', async ({ page }) => {
    await page.goto('/student/careers');
    await expect(page.getByRole('heading', { name: /Career & Internship Opportunities/i })).toBeVisible();
  });

  test('7. Student Community Discussions', async ({ page }) => {
    await page.goto('/student/community');
    await expect(page.getByRole('heading', { name: /Community Feed/i })).toBeVisible();
  });

  test('8. Student Messages & Notifications', async ({ page }) => {
    await page.goto('/student/messages');
    await expect(page.locator('text=Messages').first()).toBeVisible();
  });

  test('9. Instructor Courses & Curriculum Studio', async ({ page }) => {
    await page.goto('/instructor/courses');
    await expect(page.locator('text=My Author Courses')).toBeVisible();
    await expect(page.locator('text=Create New Course').first()).toBeVisible();
  });

  test('10. Company Recruiter Portal & Pipeline', async ({ page }) => {
    await page.goto('/company/dashboard');
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Post Opportunity/i })).toBeVisible();
  });

  test('11. Company Opportunities Manager', async ({ page }) => {
    await page.goto('/company/opportunities');
    await expect(page.getByRole('heading', { name: /Company Opportunities/i })).toBeVisible();
  });

  test('12. Admin User Management Directory', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('text=User Management Directory')).toBeVisible();
    const adminSearch = page.locator('input[placeholder*="Search by name or email"]');
    await expect(adminSearch).toBeVisible();
  });

  test('13. Admin Course Review Queue', async ({ page }) => {
    await page.goto('/admin/courses/reviews');
    await expect(page.getByRole('heading', { name: /Course Review/i })).toBeVisible();
  });

});
