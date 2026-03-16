import Symptom from "../models/Symptom.js";
import Patient from "../models/Patient.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { nowInIST } from "../utils/dateUtils.js";
import { askGemini } from "../services/geminiService.js";
import { getSignedUrl } from "../utils/s3Helper.js";

// Strip all HTML tags from a string, leaving only plain text.
// Prevents stored XSS — a patient can't embed scripts in symptom descriptions
// that would later execute when a doctor views the symptom list.
const stripHtml = (str) =>
  typeof str === "string" ? str.replace(/<[^>]*>/g, "").trim() : str;

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "severe headache",
  "severe bleeding",
  "unconscious",
];

export const addSymptom = asyncHandler(async (req, res) => {
  const { description, severity, onsetDate, notes, category } = req.body;
  const patientId = req.user.id;

  if (!description || !severity)
    return errorResponse(res, "Description and severity are required", 400);

  const symptom = await Symptom.create({
    patient: patientId,
    description: stripHtml(description),
    severity,
    onsetDate,
    notes: stripHtml(notes),
    category,
    attachments:
      req.files?.map((file) => ({
        originalName: file.originalname,
        mime: file.mimetype,
        size: file.size,
        filePath: file.key, // S3 object key — used for future deletion
        url: file.location, // Full S3 HTTPS URL — used by the client to view/download
      })) ?? [],
  });

  await Patient.findOneAndUpdate(
    { userId: patientId },
    { $push: { symptoms: symptom._id } },
    { new: true },
  );

  return successResponse(res, symptom, "Symptom added successfully", 201);
});

export const updateSymptom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { deletedAttachments, ...updates } = req.body;

  // Sanitize free-text fields in the update payload before persisting
  if (updates.description) updates.description = stripHtml(updates.description);
  if (updates.notes) updates.notes = stripHtml(updates.notes);

  const symptom = await Symptom.findOne({ _id: id, patient: req.user.id });
  if (!symptom) return errorResponse(res, "Symptom not found", 404);

  if (deletedAttachments) {
    const deletedIds = JSON.parse(deletedAttachments);
    symptom.attachments = symptom.attachments.filter(
      (att) => !deletedIds.includes(att._id.toString()),
    );
  }

  if (req.files?.length > 0) {
    symptom.attachments.push(
      ...req.files.map((file) => ({
        originalName: file.originalname,
        mime: file.mimetype,
        size: file.size,
        filePath: file.key, // S3 object key
        url: file.location, // Full S3 HTTPS URL
      })),
    );
  }

  Object.assign(symptom, updates);
  await symptom.save();

  return successResponse(res, symptom, "Symptom updated successfully", 200);
});

export const getSymptoms = asyncHandler(async (req, res) => {
  const symptoms = await Symptom.find({ patient: req.user.id }).sort({
    createdAt: -1,
  });
  return successResponse(res, symptoms, "Symptoms retrieved successfully", 200);
});

export const getSymptomsForDoctors = asyncHandler(async (req, res) => {
  const symptoms = await Symptom.find({ patient: req.body.patientId }).sort({
    createdAt: -1,
  });
  return successResponse(res, symptoms, "Symptoms retrieved successfully", 200);
});

export const getSymptomById = asyncHandler(async (req, res) => {
  const symptom = await Symptom.findOne({
    _id: req.params.id,
    patient: req.user.id,
  });
  if (!symptom) return errorResponse(res, "Symptom not found", 404);
  return successResponse(res, symptom, "Symptom retrieved successfully", 200);
});

export const deleteSymptom = asyncHandler(async (req, res) => {
  const symptom = await Symptom.findOneAndDelete({
    _id: req.params.id,
    patient: req.user.id,
  });
  if (!symptom) return errorResponse(res, "Symptom not found", 404);
  return successResponse(res, {}, "Symptom deleted successfully", 200);
});

export const analyzeSymptom = asyncHandler(async (req, res) => {
  const symptom = await Symptom.findOne({
    _id: req.params.id,
    patient: req.user.id,
  });
  if (!symptom) return errorResponse(res, "Symptom not found", 404);

  const prompt = `
You are a helpful and caring medical assistant providing clear, educational information about symptoms.

Patient has described: "${symptom.description}"
Severity: ${symptom.severity}
Category: ${symptom.category}
Started: ${symptom.onsetDate ? new Date(symptom.onsetDate).toDateString() : "Not specified"}
Additional notes: "${symptom.notes || "None"}"

Please provide a structured, easy-to-read response using these sections:
1. **Understanding**: Acknowledge their symptoms with empathy.
2. **Possible causes**: Simple explanations of what might be causing the symptoms.
3. **Self-care tips**: Safe things they can try at home (if appropriate).
4. **When to seek care**: Clear guidance on when to see a doctor.
5. **Reassurance**: Balanced encouragement without dismissing concerns.

Formatting guidelines:
- No need to bold anything
- Use bullet points (*) for lists and tips.
- Keep paragraphs short (2-3 sentences max).
- Include ⚠️ warning for severe symptoms at the start if necessary.

Keep the tone warm, supportive, and conversational. Limit to 200-300 words.
`;

  try {
    let analysis = await askGemini(prompt);

    const isEmergency =
      symptom.severity === "Severe" ||
      EMERGENCY_KEYWORDS.some((kw) =>
        symptom.description.toLowerCase().includes(kw),
      );

    if (isEmergency) {
      analysis = `⚠️ **IMPORTANT**: Based on your symptoms, you may need immediate medical attention. If this is urgent, please call emergency services or go to the nearest emergency room.\n\n${analysis}`;
    }

    analysis += `\n\nThis information is for educational purposes only and does not replace professional medical advice. Please consult with a healthcare provider for proper evaluation.`;

    symptom.lastAnalyzed = nowInIST();
    await symptom.save();

    return successResponse(
      res,
      {
        symptomId: symptom._id,
        analysis,
        analyzedAt: symptom.lastAnalyzed,
        symptomData: {
          description: symptom.description,
          severity: symptom.severity,
          category: symptom.category,
          onsetDate: symptom.onsetDate,
        },
      },
      "Symptom analysis completed",
      200,
    );
  } catch (error) {
    console.error("Error analyzing symptom:", error);
    return errorResponse(
      res,
      {
        message:
          "Unable to analyze your symptom right now. Please consult a healthcare provider directly.",
        fallbackAdvice:
          "If you're experiencing severe symptoms, seek medical attention promptly.",
      },
      500,
    );
  }
});

// @desc  Generate a short-lived signed URL for a symptom attachment
// @route GET /api/symptoms/attachment-url?key=<s3key>
// @access Private (patient who owns the symptom OR assigned doctor)
export const getAttachmentUrl = asyncHandler(async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return errorResponse(res, "Attachment key is required", 400);
  }

  // Only allow keys under the symptoms/ prefix — prevents using this
  // endpoint as a general-purpose S3 proxy for other buckets/paths
  if (!key.startsWith("symptoms/")) {
    return errorResponse(res, "Invalid attachment key", 403);
  }

  const signedUrl = getSignedUrl(key, 3600); // expires in 1 hour
  if (!signedUrl) {
    return errorResponse(res, "Could not generate attachment URL", 500);
  }

  return successResponse(res, { url: signedUrl }, "Signed URL generated");
});
