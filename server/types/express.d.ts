//d.ts - means its a declaration file

import "express";
import type { UserDocument } from "../Models/User.js";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}
export {};
