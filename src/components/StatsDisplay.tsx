"use client";

import { cn } from "@/lib/utils";

interface StatsDisplayProps {
    target: number;
    currentCount: number;
    streak: number;
    malasCompleted: number;
    totalCount: number;
}

export default function StatsDisplay({
    target,
    currentCount,
    streak,
    malasCompleted,
    totalCount
}: StatsDisplayProps) {

    return (
        <div className="w-full max-w-sm grid grid-cols-3 gap-4 text-center">
            {/* Streak */}
            <div className="flex flex-col items-center p-3 bg-white/40 rounded-2xl backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:scale-105 active:scale-95 duration-300">
                <span className="text-2xl font-bold text-jaap-primary drop-shadow-sm filter">
                    {streak} <span className="text-lg">🔥</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-jaap-neutral/80 font-bold mt-1">
                    Streak
                </span>
            </div>

            {/* Malas */}
            <div className="flex flex-col items-center p-3 bg-white/40 rounded-2xl backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:scale-105 active:scale-95 duration-300">
                <span className="text-2xl font-bold text-jaap-accent drop-shadow-sm">
                    {malasCompleted} <span className="text-lg">📿</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-jaap-neutral/80 font-bold mt-1">
                    Malas
                </span>
            </div>

            {/* Lifetime */}
            <div className="flex flex-col items-center p-3 bg-white/40 rounded-2xl backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:scale-105 active:scale-95 duration-300">
                <span className="text-2xl font-bold text-jaap-secondary drop-shadow-sm">
                    {totalCount}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-jaap-neutral/80 font-bold mt-1">
                    Total
                </span>
            </div>

            {/* Target Indicator (Subtle) */}
            <div className="col-span-3 text-center opacity-60 mt-1">
                <p className="text-[10px] text-jaap-neutral tracking-widest font-medium">
                    TARGET: <span className="font-bold text-jaap-primary">{target}</span>
                </p>
            </div>
        </div>
    );
}
