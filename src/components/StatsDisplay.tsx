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

    // Common Glass Class from Modal
    const glassClass = "bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-2xl";

    return (
        <div className="w-full max-w-sm grid grid-cols-3 gap-2 md:gap-4 text-center">
            {/* Streak */}
            <div className={cn(glassClass, "flex flex-col items-center p-2 md:p-3 transition-transform hover:scale-105 active:scale-95 duration-300")}>
                <span className="text-2xl font-bold text-jaap-primary drop-shadow-sm flex items-center gap-1">
                    {streak} <Flame size={18} className="text-jaap-primary fill-jaap-primary/20" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-jaap-neutral/80 font-bold mt-1">
                    Streak
                </span>
            </div>

            {/* Malas */}
            <div className={cn(glassClass, "flex flex-col items-center p-2 md:p-3 transition-transform hover:scale-105 active:scale-95 duration-300")}>
                <span className="text-2xl font-bold text-jaap-accent drop-shadow-sm flex items-center gap-1">
                    {malasCompleted} <Disc size={18} className="text-jaap-accent" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-jaap-neutral/80 font-bold mt-1">
                    Malas
                </span>
            </div>

            {/* Lifetime */}
            <div className={cn(glassClass, "flex flex-col items-center p-2 md:p-3 transition-transform hover:scale-105 active:scale-95 duration-300")}>
                <span className="text-2xl font-bold text-jaap-secondary drop-shadow-sm flex items-center gap-1">
                    {totalCount} <BarChart3 size={18} className="text-jaap-secondary" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-jaap-neutral/80 font-bold mt-1">
                    Total
                </span>
            </div>
        </div>
    );
}
