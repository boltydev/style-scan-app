import { FileAccess } from 'react-native-file-access';
import type { FaceGeometry, ScanResult } from './types';

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// ⚠️ IMPORTANT: Never hardcode API keys in your app!
// Before shipping this app, move this call to a backend server you control,
// so the key never lives inside the app itself.
// Get your API key from: https://platform.openai.com/api-keys
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";

export async function scanFace(
  photoUri: string,
  geometry: FaceGeometry | null
): Promise<ScanResult> {
  if (OPENAI_API_KEY === "YOUR_OPENAI_API_KEY") {
    throw new Error(
      "OpenAI API key not set. Set REACT_APP_OPENAI_API_KEY environment variable."
    );
  }

  // Convert file URI to base64
  const base64 = await FileAccess.readFile(photoUri, 'utf8')
    .then(data => Buffer.from(data).toString('base64'))
    .catch(async () => {
      // If direct read fails, try reading as base64
      return await FileAccess.readFile(photoUri, 'base64');
    });

  const geometryNote = geometry
    ? `On-device face detection found a face at roughly ${geometry.bounds.width}x${geometry.bounds.height}px, head roll ${geometry.rollAngle.toFixed(1)}°, yaw ${geometry.yawAngle.toFixed(1)}°.`
    : "On-device face detection did not find a clear face — analyze directly from the image.";

  const systemPrompt = `You are a precise visual analysis assistant. You assess face shape, skin tone, and presence/type of facial hair from a photo. You respond with ONLY valid JSON, no markdown, no extra commentary.`;

  const userPrompt = `Analyze this photo and assess: face shape, skin tone, and facial hair. ${geometryNote}

Respond with ONLY this exact JSON shape, nothing else:
{
  "faceShape": {
    "shape": "<Oval|Round|Square|Heart|Diamond|Oblong|Unknown>",
    "confidence": "<High|Medium|Low>",
    "notes": "<one short sentence on why>"
  },
  "skinTone": {
    "tone": "<Fair|Light|Medium|Tan|Deep>",
    "undertone": "<Warm|Cool|Neutral>",
    "notes": "<one short sentence>"
  },
  "facialHair": {
    "present": <true|false>,
    "type": "<Clean shaven|Stubble|Mustache only|Goatee|Short beard|Full beard|Unknown>",
    "notes": "<one short sentence>"
  },
  "summary": "<2 sentence plain-language summary of the overall scan>"
}`;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Scan failed (${response.status}): ${
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
  return JSON.parse(cleaned) as ScanResult;
}
