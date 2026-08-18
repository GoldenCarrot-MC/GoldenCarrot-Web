import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export const authClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // For sending cookies
});

// Request interceptor to add access token
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor to handle token refresh
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/refresh') {
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return authClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_URL}/refresh`, {}, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        
        processQueue(null, data.accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return authClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new Event('auth-unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  getCaptcha: () => authClient.get('/captcha'),
  register: (data: any) => authClient.post('/register', data),
  login: (data: any) => authClient.post('/login', data),
  logout: () => authClient.post('/logout'),
  getMe: () => authClient.get('/me'),
  forgotPassword: (data: any) => authClient.post('/forgot-password', data),
  resetPassword: (data: any) => authClient.post('/reset-password', data),
  updateProfile: (data: any) => authClient.put('/me/profile', data),
  updatePassword: (data: any) => authClient.put('/me/password', data),
  getMessages: () => authClient.get('/me/messages'),
};
