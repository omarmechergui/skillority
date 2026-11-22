import prisma from '../config/database.js';
import { INITIAL_CAREER_PATHS } from '../data/careerPaths.data.js';
import { calculateOpportunityMatch, calculateCareerProgress } from './matching.service.js';

// ============================================================================
// HELPER: AUDIT TIMELINE & NOTIFICATIONS
// ============================================================================

async function recordTimeline({ applicationId, action, fromStatus, toStatus, note, performedById, performedByRole }) {
  try {
    return await prisma.applicationTimeline.create({
      data: {
        applicationId,
        action,
        fromStatus: fromStatus || null,
        toStatus: toStatus || null,
        note: note || null,
        performedById: performedById || null,
        performedByRole: performedByRole || null,
      },
    });
  } catch (err) {
    // Non-blocking timeline audit
    return null;
  }
}

async function sendNotification({ userId, title, message, type = 'RECRUITMENT', linkUrl = null }) {
  if (!userId) return null;
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        linkUrl,
        isRead: false,
      },
    });
  } catch (err) {
    return null;
  }
}

// ============================================================================
// MODULE 3A: CAREER PATHS & STUDENT CAREER GOALS
// ============================================================================

/**
 * List active career paths with optional category/difficulty filters and text search.
 * Seeds initial catalog automatically if database has 0 career paths.
 */
export async function listCareerPaths({ category, difficulty, search, page = 1, limit = 20 } = {}) {
  const count = await prisma.careerPath.count();
  if (count === 0) {
    // Seed default career paths into MongoDB
    for (const p of INITIAL_CAREER_PATHS) {
      try {
        await prisma.careerPath.create({ data: p });
      } catch (e) {
        // Ignore duplicate slug races
      }
    }
  }

  const where = { isActive: true };
  if (category && category !== 'ALL') where.category = category;
  if (difficulty && difficulty !== 'ALL') where.difficultyLevel = difficulty;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, paths] = await Promise.all([
    prisma.careerPath.count({ where }),
    prisma.careerPath.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { title: 'asc' },
    }),
  ]);

  return { paths, total, page, limit, totalPages: Math.ceil(total / limit) };
}

/**
 * Get career path by unique slug.
 */
export async function getCareerPathBySlug(slug) {
  let path = await prisma.careerPath.findUnique({
    where: { slug },
  });

  if (!path) {
    // Check if it's in the initial dataset and seed it on demand
    const initial = INITIAL_CAREER_PATHS.find((p) => p.slug === slug);
    if (initial) {
      try {
        path = await prisma.careerPath.create({ data: initial });
      } catch {
        path = await prisma.careerPath.findUnique({ where: { slug } });
      }
    }
  }

  return path;
}

/**
 * Admin: Create career path
 */
export async function createCareerPath(data) {
  return prisma.careerPath.create({ data });
}

/**
 * Admin: Update career path
 */
export async function updateCareerPath(id, data) {
  return prisma.careerPath.update({
    where: { id },
    data,
  });
}

/**
 * Admin: Delete / Toggle career path
 */
export async function deleteCareerPath(id) {
  return prisma.careerPath.update({
    where: { id },
    data: { isActive: false },
  });
}

/**
 * Student: Get my targeted career goals (primary and secondary)
 */
export async function getStudentCareerGoals(studentId) {
  const goals = await prisma.studentCareerGoal.findMany({
    where: { studentId },
    include: { careerPath: true },
    orderBy: { isPrimary: 'desc' },
  });

  // Calculate real progress for each selected career goal
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      profile: true,
      enrollments: true,
      certificates: true,
    },
  });

  return goals.map((goal) => {
    const progress = calculateCareerProgress(student, goal.careerPath);
    return {
      ...goal,
      progress,
    };
  });
}

/**
 * Student: Set or update target career goal
 */
export async function setStudentCareerGoal(studentId, { careerPathId, isPrimary = true, targetDate, notes }) {
  // If setting this goal as primary, demote any other existing primary goals
  if (isPrimary) {
    await prisma.studentCareerGoal.updateMany({
      where: { studentId },
      data: { isPrimary: false },
    });
  }

  const existing = await prisma.studentCareerGoal.findUnique({
    where: {
      studentId_careerPathId: {
        studentId,
        careerPathId,
      },
    },
  });

  if (existing) {
    return prisma.studentCareerGoal.update({
      where: { id: existing.id },
      data: {
        isPrimary,
        targetDate: targetDate ? new Date(targetDate) : existing.targetDate,
        notes: notes !== undefined ? notes : existing.notes,
      },
      include: { careerPath: true },
    });
  }

  return prisma.studentCareerGoal.create({
    data: {
      studentId,
      careerPathId,
      isPrimary,
      targetDate: targetDate ? new Date(targetDate) : null,
      notes,
    },
    include: { careerPath: true },
  });
}

/**
 * Student: Remove career goal
 */
export async function removeStudentCareerGoal(studentId, careerPathId) {
  const existing = await prisma.studentCareerGoal.findUnique({
    where: {
      studentId_careerPathId: {
        studentId,
        careerPathId,
      },
    },
  });
  if (!existing) return null;

  return prisma.studentCareerGoal.delete({
    where: { id: existing.id },
  });
}

/**
 * Student: Calculate detailed progress towards a specific career path
 */
export async function getCareerProgressForStudent(studentId, careerPathId) {
  const [student, careerPath] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId },
      include: {
        profile: true,
        enrollments: true,
        certificates: true,
      },
    }),
    prisma.careerPath.findUnique({ where: { id: careerPathId } }),
  ]);

  if (!careerPath) throw new Error('CAREER_PATH_NOT_FOUND');
  return calculateCareerProgress(student, careerPath);
}

// ============================================================================
// MODULE 3B: INTERNSHIP MARKETPLACE & CRUD
// ============================================================================

/**
 * List opportunities with advanced filtering (category, workplaceType, skills, location, search, sorting)
 */
export async function listOpportunities({
  type,
  category,
  workplaceType,
  skills,
  location,
  search,
  companyId,
  status,
  isOpen,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 10,
  currentStudentId = null,
} = {}) {
  const where = {};

  if (isOpen !== undefined) {
    where.isOpen = isOpen;
  }
  if (status) {
    where.status = status;
  } else if (!companyId) {
    // Public marketplace only shows PUBLISHED roles
    where.status = 'PUBLISHED';
    where.isOpen = true;
  }

  if (companyId) where.companyId = companyId;
  if (type && type !== 'All Types' && type !== 'ALL') where.type = type;
  if (category && category !== 'ALL') where.category = category;
  if (workplaceType && workplaceType !== 'All Workplaces' && workplaceType !== 'ALL') {
    where.workplaceType = workplaceType.toUpperCase();
  }
  if (location && location !== 'ALL') {
    where.location = { contains: location, mode: 'insensitive' };
  }
  if (skills) {
    const skillList = Array.isArray(skills) ? skills : [skills];
    where.skills = { hasSome: skillList };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy = {};
  orderBy[sortBy] = sortOrder;

  const [total, rawOpportunities] = await Promise.all([
    prisma.opportunity.count({ where }),
    prisma.opportunity.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        _count: { select: { applications: true } },
        company: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
    }),
  ]);

  // If a student is requesting the feed, compute real explainable match score
  let student = null;
  if (currentStudentId) {
    student = await prisma.user.findUnique({
      where: { id: currentStudentId },
      include: {
        profile: true,
        enrollments: true,
        certificates: true,
        careerGoals: { include: { careerPath: true } },
      },
    });
  }

  const opportunities = rawOpportunities.map((opp) => {
    let match = null;
    if (student) {
      match = calculateOpportunityMatch(student, opp);
    }

    return {
      ...opp,
      company: {
        id: opp.companyId,
        companyName: opp.company?.profile?.companyName || 'Verified Partner',
        logoUrl: opp.company?.profile?.avatar || null,
        location: opp.location,
        industry: opp.company?.profile?.industry || opp.industry || 'Technology',
        isVerified: true,
      },
      matchScore: match ? match.score : null,
      matchExplanation: match || null,
    };
  });

  return { opportunities, total, page, limit, totalPages: Math.ceil(total / limit) };
}

/**
 * Get opportunity by ID with company profile, application stats, and student match details.
 */
export async function getOpportunityById(id, currentStudentId = null) {
  const opp = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      _count: { select: { applications: true } },
      company: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
  });

  if (!opp) return null;

  let match = null;
  let hasApplied = false;
  if (currentStudentId) {
    const [student, app] = await Promise.all([
      prisma.user.findUnique({
        where: { id: currentStudentId },
        include: {
          profile: true,
          enrollments: true,
          certificates: true,
          careerGoals: { include: { careerPath: true } },
        },
      }),
      prisma.application.findUnique({
        where: {
          opportunityId_studentId: {
            opportunityId: id,
            studentId: currentStudentId,
          },
        },
      }),
    ]);
    if (student) {
      match = calculateOpportunityMatch(student, opp);
    }
    hasApplied = Boolean(app);
  }

  return {
    ...opp,
    company: {
      id: opp.companyId,
      companyName: opp.company?.profile?.companyName || 'Verified Partner',
      logoUrl: opp.company?.profile?.avatar || null,
      website: opp.company?.profile?.website || null,
      description: opp.company?.profile?.companyDescription || '',
      industry: opp.company?.profile?.industry || opp.industry || 'Technology',
      companySize: opp.company?.profile?.companySize || 'Growing Team',
      location: opp.location,
    },
    matchScore: match ? match.score : 85,
    matchExplanation: match,
    hasApplied,
  };
}

/**
 * Company: Create internship / opportunity
 */
export async function createOpportunity(companyId, data) {
  const publishedAt = data.status === 'PUBLISHED' || data.status === undefined ? new Date() : null;
  const isOpen = data.status === 'CLOSED' ? false : true;

  return prisma.opportunity.create({
    data: {
      ...data,
      companyId,
      isOpen,
      publishedAt,
    },
  });
}

/**
 * Company: Update internship
 */
export async function updateOpportunity(id, companyId, data) {
  const existing = await prisma.opportunity.findUnique({ where: { id } });
  if (!existing) return null;
  if (existing.companyId !== companyId) throw new Error('FORBIDDEN_NOT_OWNER');

  const updateData = { ...data };
  if (data.status === 'CLOSED') {
    updateData.isOpen = false;
  } else if (data.status === 'PUBLISHED') {
    updateData.isOpen = true;
    if (!existing.publishedAt) updateData.publishedAt = new Date();
  }

  return prisma.opportunity.update({
    where: { id },
    data: updateData,
  });
}

/**
 * Company: Close opportunity
 */
export async function closeOpportunity(id, companyId) {
  return updateOpportunity(id, companyId, { status: 'CLOSED', isOpen: false });
}

// ============================================================================
// MODULE 3C: STUDENT APPLICATION SYSTEM
// ============================================================================

/**
 * Apply to opportunity with validation, duplicate prevention, and matching score computation.
 */
export async function applyToOpportunity(studentId, opportunityId, applicationPayload = {}) {
  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opp) throw new Error('OPPORTUNITY_NOT_FOUND');
  if (!opp.isOpen || opp.status === 'CLOSED') throw new Error('OPPORTUNITY_CLOSED');

  // Check deadline
  if (opp.deadline && new Date() > new Date(opp.deadline)) {
    throw new Error('APPLICATION_DEADLINE_PASSED');
  }

  // Check capacity
  if (opp.filledPositions >= opp.positions) {
    throw new Error('POSITIONS_FULL');
  }

  // Check duplicate
  const existing = await prisma.application.findUnique({
    where: {
      opportunityId_studentId: {
        opportunityId,
        studentId,
      },
    },
  });
  if (existing) {
    const error = new Error('ALREADY_APPLIED');
    error.code = 'ALREADY_APPLIED';
    throw error;
  }

  // Calculate matching score
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      profile: true,
      enrollments: true,
      certificates: true,
      careerGoals: { include: { careerPath: true } },
    },
  });

  const match = calculateOpportunityMatch(student, opp);

  const {
    notes,
    coverLetter,
    resumeUrl,
    portfolioUrl,
    githubUrl,
    linkedinUrl,
    candidateSkills = student?.profile?.skills || [],
    answers,
  } = applicationPayload;

  const app = await prisma.application.create({
    data: {
      studentId,
      opportunityId,
      status: 'PENDING',
      notes: notes || coverLetter || '',
      coverLetter: coverLetter || notes || '',
      resumeUrl: resumeUrl || null,
      portfolioUrl: portfolioUrl || null,
      githubUrl: githubUrl || null,
      linkedinUrl: linkedinUrl || null,
      answers: answers || null,
      candidateSkills,
      matchScore: match.score,
      matchAnalysis: match,
    },
    include: {
      opportunity: true,
    },
  });

  // Record audit timeline
  await recordTimeline({
    applicationId: app.id,
    action: 'APPLICATION_SUBMITTED',
    toStatus: 'PENDING',
    note: 'Candidate submitted application',
    performedById: studentId,
    performedByRole: 'STUDENT',
  });

  // Notify company
  await sendNotification({
    userId: opp.companyId,
    title: 'New Candidate Application',
    message: `A candidate has applied to "${opp.title}" with a ${match.score}% match score.`,
    type: 'APPLICATION_RECEIVED',
    linkUrl: `/company/applications/${app.id}`,
  });

  return app;
}

/**
 * Student: View all submitted applications with status, timelines, and sanitized evaluations.
 */
export async function getStudentApplications(studentId) {
  const apps = await prisma.application.findMany({
    where: { studentId },
    include: {
      opportunity: {
        include: {
          company: {
            select: {
              id: true,
              profile: true,
            },
          },
        },
      },
      interviews: {
        orderBy: { scheduledAt: 'asc' },
      },
      offer: true,
      timeline: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Sanitize private internal evaluations
  return apps.map((app) => ({
    id: app.id,
    opportunityId: app.opportunityId,
    title: app.opportunity?.title,
    type: app.opportunity?.type,
    location: app.opportunity?.location,
    companyName: app.opportunity?.company?.profile?.companyName || 'Verified Partner',
    companyLogo: app.opportunity?.company?.profile?.avatar || null,
    status: app.status,
    notes: app.notes,
    coverLetter: app.coverLetter,
    resumeUrl: app.resumeUrl,
    portfolioUrl: app.portfolioUrl,
    candidateSkills: app.candidateSkills,
    matchScore: app.matchScore,
    matchAnalysis: app.matchAnalysis,
    interviews: app.interviews.map((inv) => ({
      id: inv.id,
      scheduledAt: inv.scheduledAt,
      timezone: inv.timezone,
      interviewType: inv.interviewType,
      meetingLink: inv.meetingLink,
      location: inv.location,
      instructions: inv.instructions,
      status: inv.status,
    })),
    offer: app.offer
      ? {
          id: app.offer.id,
          title: app.offer.title,
          stipend: app.offer.stipend,
          startDate: app.offer.startDate,
          duration: app.offer.duration,
          conditions: app.offer.conditions,
          expiresAt: app.offer.expiresAt,
          status: app.offer.status,
        }
      : null,
    timeline: app.timeline,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  }));
}

/**
 * Student: Withdraw application (business rules: cannot withdraw if already ACCEPTED or REJECTED)
 */
export async function withdrawApplication(studentId, applicationId, reason = '') {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { opportunity: true },
  });

  if (!app) return null;
  if (app.studentId !== studentId) throw new Error('FORBIDDEN_NOT_OWNER');
  if (app.status === 'ACCEPTED' || app.status === 'REJECTED' || app.status === 'WITHDRAWN') {
    throw new Error('CANNOT_WITHDRAW');
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: 'WITHDRAWN',
      withdrawnAt: new Date(),
      notes: reason ? `${app.notes || ''} [Withdrawn: ${reason}]` : app.notes,
    },
  });

  await recordTimeline({
    applicationId,
    action: 'APPLICATION_WITHDRAWN',
    fromStatus: app.status,
    toStatus: 'WITHDRAWN',
    note: reason || 'Withdrawn by candidate',
    performedById: studentId,
    performedByRole: 'STUDENT',
  });

  await sendNotification({
    userId: app.opportunity.companyId,
    title: 'Candidate Withdrew Application',
    message: `A candidate has withdrawn their application for "${app.opportunity.title}".`,
    type: 'APPLICATION_WITHDRAWN',
    linkUrl: `/company/opportunities/${app.opportunityId}`,
  });

  return updated;
}

// ============================================================================
// MODULE 3D: COMPANY RECRUITMENT MANAGEMENT
// ============================================================================

/**
 * Company Recruitment Dashboard Metrics
 */
export async function getCompanyRecruitmentDashboardMetrics(companyId) {
  const [
    totalOpportunities,
    publishedOpportunities,
    draftOpportunities,
    closedOpportunities,
    applications,
    interviewsCount,
  ] = await Promise.all([
    prisma.opportunity.count({ where: { companyId } }),
    prisma.opportunity.count({ where: { companyId, status: 'PUBLISHED', isOpen: true } }),
    prisma.opportunity.count({ where: { companyId, status: 'DRAFT' } }),
    prisma.opportunity.count({ where: { companyId, status: 'CLOSED' } }),
    prisma.application.findMany({
      where: { opportunity: { companyId } },
      select: { status: true },
    }),
    prisma.interview.count({
      where: { companyId, status: 'SCHEDULED' },
    }),
  ]);

  const totalApplications = applications.length;
  const pendingReviewCount = applications.filter((a) => a.status === 'PENDING' || a.status === 'REVIEWING').length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const acceptedCount = applications.filter((a) => a.status === 'ACCEPTED').length;

  return {
    totalOpportunities,
    publishedOpportunities,
    draftOpportunities,
    closedOpportunities,
    totalApplications,
    pendingReviewCount,
    shortlistedCount,
    upcomingInterviewsCount: interviewsCount,
    acceptedCount,
  };
}

/**
 * Company: List applicants with filtering by opportunity, status, search
 */
export async function getCompanyApplications(companyId, { opportunityId, status, search, page = 1, limit = 50 } = {}) {
  const where = {
    opportunity: { companyId },
  };

  if (opportunityId) where.opportunityId = opportunityId;
  if (status && status !== 'ALL') where.status = status;

  if (search) {
    where.OR = [
      { student: { profile: { firstName: { contains: search, mode: 'insensitive' } } } },
      { student: { profile: { lastName: { contains: search, mode: 'insensitive' } } } },
      { opportunity: { title: { contains: search, mode: 'insensitive' } } },
    ];
  }

  return prisma.application.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      opportunity: {
        select: {
          id: true,
          title: true,
          type: true,
          category: true,
          positions: true,
          filledPositions: true,
          skills: true,
        },
      },
      student: {
        select: {
          id: true,
          email: true,
          profile: true,
          certificates: true,
          enrollments: {
            where: { isCompleted: true },
            select: { id: true, courseId: true, isCompleted: true },
          },
        },
      },
      interviews: {
        orderBy: { scheduledAt: 'desc' },
      },
      offer: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Company: View full applicant detail with private evaluation and full profile
 */
export async function getCompanyApplicationDetails(applicationId, companyId) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      opportunity: true,
      student: {
        select: {
          id: true,
          email: true,
          profile: true,
          certificates: true,
          enrollments: {
            include: {
              course: {
                select: { id: true, title: true, category: true, level: true },
              },
            },
          },
          careerGoals: {
            include: { careerPath: true },
          },
        },
      },
      interviews: {
        orderBy: { scheduledAt: 'desc' },
      },
      offer: true,
      timeline: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!app) return null;
  if (app.opportunity.companyId !== companyId) throw new Error('FORBIDDEN_NOT_OWNER');

  return app;
}

/**
 * Company: Evaluate candidate (Private notes, 1-5 rating, rejection reason)
 */
export async function evaluateCandidate(applicationId, companyId, { internalNotes, rating, rejectionReason, notes }) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { opportunity: true },
  });

  if (!app) return null;
  if (app.opportunity.companyId !== companyId) throw new Error('FORBIDDEN_NOT_OWNER');

  const updateData = {};
  if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
  if (rating !== undefined) updateData.rating = rating;
  if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
  if (notes !== undefined) updateData.notes = notes;

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: updateData,
  });

  await recordTimeline({
    applicationId,
    action: 'CANDIDATE_EVALUATED',
    note: rating ? `Rating: ${rating} stars. Evaluation recorded.` : 'Internal recruiter evaluation updated',
    performedById: companyId,
    performedByRole: 'COMPANY',
  });

  return updated;
}

/**
 * Company: Update application status with state transition validation
 */
export async function updateApplicationStatus(applicationId, companyId, nextStatus, notes = null, internalNotes = null) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { opportunity: true },
  });

  if (!app) return null;
  if (app.opportunity.companyId !== companyId) throw new Error('FORBIDDEN_NOT_OWNER');

  const prevStatus = app.status;

  // Validate state transitions
  if (prevStatus === 'WITHDRAWN') {
    throw new Error('APPLICATION_ALREADY_WITHDRAWN');
  }

  const updateData = {
    status: nextStatus,
  };
  if (notes !== null && notes !== undefined) updateData.notes = notes;
  if (internalNotes !== null && internalNotes !== undefined) updateData.internalNotes = internalNotes;

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: updateData,
  });

  // Record audit timeline
  await recordTimeline({
    applicationId,
    action: `STATUS_CHANGED_TO_${nextStatus}`,
    fromStatus: prevStatus,
    toStatus: nextStatus,
    note: notes || `Application moved to ${nextStatus}`,
    performedById: companyId,
    performedByRole: 'COMPANY',
  });

  // Notify student
  await sendNotification({
    userId: app.studentId,
    title: 'Application Status Update',
    message: `Your application for "${app.opportunity.title}" was updated to: ${nextStatus}.`,
    type: 'APPLICATION_STATUS_UPDATED',
    linkUrl: `/student/careers/applications`,
  });

  return updated;
}

// ============================================================================
// MODULE 3F: INTERVIEWS & OFFERS WORKFLOW
// ============================================================================

/**
 * Company: Schedule an interview with an applicant
 */
export async function scheduleInterview(companyId, applicationId, data) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { opportunity: true },
  });

  if (!app) throw new Error('APPLICATION_NOT_FOUND');
  if (app.opportunity.companyId !== companyId) throw new Error('FORBIDDEN_NOT_OWNER');

  const interview = await prisma.interview.create({
    data: {
      applicationId,
      opportunityId: app.opportunityId,
      studentId: app.studentId,
      companyId,
      scheduledAt: new Date(data.scheduledAt),
      timezone: data.timezone || 'UTC',
      interviewType: data.interviewType || 'TECHNICAL',
      meetingLink: data.meetingLink || null,
      location: data.location || null,
      instructions: data.instructions || null,
      status: 'SCHEDULED',
    },
  });

  // Automatically promote application status to INTERVIEW if not already
  if (app.status !== 'INTERVIEW') {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'INTERVIEW' },
    });
  }

  await recordTimeline({
    applicationId,
    action: 'INTERVIEW_SCHEDULED',
    fromStatus: app.status,
    toStatus: 'INTERVIEW',
    note: `Interview scheduled for ${new Date(data.scheduledAt).toUTCString()}`,
    performedById: companyId,
    performedByRole: 'COMPANY',
  });

  await sendNotification({
    userId: app.studentId,
    title: 'Interview Invitation Scheduled',
    message: `You have an interview scheduled for "${app.opportunity.title}" on ${new Date(data.scheduledAt).toLocaleDateString()}.`,
    type: 'INTERVIEW_INVITATION',
    linkUrl: '/student/careers/applications',
  });

  return interview;
}

/**
 * Company: Update or Reschedule Interview
 */
export async function updateInterview(interviewId, companyId, data) {
  const inv = await prisma.interview.findUnique({ where: { id: interviewId } });
  if (!inv) return null;
  if (inv.companyId !== companyId) throw new Error('FORBIDDEN_NOT_OWNER');

  const updateData = { ...data };
  if (data.scheduledAt) updateData.scheduledAt = new Date(data.scheduledAt);

  const updated = await prisma.interview.update({
    where: { id: interviewId },
    data: updateData,
  });

  await recordTimeline({
    applicationId: inv.applicationId,
    action: data.status ? `INTERVIEW_${data.status}` : 'INTERVIEW_UPDATED',
    note: data.feedback || `Interview updated: ${data.status || 'rescheduled'}`,
    performedById: companyId,
    performedByRole: 'COMPANY',
  });

  await sendNotification({
    userId: inv.studentId,
    title: 'Interview Details Updated',
    message: `Your interview schedule or status has been updated to: ${data.status || 'Updated'}.`,
    type: 'INTERVIEW_UPDATED',
    linkUrl: '/student/careers/applications',
  });

  return updated;
}

/**
 * Company: Extend an offer to a candidate
 */
export async function createOffer(companyId, applicationId, data) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { opportunity: true, offer: true },
  });

  if (!app) throw new Error('APPLICATION_NOT_FOUND');
  if (app.opportunity.companyId !== companyId) throw new Error('FORBIDDEN_NOT_OWNER');

  // Verify capacity
  if (app.opportunity.filledPositions >= app.opportunity.positions) {
    throw new Error('POSITIONS_FULL');
  }

  if (app.offer) {
    throw new Error('OFFER_ALREADY_EXISTS');
  }

  const offer = await prisma.offer.create({
    data: {
      applicationId,
      opportunityId: app.opportunityId,
      studentId: app.studentId,
      companyId,
      title: data.title || app.opportunity.title,
      stipend: data.stipend || app.opportunity.stipend,
      startDate: data.startDate ? new Date(data.startDate) : null,
      duration: data.duration || app.opportunity.duration,
      conditions: data.conditions || null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      status: 'PENDING',
    },
  });

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: 'OFFERED' },
  });

  await recordTimeline({
    applicationId,
    action: 'OFFER_EXTENDED',
    fromStatus: app.status,
    toStatus: 'OFFERED',
    note: `Offer extended: ${offer.title}`,
    performedById: companyId,
    performedByRole: 'COMPANY',
  });

  await sendNotification({
    userId: app.studentId,
    title: 'Congratulations! Internship Offer Received',
    message: `You have received an official offer for "${app.opportunity.title}". Review and respond in your tracker.`,
    type: 'OFFER_RECEIVED',
    linkUrl: '/student/careers/applications',
  });

  return offer;
}

/**
 * Student: Respond to offer (ACCEPT or DECLINE)
 */
export async function respondToOffer(studentId, offerId, { status, declinedReason }) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      opportunity: true,
      application: true,
    },
  });

  if (!offer) return null;
  if (offer.studentId !== studentId) throw new Error('FORBIDDEN_NOT_OWNER');
  if (offer.status !== 'PENDING') throw new Error('OFFER_ALREADY_RESOLVED');

  if (status === 'ACCEPTED') {
    // Capacity check before accepting
    if (offer.opportunity.filledPositions >= offer.opportunity.positions) {
      throw new Error('POSITIONS_FULL');
    }

    // Atomically increment filled positions and update offer & application
    const [updatedOffer] = await Promise.all([
      prisma.offer.update({
        where: { id: offerId },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
        },
      }),
      prisma.application.update({
        where: { id: offer.applicationId },
        data: { status: 'ACCEPTED' },
      }),
      prisma.opportunity.update({
        where: { id: offer.opportunityId },
        data: {
          filledPositions: { increment: 1 },
        },
      }),
    ]);

    await recordTimeline({
      applicationId: offer.applicationId,
      action: 'OFFER_ACCEPTED',
      fromStatus: 'OFFERED',
      toStatus: 'ACCEPTED',
      note: 'Candidate accepted the offer.',
      performedById: studentId,
      performedByRole: 'STUDENT',
    });

    await sendNotification({
      userId: offer.companyId,
      title: 'Offer Accepted!',
      message: `Candidate has accepted the offer for "${offer.opportunity.title}".`,
      type: 'OFFER_ACCEPTED',
      linkUrl: `/company/applications/${offer.applicationId}`,
    });

    return updatedOffer;
  } else if (status === 'DECLINED') {
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: 'DECLINED',
        declinedReason: declinedReason || null,
        respondedAt: new Date(),
      },
    });

    await prisma.application.update({
      where: { id: offer.applicationId },
      data: { status: 'REJECTED' },
    });

    await recordTimeline({
      applicationId: offer.applicationId,
      action: 'OFFER_DECLINED',
      fromStatus: 'OFFERED',
      toStatus: 'REJECTED',
      note: declinedReason ? `Declined: ${declinedReason}` : 'Candidate declined the offer.',
      performedById: studentId,
      performedByRole: 'STUDENT',
    });

    await sendNotification({
      userId: offer.companyId,
      title: 'Offer Declined',
      message: `Candidate has declined the offer for "${offer.opportunity.title}".`,
      type: 'OFFER_DECLINED',
      linkUrl: `/company/applications/${offer.applicationId}`,
    });

    return updatedOffer;
  }

  throw new Error('INVALID_STATUS');
}

// ============================================================================
// MODULE 3G: ADMIN MODERATION & OVERSIGHT
// ============================================================================

/**
 * Admin: Get recruitment overview
 */
export async function getAdminRecruitmentOverview() {
  const [
    totalCareers,
    totalOpportunities,
    totalApplications,
    activeInterviews,
    acceptedOffers,
  ] = await Promise.all([
    prisma.careerPath.count(),
    prisma.opportunity.count(),
    prisma.application.count(),
    prisma.interview.count({ where: { status: 'SCHEDULED' } }),
    prisma.offer.count({ where: { status: 'ACCEPTED' } }),
  ]);

  return {
    totalCareers,
    totalOpportunities,
    totalApplications,
    activeInterviews,
    acceptedOffers,
  };
}

/**
 * Admin: Moderate opportunity (Change status, close, or toggle open)
 */
export async function moderateOpportunity(opportunityId, { status, isOpen }) {
  const updateData = {};
  if (status !== undefined) updateData.status = status;
  if (isOpen !== undefined) updateData.isOpen = isOpen;

  return prisma.opportunity.update({
    where: { id: opportunityId },
    data: updateData,
  });
}
