import type { Face, Point } from '@react-native-ml-kit/face-detection';
import type { FaceMeasurements, FaceShape, FaceShapeEstimate } from './types';

// On-device face shape estimate, built only from ML Kit's face contour.
//
// ML Kit's "face" contour is a 36-point oval that runs from the upper
// forehead (not the hairline) down to the chin. We level it using the eye
// line, then measure its width at a few heights and compare the ratios to a
// prototype for each shape.
//
// The prototype numbers are starting estimates, not trained values. Tune them
// against real scans (the raw ratios are shown on the Face Reading screen).

type Prototype = { lengthToWidth: number; foreheadToCheek: number; jawToCheek: number };

const PROTOTYPES: Record<Exclude<FaceShape, 'Unknown'>, Prototype> = {
  Oval: { lengthToWidth: 1.32, foreheadToCheek: 0.86, jawToCheek: 0.8 },
  Round: { lengthToWidth: 1.12, foreheadToCheek: 0.86, jawToCheek: 0.86 },
  Square: { lengthToWidth: 1.18, foreheadToCheek: 0.93, jawToCheek: 0.94 },
  Oblong: { lengthToWidth: 1.52, foreheadToCheek: 0.9, jawToCheek: 0.86 },
  Heart: { lengthToWidth: 1.28, foreheadToCheek: 0.96, jawToCheek: 0.72 },
  Diamond: { lengthToWidth: 1.32, foreheadToCheek: 0.76, jawToCheek: 0.76 },
};

// How far a ratio can drift before it counts as one "unit" of difference.
// Length varies more between people than the width ratios do.
const TOLERANCE: Prototype = { lengthToWidth: 0.14, foreheadToCheek: 0.06, jawToCheek: 0.06 };

const SHAPE_NOTES: Record<FaceShape, string> = {
  Oval: 'Balanced proportions, slightly longer than wide, with a jaw a little narrower than the cheekbones.',
  Round: 'Width and length are close, with soft, even width from cheeks to jaw.',
  Square: 'Forehead, cheekbones, and jaw are similar widths with a strong jawline.',
  Oblong: 'Noticeably longer than wide, with fairly straight sides.',
  Heart: 'Wider across the forehead and cheekbones, narrowing to the chin.',
  Diamond: 'Cheekbones are the widest point, with a narrower forehead and jaw.',
  Unknown: 'The face outline was not clear enough to measure.',
};

export function estimateFaceShape(face: Face): FaceShapeEstimate | null {
  const outline = face.contours?.face?.points;
  if (!outline || outline.length < 10) return null;

  const points = levelPoints(outline, face);
  const ys = points.map((p) => p.y);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const length = bottom - top;
  if (length <= 0) return null;

  const widthAt = (fraction: number) => widthAtY(points, top + length * fraction);

  const forehead = widthAt(0.2);
  // Cheekbones are the widest band of the upper-middle face.
  const cheek = Math.max(widthAt(0.35), widthAt(0.42), widthAt(0.5), widthAt(0.57));
  const jaw = widthAt(0.78);
  if (!cheek) return null;

  const measurements: FaceMeasurements = {
    lengthToWidth: length / cheek,
    foreheadToCheek: forehead / cheek,
    jawToCheek: jaw / cheek,
  };

  const ranked = (Object.keys(PROTOTYPES) as (keyof typeof PROTOTYPES)[])
    .map((shape) => ({ shape, distance: distanceTo(measurements, PROTOTYPES[shape]) }))
    .sort((a, b) => a.distance - b.distance);

  const [best, runnerUp] = ranked;
  const margin = runnerUp.distance - best.distance;

  return {
    shape: best.shape,
    confidence: margin > 0.6 ? 'High' : margin > 0.25 ? 'Medium' : 'Low',
    runnerUp: runnerUp.shape,
    notes: SHAPE_NOTES[best.shape],
    measurements,
  };
}

function distanceTo(m: FaceMeasurements, p: Prototype) {
  return Math.sqrt(
    ((m.lengthToWidth - p.lengthToWidth) / TOLERANCE.lengthToWidth) ** 2 +
      ((m.foreheadToCheek - p.foreheadToCheek) / TOLERANCE.foreheadToCheek) ** 2 +
      ((m.jawToCheek - p.jawToCheek) / TOLERANCE.jawToCheek) ** 2,
  );
}

// Rotate the outline so the eyes sit on a horizontal line. Using the eye
// landmarks avoids depending on ML Kit's roll-angle sign convention.
function levelPoints(points: Point[], face: Face): Point[] {
  const leftEye = face.landmarks?.leftEye?.position;
  const rightEye = face.landmarks?.rightEye?.position;
  if (!leftEye || !rightEye) return points;

  let angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  // Left/right may be from the subject's point of view; either way we only
  // want the tilt of the line, not its direction.
  if (angle > Math.PI / 2) angle -= Math.PI;
  if (angle < -Math.PI / 2) angle += Math.PI;

  const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);

  return points.map((p) => ({
    x: cx + (p.x - cx) * cos - (p.y - cy) * sin,
    y: cy + (p.x - cx) * sin + (p.y - cy) * cos,
  }));
}

// Width of the closed outline along a horizontal line at height y.
function widthAtY(points: Point[], y: number): number {
  const xs: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    if ((a.y <= y && b.y > y) || (b.y <= y && a.y > y)) {
      xs.push(a.x + ((y - a.y) / (b.y - a.y)) * (b.x - a.x));
    }
  }
  return xs.length >= 2 ? Math.max(...xs) - Math.min(...xs) : 0;
}
