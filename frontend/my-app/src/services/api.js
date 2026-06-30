import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

console.log("API URL =", API_URL);
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh: refreshToken }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  changePassword: (data) => api.put('/auth/change-password/', data),
};

// Patient API
export const patientAPI = {
  getAll: () => api.get("/patients/"),
  getProfile: () => api.get('/patients/profile/'),
  updateProfile: (data) => api.patch('/patients/profile/', data),
  getAllergies: () => api.get('/patients/allergies/'),
  addAllergy: (data) => api.post('/patients/allergies/', data),
  deleteAllergy: (id) => api.delete(`/patients/allergies/${id}/`),
  getHealthResources: (params) => api.get('/patients/health-resources/', { params }),
};

// Doctor API
export const doctorAPI = {
  getAll: () => api.get("/doctors/"),
  getAll: (params) => api.get('/doctors/', { params }),
  getById: (id) => api.get(`/doctors/${id}/`),
  getProfile: () => api.get('/doctors/profile/'),
  updateProfile: (data) => api.patch('/doctors/profile/', data),
  getSchedules: () => api.get('/doctors/schedules/'),
  createSchedule: (data) => api.post('/doctors/schedules/', data),
  updateSchedule: (id, data) => api.patch(`/doctors/schedules/${id}/`, data),
  deleteSchedule: (id) => api.delete(`/doctors/schedules/${id}/`),
  getAvailableSlots: (doctorId, date) => 
    api.get(`/doctors/${doctorId}/available-slots/`, { params: { date } }),
  getSpecializations: () => api.get('/doctors/specializations/'),
};

// Appointment API
export const appointmentAPI = {
  getAll: (params) => api.get('/appointments/', { params }),
  create: (data) => api.post('/appointments/create/', data),
  getById: (id) => api.get(`/appointments/${id}/`),
  update: (id, data) => api.patch(`/appointments/${id}/`, data),
  cancel: (id) => api.post(`/appointments/${id}/cancel/`),
  confirm: (id) => api.post(`/appointments/${id}/confirm/`),
  complete: (id, notes) => api.post(`/appointments/${id}/complete/`, { notes }),
};

// Medical Records API
export const medicalRecordAPI = {
  getAll: (params) => api.get('/medical-records/', { params }),
  create: (data) => api.post('/medical-records/create/', data),
  getById: (id) => api.get(`/medical-records/${id}/`),
  update: (id, data) => api.patch(`/medical-records/${id}/`, data),
  getPatientHistory: (patientId) => api.get(`/medical-records/patient/${patientId}/history/`),
};

// Prescription API
export const prescriptionAPI = {
  getAll: (params) => api.get('/prescriptions/', { params }),
  create: (data) => api.post('/prescriptions/create/', data),
  getById: (id) => api.get(`/prescriptions/${id}/`),
  sendToPharmacy: (id, data) => api.post(`/prescriptions/${id}/send-to-pharmacy/`, data),
  checkInteractions: (medications) => 
    api.post('/prescriptions/check-interactions/', { medications }),
};

// Billing API
export const billingAPI = {
  getInvoices: (params) => api.get("/billing/invoices/", { params }),
  createInvoice: (data) => api.post("/billing/invoices/create/", data),
  getInvoiceById: (id) => api.get(`/billing/invoices/${id}/`),
  makePayment: (data) => api.post("/billing/payments/create/", data),
  getPayments: (params) => api.get("/billing/payments/", { params }),
};
// Facility API
export const facilityAPI = {
  getAll: (params) => api.get('/facilities/', { params }),
  getById: (id) => api.get(`/facilities/${id}/`),
  getDepartments: (params) => api.get('/facilities/departments/', { params }),
  getResources: (params) => api.get('/facilities/resources/', { params }),
};

export default api;
