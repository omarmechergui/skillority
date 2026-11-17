import api from '../apiClient';

export const messagingApi = {
  getConversations: () => api.get('/messaging/conversations'),
  getMessages: (conversationId) => api.get(`/messaging/conversations/${conversationId}/messages`),
  sendMessage: (recipientId, content, conversationId) =>
    api.post('/messaging/messages', { recipientId, content, conversationId }),
  getNotifications: () => api.get('/messaging/notifications'),
  markNotificationRead: (id) => api.patch(`/messaging/notifications/${id}/read`, {}),
};

export default messagingApi;
