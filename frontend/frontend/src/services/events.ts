import { apiClient } from './api';

export const eventsService = {
  getEvents: () => apiClient.get('/events'),
  getFeaturedEvents: () => apiClient.get('/events/featured'),
  getEvent: (id: string) => apiClient.get(`/events/${id}`),
};
