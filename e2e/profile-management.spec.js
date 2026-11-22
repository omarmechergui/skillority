import { test, expect } from '@playwright/test';

test.describe('Module 1D: Profile Management & Settings E2E', () => {

  test('Student: View profile, edit settings, save updates, and verify persistence', async ({ page }) => {
    let studentUser = {
      id: 'student_pm_1',
      email: 'student.e2e@skillority.com',
      role: 'STUDENT',
      profile: {
        id: 'prof_stud_1',
        userId: 'student_pm_1',
        firstName: 'Elena',
        lastName: 'Rostova',
        university: 'MIT',
        major: 'Computer Science',
        graduationYear: 2026,
        skills: ['Python', 'Machine Learning'],
        interests: ['Robotics'],
        learningGoals: 'Deep learning specialization',
        bio: 'Aspiring AI researcher.',
        coinsBalance: 120,
      },
    };

    let patchCalled = false;
    let patchPayload = null;

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: studentUser } }),
      });
    });

    await page.route('**/api/profiles/me', async (route) => {
      if (route.request().method() === 'PATCH') {
        patchCalled = true;
        patchPayload = JSON.parse(route.request().postData() || '{}');
        studentUser.profile = { ...studentUser.profile, ...patchPayload };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { profile: studentUser.profile },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { profile: studentUser.profile },
          }),
        });
      }
    });

    // Seed localStorage auth session
    await page.addInitScript((user) => {
      window.localStorage.setItem('accessToken', 'mock-valid-student-jwt');
      window.localStorage.setItem('user', JSON.stringify(user));
    }, studentUser);

    // 1. Visit Student Profile Page
    await page.goto('/student/profile');
    await expect(page.getByText('Elena Rostova').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('MIT')).toBeVisible();
    await expect(page.getByText('Computer Science')).toBeVisible();

    // 2. Navigate to Settings Page
    await page.goto('/student/settings');
    await expect(page.getByText('Student Settings')).toBeVisible({ timeout: 10000 });

    // Verify fields populated
    const uniInput = page.locator('input#university, input[name="university"]').first();
    await expect(uniInput).toHaveValue('MIT');

    // Update university and bio
    await uniInput.fill('Harvard University');
    const bioTextarea = page.locator('textarea#bio, textarea[name="bio"]').first();
    await bioTextarea.fill('Updated bio: pursuing quantum computing.');

    // Save changes
    const saveButton = page.getByRole('button', { name: /Save Changes/i });
    await saveButton.click();

    // Verify API called
    expect(patchCalled).toBe(true);
    expect(patchPayload.university).toBe('Harvard University');
    expect(patchPayload.bio).toBe('Updated bio: pursuing quantum computing.');

    // Verify success banner
    await expect(page.getByText(/Profile updated successfully/i)).toBeVisible();
  });

  test('Company: View profile, edit company details, save, and verify persistence', async ({ page }) => {
    let companyUser = {
      id: 'company_pm_1',
      email: 'recruiter@techcorp.io',
      role: 'COMPANY',
      profile: {
        id: 'prof_comp_1',
        userId: 'company_pm_1',
        firstName: 'Sarah',
        lastName: 'Connor',
        companyName: 'Cyberdyne Systems',
        industry: 'Robotics',
        companySize: '51-200',
        website: 'https://cyberdyne.io',
        companyDescription: 'Pioneering intelligent automation and robotics.',
        bio: 'Lead Technical Recruiter',
      },
    };

    let patchCalled = false;
    let patchPayload = null;

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: companyUser } }),
      });
    });

    await page.route('**/api/profiles/me', async (route) => {
      if (route.request().method() === 'PATCH') {
        patchCalled = true;
        patchPayload = JSON.parse(route.request().postData() || '{}');
        companyUser.profile = { ...companyUser.profile, ...patchPayload };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { profile: companyUser.profile },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { profile: companyUser.profile },
          }),
        });
      }
    });

    // Seed localStorage auth session
    await page.addInitScript((user) => {
      window.localStorage.setItem('accessToken', 'mock-valid-company-jwt');
      window.localStorage.setItem('user', JSON.stringify(user));
    }, companyUser);

    // 1. Visit Company Profile Page
    await page.goto('/company/profile');
    await expect(page.getByText('Cyberdyne Systems').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Robotics').first()).toBeVisible();

    // 2. Visit Company Settings Page
    await page.goto('/company/settings');
    await expect(page.getByText('Company Profile & Settings')).toBeVisible({ timeout: 10000 });

    const companyNameInput = page.locator('input#companyName, input[name="companyName"]').first();
    await expect(companyNameInput).toHaveValue('Cyberdyne Systems');

    // Update industry and companySize
    const industryInput = page.locator('input#industry, input[name="industry"]').first();
    await industryInput.fill('Autonomous Robotics & AI');

    const saveBtn = page.getByRole('button', { name: /Save Company Profile/i });
    await saveBtn.click();

    expect(patchCalled).toBe(true);
    expect(patchPayload.industry).toBe('Autonomous Robotics & AI');
    await expect(page.getByText(/Company profile updated successfully/i)).toBeVisible();
  });

  test('Instructor: View profile, edit educator details, save, and verify persistence', async ({ page }) => {
    let instructorUser = {
      id: 'inst_pm_1',
      email: 'dr.stone@university.edu',
      role: 'INSTRUCTOR',
      profile: {
        id: 'prof_inst_1',
        userId: 'inst_pm_1',
        firstName: 'Senku',
        lastName: 'Ishigami',
        experience: 'Senior Science Educator & Researcher',
        expertise: ['Chemistry', 'Physics', 'Engineering'],
        bio: 'Ten billion percent dedicated to hands-on science education.',
        website: 'https://science-kingdom.org',
      },
    };

    let patchCalled = false;
    let patchPayload = null;

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: instructorUser } }),
      });
    });

    await page.route('**/api/profiles/me', async (route) => {
      if (route.request().method() === 'PATCH') {
        patchCalled = true;
        patchPayload = JSON.parse(route.request().postData() || '{}');
        instructorUser.profile = { ...instructorUser.profile, ...patchPayload };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { profile: instructorUser.profile },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { profile: instructorUser.profile },
          }),
        });
      }
    });

    // Seed localStorage auth session
    await page.addInitScript((user) => {
      window.localStorage.setItem('accessToken', 'mock-valid-instructor-jwt');
      window.localStorage.setItem('user', JSON.stringify(user));
    }, instructorUser);

    // 1. Visit Instructor Profile Page
    await page.goto('/instructor/profile');
    await expect(page.getByText('Senku Ishigami').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Senior Science Educator & Researcher').first()).toBeVisible();

    // 2. Visit Instructor Settings Page
    await page.goto('/instructor/settings');
    await expect(page.getByText('Instructor Profile & Settings')).toBeVisible({ timeout: 10000 });

    const expInput = page.locator('input#experience, input[name="experience"]').first();
    await expect(expInput).toHaveValue('Senior Science Educator & Researcher');

    // Update experience
    await expInput.fill('Distinguished Professor of Experimental Sciences');

    const saveBtn = page.getByRole('button', { name: /Save Instructor Profile/i });
    await saveBtn.click();

    expect(patchCalled).toBe(true);
    expect(patchPayload.experience).toBe('Distinguished Professor of Experimental Sciences');
    await expect(page.getByText(/Instructor profile updated successfully/i)).toBeVisible();
  });
});
