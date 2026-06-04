import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// URLs
export const shortenUrl = (data) => API.post('/urls', data);
export const getUserUrls = () => API.get('/urls');
export const getUrlStats = (shortCode) => API.get(`/urls/${shortCode}/stats`);
export const deleteUrl = (shortCode) => API.delete(`/urls/${shortCode}`);
