import { FileSystem } from 'react-native-file-access';
import type { FaceReading, ScanResult } from './types';
import { postToBackend } from './backendConfig';

export async function scanFace(
  photoUri: string,
  reading: FaceReading | null
): Promise<ScanResult> {
  // Convert the captured photo to Base64.
  const imageBase64 = await FileSystem.readFile(photoUri, 'base64');

  // Send the photo and the on-device face reading to the backend,
  // which runs the OpenAI analysis.
  return postToBackend<ScanResult>(
    '/api/scan',
    { imageBase64, reading },
    'Face scan failed'
  );
}
