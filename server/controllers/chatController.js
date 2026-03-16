import { askGemini } from "../services/geminiService.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const handleChat = asyncHandler(async (req, res) => {
  {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Step 1: Health classification (unchanged)
    const classificationPrompt = `
Classify the following user message as health-related or not.
Return ONLY one word: health OR not_health
Message: ${message}
`;
    const classification = await askGemini(classificationPrompt);
    if (classification.trim().toLowerCase().includes("not_health")) {
      return res.json({
        reply:
          "I'm designed to answer health-related questions. Please ask something related to health.",
      });
    }

    // Step 2: Fetch unique specializations from verified doctors only
    const specializations = await Doctor.distinct("specialization", {
      "verification.status": "verified",
      isAvailable: { $ne: "Offline" },
    });

    // Step 3: Ask Gemini which specialization fits the query
    const specializationPrompt = `
You are a medical triage assistant.

Based on the user's health concern, identify which doctor specialization from the list below is most relevant.
Return ONLY the exact specialization string from the list, or "none" if no match applies.

Available specializations:
${specializations.map((s, i) => `${i + 1}. ${s}`).join("\n")}

User concern: ${message}
`;
    const matchedSpec = (await askGemini(specializationPrompt)).trim();

    // Step 4: Fetch matching doctors if a specialization was found
    let recommendedDoctors = [];
    if (
      matchedSpec.toLowerCase() !== "none" &&
      specializations.includes(matchedSpec)
    ) {
      recommendedDoctors = await Doctor.find({
        specialization: matchedSpec,
        "verification.status": "verified",
        isAvailable: { $ne: "Offline" },
      })
        .populate("userId", "name email")
        .select(
          "userId specialization experience rating consultationFee location isAvailable nextAvailable",
        )
        .sort({ rating: -1 })
        .limit(5);
    }

    // Step 5: Generate the health advice response
    const healthPrompt = `
You are a helpful health assistant.
Give general health guidance but do NOT diagnose diseases.
Always recommend consulting a medical professional for serious issues.
${recommendedDoctors.length > 0 ? `Note: The user will also be shown a list of ${matchedSpec} specialists.` : ""}

User question: ${message}
`;
    const healthAdvice = await askGemini(healthPrompt);

    res.json({
      reply: healthAdvice,
      recommendedDoctors: recommendedDoctors.map((doc) => ({
        id: doc._id,
        name: doc.userId?.name,
        specialization: doc.specialization,
        experience: doc.experience,
        rating: doc.rating,
        consultationFee: doc.consultationFee,
        location: doc.location,
        isAvailable: doc.isAvailable,
        nextAvailable: doc.nextAvailable,
      })),
      matchedSpecialization: matchedSpec !== "none" ? matchedSpec : null,
    });
  }
});
