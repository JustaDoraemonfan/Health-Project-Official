//Types
import type { Request, Response } from "express";
import type { Types } from "mongoose";

//middleware
import asyncHandler from "../middleware/asyncHandler.js";

//Services
import { askGemini } from "../services/geminiService.js";

//Models
import Doctor, { type IDoctor } from "../Models/Doctor.js";

//Interfaces
interface ChatRequestBody {
  message: string;
}

interface PopulatedUser {
  name?: string;
  email: string;
}

type PopulatedDoctor = Omit<IDoctor, "userId"> & {
  _id: Types.ObjectId;
  userId: PopulatedUser;
};

interface RecommendedDoctor {
  id: Types.ObjectId;
  name?: string;
  specialization: string;
  experience: number;
  rating: number;
  consultationFee: number;
  location?: string;
  isAvailable: "Available" | "Busy" | "In Surgery" | "On Break" | "Offline";
  nextAvailable?: string;
}

export const handleChat = asyncHandler(
  async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const classificationPrompt = `Classify the following user message as health-related or not.Return ONLY one word: health OR not_health
    Message: ${message}`;

    const classification = await askGemini(classificationPrompt);

    if (classification.trim().toLowerCase().includes("not_health")) {
      return res.json({
        reply:
          "I'm designed to answer health-related questions. Please ask something related to health.",
      });
    }

    const specializations = await Doctor.distinct("specialization", {
      "verification.status": "verified",
      isAvailable: { $ne: "Offline" },
    });

    const specializationPrompt = `
    You are a medical triage assistant.

    Based on the user's health concern, identify which doctor specialization from the list below is most relevant.
    Return ONLY the exact specialization string from the list, or "none" if no match applies.

    Available specializations:
    ${specializations.map((s, i) => `${i + 1}. ${s}`).join("\n")}

    User concern: ${message}`;

    const matchedSpec = (await askGemini(specializationPrompt)).trim();

    let recommendedDoctors: PopulatedDoctor[] = [];
    if (
      matchedSpec.toLowerCase() !== "none" &&
      specializations.includes(matchedSpec)
    ) {
      recommendedDoctors = await Doctor.find({
        specialization: matchedSpec,
        "verification.status": "verified",
        isAvailable: { $ne: "Offline" },
      })
        .populate<{ userId: PopulatedUser }>("userId", "name email")
        .select(
          "userId specialization experience rating consultationFee location isAvailable nextAvailable",
        )
        .sort({ rating: -1 })
        .limit(5);
    }

    const recommendedDoctorResponse: RecommendedDoctor[] =
      recommendedDoctors.map((doc) => ({
        id: doc._id,
        name: doc.userId?.name,
        specialization: doc.specialization,
        experience: doc.experience,
        rating: doc.rating,
        consultationFee: doc.consultationFee,
        location: doc.location,
        isAvailable: doc.isAvailable,
        nextAvailable: doc.nextAvailable,
      }));

    // Step 5: Generate health advice
    const healthPrompt = `
    You are a helpful health assistant.
    Give general health guidance but do NOT diagnose diseases.
    Always recommend consulting a medical professional for serious issues.
    ${
      recommendedDoctors.length > 0
        ? `Note: The user will also be shown a list of ${matchedSpec} specialists.`
        : ""
    }

    User question: ${message}`;

    const healthAdvice = await askGemini(healthPrompt);

    return res.json({
      reply: healthAdvice,
      recommendedDoctors: recommendedDoctorResponse,
      matchedSpecialization:
        matchedSpec.toLowerCase() !== "none" ? matchedSpec : null,
    });
  },
);
