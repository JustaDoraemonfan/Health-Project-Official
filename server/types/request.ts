import { UserRole } from "./auth.js";

//User in authController,
export interface LoginRequest {
  email: string;
  password: string;
  expectedRole: UserRole;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;

  age?: number | string;
  gender?: "male" | "female" | "other";

  phone?: string;
  location?: string;

  specialization?: string;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;

  adminRole?: "superadmin" | "verifier" | "support";
  department?: string;
}

//Used In PatientController
export interface CreatePatientRequest {
  userId: string;
  age: number;
  gender: "male" | "female" | "other";
}

//Used In DoctorController
export interface CreateDoctorRequest {
  userId: string;
  specialization: string;

  experience?: number;
  location?: string;
  education?: string;
  languages?: string[];
  consultationFee?: number;
  certifications?: string[];
  about?: string;
  phone?: string;
}

export interface UpdateDoctorRequest {
  specialization?: string;
  experience?: number;
  location?: string;
  education?: string;
  languages?: string[];
  consultationFee?: number;
  certifications?: string[];
  about?: string;
  phone?: string;
}
