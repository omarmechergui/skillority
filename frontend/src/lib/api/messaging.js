import api from '../apiClient.js';

export const messagingApi = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId) => api.get(`/messages/conversations/${conversationId}`),
  sendMessage: (conversationId, recipientId, content) =>
    api.post(`/messages/conversations/${conversationId}`, { recipientId, content }),
  getNotifications: () => api.get('/messages/notifications'),
  markNotificationRead: (id) => api.patch(`/messages/notifications/${id}/read`, {}),
};

export default messagingApi;
