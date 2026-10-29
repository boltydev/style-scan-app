import { FileSystem } from 'react-native-file-access';
import type { FaceReading, ScanResult } from './types';
import { BACKEND_BASE_URL } from './backendConfig';

export async function scanFace(
  photoUri: string,
  reading: FaceReading | null
): Promise<ScanResult> {

  // Convert the captured photo to Base64.
  const imageBase64 = await FileSystem.readFile(
    photoUri,
    'base64'
  );

  // Send the photo and Ryan's facial measurements
  // to the Lune AI backend.
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/scan`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        reading,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.error === 'string'
        ? data.error
        : `Face scan failed (${response.status}).`
    );
  }

  return data as ScanResult;
}
