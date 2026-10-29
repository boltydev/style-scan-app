// The data we get back from on-device face detection (ML Kit).
export interface FaceGeometry {
  bounds: { x: number; y: number; width: number; height: number };
  rollAngle: number;
  yawAngle: number;
  smilingProbability?: number;
}

export type FaceShape = "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong" | "Unknown";

// Face proportions measured from the ML Kit contour, relative to cheekbone width.
export interface FaceMeasurements {
  lengthToWidth: number;
  foreheadToCheek: number;
  jawToCheek: number;
}

export interface FaceShapeEstimate {
  shape: FaceShape;
  confidence: "High" | "Medium" | "Low";
  runnerUp: FaceShape;
  notes: string;
  measurements: FaceMeasurements;
}

// Everything the phone can tell about the face before anything is sent to OpenAI.
export interface FaceReading {
  geometry: FaceGeometry;
  faceShape: FaceShapeEstimate | null;
  pitchAngle: number;
  leftEyeOpenProbability?: number;
  rightEyeOpenProbability?: number;
  // Face width as a fraction of the photo width.
  frameCoverage: number | null;
}

// The structured result we ask the AI to return.
// This is designed to be easy to hand to OpenAI afterward
// for hairstyle + beard style recommendations.
export interface ScanResult {
  faceShape: {
    shape: FaceShape;
    confidence: "High" | "Medium" | "Low";
    notes: string;
  };
  // Optional because scans saved before this field existed (and rows loaded
  // back from Supabase, which has no column for it) won't include it.
  hairLength?: {
    length: string;      // e.g. "Bald", "Buzzed", "Short", "Medium", "Long"
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
