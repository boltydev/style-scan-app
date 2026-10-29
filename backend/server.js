import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createTeamRoutes } from "./teamRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: "8mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 45000,
  maxRetries: 0,
});

app.use("/api", createTeamRoutes(client));

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "running",
    app: "Lune AI",
    port: PORT,
    aiConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
});

// Grooming advice endpoint
app.post("/api/grooming-advice", async (req, res) => {
  console.log("[GROOMING] Request received");

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OpenAI API key is missing.",
      });
    }

    const {
      faceShape,
      hairType,
      hairLength,
      beardStyle,
      skinTone,
      styleGoal,
    } = req.body || {};

    const prompt = `
You are Lune AI, a helpful grooming assistant.

Give personalized grooming recommendations.

User details:
Face shape: ${faceShape || "Not provided"}
Hair type: ${hairType || "Not provided"}
Hair length: ${hairLength || "Not provided"}
Beard style: ${beardStyle || "Not provided"}
Skin tone: ${skinTone || "Not provided"}
Style goal: ${styleGoal || "Not provided"}

Provide:
1. Hairstyle recommendation
2. Facial hair recommendation
3. Skincare or hair care tip
4. Overall grooming suggestion

Be practical, friendly, and respectful.
`;

    console.log("[GROOMING] Sending request to OpenAI");
    const start = Date.now();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Lune AI, a grooming assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log(
      "[GROOMING] OpenAI responded in",
      ((Date.now() - start) / 1000).toFixed(2),
      "seconds"
    );

    return res.json({
      advice:
        response.choices[0]?.message?.content ||
        "No grooming advice generated.",
    });
  } catch (error) {
    return handleAIError(error, res, "GROOMING");
  }
});

// AI photo analysis endpoint
app.post("/api/analyze-photo", async (req, res) => {
  console.log("[PHOTO] Request received");

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OpenAI API key is missing.",
      });
    }

    const { imageBase64 } = req.body || {};

    if (
      typeof imageBase64 !== "string" ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(imageBase64) ||
      imageBase64.length > 7_000_000
    ) {
      console.log("[PHOTO] Invalid image");

      return res.status(400).json({
        error: "Invalid or oversized image.",
      });
    }

    console.log(
      "[PHOTO] Image received:",
      Math.round(imageBase64.length / 1024),
      "KB base64"
    );

    const start = Date.now();

    console.log("[PHOTO] Sending image to OpenAI...");

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
You are Lune AI, a grooming analysis assistant.

Analyze visible grooming features only.
Do not identify the person.
Do not infer race, ethnicity, health,
or other sensitive personal attributes.
If a feature is unclear, say "Not clear".
Respond with valid JSON only.
          `,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Analyze this grooming photograph.

Return JSON with exactly these fields:

{
  "faceShape": "",
  "hairType": "",
  "hairLength": "",
  "beardStyle": "",
  "skinTone": ""
}

Describe:
- Approximate face shape
- Visible hair texture or hairstyle
- Approximate hair length
- Visible facial hair
- Apparent skin tone under current lighting

Do not guess hidden features.
Do not infer ethnicity or race.
Keep every value short.
              `,
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

    console.log(
      "[PHOTO] OpenAI responded in",
      ((Date.now() - start) / 1000).toFixed(2),
      "seconds"
    );

    const content =
      response.choices[0]?.message?.content;

    if (!content) {
      return res.status(502).json({
        error: "OpenAI returned no analysis.",
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(502).json({
        error: "Invalid JSON returned by AI.",
      });
    }

    const fields = [
      "faceShape",
      "hairType",
      "hairLength",
      "beardStyle",
      "skinTone",
    ];

    const analysis = {};

    for (const field of fields) {
      analysis[field] =
        typeof parsed[field] === "string"
          ? parsed[field].slice(0, 100)
          : "Not clear";
    }

    console.log("[PHOTO] Analysis complete");

    return res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    return handleAIError(error, res, "PHOTO");
  }
});

// Common OpenAI error handler
function handleAIError(error, res, route) {
  console.error(`[${route}] OpenAI error:`, {
    status: error.status,
    code: error.code,
    message: error.message,
  });

  if (error.status === 401) {
    return res.status(401).json({
      error: "Invalid OpenAI API key.",
    });
  }

  if (error.status === 429) {
    return res.status(429).json({
      error: "OpenAI quota or rate limit reached.",
    });
  }

  if (
    error.name === "APIConnectionTimeoutError" ||
    error.code === "ETIMEDOUT"
  ) {
    return res.status(504).json({
      error: "OpenAI request timed out.",
    });
  }

  if (error.status === 400) {
    return res.status(400).json({
      error: "OpenAI rejected the request.",
    });
  }

  return res.status(502).json({
    error: "AI request failed. Check backend logs.",
  });
}

// Invalid JSON and oversized requests
app.use((error, req, res, next) => {
  if (error.status === 413) {
    return res.status(413).json({
      error: "Image upload is too large.",
    });
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      error: "Invalid JSON request.",
    });
  }

  console.error("[SERVER] Request error:", error.message);

  return res.status(500).json({
    error: "Server request failed.",
  });
});

// Start backend
app.listen(PORT, "0.0.0.0", () => {
  console.log("--------------------------------");
  console.log("LUNE AI BACKEND ONLINE");
  console.log(`Port: ${PORT}`);
  console.log("Model: gpt-4o-mini");
  console.log(
    "OpenAI key configured:",
    Boolean(process.env.OPENAI_API_KEY)
  );
  console.log("POST /api/grooming-advice");
  console.log("POST /api/analyze-photo");
  console.log("--------------------------------");
});
