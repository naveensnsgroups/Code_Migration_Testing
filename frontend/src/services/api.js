import axios from 'axios';

// Uses VITE_API_URL in production, fallback to '/api/employees' for local development via Vite proxy
const BASE_URL = import.meta.env.VITE_API_URL || '/api/employees';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Global response interceptor — handles network errors and unexpected responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    return Promise.reject(error);
  }
);

export const getAllEmployees  = ()         => api.get('/');
export const getEmployeeById = (id)        => api.get(`/${id}`);
export const createEmployee  = (data)      => api.post('/', data);
export const updateEmployee  = (id, data)  => api.put(`/${id}`, data);
export const deleteEmployee  = (id)        => api.delete(`/${id}`);
