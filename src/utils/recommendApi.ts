import type { ScanResult, RecommendationResult } from './types';
import { postToBackend } from './backendConfig';

// Sends the scan results (not the photo) to the backend's OpenAI stylist.
export async function getRecommendations(
  scan: ScanResult
): Promise<RecommendationResult> {
  return postToBackend<RecommendationResult>(
    '/api/recommendations',
    { scan },
    'Recommendations failed'
  );
}
