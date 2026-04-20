import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Mantra } from "@/components/ControlPanel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom Mantras Storage
const CUSTOM_MANTRAS_KEY = "jaap_custom_mantras";

export function getCustomMantras(): Mantra[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CUSTOM_MANTRAS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCustomMantras(mantras: Mantra[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_MANTRAS_KEY, JSON.stringify(mantras));
  } catch (error) {
    console.error("Failed to save custom mantras:", error);
  }
}

export function addCustomMantra(mantra: Omit<Mantra, "id">): Mantra {
  const customMantras = getCustomMantras();
  const newMantra: Mantra = {
    ...mantra,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  customMantras.push(newMantra);
  saveCustomMantras(customMantras);
  return newMantra;
}

export function removeCustomMantra(id: string): void {
  const customMantras = getCustomMantras();
  const filtered = customMantras.filter(m => m.id !== id);
  saveCustomMantras(filtered);
}
