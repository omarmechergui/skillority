import prisma from '../config/database.js';

export async function getUserConversations(userId) {
  // Aggregate recent messages by conversationId
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { recipientId: userId }],
    },
    orderBy: { createdAt: 'desc' },
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
