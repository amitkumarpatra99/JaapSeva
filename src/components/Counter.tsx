import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CounterProps {
  count: number;
  target: number;
  onIncrement: () => void;
}

export default function Counter({ count, target, onIncrement }: CounterProps) {
  const [isPressed, setIsPressed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startContinuousIncrement = () => {
    setIsPressed(true);
    // Initial increment
    onIncrement();
    // Continuous increment after delay
    intervalRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onIncrement();
      }, 150); // Rapid fire speed
    }, 400); // Holding delay
  };

  const stopContinuousIncrement = () => {
    setIsPressed(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopContinuousIncrement();
  }, []);

  // Calculate progress for ring
  const progress = Math.min(count / target, 1);
  const circumference = 2 * Math.PI * 135;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center py-10">
      {/* Ripple Wrapper */}
      <div
        className={cn(
          "absolute rounded-full transition-all duration-500 ease-out",
          isPressed ? "w-[320px] h-[320px] bg-jaap-primary/20" : "w-[280px] h-[280px] bg-jaap-primary/5"
        )}
      />

      <div className="absolute z-0 w-[290px] h-[290px] pointer-events-none transform -rotate-90">
        <svg className="w-full h-full" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="135" stroke="currentColor" strokeWidth="4" className="text-jaap-saffron/10" />
          <circle
            cx="150"
            cy="150"
            r="135"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-jaap-primary transition-all duration-100 ease-linear" // Faster transition for rapid updates
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
      </div>

      {/* Main Button with Sacred Texture */}
      <button
        className={cn(
          "relative z-10 w-64 h-64 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-jaap-primary via-jaap-accent to-jaap-secondary shadow-2xl",
          "border-4 border-white/20",
          "transition-all duration-150 ease-in-out select-none",
          "active:scale-95 focus:outline-none focus:ring-4 focus:ring-jaap-primary/40",
          isPressed ? "scale-95 shadow-inner" : "scale-100"
        )}
        onPointerDown={startContinuousIncrement}
        onPointerUp={stopContinuousIncrement}
        onPointerLeave={stopContinuousIncrement}
        onPointerCancel={stopContinuousIncrement}
        aria-label="Increment Count"
        style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
      >
        {/* Inner glow/shine */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

        {/* Count Display */}
        <span className="text-7xl font-sans font-bold text-white tracking-tight tabular-nums drop-shadow-md z-10 relative">
          {count}
        </span>
      </button>
    </div>
  );
}
