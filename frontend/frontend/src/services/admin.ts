import { authClient } from './auth';

// Create a new instance or reuse authClient with a different base URL logic?
// Better to just use axios directly or create a new client that shares the interceptors, 
// but since authClient is already configured with interceptors, let's just override the URL for admin calls.
// Actually, it's cleaner to change authClient's baseURL to '/api' and update authService to use '/auth/...'.
// But let's not break existing authService. I'll just use authClient but with absolute paths that override baseURL.

export const adminApi = {
  getStats: () => authClient.get('http://localhost:3001/api/admin/stats').then(res => res.data),
  
  getUsers: (params: any) => authClient.get('http://localhost:3001/api/admin/users', { params }).then(res => res.data),
  updateUser: (id: string, data: any) => authClient.put(`http://localhost:3001/api/admin/users/${id}`, data).then(res => res.data),
  resetPassword: (id: string) => authClient.post(`http://localhost:3001/api/admin/users/${id}/reset-password`).then(res => res.data),
  toggleUserStatus: (id: string) => authClient.patch(`http://localhost:3001/api/admin/users/${id}/status`).then(res => res.data),
  batchUsers: (data: any) => authClient.post('http://localhost:3001/api/admin/users/batch', data).then(res => res.data),
  exportUsers: () => authClient.get('http://localhost:3001/api/admin/users/export', { responseType: 'blob' }).then(res => res.data),
  
  getNews: () => authClient.get('http://localhost:3001/api/admin/news').then(res => res.data),
  createNews: (data: any) => authClient.post('http://localhost:3001/api/admin/news', data).then(res => res.data),
  updateNews: (id: string, data: any) => authClient.put(`http://localhost:3001/api/admin/news/${id}`, data).then(res => res.data),
  toggleNewsPin: (id: string) => authClient.patch(`http://localhost:3001/api/admin/news/${id}/pin`).then(res => res.data),
  deleteNews: (id: string) => authClient.delete(`http://localhost:3001/api/admin/news/${id}`).then(res => res.data),
  
  getLogs: (params: any) => authClient.get('http://localhost:3001/api/admin/logs', { params }).then(res => res.data),
  
  getTimelines: () => authClient.get('http://localhost:3001/api/timeline').then(res => res.data),
  createTimeline: (data: any) => authClient.post('http://localhost:3001/api/timeline', data).then(res => res.data),
  updateTimeline: (id: string, data: any) => authClient.put(`http://localhost:3001/api/timeline/${id}`, data).then(res => res.data),
  deleteTimeline: (id: string) => authClient.delete(`http://localhost:3001/api/timeline/${id}`).then(res => res.data),

  // Team
  getTeam: () => authClient.get('http://localhost:3001/api/team').then(res => res.data),
  createTeam: (data: any) => authClient.post('http://localhost:3001/api/team', data).then(res => res.data),
  updateTeam: (id: string, data: any) => authClient.put(`http://localhost:3001/api/team/${id}`, data).then(res => res.data),
  deleteTeam: (id: string) => authClient.delete(`http://localhost:3001/api/team/${id}`).then(res => res.data),
  
  getSettings: () => authClient.get('http://localhost:3001/api/admin/settings').then(res => res.data),
  updateSettings: (data: any) => authClient.put('http://localhost:3001/api/admin/settings', data).then(res => res.data),

  // Votes
  getVotes: () => authClient.get('http://localhost:3001/api/admin/votes'),
  updateVoteStatus: (id: string, status: string) => authClient.patch(`http://localhost:3001/api/admin/votes/${id}/status`, { status }),
  toggleVoteVisibility: (id: string) => authClient.patch(`http://localhost:3001/api/admin/votes/${id}/visibility`),
  replyVote: (id: string, content: string) => authClient.post(`http://localhost:3001/api/admin/votes/${id}/reply`, { content }),

  // Events
  getAdminEvents: () => authClient.get('http://localhost:3001/api/events'), // using public for now since we didn't make an admin-specific GET events
  createEvent: (data: any) => authClient.post('http://localhost:3001/api/admin/events', data),
  updateEvent: (id: string, data: any) => authClient.put(`http://localhost:3001/api/admin/events/${id}`, data),
  deleteEvent: (id: string) => authClient.delete(`http://localhost:3001/api/admin/events/${id}`),
};
