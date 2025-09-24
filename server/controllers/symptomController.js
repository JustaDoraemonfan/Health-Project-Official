import Symptom from "../models/Symptom.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @desc    Add a new symptom
 * @route   POST /api/symptoms
 * @access  Private (Patient)
 */
export const addSymptom = asyncHandler(async (req, res) => {
  const { description, severity, onsetDate, notes, category } = req.body;
  const patientId = req.user.id;

  if (!description || !severity) {
    return errorResponse(res, "Description and severity are required", 400);
  }

  const symptomData = {
    patient: patientId,
    description,
    severity,
    onsetDate,
    notes,
    category,
    attachments: [],
  };

  // Handle multiple files for symptoms
  if (req.files && req.files.length > 0) {
    symptomData.attachments = req.files.map((file) => ({
      originalName: file.originalname,
      mime: file.mimetype,
      size: file.size,
      filePath: file.path,
      url: `/uploads/symptoms/${file.filename}`, // Correct path for symptoms
    }));
  }

  const symptom = await Symptom.create(symptomData);
  return successResponse(res, symptom, "Symptom added successfully", 201);
});

export const updateSymptom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patientId = req.user.id;
  const { deletedAttachments, ...updates } = req.body;

  const symptom = await Symptom.findOne({ _id: id, patient: patientId });
  if (!symptom) {
    return errorResponse(res, "Symptom not found", 404);
  }

  // Handle deleted attachments
  if (deletedAttachments) {
    const deletedIds = JSON.parse(deletedAttachments);
    symptom.attachments = symptom.attachments.filter(
      (att) => !deletedIds.includes(att._id.toString())
    );
  }

  // Handle new files
  if (req.files && req.files.length > 0) {
    const newAttachments = req.files.map((file) => ({
      originalName: file.originalname,
      mime: file.mimetype,
      size: file.size,
      filePath: file.path,
      url: `/uploads/symptoms/${file.filename}`, // Correct path for symptoms
    }));
    symptom.attachments.push(...newAttachments);
  }

  // Update other fields
  Object.assign(symptom, updates);
  await symptom.save();

  return successResponse(res, symptom, "Symptom updated successfully", 200);
});

/**
 * @desc    Get all symptoms for a patient
 * @route   GET /api/symptoms
 * @access  Private (Patient)
 */
export const getSymptoms = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const symptoms = await Symptom.find({ patient: patientId }).sort({
    createdAt: -1,
  });

  return successResponse(res, symptoms, "Symptoms retrieved successfully", 200);
});
/**
 * @desc    Get all symptoms for a patient
 * @route   GET /api/symptoms
 * @access  Private (Patient)
 */
export const getSymptomsForDoctors = asyncHandler(async (req, res) => {
  const { patientId } = req.body;
  const symptoms = await Symptom.find({ patient: patientId }).sort({
    createdAt: -1,
  });

  return successResponse(res, symptoms, "Symptoms retrieved successfully", 200);
});

/**
 * @desc    Get a single symptom
 * @route   GET /api/symptoms/:id
 * @access  Private (Patient)
 */
export const getSymptomById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patientId = req.user.id;

  const symptom = await Symptom.findOne({ _id: id, patient: patientId });
  if (!symptom) {
    return errorResponse(res, "Symptom not found", 404);
  }

  return successResponse(res, symptom, "Symptom retrieved successfully", 200);
});

/**
 * @desc    Delete a symptom
 * @route   DELETE /api/symptoms/:id
 * @access  Private (Patient)
 */
export const deleteSymptom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patientId = req.user.id;

  const symptom = await Symptom.findOneAndDelete({
    _id: id,
    patient: patientId,
  });
  if (!symptom) {
    return errorResponse(res, "Symptom not found", 404);
  }

  return successResponse(res, {}, "Symptom deleted successfully", 200);
});

/**
 * @desc    Summarize a symptom with AI
 * @route   POST /api/symptoms/:id/summarize
 * @access  Private (Patient)
 */
/**
 * @desc    Analyze symptoms with AI assistance
 * @route   POST /api/symptoms/analyze
 * @access  Private (Patient)
 */
/**
 * @desc    Analyze an existing symptom with AI assistance
 * @route   POST /api/symptoms/:id/analyze
 * @access  Private (Patient)
 */
export const analyzeSymptom = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.id;

    // Find the symptom in the database
    const symptom = await Symptom.findOne({ _id: id, patient: patientId });
    if (!symptom) {
      return errorResponse(res, "Symptom not found", 404);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a helpful and caring medical assistant providing clear, educational information about symptoms. 

Patient has described: "${symptom.description}"
Severity: ${symptom.severity}
Category: ${symptom.category}  
Started: ${
      symptom.onsetDate
        ? new Date(symptom.onsetDate).toDateString()
        : "Not specified"
    }
Additional notes: "${symptom.notes || "None"}"

Please provide a structured, easy-to-read response using these sections:

1. **Understanding**: Acknowledge their symptoms with empathy.
2. **Possible causes**: Simple explanations of what might be causing the symptoms.
3. **Self-care tips**: Safe things they can try at home (if appropriate).
4. **When to seek care**: Clear guidance on when to see a doctor.
5. **Reassurance**: Balanced encouragement without dismissing concerns.

Formatting guidelines for the response:
- No need to bold anything 
- Use bullet points (*) for lists and tips.
- Keep paragraphs short (2-3 sentences max) for readability.
- Include ⚠️ warning for severe symptoms at the start if necessary.


Keep the tone warm, supportive, and conversational. 
Limit the response to 200-300 words.
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Add emergency warning for severe symptoms
    const emergencyKeywords = [
      "chest pain",
      "difficulty breathing",
      "severe headache",
      "severe bleeding",
      "unconscious",
    ];
    const hasEmergencySymptoms = emergencyKeywords.some((keyword) =>
      symptom.description.toLowerCase().includes(keyword.toLowerCase())
    );

    if (hasEmergencySymptoms || symptom.severity === "Severe") {
      responseText = `⚠️ **IMPORTANT**: Based on your symptoms, you may need immediate medical attention. If this is urgent, please call emergency services or go to the nearest emergency room right away.\n\n${responseText}`;
    }

    // Add standard disclaimer
    responseText += `\n\nThis information is for educational purposes only and does not replace professional medical advice. Please consult with a healthcare provider for proper evaluation and treatment.`;

    // Optional: Save the analysis back to the symptom record
    symptom.lastAnalyzed = new Date();
    await symptom.save();

    return successResponse(
      res,
      {
        symptomId: symptom._id,
        analysis: responseText,
        analyzedAt: new Date().toISOString(),
        symptomData: {
          description: symptom.description,
          severity: symptom.severity,
          category: symptom.category,
          onsetDate: symptom.onsetDate,
        },
      },
      "Symptom analysis completed",
      200
    );
  } catch (error) {
    console.error("Error analyzing symptom:", error);

    return errorResponse(
      res,
      {
        message:
          "I'm unable to analyze your symptom right now. Please consult with a healthcare provider directly for evaluation of your symptoms.",
        fallbackAdvice:
          "If you're experiencing severe or concerning symptoms, don't hesitate to seek medical attention promptly.",
      },
      500
    );
  }
});
