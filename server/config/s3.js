import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "healthymewebsite-verifications",
    contentType: multerS3.AUTO_CONTENT_TYPE, // Add this
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
    bucket: "healthymewebsite-verifications",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const userType = req.user.role; // "doctor" or "patient"
      const userId = req.user.id; // ID of doctor/patient

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
