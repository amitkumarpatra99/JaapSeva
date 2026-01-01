"use client";

import { cn } from "@/lib/utils";

interface StatsDisplayProps {
  target: number;
  currentCount: number;
}

export default function StatsDisplay({ target, currentCount }: StatsDisplayProps) {
  const progress = Math.min((currentCount / target) * 100, 100);

  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="flex justify-between items-end text-sm font-medium text-jaap-neutral">
        <span>Progress</span>
        <span>{currentCount} / {target}</span>
      </div>
      
      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-jaap-saffron transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {currentCount >= target && (
        <p className="text-center text-jaap-saffron font-medium animate-pulse mt-2">
          Target Reached! 🙏
        </p>
      )}
    </div>
  );
}
