//d.ts - means its a declaration file

import "express";
import type { UserDocument } from "../TSModels/User";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}
export {};
