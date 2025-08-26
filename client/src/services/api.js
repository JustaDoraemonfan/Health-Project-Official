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
  // Get patient profile
  getProfile: () => {
    return apiClient.get("/patients/profile");
  },

  // Update patient profile
  updateProfile: (data) => {
    return apiClient.put("/patients/profile", data);
  },

  // Get medical history
  getMedicalHistory: () => {
    return apiClient.get("/patients/medical-history");
  },

  // Add medical record
  addMedicalRecord: (record) => {
    return apiClient.post("/patients/medical-history", record);
  },
};

// Doctor API endpoints
export const doctorAPI = {
  // Get doctor profile
  getProfile: () => {
    return apiClient.get("/doctors/profile");
  },

  // Update doctor profile
  updateProfile: (data) => {
    return apiClient.put("/doctors/profile", data);
  },

  // Get assigned patients
  getPatients: () => {
    return apiClient.get("/doctors/patients");
  },

  // Get doctor availability
  getAvailability: () => {
    return apiClient.get("/doctors/availability");
  },

  // Update availability
  updateAvailability: (availability) => {
    return apiClient.put("/doctors/availability", availability);
  },
};

// Frontline Worker API endpoints
export const frontlineAPI = {
  // Get frontline worker profile
  getProfile: () => {
    return apiClient.get("/frontline/profile");
  },

  // Update frontline worker profile
  updateProfile: (data) => {
    return apiClient.put("/frontline/profile", data);
  },
};

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard data based on user role
  getDashboardData: () => {
    return apiClient.get("/dashboard");
  },

  // Get user statistics
  getStats: () => {
    return apiClient.get("/dashboard/stats");
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
