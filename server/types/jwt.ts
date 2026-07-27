import { UserRole } from "./auth.js";

export interface AccessTokenPayload {
  id: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  id: string;
}
