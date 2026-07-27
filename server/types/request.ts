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
