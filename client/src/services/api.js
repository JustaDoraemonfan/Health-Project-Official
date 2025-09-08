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
  getDoctorPatients: () => {
    return apiClient.get("/doctors/get-patients");
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

// Appointment API endpoints
export const appointmentAPI = {
  // Get all appointments (admin/doctor)
  getAppointments: () => apiClient.get("/appointments"),

  // Book appointment (patient/doctor/admin)
  bookAppointment: (appointmentData) =>
    apiClient.post("/appointments", appointmentData),

  // Get single appointment
  getAppointment: (appointmentId) =>
    apiClient.get(`/appointments/${appointmentId}`),

  // Update appointment
  updateAppointment: (appointmentId, data) =>
    apiClient.put(`/appointments/${appointmentId}`, data),

  // Delete appointment (admin/doctor)
  deleteAppointment: (appointmentId) =>
    apiClient.delete(`/appointments/${appointmentId}`),

  // Cancel appointment
  cancelAppointment: (appointmentId) =>
    apiClient.patch(`/appointments/${appointmentId}/cancel`),

  // Confirm appointment (doctor/admin)
  confirmAppointment: (appointmentId) =>
    apiClient.patch(`/appointments/${appointmentId}/confirm`),

  // Complete appointment (doctor/admin)
  completeAppointment: (appointmentId, notes) =>
    apiClient.patch(`/appointments/${appointmentId}/complete`, { notes }),

  // Get upcoming appointments
  getUpcomingAppointments: () => apiClient.get("/appointments/upcoming"),

  // Get past appointments
  getPastAppointments: () => apiClient.get("/appointments/past"),

  // Get appointments in a date range
  getAppointmentsByDateRange: (startDate, endDate) =>
    apiClient.get(
      `/appointments/date-range?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`
    ),

  // Get appointment statistics (admin/doctor)
  getAppointmentStats: () => apiClient.get("/appointments/stats"),
};

// Symptom API endpoints
export const symptomAPI = {
  // Add a new symptom (patient)
  addSymptom: (symptomData) => {
    return apiClient.post("/symptoms", symptomData);
  },

  // Update an existing symptom
  updateSymptom: (symptomId, updates) => {
    return apiClient.put(`/symptoms/${symptomId}`, updates);
  },

  // Get all symptoms for current patient
  getSymptoms: () => {
    return apiClient.get("/symptoms");
  },

  // Get single symptom by ID
  getSymptomById: (symptomId) => {
    return apiClient.get(`/symptoms/${symptomId}`);
  },

  // Delete a symptom
  deleteSymptom: (symptomId) => {
    return apiClient.delete(`/symptoms/${symptomId}`);
  },
};

// Profile
export const profileAPI = {
  //Get user profile
  getProfile: () => {
    return apiClient.get("/profile");
  },
};

// -----------------------------
// Prescription API endpoints
// -----------------------------
export const prescriptionAPI = {
  // Upload prescription (doctor only)
  uploadPrescription: (patientId, file) => {
    const formData = new FormData();
    formData.append("prescriptionPdf", file); // <-- key must match multer's upload.single("file")
    formData.append("patientId", patientId);

    return apiClient.post("/prescriptions", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // override JSON
      },
    });
  },

  // Get prescriptions for logged-in patient
  getMyPrescriptions: () => {
    return apiClient.get("/prescriptions/mine");
  },

  // Get prescriptions for a specific patient (doctor only)
  getPatientPrescriptions: (patientId) => {
    return apiClient.get(`/prescriptions/${patientId}`);
  },
};

// Notes API endpoints
export const notesAPI = {
  // Doctor: Create a new note
  createNote: (noteData) => {
    return apiClient.post("/notes", noteData);
  },

  // Patient: Get all notes assigned to them
  getPatientNotes: () => {
    return apiClient.get("/notes");
  },

  // Doctor: Get all notes they created
  getDoctorNotes: () => {
    return apiClient.get("/notes/doctor");
  },

  // Patient: Mark a note as read
  markNoteAsRead: (noteId) => {
    return apiClient.patch(`/notes/${noteId}/read`);
  },

  // Patient: Acknowledge a note
  acknowledgeNote: (noteId) => {
    return apiClient.patch(`/notes/${noteId}/acknowledge`);
  },

  // Doctor: Update a note
  updateNote: (noteId, updates) => {
    return apiClient.put(`/notes/${noteId}`, updates);
  },

  // Doctor: Delete a note
  deleteNote: (noteId) => {
    return apiClient.delete(`/notes/${noteId}`);
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
