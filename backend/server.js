import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import { createTeamRoutes } from "./teamRoutes.js";

// Always read backend/.env, even when started from the project root.
dotenv.config({ path: fileURLToPath(new URL(".env", import.meta.url)) });

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
  console.log("POST /api/scan");
  console.log("POST /api/recommendations");
  console.log("--------------------------------");
});
