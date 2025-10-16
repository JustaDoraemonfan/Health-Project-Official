import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// --- Setup Day.js for IST ---
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Kolkata");

const adminSchema = new mongoose.Schema(
  {
    // --- Core Identity ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

    // --- Permissions Section ---
    permissions: {
      canApproveDoctors: { type: Boolean, default: true },
      canManageAdmins: { type: Boolean, default: false },
      canViewAnalytics: { type: Boolean, default: false },
      canSuspendAccounts: { type: Boolean, default: false },
    },

    // --- Activity Tracking ---
    activity: {
      lastLogin: {
        type: Date,
        default: () => dayjs().tz("Asia/Kolkata").toDate(),
      },
      lastAction: { type: String },
      ipAddress: { type: String },
    },

    // --- Security & Status ---
    security: {
      passwordHash: { type: String, required: true },
      lastPasswordChange: {
        type: Date,
        default: () => dayjs().tz("Asia/Kolkata").toDate(),
      },
      isActive: { type: Boolean, default: true },
    },

    // --- Verification Review Log ---
    handledVerifications: [
      {
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
        action: {
          type: String,
          enum: ["approved", "rejected", "suspended"],
        },
        at: {
          type: Date,
          default: () => dayjs().tz("Asia/Kolkata").toDate(),
        },
        notes: { type: String },
      },
    ],

    // --- Audit Trail (Full History of Admin Actions) ---
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
        targetId: { type: mongoose.Schema.Types.ObjectId },
        at: {
          type: Date,
          default: () => dayjs().tz("Asia/Kolkata").toDate(),
        },
        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// --- Password Hashing Middleware ---
adminSchema.pre("save", async function (next) {
  if (!this.isModified("security.passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.security.passwordHash = await bcrypt.hash(
    this.security.passwordHash,
    salt
  );
  next();
});

// --- Password Comparison Method ---
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.security.passwordHash);
};

// --- Export Model ---
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
