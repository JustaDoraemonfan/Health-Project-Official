import { UserRole } from "../TSModels/User.js";

export interface AccessTokenPayload {
  id: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  id: string;
}
