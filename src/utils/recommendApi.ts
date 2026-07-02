import type { ScanResult, RecommendationResult } from "./types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// ⚠️ IMPORTANT: Never hardcode API keys in your app!
// Before shipping this app, move this call to a backend server you control,
// so the key never lives inside the app itself.
// Get your API key from: https://platform.openai.com/api-keys
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";

export async function getRecommendations(scan: ScanResult): Promise<RecommendationResult> {
  if (OPENAI_API_KEY === "YOUR_OPENAI_API_KEY") {
    throw new Error(
      "OpenAI API key not set. Set REACT_APP_OPENAI_API_KEY environment variable."
    );
  }

  const systemPrompt = `You are a friendly men's grooming and hairstyling expert. Based on structured face-scan data (face shape, skin tone, facial hair), you recommend hairstyles and, if relevant, beard styles. You respond with ONLY valid JSON, no markdown, no extra commentary.`;

  const userPrompt = `Here is a person's face scan data:
${JSON.stringify(scan, null, 2)}

Based on this data, recommend 3 hairstyles and (if facial hair is relevant — i.e. they currently have or could grow facial hair) up to 3 beard styles. If facial hair clearly isn't applicable, return an empty array for beardStyles.

Respond with ONLY this exact JSON shape:
{
  "hairstyles": [
    { "name": "<style name>", "reason": "<one sentence tailored to their face shape and skin tone>" }
  ],
  "beardStyles": [
    { "name": "<style name>", "reason": "<one sentence tailored to their face shape>" }
  ],
  "summary": "<2-3 sentence friendly overall styling summary>"
}`;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Recommendations failed (${response.status}): ${
        errorData.error?.message || "Unknown error"
      }. Please check your API key and try again.`
    );
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";

  if (!raw) {
    throw new Error("No response from OpenAI. Please try again.");
  }

  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as RecommendationResult;
}
