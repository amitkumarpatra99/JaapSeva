import { useCallback, useEffect, useRef } from 'react';

// Use a major pentatonic scale for a pleasant, harmonious chime
const BELL_FREQUENCIES = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

export default function useSound(enabled: boolean = true, vibrationEnabled: boolean = true) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContextRef.current = new AudioContext();
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playClick = useCallback(() => {
    if (!enabled) return;
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Samsung/System UI "Tick" is usually high pitch and extremely short
    osc.type = 'sine';
    const now = ctx.currentTime;
    
    // High frequency starting point dropping fast
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);

    // Very tight envelope (percussive)
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.005); // Sharp attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03); // Instant decay

    osc.start(now);
    osc.stop(now + 0.04);

    if (vibrationEnabled && navigator.vibrate) {
       try { navigator.vibrate(5); } catch(e) {}
    }
  }, [enabled, vibrationEnabled, initAudio]);

  const playMalaComplete = useCallback(() => {
    if (!enabled && !vibrationEnabled) return;
    
    if (enabled) {
      initAudio();
      const ctx = audioContextRef.current;
      if (ctx) {
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;

        BELL_FREQUENCIES.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          // Sine waves for pure "singing bowl" tone
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          
          gain.gain.setValueAtTime(0, now);
          // Slower attack for "swelling" sound
          gain.gain.linearRampToValueAtTime(0.15 / (i + 1), now + 0.1 + (i * 0.05)); 
          // Very long, smooth decay
          gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

          osc.start(now);
          osc.stop(now + 3.5);
        });
      }
    }

    if (vibrationEnabled && navigator.vibrate) {
      try { navigator.vibrate([50, 50, 50, 50, 200]); } catch(e) {}
    }
  }, [enabled, vibrationEnabled, initAudio]);

  const playReset = useCallback(() => {
    if (!enabled) return;
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Gentle "Airy" sweep
    osc.type = 'sine';
    const now = ctx.currentTime;
    
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);

    if (vibrationEnabled && navigator.vibrate) {
        try { navigator.vibrate(10); } catch(e) {}
     }
  }, [enabled, vibrationEnabled, initAudio]);

  return { playClick, playMalaComplete, playReset };
}
