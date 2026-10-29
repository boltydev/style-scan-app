import { useState, useCallback } from 'react';
import { Image } from 'react-native';
import FaceDetection from '@react-native-ml-kit/face-detection';
import { estimateFaceShape } from '../utils/faceShape';
import type { FaceReading } from '../utils/types';

function getImageWidth(uri: string): Promise<number | null> {
  return new Promise((resolve) => {
    Image.getSize(uri, (width) => resolve(width), () => resolve(null));
  });
}

export function useFaceDetection() {
  const [detecting, setDetecting] = useState(false);

  // Runs on-device. Returns null if no face was found.
  const detectFace = useCallback(async (photoUri: string): Promise<FaceReading | null> => {
    setDetecting(true);
    try {
      const [faces, imageWidth] = await Promise.all([
        FaceDetection.detect(photoUri, {
          performanceMode: 'accurate',
          landmarkMode: 'all',
          contourMode: 'all',
          classificationMode: 'all',
          minFaceSize: 0.1,
        }),
        getImageWidth(photoUri),
      ]);

      if (!faces || faces.length === 0) return null;

      // If more than one face was caught in frame, use the biggest one.
      const main = faces.reduce((biggest, f) =>
        f.frame.width * f.frame.height > biggest.frame.width * biggest.frame.height ? f : biggest
      );

      return {
        geometry: {
          bounds: {
            x: main.frame.left,
            y: main.frame.top,
            width: main.frame.width,
            height: main.frame.height,
          },
          rollAngle: main.rotationZ ?? 0,
          yawAngle: main.rotationY ?? 0,
          smilingProbability: main.smilingProbability,
        },
        faceShape: estimateFaceShape(main),
        pitchAngle: main.rotationX ?? 0,
        leftEyeOpenProbability: main.leftEyeOpenProbability,
        rightEyeOpenProbability: main.rightEyeOpenProbability,
        frameCoverage: imageWidth ? main.frame.width / imageWidth : null,
      };
    } finally {
      setDetecting(false);
    }
  }, []);

  return { detecting, detectFace };
}
