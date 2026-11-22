import prisma from '../config/database.js';

export async function getUserConversations(userId) {
  // Aggregate recent messages by conversationId with bounded limit to prevent memory exhaustion
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { recipientId: userId }],
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      sender: { select: { id: true, profile: true } },
    },
  });

  const conversationMap = new Map();
  messages.forEach(msg => {
    if (!conversationMap.has(msg.conversationId.toString())) {
      conversationMap.set(msg.conversationId.toString(), msg);
    }
  });

  return Array.from(conversationMap.values());
}

export async function getConversationMessages(userId, conversationId) {
  return prisma.message.findMany({
    where: {
      conversationId,
      OR: [{ senderId: userId }, { recipientId: userId }],
    },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: { select: { id: true, profile: true } },
    },
  });
}

export async function sendMessage(senderId, conversationId, recipientId, content) {
  if (senderId === recipientId) {
    const err = new Error('CANNOT_MESSAGE_SELF');
    err.statusCode = 400;
    throw err;
  }

  // Prevent thread injection / IDOR: if conversation already exists, verify sender is participant
  const existingMsg = await prisma.message.findFirst({
    where: { conversationId },
  });

  if (existingMsg) {
    const isParticipant = existingMsg.senderId === senderId || existingMsg.recipientId === senderId;
    if (!isParticipant) {
      const err = new Error('FORBIDDEN_NOT_PARTICIPANT');
      err.statusCode = 403;
      throw err;
    }
  }

  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      recipientId,
      content,
      isRead: false,
    },
  });
}

export async function getUserNotifications(userId) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function markNotificationAsRead(userId, notificationId) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
}
