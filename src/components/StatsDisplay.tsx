"use client";

import { cn } from "@/lib/utils";
import { Flame, Disc, BarChart3 } from "lucide-react";

interface StatsDisplayProps {
  target: number;
  currentCount: number;
  streak: number;
  malasCompleted: number;
  totalCount: number;
}

export default function StatsDisplay({
  target,
  streak,
  malasCompleted,
  totalCount
}: StatsDisplayProps) {

  // Updated to Soft Rounded Solid Design
  const cardClass = "bg-background border border-foreground/10 shadow-md rounded-[1.5rem]";

  return (
    <div className="w-full max-w-sm grid grid-cols-3 gap-3 md:gap-4 text-center">
      {/* Streak */}
      <div className={cn(cardClass, "flex flex-col items-center justify-center p-4 transition-transform hover:scale-[1.02] active:scale-95 duration-300 gap-1.5")}>
        <span className="text-2xl font-bold text-jaap-primary flex items-center gap-1.5 leading-none">
          {streak} <Flame size={18} className="text-jaap-primary fill-jaap-primary/20" />
        </span>
        <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
          Streak
        </span>
      </div>

      {/* Malas */}
      <div className={cn(cardClass, "flex flex-col items-center justify-center p-4 transition-transform hover:scale-[1.02] active:scale-95 duration-300 gap-1.5")}>
        <span className="text-2xl font-bold text-jaap-accent flex items-center gap-1.5 leading-none">
          {malasCompleted} <Disc size={18} className="text-jaap-accent" />
        </span>
        <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
          Malas
        </span>
      </div>

      {/* Lifetime */}
      <div className={cn(cardClass, "flex flex-col items-center justify-center p-4 transition-transform hover:scale-[1.02] active:scale-95 duration-300 gap-1.5")}>
        <span className="text-2xl font-bold text-jaap-secondary flex items-center gap-1.5 leading-none">
          {totalCount} <BarChart3 size={18} className="text-jaap-secondary" />
        </span>
        <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
          Total
        </span>
      </div>
    </div>
  );
}