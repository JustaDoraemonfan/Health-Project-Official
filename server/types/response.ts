import type { Types } from "mongoose";
//Models
import { type UserRole } from "../Models/User.js";
import { type PatientDocument } from "../Models/Patient.js";
import { type DoctorDocument } from "../Models/Doctor.js";
import { type AdminDocument } from "../Models/Admin.js";

export interface BaseUserResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
}
export interface DoctorUserResponse extends BaseUserResponse {
  role: "doctor";
  doctorProfile: DoctorDocument;
}

export interface PatientUserResponse extends BaseUserResponse {
  role: "patient";
  patientProfile: PatientDocument;
}

export interface AdminUserResponse extends BaseUserResponse {
  role: "admin";
  adminProfile: AdminDocument;
}
export type CurrentUserResponse =
  | DoctorUserResponse
  | PatientUserResponse
  | AdminUserResponse;

export interface GetUserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  adminDetails?: {
    adminRole: "superadmin" | "support" | "verifier";
    department: string;
    permissions: {
      canApproveDoctors: boolean;
      canManageAdmins: boolean;
      canViewAnalytics: boolean;
      canSuspendAccounts: boolean;
    };
    isActive: boolean;
    lastLogin: Date | null;
    verificationsHandled?: number;
  };
}
