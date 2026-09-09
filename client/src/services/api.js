import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skyflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid or expired
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('skyflow_token');
        localStorage.removeItem('skyflow_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  getUsers: () => api.get('/auth/users'),
  updateUserRole: (id, data) => api.put(`/auth/users/${id}`, data),
};

export const flightApi = {
  getAll: (params) => api.get('/flights', { params }),
  getById: (id) => api.get(`/flights/${id}`),
  create: (data) => api.post('/flights', data),
  update: (id, data) => api.put(`/flights/${id}`, data),
  updateStatus: (id, data) => api.patch(`/flights/${id}/status`, data),
  predictDelay: (id) => api.post(`/flights/${id}/predict-delay`),
  delete: (id) => api.delete(`/flights/${id}`),
};

export const bookingApi = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const aircraftApi = {
  getAll: (params) => api.get('/aircraft', { params }),
  getById: (id) => api.get(`/aircraft/${id}`),
  create: (data) => api.post('/aircraft', data),
  update: (id, data) => api.put(`/aircraft/${id}`, data),
  delete: (id) => api.delete(`/aircraft/${id}`),
};

export const crewApi = {
  getAll: (params) => api.get('/crew', { params }),
  getById: (id) => api.get(`/crew/${id}`),
  create: (data) => api.post('/crew', data),
  update: (id, data) => api.put(`/crew/${id}`, data),
  delete: (id) => api.delete(`/crew/${id}`),
};

export const passengerApi = {
  getAll: (params) => api.get('/passengers', { params }),
  getById: (id) => api.get(`/passengers/${id}`),
  create: (data) => api.post('/passengers', data),
  update: (id, data) => api.put(`/passengers/${id}`, data),
};

export const airlineApi = {
  getAll: () => api.get('/airlines'),
  getById: (id) => api.get(`/airlines/${id}`),
  create: (data) => api.post('/airlines', data),
};

export const airportApi = {
  getAll: () => api.get('/airports'),
  getById: (id) => api.get(`/airports/${id}`),
  updateWeather: (id, data) => api.patch(`/airports/${id}/weather`, data),
};

export const aiApi = {
  predictDelay: (data) => api.post('/ai/predict-delay', data),
  forecastPassengers: (data) => api.post('/ai/forecast-passengers', data),
  recommendRoute: (data) => api.post('/ai/recommend-route', data),
  getAnomalies: (params) => api.get('/ai/anomalies', { params }),
  resolveAnomaly: (id, data) => api.post(`/ai/anomalies/${id}/resolve`, data),
  chatAssistant: (data) => api.post('/ai/chat', data),
};

export const analyticsApi = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getCharts: () => api.get('/analytics/charts'),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export default api;
