import { useState, useEffect } from "react";
import { STORAGE_KEYS, DEFAULTS } from "@/lib/constants";

export function useSettings() {
  const [soundEnabled, setSoundEnabled] = useState(DEFAULTS.SOUND_ENABLED);
  const [hapticEnabled, setHapticEnabled] = useState(DEFAULTS.HAPTIC_ENABLED);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedSound = localStorage.getItem(STORAGE_KEYS.SOUND);
    const savedHaptic = localStorage.getItem(STORAGE_KEYS.HAPTIC);

    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    if (savedHaptic !== null) setHapticEnabled(savedHaptic === "true");
  }, []);

  // Save Effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND, soundEnabled.toString());
    localStorage.setItem(STORAGE_KEYS.HAPTIC, hapticEnabled.toString());
  }, [soundEnabled, hapticEnabled]);

  return {
    soundEnabled,
    setSoundEnabled,
    hapticEnabled,
    setHapticEnabled,
  };
}
