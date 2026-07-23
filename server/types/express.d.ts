//d.ts - means its a declaration file

import "express";
import type { UserDocument } from "../Models/User.js";
import type { AdminDocument } from "../Models/Admin.ts";

interface AdminAction {
  action: string;
  timestamp: Date;
  ip: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      adminProfile?: AdminDocument;
      adminAction?: AdminAction;

      rateLimit: {
        limit: number;
        current: number;
        remaining: number;
        resetTime?: Date;
      };
    }
  }
}
export {};
