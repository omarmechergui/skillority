import api from '../apiClient.js';

export const communityApi = {
  getPosts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/community/posts${query ? `?${query}` : ''}`, { requiresAuth: false });
  },
  getPost: (id) => api.get(`/community/posts/${id}`, { requiresAuth: false }),
  createPost: (data) => api.post('/community/posts', data),
  toggleLike: (id) => api.post(`/community/posts/${id}/like`, {}),
  addComment: (id, content) => api.post(`/community/posts/${id}/comments`, { content }),
};

export default communityApi;
