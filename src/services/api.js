import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/constants';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Sessions (Faculty)
export const startSession = (data) => api.post('/sessions/start', data);
export const endSession = (id) => api.post(`/sessions/end/${id}`);
export const getActiveSession = () => api.get('/sessions/active');
export const getMySessions = () => api.get('/sessions/my-sessions');
export const getSessionStats = () => api.get('/sessions/stats');

// Attendance (Student)
export const getNearbySessions = (latitude, longitude) => 
  api.get(`/attendance/nearby?latitude=${latitude}&longitude=${longitude}`);
export const markAttendance = (data) => api.post('/attendance/mark', data);
export const getMyAttendance = () => api.get('/attendance/my-attendance');
export const getAttendanceStats = () => api.get('/attendance/stats');

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getAllStudents = () => api.get('/admin/students');
export const getAllFaculty = () => api.get('/admin/faculty');
export const getAllSessions = () => api.get('/admin/sessions');
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export default api;
