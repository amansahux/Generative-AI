import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // required for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
};

export const chatAPI = {
  getSessions: () => api.get('/chat/sessions'),
  getSessionHistory: (sessionId) => api.get(`/chat/session/${sessionId}`),
  deleteSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
  sendMessage: (data) => api.post('/chat/message', data),
};

export default api;
