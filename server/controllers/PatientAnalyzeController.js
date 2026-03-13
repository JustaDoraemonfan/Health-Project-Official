import Patient from "../models/Patient.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { nowInIST } from "../utils/dateUtils.js";
import { askGemini } from "../services/geminiService.js";

export const analyzePatientProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ userId: req.params.patientId })
    .populate("userId", "name email role")
    .populate("symptoms", "description severity category onsetDate notes")
    .populate({
      path: "assignedDoctor",
      populate: {
        path: "userId",
        select: "name email specialization experience consultationFee rating",
      },
    });

  if (!patient) return errorResponse(res, "Patient not found", 404);

  const list = (arr, fn) => (arr?.length ? arr.map(fn).join(", ") : "None");

  const prompt = `
You are an AI clinical assistant helping a doctor assess a patient's overall health and current symptoms.
Summarize the case clearly and professionally (around 200–250 words).

Patient Summary:
- Name: ${patient.userId.name}
- Age: ${patient.age || "Unknown"}
- Gender: ${patient.gender || "Unknown"}
- Blood Group: ${patient.bloodGroup || "N/A"}
- Location: ${patient.location || "N/A"}
- Ongoing Conditions: ${list(patient.medicalHistory, (c) => c.condition)}
- Medications: ${list(patient.medications, (m) => m.name)}
- Allergies: ${patient.allergies?.join(", ") || "None"}
- Surgeries: ${list(patient.surgeries, (s) => s.name)}
- Symptoms: ${
    patient.symptoms?.length
      ? patient.symptoms
          .map(
            (s) =>
              `${s.category} (${s.severity}): ${s.description || "No details"}`,
          )
          .join("; ")
      : "None reported"
  }

Generate a brief, structured report with:
1. Overview — Key health profile & chronic issues.
2. Symptom Interpretation — Relation to conditions or medications.
3. Risks / Alerts — Any possible interactions or serious signs.
4. Next Steps — Suggested monitoring, tests, or follow-up focus.

Keep it concise, factual, and suitable for a medical professional.
Avoid emotional tone and unnecessary explanations.
`;

  try {
    let analysis = await askGemini(prompt);
    analysis += `\n\nNote: This AI-generated analysis is for clinical support only. Final decisions should be based on professional medical judgment and diagnostic evaluation.`;

    return successResponse(
      res,
      {
        patient: {
          id: patient._id,
          name: patient.userId.name,
          age: patient.age,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
        },
        analysis,
        generatedAt: nowInIST(),
      },
      "Patient profile analysis generated successfully",
    );
  } catch (error) {
    console.error("Error analyzing patient profile:", error);
    return errorResponse(
      res,
      {
        message:
          "Unable to analyze patient data at this time. Please review manually.",
      },
      500,
    );
  }
});
