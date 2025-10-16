import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-south-1",
});

/**
 * Generate a pre-signed URL for accessing a private file
 * @param {string} key - The S3 object key (path in bucket)
 * @param {number} expiresIn - Time in seconds before URL expires (default: 1 hour)
 */
export const getSignedUrl = (key, expiresIn = 3600) => {
  try {
    return s3.getSignedUrl("getObject", {
      Bucket: "healthymewebsite-verifications",
      Key: key,
      Expires: expiresIn,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};
