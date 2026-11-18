import { test, expect } from '@playwright/test';

// Helper to set up an authenticated role session with mocked verification API
async function mockAuthenticatedUser(page, roleData) {
  // Mock /api/auth/me response
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: roleData,
      }),
    });
  });

  // Also intercept any student/instructor/company initial API requests to prevent unhandled errors
  await page.route('**/api/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/auth/me')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, user: roleData }),
      });
    } else {
      await route.continue();
    }
  });

  // Pre-seed localStorage before navigating
  await page.addInitScript((user) => {
    localStorage.setItem('skillority_user', JSON.stringify(user));
    localStorage.setItem('skillority_token', 'mock-jwt-test-token');
  }, roleData);
}

test.describe('Skillority Route Authorization & Multi-Role Navigation E2E', () => {

  // ==========================================
  // SUITE 1: PUBLIC PAGES (UNAUTHENTICATED)
  // ==========================================

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

  // ==========================================
  // SUITE 2: UNAUTHENTICATED ROUTE GUARD CHECKS
  // Unauthenticated requests MUST redirect to /auth/signin?redirect=...
  // ==========================================

  test('3. Route Guard — Unauthenticated Access to /student/dashboard Redirects to /auth/signin', async ({ page }) => {
    await page.goto('/student/dashboard');
    await expect(page).toHaveURL(/\/auth\/signin\?redirect=%2Fstudent%2Fdashboard/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('4. Route Guard — Unauthenticated Access to /company/dashboard Redirects to /auth/signin', async ({ page }) => {
    await page.goto('/company/dashboard');
    await expect(page).toHaveURL(/\/auth\/signin\?redirect=%2Fcompany%2Fdashboard/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('5. Route Guard — Unauthenticated Access to /instructor/courses Redirects to /auth/signin', async ({ page }) => {
    await page.goto('/instructor/courses');
    await expect(page).toHaveURL(/\/auth\/signin\?redirect=%2Finstructor%2Fcourses/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('6. Route Guard — Unauthenticated Access to /admin/users Redirects to /auth/signin', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/auth\/signin\?redirect=%2Fadmin%2Fusers/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('7. Route Guard — Unauthenticated Access to /onboarding/student Redirects to /auth/signin', async ({ page }) => {
    await page.goto('/onboarding/student');
    await expect(page).toHaveURL(/\/auth\/signin\?redirect=%2Fonboarding%2Fstudent/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  // ==========================================
  // SUITE 3: CROSS-ROLE UNAUTHORIZED REDIRECTS
  // Authenticated user accessing forbidden role group MUST redirect to own role's dashboard
  // ==========================================

  test('8. Cross-Role Guard — Authenticated Student Visiting /admin/users Redirects to /student/dashboard', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'student-id-1',
      email: 'student@skillority.test',
      role: 'STUDENT',
      profile: { firstName: 'Student', lastName: 'User' },
    });

    await page.goto('/admin/users');
    // AuthGuard detects role mismatch and redirects to /student/dashboard
    await expect(page).toHaveURL(/\/student\/dashboard/);
    await expect(page.locator('text=Student Workspace')).toBeVisible();
  });

  test('9. Cross-Role Guard — Authenticated Student Visiting /company/pipeline Redirects to /student/dashboard', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'student-id-1',
      email: 'student@skillority.test',
      role: 'STUDENT',
      profile: { firstName: 'Student', lastName: 'User' },
    });

    await page.goto('/company/pipeline');
    await expect(page).toHaveURL(/\/student\/dashboard/);
    await expect(page.locator('text=Student Workspace')).toBeVisible();
  });

  test('10. Cross-Role Guard — Authenticated Company Visiting /instructor/courses Redirects to /company/dashboard', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'company-id-1',
      email: 'recruiter@techcorp.test',
      role: 'COMPANY',
      profile: { firstName: 'Recruiter', lastName: 'User' },
    });

    await page.goto('/instructor/courses');
    await expect(page).toHaveURL(/\/company\/dashboard/);
    const aside = page.locator('aside');
    await expect(aside.getByText('Recruiter Portal').first()).toBeVisible();
  });

  // ==========================================
  // SUITE 4: AUTHORIZED DASHBOARD & NAVIGATION UI
  // Authenticated users in their proper role route groups render correct Navbar/Sidebar
  // ==========================================

  test('11. Student Dashboard & Navigation UI', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'student-id-1',
      email: 'student@skillority.test',
      role: 'STUDENT',
      profile: { firstName: 'Alex', lastName: 'Student' },
    });

    await page.goto('/student/dashboard');
    await expect(page.locator('text=Student Workspace')).toBeVisible();
    await expect(page.locator('text=Streak').first()).toBeVisible();
    // Student Navbar visible, Sidebar not present
    await expect(page.locator('nav:has-text("Learn")')).toBeVisible();
    await expect(page.locator('aside')).not.toBeVisible();
  });

  test('12. Learning Catalog & Course Browsing', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'student-id-1',
      email: 'student@skillority.test',
      role: 'STUDENT',
      profile: { firstName: 'Alex', lastName: 'Student' },
    });

    await page.goto('/student/learn');
    await expect(page.locator('text=Learning Catalog')).toBeVisible();
    const catalogSearch = page.locator('input[placeholder*="Search courses, instructors"]');
    await expect(catalogSearch).toBeVisible();
    await catalogSearch.fill('Web');
  });

  test('13. Student Wallet & Coin Economy', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'student-id-1',
      email: 'student@skillority.test',
      role: 'STUDENT',
      profile: { firstName: 'Alex', lastName: 'Student' },
    });

    await page.goto('/student/wallet');
    await expect(page.getByRole('heading', { name: /Coins Wallet/i })).toBeVisible();
    await expect(page.getByText(/How Skillority Coins Work/i)).toBeVisible();
  });

  test('14. Student Career Hub & Opportunities', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'student-id-1',
      email: 'student@skillority.test',
      role: 'STUDENT',
      profile: { firstName: 'Alex', lastName: 'Student' },
    });

    await page.goto('/student/careers');
    await expect(page.getByRole('heading', { name: /Career & Internship Opportunities/i })).toBeVisible();
  });

  test('15. Student Community Discussions', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'student-id-1',
      email: 'student@skillority.test',
      role: 'STUDENT',
      profile: { firstName: 'Alex', lastName: 'Student' },
    });

    await page.goto('/student/community');
    await expect(page.getByRole('heading', { name: /Community Feed/i })).toBeVisible();
  });

  test('16. Student Messages & Notifications', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'student-id-1',
      email: 'student@skillority.test',
      role: 'STUDENT',
      profile: { firstName: 'Alex', lastName: 'Student' },
    });

    await page.goto('/student/messages');
    await expect(page.locator('text=Messages').first()).toBeVisible();
  });

  test('17. Instructor Courses & Curriculum Studio', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'instructor-id-1',
      email: 'instructor@skillority.test',
      role: 'INSTRUCTOR',
      profile: { firstName: 'Elena', lastName: 'Instructor' },
    });

    await page.goto('/instructor/courses');
    const aside = page.locator('aside');
    await expect(aside).toBeVisible();
    await expect(aside.getByText('Instructor Portal').first()).toBeVisible();
    await expect(aside.getByText('My Courses')).toBeVisible();
    await expect(aside.getByText('Curriculum Builder')).toBeVisible();
    await expect(aside.getByText('Student Directory')).toBeVisible();
    await expect(aside.getByText('Learn Hub')).not.toBeVisible();
    await expect(aside.getByText('Coins & Wallet')).not.toBeVisible();

    await expect(page.locator('text=My Author Courses')).toBeVisible();
    await expect(page.locator('text=Create New Course').first()).toBeVisible();
  });

  test('18. Company Recruiter Portal & Pipeline', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'company-id-1',
      email: 'recruiter@techcorp.test',
      role: 'COMPANY',
      profile: { firstName: 'Sarah', lastName: 'Recruiter' },
    });

    await page.goto('/company/dashboard');
    const aside = page.locator('aside');
    await expect(aside).toBeVisible();
    await expect(aside.getByText('Recruiter Portal').first()).toBeVisible();
    await expect(aside.getByText('Job Opportunities')).toBeVisible();
    await expect(aside.getByText('Applications Inbox')).toBeVisible();
    await expect(aside.getByText('Recruitment Pipeline')).toBeVisible();
    await expect(aside.getByText('Curriculum Builder')).not.toBeVisible();
    await expect(aside.getByText('Coins & Wallet')).not.toBeVisible();

    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Post Opportunity/i })).toBeVisible();
  });

  test('19. Company Opportunities Manager', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'company-id-1',
      email: 'recruiter@techcorp.test',
      role: 'COMPANY',
      profile: { firstName: 'Sarah', lastName: 'Recruiter' },
    });

    await page.goto('/company/opportunities');
    const aside = page.locator('aside');
    await expect(aside).toBeVisible();
    await expect(aside.getByText('Recruiter Portal').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Company Opportunities/i })).toBeVisible();
  });

  test('20. Admin User Management Directory', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'admin-id-1',
      email: 'admin@skillority.test',
      role: 'ADMIN',
      profile: { firstName: 'Platform', lastName: 'Admin' },
    });

    await page.goto('/admin/users');
    const aside = page.locator('aside');
    await expect(aside).toBeVisible();
    await expect(aside.getByText('Platform Admin').first()).toBeVisible();
    await expect(aside.getByText('User Directory')).toBeVisible();
    await expect(aside.getByText('Course Approvals')).toBeVisible();
    await expect(aside.getByText('Platform Activity')).toBeVisible();
    await expect(aside.getByText('Learn Hub')).not.toBeVisible();

    await expect(page.locator('text=User Management Directory')).toBeVisible();
    const adminSearch = page.locator('input[placeholder*="Search by name or email"]');
    await expect(adminSearch).toBeVisible();
  });

  test('21. Admin Course Review Queue', async ({ page }) => {
    await mockAuthenticatedUser(page, {
      id: 'admin-id-1',
      email: 'admin@skillority.test',
      role: 'ADMIN',
      profile: { firstName: 'Platform', lastName: 'Admin' },
    });

    await page.goto('/admin/courses/reviews');
    const aside = page.locator('aside');
    await expect(aside).toBeVisible();
    await expect(aside.getByText('Platform Admin').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Course Review/i })).toBeVisible();
  });

});
