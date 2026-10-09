import { supabase, isSupabaseConfigured } from './supabase';
import type { ScanResult } from './types';

export interface SavedScan {
  id: string;
  faceShape: ScanResult['faceShape'];
  skinTone: ScanResult['skinTone'];
  facialHair: ScanResult['facialHair'];
  summary: string;
  createdAt: string;
}

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

// Saves a completed scan to the current user's profile.
export async function saveScan(scan: ScanResult): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file (see .env.example) and rebuild the app.'
    );
  }

  const userId = await ensureSession();

  const { error } = await supabase.from('scans').insert({
    user_id: userId,
    face_shape: scan.faceShape.shape,
    face_shape_confidence: scan.faceShape.confidence,
    face_shape_notes: scan.faceShape.notes,
    skin_tone: scan.skinTone.tone,
    undertone: scan.skinTone.undertone,
    skin_tone_notes: scan.skinTone.notes,
    facial_hair_present: scan.facialHair.present,
    facial_hair_type: scan.facialHair.type,
    facial_hair_notes: scan.facialHair.notes,
    summary: scan.summary,
  });

  if (error) {
    throw new Error(`Could not save scan: ${error.message}`);
  }
}

// Returns the current user's scan history, newest first.
export async function getScanHistory(): Promise<SavedScan[]> {
  if (!isSupabaseConfigured) return [];

  const userId = await ensureSession();

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    faceShape: {
      shape: row.face_shape as ScanResult['faceShape']['shape'],
      confidence: row.face_shape_confidence as ScanResult['faceShape']['confidence'],
      notes: row.face_shape_notes ?? '',
    },
    skinTone: {
      tone: row.skin_tone,
      undertone: row.undertone as ScanResult['skinTone']['undertone'],
      notes: row.skin_tone_notes ?? '',
    },
    facialHair: {
      present: row.facial_hair_present,
      type: row.facial_hair_type ?? '',
      notes: row.facial_hair_notes ?? '',
    },
    summary: row.summary ?? '',
    createdAt: row.created_at,
  }));
}
