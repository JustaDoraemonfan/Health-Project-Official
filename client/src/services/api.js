// client/src/services/api.js
import axios from "axios";

// Base API URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Redirect to login page if needed
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const authAPI = {
  // Register user
  register: (userData) => {
    return apiClient.post("/auth/register", userData);
  },

  // Login user
  login: (credentials) => {
    return apiClient.post("/auth/login", credentials);
  },

  // Get current user profile
  getCurrentUser: () => {
    return apiClient.get("/auth/me");
  },

  // Logout (client-side token removal)
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
};

// Patient API endpoints
export const patientAPI = {
  // Create a new patient (admin/frontline only)
  createPatient: (patientData) => {
    return apiClient.post("/patients", patientData);
  },

  // Get all patients (admin/doctor only)
  getPatients: () => {
    return apiClient.get("/patients");
  },

  // Get single patient by ID
  getPatient: (patientId) => {
    return apiClient.get(`/patients/${patientId}`);
  },

  // Update patient profile
  updatePatient: (patientId, data) => {
    return apiClient.put(`/patients/${patientId}`, data);
  },

  // Delete patient (admin only)
  deletePatient: (patientId) => {
    return apiClient.delete(`/patients/${patientId}`);
  },
};

// Doctor API endpoints
export const doctorAPI = {
  // Create doctor (admin only)
  createDoctor: (doctorData) => {
    return apiClient.post("/doctors", doctorData);
  },

  // Get all doctors (admin only)
  getDoctors: () => {
    return apiClient.get("/doctors");
  },

  // Get single doctor by ID
  getDoctor: (doctorId) => {
    return apiClient.get(`/doctors/${doctorId}`);
  },

  // Update doctor (admin only)
  updateDoctor: (doctorId, data) => {
    return apiClient.put(`/doctors/${doctorId}`, data);
  },

  // Delete doctor (admin only)
  deleteDoctor: (doctorId) => {
    return apiClient.delete(`/doctors/${doctorId}`);
  },

  // Assign patient to doctor
  assignPatient: (assignmentData) => {
    return apiClient.post("/doctors/assign", assignmentData);
  },

  // Unassign patient from doctor
  unassignPatient: (unassignmentData) => {
    return apiClient.post("/doctors/unassign", unassignmentData);
  },

  // Get patients assigned to a doctor
  getDoctorPatients: (doctorData) => {
    return apiClient.post("/doctors/get-patients", doctorData);
  },

  // 🔍 Search doctors by location
  searchDoctors: (location) => {
    return apiClient.get(
      `/doctors/search?location=${encodeURIComponent(location)}`
    );
  },
};

// Frontline Worker API endpoints
export const frontlineAPI = {
  // Create frontline worker (admin only)
  createFrontlineWorker: (fwlData) => {
    return apiClient.post("/frontline", fwlData);
  },

  // Get all frontline workers (admin only)
  getFrontlineWorkers: () => {
    return apiClient.get("/frontline");
  },

  // Get frontline worker by ID
  getFrontlineWorker: (fwlId) => {
    return apiClient.get(`/frontline/${fwlId}`);
  },

  // Delete frontline worker (admin only)
  deleteFrontlineWorker: (fwlId) => {
    return apiClient.delete(`/frontline/${fwlId}`);
  },
};

// Dashboard API endpoints
export const dashboardAPI = {
  //Get Stats for Stats Section
  getStats: () => apiClient.get("/stats"),

  // Get patient dashboard data
  getPatientDashboard: () => {
    return apiClient.get("/dashboard/patient");
  },

  // Get doctor dashboard data
  getDoctorDashboard: () => {
    return apiClient.get("/dashboard/doctor");
  },

  // Get frontline worker dashboard data
  getFrontlineDashboard: () => {
    return apiClient.get("/dashboard/frontline");
  },

  // Get admin dashboard data
  getAdminDashboard: () => {
    return apiClient.get("/dashboard/admin");
  },
};

// Appointment API endpoints (for future use)
export const appointmentAPI = {
  // Get user appointments
  getAppointments: () => {
    return apiClient.get("/appointments");
  },

  // Book appointment
  bookAppointment: (appointmentData) => {
    return apiClient.post("/appointments", appointmentData);
  },

  // Cancel appointment
  cancelAppointment: (appointmentId) => {
    return apiClient.delete(`/appointments/${appointmentId}`);
  },

  // Update appointment
  updateAppointment: (appointmentId, data) => {
    return apiClient.put(`/appointments/${appointmentId}`, data);
  },
};

// Profile
export const profileAPI = {
  //Get user profile
  getProfile: () => {
    return apiClient.get("/profile");
  },
};

// Generic API helper functions
export const apiHelpers = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || "An error occurred",
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: "Network error. Please check your connection.",
        status: 0,
      };
    } else {
      // Other error
      return {
        message: error.message || "An unexpected error occurred",
        status: 0,
      };
    }
  },

  // Format response data
  formatResponse: (response) => {
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  },
};

export default apiClient;
