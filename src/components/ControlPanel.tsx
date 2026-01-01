"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  selectedTarget: number;
  onTargetSelect: (target: number) => void;
  onResetRequest: () => void;
}

const PRESETS = [11, 27, 54, 108];

export default function ControlPanel({
  selectedTarget,
  onTargetSelect,
  onResetRequest,
}: ControlPanelProps) {
  return (
    <div className="w-full max-w-sm flex flex-col gap-6 items-center">
      <div className="flex gap-3 justify-center flex-wrap">
        {PRESETS.map((target) => (
          <button
            key={target}
            onClick={() => onTargetSelect(target)}
            className={cn(
              "px-4 py-2 rounded-full font-medium text-sm transition-all duration-200",
              selectedTarget === target
                ? "bg-jaap-blue text-white shadow-md scale-105"
                : "bg-white dark:bg-slate-800 text-jaap-neutral hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105"
            )}
          >
            {target}
          </button>
        ))}
      </div>

      <button
        onClick={onResetRequest}
        className="flex items-center gap-2 text-jaap-neutral hover:text-red-500 transition-colors text-sm font-medium px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
      >
        <RotateCcw size={16} />
        Reset Counter
      </button>
    </div>
  );
}
