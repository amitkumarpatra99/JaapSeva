"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface WeeklyChartProps {
  history: Record<string, number>; // "YYYY-MM-DD": count
}

export default function WeeklyChart({ history }: WeeklyChartProps) {
  const chartData = useMemo(() => {
    const today = new Date();
    const days = [];
    let maxCount = 0;

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0];
      const count = history[dateString] || 0;

      if (count > maxCount) maxCount = count;

      days.push({
        date: dateString,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }), // Mon, Tue...
        count,
        isToday: i === 0
      });
    }

    // Ensure bar has at least some height if maxCount is 0 to avoid division by zero issues
    // Though math works fine (0/1 = 0).
    // Normalize height: count / (maxCount * 1.2) to leave headroom
    const limit = Math.max(maxCount, 10); // Minimum scale of 10

    return { days, limit };
  }, [history]);

  return (
    <div className="w-full space-y-3 bg-white/40 p-4 md:p-5 rounded-[2rem] backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center justify-between text-xs text-jaap-neutral px-1 border-b border-jaap-primary/5 pb-2">
        <span className="font-bold uppercase tracking-[0.2em]">Activity</span>
        <span className="font-medium opacity-70">Last 7 Days</span>
      </div>

      <div className="flex items-end justify-between h-24 md:h-28 gap-2 md:gap-3 px-1">
        {chartData.days.map((day) => {
          const heightPercent = Math.min((day.count / chartData.limit) * 100, 100);

          return (
            <div key={day.date} className="flex flex-col items-center gap-2 flex-1 group">
              {/* Tooltip-ish count number only on hover or if today */}
              <span className={cn(
                "text-[10px] font-medium transition-opacity duration-200",
                day.isToday ? "text-jaap-primary opacity-100" : "text-jaap-neutral opacity-0 group-hover:opacity-100"
              )}>
                {day.count}
              </span>

              {/* Bar */}
              <div className="w-full bg-jaap-neutral/10 rounded-t-lg relative h-full flex items-end overflow-hidden">
                <div
                  className={cn(
                    "w-full rounded-t-lg transition-all duration-500 ease-out",
                    day.isToday ? "bg-jaap-primary" : "bg-jaap-accent/60 hover:bg-jaap-accent"
                  )}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Label */}
              <span className={cn(
                "text-[10px] uppercase font-bold",
                day.isToday ? "text-jaap-primary" : "text-jaap-neutral"
              )}>
                {day.dayName.charAt(0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
