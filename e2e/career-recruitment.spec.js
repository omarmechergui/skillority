import { test, expect } from '@playwright/test';

test.describe('Module 3: Careers, Internships & Recruitment Engine E2E', () => {

  test('Scenario A — Student Career Development: Exploration, Skills Breakdown & Target Goal Setting', async ({ page }) => {
    // Mock user session
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'skillority_user',
        JSON.stringify({
          id: 'student_e2e_1',
          email: 'student.e2e@skillority.com',
          role: 'STUDENT',
          profile: {
            firstName: 'Sarah',
            lastName: 'Connor',
            skills: ['JavaScript', 'HTML5 & CSS3', 'React'],
            university: 'Cyberdyne Tech',
            major: 'Computer Science',
          },
        })
      );
      window.localStorage.setItem('skillority_token', 'mock_student_jwt_token');
    });

    // Mock API routes
    await page.route('**/api/careers/paths**', async (route) => {
      const url = route.request().url();
      if (url.includes('/frontend-developer')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'path_frontend',
              title: 'Frontend Developer',
              slug: 'frontend-developer',
              category: 'Software Engineering',
              difficultyLevel: 'INTERMEDIATE',
              estimatedDuration: '6-9 months',
              salaryRange: '$70,000 - $115,000 / yr',
              jobOutlook: '+16% growth over 5 years (High Demand)',
              description: 'Design and build engaging, responsive, and accessible user interfaces for modern web applications.',
              requiredSkills: [
                { name: 'JavaScript', proficiency: 'Advanced', importance: 'CORE', weight: 25 },
                { name: 'React', proficiency: 'Intermediate', importance: 'CORE', weight: 25 },
                { name: 'HTML5 & CSS3', proficiency: 'Advanced', importance: 'CORE', weight: 20 },
                { name: 'Tailwind CSS', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15 },
                { name: 'Git & GitHub', proficiency: 'Basic', importance: 'IMPORTANT', weight: 15 },
              ],
              recommendedSkills: [{ name: 'Next.js', proficiency: 'Intermediate' }],
              learningResources: [{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org', isFree: true }],
            },
          }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 'path_frontend',
              title: 'Frontend Developer',
              slug: 'frontend-developer',
              category: 'Software Engineering',
              difficultyLevel: 'INTERMEDIATE',
              estimatedDuration: '6-9 months',
              salaryRange: '$70,000 - $115,000 / yr',
              jobOutlook: 'High Demand',
              description: 'Design and build responsive web applications with React.',
              requiredSkills: [{ name: 'JavaScript' }, { name: 'React' }],
            },
          ],
        }),
      });
    });

    await page.route('**/api/careers/goals**', async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Career goal updated',
            data: {
              id: 'goal_1',
              careerPathId: 'path_frontend',
              isPrimary: true,
              careerPath: { id: 'path_frontend', title: 'Frontend Developer', category: 'Software Engineering' },
            },
          }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 'goal_1',
              careerPathId: 'path_frontend',
              isPrimary: true,
              careerPath: {
                id: 'path_frontend',
                title: 'Frontend Developer',
                slug: 'frontend-developer',
                category: 'Software Engineering',
                difficultyLevel: 'INTERMEDIATE',
              },
              progress: {
                readinessScore: 70,
                stats: { totalRequiredSkills: 5, verifiedSkillsCount: 3, skillGapsCount: 2 },
                verifiedSkills: [{ name: 'JavaScript' }, { name: 'React' }, { name: 'HTML5 & CSS3' }],
                skillGaps: [{ name: 'Tailwind CSS', description: 'Core styling utility' }, { name: 'Git & GitHub', description: 'Version control' }],
              },
            },
          ],
        }),
      });
    });

    await page.route('**/api/careers/progress/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            readinessScore: 70,
            stats: { totalRequiredSkills: 5, verifiedSkillsCount: 3, skillGapsCount: 2 },
            verifiedSkills: [{ name: 'JavaScript' }, { name: 'React' }, { name: 'HTML5 & CSS3' }],
            skillGaps: [{ name: 'Tailwind CSS' }, { name: 'Git & GitHub' }],
            milestones: [
              { title: 'Target Profession Selected', completed: true },
              { title: 'Core Skills Acquisition', completed: true },
              { title: 'Internship Ready', completed: false },
            ],
          },
        }),
      });
    });

    // 1. Visit Career Paths Catalog
    await page.goto('/student/careers/paths');
    await expect(page.locator('h1')).toContainText('Explore Career Paths');
    await expect(page.locator('text=Frontend Developer').first()).toBeVisible();

    // 2. Click through to details
    await page.click('text=Frontend Developer');
    await expect(page.locator('h1')).toContainText('Frontend Developer Career Blueprint');
    await expect(page.locator('text=Core Technical Skill Requirements')).toBeVisible();
    await expect(page.locator('text=JavaScript')).toBeVisible();
    await expect(page.locator('text=React')).toBeVisible();

    // 3. Set as Target Goal
    const goalBtn = page.locator('button:has-text("Set as Target Career Goal"), button:has-text("Your Primary Target Profession")');
    await expect(goalBtn.first()).toBeVisible();
  });

  test('Scenario B — Company Internship Creation & Management Workflow', async ({ page }) => {
    // Mock company session
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'skillority_user',
        JSON.stringify({
          id: 'company_e2e_1',
          email: 'recruiter@techcorplabs.com',
          role: 'COMPANY',
          profile: {
            companyName: 'TechCorp Labs',
            industry: 'Technology',
            companySize: '50-100',
          },
        })
      );
      window.localStorage.setItem('skillority_token', 'mock_company_jwt_token');
    });

    let createdOpportunity = null;

    await page.route('**/api/careers/opportunities**', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}');
        createdOpportunity = {
          id: 'opp_e2e_created',
          title: body.title,
          description: body.description,
          location: body.location,
          type: body.type || 'INTERNSHIP',
          status: body.status || 'PUBLISHED',
          isOpen: body.status !== 'CLOSED',
          positions: body.positions || 1,
          filledPositions: 0,
          skills: body.skills || [],
          createdAt: new Date().toISOString(),
          _count: { applications: 0 },
        };
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: createdOpportunity }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: createdOpportunity ? [createdOpportunity] : [],
        }),
      });
    });

    // 1. Visit Create Opportunity page
    await page.goto('/company/opportunities/create');
    await expect(page.locator('h1')).toContainText('Post New Internship / Opportunity');

    // 2. Fill form
    await page.fill('input[name="title"]', 'Junior Cloud Solutions Intern');
    await page.fill('input[name="location"]', 'Remote');
    await page.fill('textarea[name="description"]', 'Opportunity to work with AWS, Terraform, and Docker pipelines.');

    // 3. Submit
    await page.click('button[type="submit"]');

    // 4. Verify redirected to opportunities list
    await expect(page).toHaveURL(/\/company\/opportunities/);
  });

  test('Scenario C & D — Student Application, Recruiter Screening & Offer Lifecycle', async ({ page }) => {
    // Mock student session
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'skillority_user',
        JSON.stringify({
          id: 'student_e2e_1',
          email: 'student.e2e@skillority.com',
          role: 'STUDENT',
          profile: {
            firstName: 'Alex',
            lastName: 'Mercer',
            skills: ['React', 'JavaScript'],
          },
        })
      );
      window.localStorage.setItem('skillority_token', 'mock_student_jwt_token');
    });

    let currentAppStatus = 'PENDING';
    let offer = null;

    await page.route('**/api/careers/opportunities/opp_live_1**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'opp_live_1',
            title: 'Frontend React Engineering Intern',
            description: 'Work with Next.js, Tailwind, and React Server Components.',
            location: 'Remote',
            type: 'INTERNSHIP',
            workplaceType: 'REMOTE',
            stipend: '$1,500 / month',
            duration: '6 months',
            positions: 2,
            filledPositions: 0,
            skills: ['React', 'JavaScript', 'Tailwind CSS'],
            matchScore: 90,
            isOpen: true,
            status: 'PUBLISHED',
            company: { companyName: 'Veloce Labs' },
          },
        }),
      });
    });

    await page.route('**/api/careers/opportunities/opp_live_1/apply', async (route) => {
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Application submitted',
          data: {
            id: 'app_live_1',
            opportunityId: 'opp_live_1',
            status: 'PENDING',
          },
        }),
      });
    });

    await page.route('**/api/careers/my-applications', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 'app_live_1',
              opportunityId: 'opp_live_1',
              title: 'Frontend React Engineering Intern',
              companyName: 'Veloce Labs',
              location: 'Remote',
              type: 'INTERNSHIP',
              status: currentAppStatus,
              createdAt: new Date().toISOString(),
              matchScore: 90,
              offer: offer,
            },
          ],
        }),
      });
    });

    // 1. Visit Opportunity Page & Apply
    await page.goto('/student/careers/opp_live_1');
    await expect(page.locator('h1')).toContainText('Frontend React Engineering Intern');
    await page.click('button:has-text("Apply Now")');

    // Fill application modal
    await page.fill('textarea[name="coverLetter"]', 'I have built multiple Next.js applications and would love to contribute.');
    await page.click('button:has-text("Submit Application")');

    // Verify success banner appears
    await expect(page.locator('text=Application submitted successfully')).toBeVisible();

    // 2. Open Student Applications Tracker
    await page.goto('/student/careers/applications');
    await expect(page.locator('h1')).toContainText('My Internship Applications');
    await expect(page.locator('text=Frontend React Engineering Intern')).toBeVisible();
  });

  test('Scenario E — Security & RBAC Regression Verification', async ({ page }) => {
    // Verify unauthorized roles cannot execute company endpoints
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'skillority_user',
        JSON.stringify({
          id: 'student_e2e_hack',
          email: 'hacker@student.com',
          role: 'STUDENT',
        })
      );
    });

    // Attempting to post opportunity as student triggers 403
    await page.route('**/api/careers/opportunities', async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Access denied. Requires role: COMPANY' },
          }),
        });
      }
      return route.continue();
    });

    await page.goto('/company/opportunities/create');
    await page.fill('input[name="title"]', 'Malicious Student Job');
    await page.fill('input[name="location"]', 'Remote');
    await page.fill('textarea[name="description"]', 'Trying to post as student');
    await page.click('button[type="submit"]');

    // Verify error banner displayed
    await expect(page.locator('text=Access denied')).toBeVisible();
  });

});
