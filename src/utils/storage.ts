import AsyncStorage from '@react-native-async-storage/async-storage';

// A single day's outfit/style curation entry, shown on the Home screen.
// Nothing currently writes these — see addLogEntry below — so the log
// starts out (and stays) empty until something wires it up.
export interface LogEntry {
  id: string;
  date: string;
  vibe: string;
  weather: string;
  top: string;
  bottom: string;
  shoes: string;
  fragranceName: string;
  fragranceNotes: string;
}

const STORAGE_KEY = '@stylescan/log_entries';

// Returns entries newest-first.
export async function getLogEntries(): Promise<LogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch {
    return [];
  }
}

export async function addLogEntry(entry: LogEntry): Promise<void> {
  const entries = await getLogEntries();
  entries.unshift(entry);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export async function clearLogEntries(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
