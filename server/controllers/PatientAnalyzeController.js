import { GoogleGenerativeAI } from "@google/generative-ai";
import Patient from "../models/Patient.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { nowInIST } from "../utils/dateUtils.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzePatientProfile = asyncHandler(async (req, res) => {
  try {
    const { patientId } = req.params;

    // Fetch patient data with all the necessary relationships
    const  = await Patient.findOne({ userId: patientId })
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Construct a structured prompt with relevant details
    const prompt = `
You are an AI clinical assistant helping a doctor assess a patient's overall health and current symptoms. 
Summarize the case clearly and professionally (around 200–250 words).

Patient Summary:
- Name: ${patient.userId.name}
- Age: ${patient.age || "Unknown"}
- Gender: ${patient.gender || "Unknown"}
- Blood Group: ${patient.bloodGroup || "N/A"}
- Location: ${patient.location || "N/A"}
- Ongoing Conditions: ${
      patient.medicalHistory?.length
        ? patient.medicalHistory.map((c) => c.condition).join(", ")
        : "None"
    }
- Medications: ${
      patient.medications?.length
        ? patient.medications.map((m) => m.name).join(", ")
        : "None"
    }
- Allergies: ${patient.allergies?.join(", ") || "None"}
- Surgeries: ${
      patient.surgeries?.length
        ? patient.surgeries.map((s) => s.name).join(", ")
        : "None"
    }
- Symptoms: ${
      patient.symptoms?.length
        ? patient.symptoms
            .map(
              (s) =>
                `${s.category} (${s.severity}): ${
                  s.description || "No details"
                }`
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

    // Generate the AI output
    const result = await model.generateContent(prompt);
    let analysisText = result.response.text();

    // Add safety disclaimer
    analysisText += `

Note: This AI-generated analysis is for clinical support only. Final decisions should be based on professional medical judgment and diagnostic evaluation.`;

    const analyzedAt = nowInIST();

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
        analysis: analysisText,
        generatedAt: analyzedAt,
      },
      "Patient profile analysis generated successfully"
    );
  } catch (error) {
    console.error("Error analyzing patient profile:", error);
    return errorResponse(
      res,
      {
        message:
          "Unable to analyze patient data at this time. Please review manually.",
      },
      500
    );
  }
});
