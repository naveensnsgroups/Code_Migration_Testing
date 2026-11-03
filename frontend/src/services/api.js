import axios from 'axios';

// Connect directly to backend on port 5000 to avoid CORS or proxy issues on port 3000
const BASE_URL = 'http://localhost:5000/api/employees';

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
