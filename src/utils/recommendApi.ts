import type {
  ScanResult,
  RecommendationResult,
} from './types';

import { BACKEND_BASE_URL } from './backendConfig';

export async function getRecommendations(
  scan: ScanResult
): Promise<RecommendationResult> {

  const response = await fetch(
    `${BACKEND_BASE_URL}/api/recommendations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scan,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.error === 'string'
        ? data.error
        : `Recommendations failed (${response.status}).`
    );
  }

  return data as RecommendationResult;
}
