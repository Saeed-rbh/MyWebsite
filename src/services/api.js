import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getCVData = () => api.get('/cv');
export const updateCVSection = (id, data) => api.put(`/cv/${id}`, data);
export const login = (credentials) => api.post('/auth/login', credentials);
export const syncScholarData = (url) => api.post('/scholar/sync', { scholarUrl: url });
export const uploadFile = (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;
