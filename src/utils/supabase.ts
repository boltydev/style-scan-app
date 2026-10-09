import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Config.SUPABASE_URL;
const SUPABASE_ANON_KEY = Config.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Falls back to a placeholder client when env vars are missing so the app
// doesn't crash on import — callers should check isSupabaseConfigured (or
// let profileApi's calls fail gracefully) before relying on network calls.
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
