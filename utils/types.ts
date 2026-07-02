// The data we get back from on-device face detection (ML Kit).
export interface FaceGeometry {
  bounds: { x: number; y: number; width: number; height: number };
  rollAngle: number;
  yawAngle: number;
  smilingProbability?: number;
}

// The structured result we ask the AI to return.
// This is designed to be easy to hand to Claude/OpenAI afterward
// for hairstyle + beard style recommendations.
export interface ScanResult {
  faceShape: {
    shape: "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong" | "Unknown";
    confidence: "High" | "Medium" | "Low";
    notes: string;
  };
  skinTone: {
    tone: string;        // e.g. "Fair", "Light", "Medium", "Tan", "Deep"
    undertone: "Warm" | "Cool" | "Neutral";
    notes: string;
  };
  facialHair: {
    present: boolean;
    type: string;        // e.g. "Full beard", "Stubble", "Mustache only", "Clean shaven"
    notes: string;
  };
  summary: string;
}

// What we send onward to an AI assistant for style recommendations.
export interface RecommendationRequest {
  scan: ScanResult;
}

export interface RecommendationResult {
  hairstyles: { name: string; reason: string }[];
  beardStyles: { name: string; reason: string }[];
  summary: string;
}
