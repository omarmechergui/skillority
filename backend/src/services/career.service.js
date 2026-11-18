import prisma from '../config/database.js';

export async function listOpportunities({ type, location, search, companyId, isOpen = true, page = 1, limit = 10 }) {
  const where = {};
  if (isOpen !== undefined) where.isOpen = isOpen;
  if (companyId) where.companyId = companyId;
  if (type) where.type = type;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, opportunities] = await Promise.all([
    prisma.opportunity.count({ where }),
    prisma.opportunity.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } },
      },
    }),
  ]);

  return { opportunities, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getOpportunityById(id) {
  return prisma.opportunity.findUnique({
    where: { id },
    include: {
      _count: { select: { applications: true } },
    },
  });
}

export async function createOpportunity(companyId, data) {
  return prisma.opportunity.create({
    data: {
      ...data,
      companyId,
    },
  });
}

export async function applyToOpportunity(studentId, opportunityId, notes = '') {
  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opp || !opp.isOpen) throw new Error('OPPORTUNITY_NOT_AVAILABLE');

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

  return prisma.application.create({
    data: {
      studentId,
      opportunityId,
      notes,
      status: 'PENDING',
    },
  });
}

export async function getStudentApplications(studentId) {
  return prisma.application.findMany({
    where: { studentId },
    include: {
      opportunity: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCompanyApplications(companyId) {
  return prisma.application.findMany({
    where: { opportunity: { companyId } },
    include: {
      opportunity: { select: { title: true, type: true } },
      student: {
        select: {
          id: true,
          email: true,
          profile: true,
          certificates: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateApplicationStatus(applicationId, companyId, status, notes) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { opportunity: true },
  });
  if (!app) return null;
  if (app.opportunity.companyId !== companyId) throw new Error('FORBIDDEN_NOT_OWNER');

  return prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      notes: notes !== undefined ? notes : app.notes,
    },
  });
}
