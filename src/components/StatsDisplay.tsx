"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Flame, Disc, BarChart3, Info, X, CalendarDays, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

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

/* -------------------- UTIL -------------------- */

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Invalid";
  }
};

/* -------------------- CARD -------------------- */

function StatCard({
  value,
  label,
  icon,
  color,
  onClick,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : "presentation"}
      className={cn(
        "rounded-2xl border border-foreground/10 bg-background shadow-sm",
        "flex flex-col items-center justify-center gap-1.5 p-4",
        "transition-all duration-300",
        onClick && "cursor-pointer hover:scale-[1.03] active:scale-95"
      )}
    >
      <span className={cn("text-2xl font-bold flex items-center gap-1", color)}>
        {value} {icon}
      </span>

      <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
        {label}
      </span>
    </div>
  );
}

/* -------------------- MODAL -------------------- */

function StreakModal({
  open,
  onClose,
  streak,
  bestStreak,
  startDate,
  endDate,
}: {
  open: boolean;
  onClose: () => void;
  streak: number;
  bestStreak: number;
  startDate?: string | null;
  endDate?: string | null;
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-background rounded-3xl shadow-xl border border-foreground/10 p-6 space-y-6 animate-in zoom-in-95">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Flame className="text-orange-500" /> Streak Details
          </h2>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-foreground/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Streak */}
        <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/5">
          <p className="text-xs text-foreground/50 flex items-center gap-1">
            <Flame size={14} /> Current Streak
          </p>

          <p className="text-3xl font-black text-orange-500">
            {streak} <span className="text-sm text-foreground/50">days</span>
          </p>

          {streak > 0 && (
            <div className="text-xs mt-2 flex items-center gap-1 text-foreground/60">
              <CalendarDays size={12} />
              {formatDate(startDate)} → {formatDate(endDate)}
            </div>
          )}
        </div>

        {/* Best Streak */}
        <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/5">
          <p className="text-xs text-foreground/50 flex items-center gap-1">
            <Crown size={14} /> Best Streak
          </p>

          <p className="text-3xl font-black text-purple-500">
            {Math.max(streak, bestStreak)}{" "}
            <span className="text-sm text-foreground/50">days</span>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* -------------------- MAIN COMPONENT -------------------- */

export default function StatsDisplay({
  target,
  currentCount,
  streak,
  bestStreak = 0,
  streakStartDate,
  lastActiveDate,
  malasCompleted,
  totalCount,
}: StatsDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm text-center">

        {/* Streak */}
        <div className="relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="absolute top-2 right-2 opacity-40 group-hover:opacity-100"
          >
            <Info size={14} />
          </button>

          <StatCard
            value={streak}
            label="Streak"
            color="text-orange-500"
            icon={<Flame size={18} />}
            onClick={() => setIsOpen(true)}
          />
        </div>

        {/* Malas */}
        <StatCard
          value={malasCompleted}
          label="Malas"
          color="text-blue-500"
          icon={<Disc size={18} />}
        />

        {/* Total */}
        <StatCard
          value={totalCount}
          label="Total"
          color="text-green-500"
          icon={<BarChart3 size={18} />}
        />
      </div>

      {/* Modal */}
      {isMounted && (
        <StreakModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          streak={streak}
          bestStreak={bestStreak}
          startDate={streakStartDate}
          endDate={lastActiveDate}
        />
      )}
    </>
  );
}