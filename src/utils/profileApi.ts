import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dirs, FileSystem } from 'react-native-file-access';
import { supabase, isSupabaseConfigured } from './supabase';
import type { RecommendationResult, ScanResult } from './types';

// Scan history lives on the device first, so it works with no backend setup.
// When Supabase is configured, each scan is also copied to the user's profile
// there (best-effort — a failed sync never loses the local copy).

export interface SavedScan {
  id: string;
  createdAt: string;
  result: ScanResult;
  // File name inside Documents/scans. iOS changes the app container path
  // between installs, so the full path is rebuilt on read (see photoUri).
  photoFile: string | null;
  onDeviceShape?: string;
  recommendations?: RecommendationResult;
  // Row id in Supabase's scans table, once synced.
  remoteId?: string;
}

const STORAGE_KEY = 'stylescan.scanHistory.v1';
const PHOTO_DIR = `${Dirs.DocumentDir}/scans`;

export function photoUri(scan: SavedScan): string | null {
  return scan.photoFile ? `file://${PHOTO_DIR}/${scan.photoFile}` : null;
}

async function readAll(): Promise<SavedScan[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedScan[];
  } catch {
    return [];
  }
}

async function writeAll(scans: SavedScan[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
}

async function updateScan(id: string, changes: Partial<SavedScan>): Promise<void> {
  const scans = await readAll();
  await writeAll(scans.map((s) => (s.id === id ? { ...s, ...changes } : s)));
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Saves a completed scan (and a copy of its photo) to the user's profile.
export async function saveScan(
  result: ScanResult,
  sourcePhotoUri: string | null,
  onDeviceShape?: string
): Promise<SavedScan> {
  const id = newId();

  // The captured photo sits in a temp folder iOS can clear, so keep a copy.
  let photoFile: string | null = null;
  if (sourcePhotoUri) {
    try {
      if (!(await FileSystem.exists(PHOTO_DIR))) {
        await FileSystem.mkdir(PHOTO_DIR);
      }
      photoFile = `${id}.jpg`;
      await FileSystem.cp(sourcePhotoUri.replace(/^file:\/\//, ''), `${PHOTO_DIR}/${photoFile}`);
    } catch (e) {
      console.warn('Could not keep scan photo:', e instanceof Error ? e.message : e);
      photoFile = null;
    }
  }

  const scan: SavedScan = {
    id,
    createdAt: new Date().toISOString(),
    result,
    photoFile,
    onDeviceShape,
  };

  await writeAll([scan, ...(await readAll())]);

  syncScanToSupabase(scan).catch((e) => {
    console.warn('Could not sync scan to Supabase:', e instanceof Error ? e.message : e);
  });

  return scan;
}

// Returns the user's scan history, newest first.
export async function getScanHistory(): Promise<SavedScan[]> {
  return readAll();
}

export async function getSavedScan(id: string): Promise<SavedScan | null> {
  return (await readAll()).find((s) => s.id === id) ?? null;
}

// Attaches AI recommendations to a saved scan so they can be reopened
// from History without calling OpenAI again.
export async function saveRecommendations(
  id: string,
  recommendations: RecommendationResult
): Promise<void> {
  await updateScan(id, { recommendations });

  const scan = await getSavedScan(id);
  if (isSupabaseConfigured && scan?.remoteId) {
    const { error } = await supabase
      .from('scans')
      .update({ recommendations })
      .eq('id', scan.remoteId);
    if (error) {
      console.warn('Could not sync recommendations to Supabase:', error.message);
    }
  }
}

export async function deleteScan(id: string): Promise<void> {
  const scans = await readAll();
  const scan = scans.find((s) => s.id === id);
  await writeAll(scans.filter((s) => s.id !== id));

  if (scan?.photoFile) {
    FileSystem.unlink(`${PHOTO_DIR}/${scan.photoFile}`).catch(() => {});
  }

  if (isSupabaseConfigured && scan?.remoteId) {
    const { error } = await supabase.from('scans').delete().eq('id', scan.remoteId);
    if (error) {
      console.warn('Could not delete scan from Supabase:', error.message);
    }
  }
}

// ---------------------------------------------------------------------------
// Supabase sync
// ---------------------------------------------------------------------------

// Ensures there's a signed-in user, creating an anonymous one on first launch.
// The profiles row is created automatically by a DB trigger (see schema.sql).
export async function ensureSession(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user.id) {
    return data.session.user.id;
  }

  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error || !signInData.user) {
    throw new Error(error?.message || 'Could not start a session.');
  }
  return signInData.user.id;
}

async function syncScanToSupabase(scan: SavedScan): Promise<void> {
  if (!isSupabaseConfigured) return;

  const userId = await ensureSession();
  const { result } = scan;

  const { data, error } = await supabase
    .from('scans')
    .insert({
      user_id: userId,
      face_shape: result.faceShape.shape,
      face_shape_confidence: result.faceShape.confidence,
      face_shape_notes: result.faceShape.notes,
      hair_length: result.hairLength?.length ?? null,
      hair_length_notes: result.hairLength?.notes ?? null,
      skin_tone: result.skinTone.tone,
      undertone: result.skinTone.undertone,
      skin_tone_notes: result.skinTone.notes,
      facial_hair_present: result.facialHair.present,
      facial_hair_type: result.facialHair.type,
      facial_hair_notes: result.facialHair.notes,
      summary: result.summary,
      on_device_face_shape: scan.onDeviceShape ?? null,
      created_at: scan.createdAt,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await updateScan(scan.id, { remoteId: data.id });
}
