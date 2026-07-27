export type UserRole = "patient" | "doctor" | "admin";

export interface AuthUser {
  id: string;
  role: UserRole;
}
