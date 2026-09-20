import type { RequestHandler } from "express";

//Models
import type { IUser } from "../Models/User.js";
import type { ISymptom } from "../Models/Symptom.js";
import Patient from "../Models/Patient.js";

//Middleware
import asyncHandler from "../middleware/asyncHandler.js";

//Utils
import { successResponse, errorResponse } from "../utils/response.js";
import { nowInIST } from "../utils/dateUtils.js";

//Services
import { askGemini } from "../services/geminiService.js";

const formatList = <T>(
  arr: readonly T[] | undefined,
  fn: (item: T) => string,
): string => (arr?.length ? arr.map(fn).join(", ") : "None");

interface AnalyzePatientParams {
  patientId: string;
}

export const PatientAnalyzeController: RequestHandler<AnalyzePatientParams> =
  asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({
      userId: req.params.patientId,
    })
      .populate<{ userId: IUser }>("userId", "name email role")
      .populate<{ symptoms: ISymptom[] }>(
        "symptoms",
        "description severity category onsetDate notes",
      );

    if (!patient) {
      return errorResponse(res, "Patient not found", 404);
    }

    const prompt = `
You are an AI clinical assistant helping a doctor assess a patient's overall health and current symptoms.
Summarize the case clearly and professionally (around 200–250 words).

Patient Summary:
- Name: ${patient.userId.name}
- Age: ${patient.age ?? "Unknown"}
- Gender: ${patient.gender ?? "Unknown"}
- Blood Group: ${patient.bloodGroup ?? "N/A"}
- Location: ${patient.location ?? "N/A"}
- Ongoing Conditions: ${formatList(
      patient.medicalHistory,
      (condition) => condition.condition,
    )}
- Medications: ${formatList(
      patient.medications,
      (medication) => medication.name,
    )}
- Allergies: ${patient.allergies?.join(", ") || "None"}
- Surgeries: ${formatList(patient.surgeries, (surgery) => surgery.name)}
- Symptoms: ${
      patient.symptoms?.length
        ? patient.symptoms
            .map(
              (symptom) =>
                `${symptom.category} (${symptom.severity}): ${
                  symptom.description ?? "No details"
                }`,
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
      const aiAnalysis = await askGemini(prompt);

      const analysis = `${aiAnalysis}

Note: This AI-generated analysis is for clinical support only. Final decisions should be based on professional medical judgment and diagnostic evaluation.`;

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
    } catch (error: unknown) {
      console.error("Error analyzing patient profile:", error);

      return errorResponse(
        res,
        "Unable to analyze patient data at this time. Please review manually.",
        500,
      );
    }
  });
