import prisma from '../config/database.js';

export async function getProfileByUserId(userId) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });
  return profile;
}

export async function updateProfile(userId, updateData) {
  const existing = await prisma.profile.findUnique({ where: { userId } });
  if (!existing) {
    return prisma.profile.create({
      data: {
        userId,
        firstName: updateData.firstName || 'User',
        lastName: updateData.lastName || '',
        ...updateData,
      },
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
    });
  }

  return prisma.profile.update({
    where: { userId },
    data: updateData,
    include: {
      user: { select: { id: true, email: true, role: true } },
    },
  });
}
