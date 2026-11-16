import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getConversations,
  getMessages,
  sendMessage,
  getNotifications,
  markNotificationRead,
} from '../controllers/messaging.controller.js';

const router = Router();

// One-to-one Conversations & Messages
router.get('/conversations', requireAuth, getConversations);
router.get('/conversations/:conversationId', requireAuth, getMessages);
router.post('/conversations/:conversationId', requireAuth, sendMessage);

// Notifications stream
router.get('/notifications', requireAuth, getNotifications);
router.patch('/notifications/:id/read', requireAuth, markNotificationRead);

export default router;
