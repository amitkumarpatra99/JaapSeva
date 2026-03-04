"use client";

import { RotateCcw, Lock, History, Volume2, VolumeX, Zap, ZapOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";

export interface Mantra {
  id: string;
  name: string;
  sanskrit: string;
  symbol: string;
  suggestedTarget: number;
}

export const MANTRAS: Mantra[] = [
  { id: "radha", name: "Radha Naam", sanskrit: "राधे राधे", symbol: "🌸", suggestedTarget: 108 },
  { id: "mritunjaya", name: "Maha Mrityunjaya", sanskrit: "ॐ त्र्यम्बकं", symbol: "🔱", suggestedTarget: 108 },
  { id: "ram", name: "Ram Naam", sanskrit: "श्री राम जय राम", symbol: "🪔", suggestedTarget: 108 },
  { id: "hanuman", name: "Hanuman Chalisa", sanskrit: "श्री हनुमान", symbol: "🙏", suggestedTarget: 40 },
];

interface ControlPanelProps {
  selectedTarget: number;
  onTargetSelect: (target: number) => void;
  selectedMantra: Mantra;
  onMantraSelect: (mantra: Mantra) => void;
  onResetRequest: () => void;
  onUndo: () => void;
  onLockToggle: () => void;
  onShowHistory: () => void;
  isLocked: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hapticEnabled: boolean;
  onToggleHaptic: () => void;
}

const PRESETS = [11, 108];

export default function ControlPanel({
  selectedTarget,
  onTargetSelect,
  selectedMantra,
  onMantraSelect,
  onResetRequest,
  onUndo,
  onLockToggle,
  onShowHistory,
  isLocked,
  soundEnabled,
  onToggleSound,
  hapticEnabled,
  onToggleHaptic,
}: ControlPanelProps) {
  return (

    <div className="w-full max-w-sm flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200">

      {/* Unified Glass Control Capsule matching Modal Style */}
      {/* old: bg-white/5 ... */}
      {/* new: bg-white/10 backdrop-blur-2xl border-white/20 shadow... */}
      <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-[2rem] p-2 flex flex-col gap-2">

        {/* Mantra Selector Row */}
        <div className="flex items-center bg-white/5 rounded-[1.5rem] p-1.5 border border-white/10 gap-1 overflow-x-auto scrollbar-none">
          {MANTRAS.map((mantra) => (
            <button
              key={mantra.id}
              onClick={() => {
                onMantraSelect(mantra);
                if (!isLocked) onTargetSelect(mantra.suggestedTarget);
              }}
              disabled={isLocked}
              title={mantra.sanskrit}
              className={cn(
                "flex-shrink-0 flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-[1.1rem] font-bold text-[9px] md:text-[10px] tracking-wider transition-all duration-300 min-w-[60px]",
                selectedMantra.id === mantra.id
                  ? "bg-black text-white shadow-md"
                  : "text-black/60 hover:bg-black/5 hover:text-black",
                isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
              )}
            >
              <span className="text-base leading-none">{mantra.symbol}</span>
              <span className="leading-tight text-center whitespace-nowrap">{mantra.name}</span>
            </button>
          ))}
        </div>

        {/* Presets Row (count targets) */}
        <div className="flex justify-between items-center bg-white/5 rounded-[1.5rem] p-1.5 border border-white/10 gap-2">
          {PRESETS.map((target) => (
            <button
              key={target}
              onClick={() => onTargetSelect(target)}
              disabled={isLocked}
              className={cn(
                "flex-1 py-4 md:py-3 rounded-[1.2rem] font-bold text-sm md:text-xs tracking-wider transition-all duration-300",
                selectedTarget === target
                  ? "bg-black text-white shadow-md scale-100"
                  : "text-black/60 hover:bg-black/5 hover:text-black",
                isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
              )}
            >
              {target}
            </button>
          ))}
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex items-center justify-between px-2 pb-1 pt-1 gap-2">

          {/* Left Group */}
          <div className="flex flex-1 gap-2">
            <button
              onClick={onUndo}
              disabled={isLocked}
              className="flex-1 flex justify-center items-center gap-2 text-black/60 hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-black/5 group disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <RotateCcw size={18} className="-scale-x-100 group-hover:-rotate-12 transition-transform" />
            </button>

            <button
              onClick={onShowHistory}
              className="flex-1 flex justify-center items-center gap-2 text-black/60 hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-black/5"
              title="History"
            >
              <History size={18} />
            </button>
          </div>

          <div className="w-px h-8 bg-black/10" />

          {/* Center Lock */}
          <button
            onClick={onLockToggle}
            className={cn(
              "flex-[1.5] flex justify-center items-center gap-2 transition-all text-xs font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl border shadow-sm mx-1",
              isLocked
                ? "bg-black text-white border-black/10 shadow-md"
                : "bg-white/10 text-black hover:text-black/70 hover:bg-white/30 border-white/20 hover:shadow-md active:scale-95"
            )}
          >
            <Lock size={18} />
            <span className="hidden md:inline">{isLocked ? "Unlock" : "Lock"}</span>
            {/* Show only icon or smaller text on very small screens if needed, but flex should handle it. Hiding text on mobile to save space. */}
            <span className="md:hidden">{isLocked ? "Unlock" : "Lock"}</span>
          </button>

          <div className="w-px h-8 bg-black/10" />

          {/* Right Group: Sound, Haptic, Reset */}
          <div className="flex flex-[1.5] gap-1">

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={cn(
                "flex-1 flex justify-center items-center gap-2 transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-black/5",
                soundEnabled ? "text-black" : "text-black/40"
              )}
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Haptic Toggle */}
            <button
              onClick={onToggleHaptic}
              className={cn(
                "flex-1 flex justify-center items-center gap-2 transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-black/5",
                hapticEnabled ? "text-black" : "text-black/40"
              )}
              title={hapticEnabled ? "Disable Vibration" : "Enable Vibration"}
            >
              {hapticEnabled ? <Zap size={18} /> : <ZapOff size={18} />}
            </button>

            {/* Reset */}
            <button
              onClick={onResetRequest}
              className="flex-1 flex justify-center items-center gap-2 text-black/60 hover:text-red-600 transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-black/5 group"
              title="Reset"
            >
              <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>

      </div>

      {/* Theme Switcher */}
      <div className="mt-4">
        <ThemeSwitcher />
      </div>
    </div >
  );
}
