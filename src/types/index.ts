export interface HistorySession {
  id: string;
  date: string; // ISO string
  count: number;
  target: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
}
