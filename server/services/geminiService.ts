import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
});

const TIMEOUT_MS = 20_000;
const MAX_RETRIES = 2;

export const askGemini = async (
  prompt: string,
  retries: number = 0,
): Promise<string> => {
  try {
    const result = await Promise.race([
      model.generateContent(prompt),

      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Gemini request timed out")),
          TIMEOUT_MS,
        ),
      ),
    ]);

    return result.response.text();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    const isRetryable =
      errorMessage.includes("timed out") ||
      errorMessage.includes("503") ||
      errorMessage.includes("429");

    if (isRetryable && retries < MAX_RETRIES) {
      const delay = 1000 * (retries + 1);

      console.warn(
        `⚠️ Gemini attempt ${retries + 1} failed, retrying in ${delay}ms...`,
      );

      await new Promise<void>((resolve) => setTimeout(resolve, delay));

      return askGemini(prompt, retries + 1);
    }

    console.error("❌ Gemini API error:", errorMessage);

    throw new Error("AI service is temporarily unavailable. Please try again.");
  }
};
