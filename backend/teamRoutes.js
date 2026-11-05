import { Router } from "express";

export function createTeamRoutes(client) {
  const router = Router();

  function sendError(error, res) {
    console.error("[TEAM API]", error.message);

    if (error.status === 401) {
      return res.status(401).json({ error: "Invalid OpenAI API key." });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: "OpenAI rate limit or quota reached." });
    }

    return res.status(502).json({
      error: "AI request failed. Check backend logs.",
    });
  }

  router.post("/scan", async (req, res) => {
    const { imageBase64, reading } = req.body || {};

    if (
      typeof imageBase64 !== "string" ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(imageBase64) ||
      imageBase64.length > 7_000_000
    ) {
      return res.status(400).json({
        error: "Invalid or oversized image.",
      });
    }

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are Lune AI. Analyze visible grooming
features without identifying the person or inferring race,
ethnicity, or health. Respond with valid JSON only.

Return exactly this structure:
{
  "faceShape": {
    "shape": "Oval|Round|Square|Heart|Diamond|Oblong|Unknown",
    "confidence": "High|Medium|Low",
    "notes": "short explanation"
  },
  "hairLength": {
    "length": "Bald|Buzzed|Short|Medium|Long|Unknown",
    "notes": "short explanation"
  },
  "skinTone": {
    "tone": "Fair|Light|Medium|Tan|Deep|Unknown",
    "undertone": "Warm|Cool|Neutral",
    "notes": "short explanation"
  },
  "facialHair": {
    "present": false,
    "type": "Clean shaven|Stubble|Mustache only|Goatee|Short beard|Full beard|Unknown",
    "notes": "short explanation"
  },
  "summary": "two sentence summary"
}
Use Unknown when a feature cannot be determined.
Do not invent confidence scores from measurements.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this photo. On-device face
reading, if available: ${JSON.stringify(reading ?? null).slice(0, 3000)}`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: "low",
                },
              },
            ],
          },
        ],
      });

      const result = JSON.parse(
        response.choices[0]?.message?.content || "{}"
      );

      if (
        !result.faceShape ||
        !result.skinTone ||
        !result.facialHair ||
        typeof result.summary !== "string"
      ) {
        return res.status(502).json({
          error: "Incomplete face analysis returned.",
        });
      }

      // Keep confidence compatible with the team's ScanResult type.
      if (!["High", "Medium", "Low"].includes(result.faceShape.confidence)) {
        result.faceShape.confidence = "Low";
      }

      return res.json(result);
    } catch (error) {
      return sendError(error, res);
    }
  });

  router.post("/recommendations", async (req, res) => {
    const { scan } = req.body || {};

    if (
      !scan ||
      typeof scan !== "object" ||
      Array.isArray(scan) ||
      !scan.faceShape ||
      !scan.skinTone ||
      !scan.facialHair
    ) {
      return res.status(400).json({
        error: "Valid scan data is required.",
      });
    }

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are Lune AI, a grooming assistant.
Return valid JSON with exactly:
{
  "hairstyles": [
    { "name": "style", "reason": "explanation" }
  ],
  "beardStyles": [
    { "name": "style", "reason": "explanation" }
  ],
  "summary": "friendly overall recommendation"
}
Recommend 3 hairstyles and up to 3 beard styles.
Use an empty beardStyles array if not applicable.
Be practical, respectful, and personalized.`,
          },
          {
            role: "user",
            content: JSON.stringify(scan),
          },
        ],
      });

      const result = JSON.parse(
        response.choices[0]?.message?.content || "{}"
      );

      if (
        !Array.isArray(result.hairstyles) ||
        !Array.isArray(result.beardStyles) ||
        typeof result.summary !== "string"
      ) {
        return res.status(502).json({
          error: "Incomplete recommendations returned.",
        });
      }

      return res.json(result);
    } catch (error) {
      return sendError(error, res);
    }
  });

  return router;
}
