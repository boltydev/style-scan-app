import Config from 'react-native-config';

// Address of the Lune AI backend (backend/server.js), which holds the OpenAI
// key so it never ships inside the app. During development this is your
// Mac's LAN IP — the phone must be on the same Wi-Fi. Set BACKEND_URL in
// .env and rebuild the app (not just reload JS) after changing it.
export const BACKEND_BASE_URL = (
  Config.BACKEND_URL ?? 'http://192.168.100.123:3002'
).replace(/\/$/, '');

// POST JSON to the backend and return the parsed response, turning network
// failures and non-JSON replies into readable errors.
export async function postToBackend<T>(
  path: string,
  body: unknown,
  failureLabel: string
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BACKEND_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      `Can't reach the StyleScan server at ${BACKEND_BASE_URL}. Make sure the backend is running and your phone is on the same Wi-Fi.`
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || data === null) {
    throw new Error(
      typeof data?.error === 'string'
        ? data.error
        : `${failureLabel} (${response.status}).`
    );
  }

  return data as T;
}
