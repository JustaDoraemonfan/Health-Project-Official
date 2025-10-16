// client/src/services/api.js - FIXED VERSION
import axios from "axios";

// Base API URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and handle FormData
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CRITICAL FIX: Remove Content-Type for FormData to let axios handle it
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      console.log("FormData detected - removed Content-Type header");
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
  setAvailability: (availability) => {
    return apiClient.post("/doctors/availability", { availability });
  },
  getAvailability: () => {
    return apiClient.get("/doctors/availability");
  },
  // Submit verification documents for a doctor
  submitDoctorVerification: async (formData) => {
    console.log("API: Submitting doctor verification", {
      isFormData: formData instanceof FormData,
    });

    try {
      const response = await apiClient.post("/doctors/verify", formData);
      console.log("API: Doctor verification submitted successfully");
      return response;
    } catch (error) {
      console.error(
        "API: Doctor verification submission error",
        error.response?.data || error.message
      );
      throw error;
    }
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

// ==================== ADMIN MANAGEMENT ====================

export const adminAPI = {
  // Get all admins (superadmin only)
  getAllAdmins: () => {
    return apiClient.get("/admin");
  },

  // Get a single admin by ID (superadmin only)
  getAdmin: (adminId) => {
    return apiClient.get(`/admin/${adminId}`);
  },

  // Update admin details (superadmin only)
  updateAdmin: (adminId, adminData) => {
    return apiClient.put(`/admin/${adminId}`, adminData);
  },

  // Delete admin (superadmin only)
  deleteAdmin: (adminId) => {
    return apiClient.delete(`/admin/${adminId}`);
  },

  // ==================== DOCTOR VERIFICATION ====================

  // Get all pending doctor verifications
  getPendingVerifications: () => {
    return apiClient.get("/admin/verifications/pending");
  },

  // Get all doctor verifications
  getAllVerifications: () => {
    return apiClient.get("/admin/verifications");
  },

  // Approve a doctor’s verification
  approveVerification: (doctorId, notes) => {
    return apiClient.post(`/admin/verifications/${doctorId}/approve`, {
      notes,
    });
  },

  // Reject a doctor’s verification
  rejectVerification: (doctorId, reason) => {
    return apiClient.post(`/admin/verifications/${doctorId}/reject`, {
      reason,
    });
  },

  // ==================== ACCOUNT MANAGEMENT ====================

  // Suspend a user account
  suspendAccount: (userId) => {
    return apiClient.post(`/admin/users/${userId}/suspend`);
  },

  // Reactivate a suspended user account
  reactivateAccount: (userId) => {
    return apiClient.post(`/admin/users/${userId}/reactivate`);
  },

  // ==================== ANALYTICS & ACTIVITY ====================

  // Get dashboard analytics
  getDashboardAnalytics: () => {
    return apiClient.get("/admin/analytics/dashboard");
  },

  // Get admin’s recent activity logs
  getAdminActivity: () => {
    return apiClient.get("/admin/activity");
  },

  // ==================== USER MANAGEMENT ====================

  // Get all users
  getAllUsers: () => {
    return apiClient.get("/admin/users");
  },

  // ==================== ADMIN PROFILE ====================

  // Update admin password
  updateAdminPassword: (passwordData) => {
    return apiClient.put("/admin/password", passwordData);
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
  cancelAppointment: (appointmentId, reasonForCancellation) =>
    apiClient.patch(`/appointments/${appointmentId}/cancel`, {
      reason: reasonForCancellation,
    }),

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

// Symptom API endpoints - FIXED VERSION
export const symptomAPI = {
  // Add a new symptom (patient) - FIXED
  addSymptom: async (symptomData) => {
    console.log("API: Adding symptom", {
      isFormData: symptomData instanceof FormData,
      type: typeof symptomData,
    });

    // Debug FormData contents
    if (symptomData instanceof FormData) {
      console.log("FormData contents:");
      for (let [key, value] of symptomData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    }

    try {
      // Don't set Content-Type - the request interceptor will handle it
      const response = await apiClient.post("/symptoms/add", symptomData);
      console.log("API: Add symptom success");
      return response;
    } catch (error) {
      console.error(
        "API: Add symptom error",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  analyzeSymptom: (symptomId) => {
    return apiClient.post(`/symptoms/${symptomId}/analyze`);
  },

  // Update an existing symptom - FIXED (was missing FormData handling)
  updateSymptom: async (symptomId, updates) => {
    console.log("API: Updating symptom", symptomId, {
      isFormData: updates instanceof FormData,
      type: typeof updates,
    });

    // Debug FormData contents
    if (updates instanceof FormData) {
      console.log("FormData contents:");
      for (let [key, value] of updates.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    }

    try {
      // Don't set Content-Type - the request interceptor will handle it
      const response = await apiClient.put(`/symptoms/${symptomId}`, updates);
      console.log("API: Update symptom success");
      return response;
    } catch (error) {
      console.error(
        "API: Update symptom error",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get all symptoms for current patient
  getSymptoms: () => {
    return apiClient.get("/symptoms");
  },
  //Get all symptoms for current patient for doctor
  getSymptomForDoctor: (patientId) => {
    return apiClient.post("/symptoms/doctorpatientsymptoms", { patientId });
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

// Prescription API endpoints - ALSO NEEDS FIXING
export const prescriptionAPI = {
  // Upload prescription (doctor only) - FIXED
  uploadPrescription: async (patientId, file) => {
    const formData = new FormData();
    formData.append("prescriptionPdf", file);
    formData.append("patientId", patientId);

    console.log("API: Uploading prescription", {
      patientId,
      fileName: file.name,
      fileSize: file.size,
    });

    try {
      // Don't set Content-Type - the request interceptor will handle it
      const response = await apiClient.post("/prescriptions", formData);
      console.log("API: Upload prescription success");
      return response;
    } catch (error) {
      console.error(
        "API: Upload prescription error",
        error.response?.data || error.message
      );
      throw error;
    }
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

// Reminder API endpoints
export const reminderAPI = {
  //Create a new reminder
  createReminder: (data) => apiClient.post("/reminders", data),

  // Get all reminders for the logged-in user
  getReminders: () => apiClient.get("/reminders"),

  // Get a specific reminder by its ID
  getReminderById: (reminderId) => apiClient.get(`/reminders/${reminderId}`),

  // Update an existing reminder
  updateReminder: (reminderId, updateData) =>
    apiClient.put(`/reminders/${reminderId}`, updateData),

  // Delete a reminder by its ID
  deleteReminder: (reminderId) => apiClient.delete(`/reminders/${reminderId}`),
  markAsTaken: (reminderId) =>
    apiClient.put(`/reminders/${reminderId}/mark-as-taken`),
};

// Earthquake API endpoints
export const earthquakeAPI = {
  // Fetch latest earthquakes from USGS (force fetch)
  fetchEarthquakes: () => apiClient.post("/earthquakes/fetch"),

  // Get recent earthquakes (default latest 20)
  getRecentEarthquakes: (limit = 20) =>
    apiClient.get(`/earthquakes?limit=${limit}`),

  // Get earthquake by USGS ID
  getEarthquakeById: (usgsId) => apiClient.get(`/earthquakes/${usgsId}`),

  // Get earthquakes by date range
  getEarthquakesByRange: (startDate, endDate) =>
    apiClient.get(
      `/earthquakes/range?start=${encodeURIComponent(
        startDate
      )}&end=${encodeURIComponent(endDate)}`
    ),

  // Get significant earthquakes above a magnitude
  getSignificantEarthquakes: (minMag = 5.0) =>
    apiClient.get(`/earthquakes/significant?minMag=${minMag}`),
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
