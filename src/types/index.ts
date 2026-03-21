export interface HistorySession {
  id: string;
  date: string; // ISO string
  count: number;
  target: number;
  mantraId?: string;
  mantraName?: string;
  mantraSymbol?: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
}
