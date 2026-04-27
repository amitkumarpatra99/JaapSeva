"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Flame, Disc, BarChart3, Info, X, CalendarDays, Crown } from "lucide-react";

interface StatsDisplayProps {
  target: number;
  currentCount: number;
  streak: number;
  bestStreak?: number;
  streakStartDate?: string | null;
  lastActiveDate?: string | null;
  malasCompleted: number;
  totalCount: number;
}

export default function StatsDisplay({
  target,
  streak,
  bestStreak = 0,
  streakStartDate,
  lastActiveDate,
  malasCompleted,
  totalCount
}: StatsDisplayProps) {
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Updated to Soft Rounded Solid Design
  const cardClass = "bg-background border border-foreground/10 shadow-md rounded-[1.5rem] relative group cursor-pointer";

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="w-full max-w-sm grid grid-cols-3 gap-3 md:gap-4 text-center">
        {/* Streak */}
      <div 
        onClick={() => setIsStreakModalOpen(true)}
        className={cn(cardClass, "flex flex-col items-center justify-center p-4 transition-transform hover:scale-[1.02] active:scale-95 duration-300 gap-1.5")}
      >
        <button className="absolute top-2.5 right-2.5 text-foreground/30 group-hover:text-jaap-primary transition-colors duration-300">
          <Info size={14} />
        </button>
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
      <div className={cn(cardClass, "flex flex-col items-center justify-center p-4 transition-transform hover:scale-[1.02] active:scale-95 duration-300 gap-1.5 cursor-default group-hover:opacity-100")}>
        <span className="text-2xl font-bold text-jaap-secondary flex items-center gap-1.5 leading-none">
          {totalCount} <BarChart3 size={18} className="text-jaap-secondary" />
        </span>
        <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
          Total
        </span>
      </div>
    </div>

    {mounted && isStreakModalOpen && createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-background/95 backdrop-blur-2xl border border-jaap-primary/20 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] w-full max-w-xs overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground tracking-wide flex items-center gap-2">
                <Flame size={20} className="text-jaap-primary fill-jaap-primary/20" /> Streak Stats
              </h3>
              <button
                onClick={() => setIsStreakModalOpen(false)}
                className="text-foreground/60 hover:text-foreground transition-colors p-1 hover:bg-jaap-primary/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-foreground/5 rounded-2xl p-4 flex flex-col gap-1 border border-foreground/5">
                <span className="text-xs uppercase tracking-wider text-foreground/50 font-bold flex items-center gap-1.5">
                  <Flame size={14} className="text-jaap-primary" /> Current Streak
                </span>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-3xl font-black text-jaap-primary leading-none">{streak} <span className="text-sm font-bold text-foreground/50">days</span></span>
                </div>
                {streak > 0 && (
                  <div className="text-[10px] text-foreground/50 mt-2 flex items-center gap-1.5 font-medium bg-background/50 py-1.5 px-2.5 rounded-lg w-fit border border-foreground/5">
                    <CalendarDays size={12} className="text-foreground/40" /> 
                    <span>{formatDate(streakStartDate)} <span className="text-foreground/30 mx-0.5">→</span> {formatDate(lastActiveDate)}</span>
                  </div>
                )}
              </div>

              <div className="bg-foreground/5 rounded-2xl p-4 flex flex-col gap-1 border border-foreground/5">
                <span className="text-xs uppercase tracking-wider text-foreground/50 font-bold flex items-center gap-1.5">
                  <Crown size={14} className="text-jaap-accent" /> Highest Streak
                </span>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-3xl font-black text-jaap-accent leading-none">{Math.max(streak, bestStreak)} <span className="text-sm font-bold text-foreground/50">days</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}