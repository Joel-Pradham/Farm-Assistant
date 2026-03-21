/**
 * Terra Intelligence — API Service Layer
 * Points to FastAPI backend at localhost:8000
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

export const weatherAPI = {
  get: (city = 'Ernakulam', country = 'IN') =>
    api.get(`/weather?city=${city}&country=${country}`).then(r => r.data),
};

export const cropAPI = {
  recommend: (data) => api.post('/crop-recommend', data).then(r => r.data),
};

export const diseaseAPI = {
  scan: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/disease-scan', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};

export const fertilizerAPI = {
  recommend: (data) => api.post('/fertilizer', data).then(r => r.data),
};

export const chatAPI = {
  send: (message, history = []) =>
    api.post('/chat', { message, history }).then(r => r.data),
};

export const healthAPI = {
  check: () => api.get('/health').then(r => r.data),
};

export default api;
