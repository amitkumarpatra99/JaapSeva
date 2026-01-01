"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CounterProps {
  count: number;
  onIncrement: () => void;
}

export default function Counter({ count, onIncrement }: CounterProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Handle interaction for both mouse and touch
  const handleInteractionStart = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsPressed(false);
    onIncrement();
  }, [onIncrement]);

  return (
    <div className="relative flex items-center justify-center py-10">
      {/* Ripple/Glow Effect Background */}
      <div 
        className={cn(
          "absolute rounded-full transition-all duration-500 ease-out",
          isPressed ? "w-[320px] h-[320px] bg-jaap-saffron/20" : "w-[280px] h-[280px] bg-jaap-saffron/5"
        )}
      />
      
      {/* Main Button */}
      <button
        className={cn(
          "relative z-10 w-64 h-64 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-jaap-saffron to-amber-500 shadow-xl",
          "transition-all duration-150 ease-in-out select-none",
          "active:scale-95 focus:outline-none focus:ring-4 focus:ring-jaap-saffron/30",
          isPressed ? "scale-95 shadow-lg" : "scale-100"
        )}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        aria-label="Increment Count"
      >
        <span className="text-7xl font-bold text-white tracking-tight tabular-nums drop-shadow-md">
          {count}
        </span>
      </button>
      
      {/* Decorative Ring */}
      <div className="absolute w-[270px] h-[270px] rounded-full border-2 border-white/20 pointer-events-none" />
    </div>
  );
}
