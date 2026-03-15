import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const TIMEOUT_MS = 20000;
const MAX_RETRIES = 2;

export const askGemini = async (prompt, retries = 0) => {
  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Gemini request timed out")),
          TIMEOUT_MS,
        ),
      ),
    ]);

    return result.response.text();
  } catch (error) {
    const isRetryable =
      error.message.includes("timed out") ||
      error.message.includes("503") ||
      error.message.includes("429");

    if (isRetryable && retries < MAX_RETRIES) {
      const delay = 1000 * (retries + 1);
      console.warn(
        `⚠️ Gemini attempt ${retries + 1} failed, retrying in ${delay}ms...`,
      );
      await new Promise((res) => setTimeout(res, delay));
      return askGemini(prompt, retries + 1);
    }

    console.error("❌ Gemini API error:", error.message);
    throw new Error("AI service is temporarily unavailable. Please try again.");
  }
};
