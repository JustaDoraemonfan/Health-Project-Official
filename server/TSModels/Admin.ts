import { Schema, model, type HydratedDocument, Types } from "mongoose";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Kolkata");

export type AdminRole = "superadmin" | "verifier" | "support";

export type VerificationAction = "approved" | "rejected" | "suspended";

export type AuditAction =
  | "login"
  | "logout"
  | "approve_verification"
  | "reject_verification"
  | "create_admin"
  | "suspend_account";

export interface Permissions {
  canApproveDoctors: boolean;
  canManageAdmins: boolean;
  canViewAnalytics: boolean;
  canSuspendAccounts: boolean;
}

export interface Activity {
  lastLogin: Date;
  lastAction?: string;
  ipAddress?: string;
}

export interface Security {
  passwordHash: string;
  lastPasswordChange: Date;
  isActive: boolean;
}

export interface HandledVerification {
  doctor: Types.ObjectId;
  action: VerificationAction;
  at: Date;
  notes?: string;
}

export interface AuditTrail {
  action: AuditAction;
  targetId?: Types.ObjectId;
  at: Date;
  notes?: string;
}

export interface IAdmin {
  userId: Types.ObjectId;

  role: AdminRole;

  department: string;

  permissions: Permissions;

  activity: Activity;

  security: Security;

  handledVerifications: HandledVerification[];

  auditTrail: AuditTrail[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export type AdminDocument = HydratedDocument<IAdmin, AdminMethods>;

const adminSchema = new Schema<IAdmin, {}, AdminMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["superadmin", "verifier", "support"],
      default: "verifier",
    },

    department: {
      type: String,
      default: "Verification",
    },

    permissions: {
      canApproveDoctors: {
        type: Boolean,
        default: true,
      },

      canManageAdmins: {
        type: Boolean,
        default: false,
      },

      canViewAnalytics: {
        type: Boolean,
        default: false,
      },

      canSuspendAccounts: {
        type: Boolean,
        default: false,
      },
    },

    activity: {
      lastLogin: {
        type: Date,
        default: () => dayjs().tz("Asia/Kolkata").toDate(),
      },

      lastAction: {
        type: String,
      },

      ipAddress: {
        type: String,
      },
    },

    security: {
      passwordHash: {
        type: String,
        required: true,
      },

      lastPasswordChange: {
        type: Date,
        default: () => dayjs().tz("Asia/Kolkata").toDate(),
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },

    handledVerifications: [
      {
        doctor: {
          type: Schema.Types.ObjectId,
          ref: "Doctor",
        },

        action: {
          type: String,
          enum: ["approved", "rejected", "suspended"],
        },

        at: {
          type: Date,
          default: () => dayjs().tz("Asia/Kolkata").toDate(),
        },

        notes: {
          type: String,
        },
      },
    ],

    auditTrail: [
      {
        action: {
          type: String,
          enum: [
            "login",
            "logout",
            "approve_verification",
            "reject_verification",
            "create_admin",
            "suspend_account",
          ],
        },

        targetId: {
          type: Schema.Types.ObjectId,
        },

        at: {
          type: Date,
          default: () => dayjs().tz("Asia/Kolkata").toDate(),
        },

        notes: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("security.passwordHash")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.security.passwordHash = await bcrypt.hash(
    this.security.passwordHash,
    salt,
  );

  next();
});

adminSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.security.passwordHash);
};

adminSchema.index(
  {
    userId: 1,
  },
  {
    unique: true,
  },
);

const Admin = model<IAdmin>("Admin", adminSchema);

export default Admin;
