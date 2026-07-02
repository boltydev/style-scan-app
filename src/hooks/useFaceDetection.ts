import { useState, useCallback } from 'react';
import FaceDetection, {
  FaceDetectorContourMode,
  FaceDetectorLandmarkMode,
  FaceDetectorPerformanceMode,
} from '@react-native-ml-kit/face-detection';
import type { FaceGeometry } from '../utils/types';

export function useFaceDetection() {
  const [detecting, setDetecting] = useState(false);

  // Runs on-device. Returns null if no face was found.
  const detectFace = useCallback(async (photoUri: string): Promise<FaceGeometry | null> => {
    setDetecting(true);
    try {
      const faces = await FaceDetection.detect(photoUri, {
        performanceMode: FaceDetectorPerformanceMode.ACCURATE,
        landmarkMode: FaceDetectorLandmarkMode.ALL,
        contourMode: FaceDetectorContourMode.ALL,
        classificationMode: true,
        minFaceSize: 0.1,
      });

      if (!faces || faces.length === 0) return null;

      // If more than one face was caught in frame, use the biggest one.
      const main = faces.reduce((biggest, f) =>
        f.frame.width * f.frame.height > biggest.frame.width * biggest.frame.height ? f : biggest
      );

      return {
        bounds: {
          x: main.frame.left,
          y: main.frame.top,
          width: main.frame.width,
          height: main.frame.height,
        },
        rollAngle: main.rollAngle ?? 0,
        yawAngle: main.yawAngle ?? 0,
        smilingProbability: main.smilingProbability,
      };
    } finally {
      setDetecting(false);
    }
  }, []);

  return { detecting, detectFace };
}
