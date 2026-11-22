import { test, expect } from '@playwright/test';

test.describe('Module 2D: Course Platform Lifecycle & Accreditation E2E', () => {

  test('Complete Course Lifecycle: Instructor Authoring -> Admin Approval -> Student Discovery, Enrollment & Coin Unlock', async ({ page }) => {
    let courseStore = {
      id: 'course_e2e_live',
      title: 'Full-Stack Modern Next.js Architecture',
      description: 'Mastering App Router, React Server Components, and scalable systems.',
      category: 'Web Development',
      level: 'Intermediate',
      status: 'DRAFT',
      instructorId: 'inst_e2e_1',
      instructor: {
        id: 'inst_e2e_1',
        email: 'instructor@test.com',
        profile: { firstName: 'Linus', lastName: 'Torvalds', avatar: null, experience: 'Kernel Lead' },
      },
      chapters: [
        {
          id: 'chap_e2e_0',
          title: 'Foundation & Principles',
          order: 0,
          isFree: true,
          coinsCost: 0,
          lessons: [
            {
              id: 'les_e2e_1',
              title: 'Server vs Client Components',
              order: 0,
              duration: 15,
              content: { lead: 'Deep dive into React Server Component boundaries.' },
            },
          ],
        },
        {
          id: 'chap_e2e_6',
          title: 'Advanced Edge Middleware',
          order: 6,
          isFree: false,
          coinsCost: 50,
          lessons: [
            {
              id: 'les_e2e_2',
              title: 'Distributed Session Verification',
              order: 0,
              duration: 25,
              content: { lead: 'Edge computing runtime isolation.' },
            },
          ],
        },
      ],
    };

    let studentEnrollment = null;
    let studentWallet = { balance: 150 };

    // API Route Interceptions
    await page.route('**/api/courses**', async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (url.includes('/submit-review') && method === 'POST') {
        courseStore.status = 'PENDING_REVIEW';
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: courseStore }),
        });
      }

      if (url.includes('/review-decision') && method === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}');
        courseStore.status = body.status;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: courseStore }),
        });
      }

      if (url.includes(`/courses/${courseStore.id}`)) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: courseStore }),
        });
      }

      // Catalog query
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [courseStore] }),
      });
    });

    await page.route('**/api/admin/courses/reviews', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [courseStore] }),
      });
    });

    await page.route('**/api/learning/**', async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (url.includes('/my-courses')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: studentEnrollment ? [studentEnrollment] : [] }),
        });
      }

      if (url.includes(`/enroll/${courseStore.id}`)) {
        studentEnrollment = {
          id: 'enr_e2e_1',
          courseId: courseStore.id,
          unlockedChapterIds: ['chap_e2e_0'],
          completedLessonIds: [],
          progressPercent: 0,
        };
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: studentEnrollment }),
        });
      }

      if (url.includes('/unlock')) {
        studentWallet.balance -= 50;
        studentEnrollment.unlockedChapterIds.push('chap_e2e_6');
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: { alreadyUnlocked: false, enrollment: studentEnrollment } }),
        });
      }

      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await page.route('**/api/wallet/balance', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: studentWallet }),
      });
    });

    // 1. Instructor Course Management: View overview & Submit for Review
    await page.addInitScript(() => {
      window.localStorage.setItem('skillority_token', 'mock-instructor-jwt');
      window.localStorage.setItem('user', JSON.stringify({
        id: 'inst_e2e_1',
        email: 'instructor@test.com',
        role: 'INSTRUCTOR',
        profile: { firstName: 'Linus', lastName: 'Torvalds' },
      }));
    });

    await page.goto(`/instructor/courses/${courseStore.id}`);
    await expect(page.getByText('Full-Stack Modern Next.js Architecture').first()).toBeVisible({ timeout: 10000 });

    const submitReviewBtn = page.getByRole('button', { name: /Submit for Admin Review/i });
    await expect(submitReviewBtn).toBeVisible();
    await submitReviewBtn.click();
    await expect(page.getByText(/Course submitted to Admin review queue/i)).toBeVisible();

    // 2. Admin Portal: Review accreditation decision
    await page.goto(`/admin/courses/reviews/${courseStore.id}/decide`);
    await expect(page.getByText('Approve / Reject Decision')).toBeVisible({ timeout: 10000 });

    const approveBtn = page.getByRole('button', { name: /Approve & Authorize Publishing/i });
    await approveBtn.click();
    await expect(page.getByText(/Decision recorded: Course has been marked APPROVED/i)).toBeVisible();

    // Mark as published for student discovery
    courseStore.status = 'PUBLISHED';

    // 3. Student Portal: Learning Hub Catalog Discovery & Course View
    await page.addInitScript(() => {
      window.localStorage.setItem('skillority_token', 'mock-student-jwt');
      window.localStorage.setItem('user', JSON.stringify({
        id: 'stud_e2e_1',
        email: 'student@test.com',
        role: 'STUDENT',
        profile: { firstName: 'Ada', lastName: 'Lovelace', coinsBalance: 150 },
      }));
    });

    await page.goto('/student/learn');
    await expect(page.getByText('Full-Stack Modern Next.js Architecture').first()).toBeVisible({ timeout: 10000 });

    // Navigate to course details
    await page.goto(`/student/courses/${courseStore.id}`);
    await expect(page.getByText('Foundation & Principles')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Advanced Edge Middleware')).toBeVisible();

    // Click Enroll in Course
    const enrollBtn = page.getByRole('button', { name: /Enroll in Course/i });
    await expect(enrollBtn).toBeVisible();
    await enrollBtn.click();

    // Verify Continue Learning button appears after enrollment
    await expect(page.getByRole('button', { name: /Continue Learning/i })).toBeVisible();

    // 4. Freemium Coin Unlock Verification: Unlock Chapter 6
    const unlockChapterBtn = page.getByRole('button', { name: /Unlock with 50 Coins/i }).first();
    await expect(unlockChapterBtn).toBeVisible();
    await unlockChapterBtn.click();

    // Modal opens
    await expect(page.getByText('Unlock Advanced Chapter')).toBeVisible();
    const confirmUnlockBtn = page.getByRole('button', { name: /Confirm & Unlock/i });
    await confirmUnlockBtn.click();

    // Chapter 6 is now unlocked! View Chapter button appears instead of Unlock button
    await expect(page.getByRole('button', { name: /View Chapter/i }).nth(1)).toBeVisible();
  });
});
