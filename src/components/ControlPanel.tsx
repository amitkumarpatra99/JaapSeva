"use client";

import { RotateCcw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  selectedTarget: number;
  onTargetSelect: (target: number) => void;
  onResetRequest: () => void;
  onUndo: () => void;
  onLockToggle: () => void;
}

const PRESETS = [11, 27, 54, 108];

export default function ControlPanel({
  selectedTarget,
  onTargetSelect,
  onResetRequest,
  onUndo,
  onLockToggle,
}: ControlPanelProps) {
  return (

    <div className="w-full max-w-sm flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200">

      {/* Unified Glass Control Capsule */}
      <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-2 flex flex-col gap-2">

        {/* Top Row: Presets */}
        <div className="flex justify-between items-center bg-white/30 rounded-[1.5rem] p-1.5 border border-white/40">
          {PRESETS.map((target) => (
            <button
              key={target}
              onClick={() => onTargetSelect(target)}
              className={cn(
                "flex-1 py-3 rounded-[1.2rem] font-bold text-xs tracking-wider transition-all duration-300",
                selectedTarget === target
                  ? "bg-gradient-to-br from-jaap-primary to-jaap-accent text-white shadow-[0_4px_12px_-2px_rgba(245,158,11,0.4)] scale-100"
                  : "text-jaap-neutral/70 hover:bg-white/50 hover:text-jaap-primary"
              )}
            >
              {target}
            </button>
          ))}
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex items-center justify-between px-2 pb-1 pt-1 gap-2">
          <button
            onClick={onUndo}
            className="flex-1 flex justify-center items-center gap-2 text-jaap-neutral/60 hover:text-jaap-primary transition-all text-[10px] font-bold uppercase tracking-widest py-3 rounded-2xl hover:bg-white/40 group"
            title="Undo"
          >
            <RotateCcw size={16} className="-scale-x-100 group-hover:-rotate-12 transition-transform" />
            <span>Undo</span>
          </button>

          <div className="w-px h-8 bg-jaap-primary/10" />

          <button
            onClick={onLockToggle}
            className="flex-[1.5] flex justify-center items-center gap-2 text-jaap-primary hover:text-jaap-accent transition-all text-xs font-bold uppercase tracking-widest py-3 rounded-2xl bg-white/40 hover:bg-white/60 border border-white/50 shadow-sm hover:shadow-md active:scale-95"
          >
            <Lock size={16} />
            <span>Lock Only</span>
          </button>

          <div className="w-px h-8 bg-jaap-primary/10" />

          <button
            onClick={onResetRequest}
            className="flex-1 flex justify-center items-center gap-2 text-jaap-neutral/60 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest py-3 rounded-2xl hover:bg-red-50/50 group"
            title="Reset"
          >
            <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

    </div>
  );
}
