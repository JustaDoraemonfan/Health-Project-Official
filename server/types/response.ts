import type { Types } from "mongoose";
//Models
import { type UserRole } from "../Models/User.js";
import { type PatientDocument } from "../Models/Patient.js";
import { type DoctorDocument } from "../Models/Doctor.js";
import { type AdminDocument } from "../Models/Admin.js";

export interface CurrentUserResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;

  doctorProfile?: DoctorDocument | null;
  patientProfile?: PatientDocument | null;
  adminProfile?: AdminDocument | null;
}

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
