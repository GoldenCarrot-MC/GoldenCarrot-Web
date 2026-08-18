import { apiClient } from './api';

export const votesService = {
  getPosts: (params: any) => apiClient.get('/votes/posts', { params }),
  getPost: (id: string) => apiClient.get(`/votes/posts/${id}`),
  createPost: (data: any) => apiClient.post('/votes/posts', data),
  votePost: (id: string) => apiClient.post(`/votes/posts/${id}/vote`),
  createComment: (id: string, data: any) => apiClient.post(`/votes/posts/${id}/comments`, data),
};
