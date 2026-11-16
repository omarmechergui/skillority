import prisma from '../config/database.js';

export async function listUsers({ role, isActive, search, page = 1, limit = 20 }) {
  const where = {};
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive === 'true' || isActive === true;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { firstName: { contains: search, mode: 'insensitive' } } },
      { profile: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        profile: true,
      },
    }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function updateUserStatus(userId, { isActive }) {
  // If deactivating, increment tokenVersion to immediately revoke all active JWT sessions
  return prisma.user.update({
    where: { id: userId },
    data: {
      isActive,
      ...(isActive === false ? { tokenVersion: { increment: 1 } } : {}),
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      tokenVersion: true,
    },
  });
}

export async function getCourseReviewQueue() {
  return prisma.course.findMany({
    where: { status: 'PENDING_REVIEW' },
    include: {
      instructor: { select: { email: true, profile: true } },
      chapters: {
        include: {
          lessons: { select: { id: true, title: true, order: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getPlatformStatistics() {
  const [totalUsers, totalStudents, totalInstructors, totalCompanies, totalCourses, totalEnrollments, pendingReviews] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
      prisma.user.count({ where: { role: 'COMPANY' } }),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.course.count({ where: { status: 'PENDING_REVIEW' } }),
    ]);

  return {
    users: { total: totalUsers, students: totalStudents, instructors: totalInstructors, companies: totalCompanies },
    courses: { total: totalCourses, pendingReview: pendingReviews },
    enrollments: { total: totalEnrollments },
  };
}
