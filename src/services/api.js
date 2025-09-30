import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const agentAPI = {
  getAgents: () => api.get('/agents'),
  createAgent: (agentData) => api.post('/agents', agentData),
  updateAgent: (id, agentData) => api.put(`/agents/${id}`, agentData),
  deleteAgent: (id) => api.delete(`/agents/${id}`),
};

export const listAPI = {
  uploadList: (formData) => api.post('/lists/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getLists: () => api.get('/lists'),
  getListById: (id) => api.get(`/lists/${id}`),
};

export default api;