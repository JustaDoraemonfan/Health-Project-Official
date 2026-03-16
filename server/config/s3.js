import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const BUCKET = "healthymewebsite-verifications";

// Allowed MIME types for symptom attachments
const SYMPTOM_ALLOWED_MIMES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `doctor-verifications/${Date.now()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit (optional)
  },
});

export const uploadProfilePhoto = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const userType = req.user.role;
      const userId = req.user.id;

      const folder =
        userType === "doctor"
          ? `profile-photos/doctors/${userId}`
          : `profile-photos/patients/${userId}`;

      cb(null, `${folder}/photo-${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Symptom attachments — stored under symptoms/<userId>/ in S3.
// Using S3 instead of local disk means files survive server restarts
// and redeployments on ephemeral hosts (Railway, Render, Heroku, etc.)
export const uploadSymptomFiles = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const userId = req.user.id;
      cb(null, `symptoms/${userId}/${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (SYMPTOM_ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only images, PDF, and Word documents are allowed for symptoms",
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB — same as the old local config
    files: 10,
  },
});
