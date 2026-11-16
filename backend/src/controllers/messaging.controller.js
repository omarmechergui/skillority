import * as messagingService from '../services/messaging.service.js';

export async function getConversations(req, res, next) {
  try {
    const list = await messagingService.getUserConversations(req.user.id);
    return res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const list = await messagingService.getConversationMessages(req.user.id, req.params.conversationId);
    return res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { recipientId, content } = req.body;
    if (!recipientId || !content) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'recipientId and content are required' } });
    }

    const msg = await messagingService.sendMessage(req.user.id, req.params.conversationId, recipientId, content);
    return res.status(201).json({ success: true, message: 'Message sent', data: msg });
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req, res, next) {
  try {
    const notifications = await messagingService.getUserNotifications(req.user.id);
    return res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    await messagingService.markNotificationAsRead(req.user.id, req.params.id);
    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
}
