import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface CounterProps {
  count: number;
  target: number;
  onIncrement: () => void;
  isLocked: boolean;
}

export default function Counter({ count, target, onIncrement, isLocked }: CounterProps) {
  // --- Logic State ---
  const [isPressed, setIsPressed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Refs for Animation ---
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  const handleIncrement = () => {
    onIncrement();
  };

  // --- GSAP Animations ---
  const { contextSafe } = useGSAP({ scope: containerRef });

  const animatePress = contextSafe(() => {
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power1.out"
    });
    // Ripple Expand
    gsap.to(rippleRef.current, {
      opacity: 0.6,
      scale: 1.2,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  const animateRelease = contextSafe(() => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)" // Juicy bounce
    });
    // Ripple Contract/Fade
    gsap.to(rippleRef.current, {
      opacity: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.in"
    });
  });

  // --- Handlers ---
  const startContinuousIncrement = () => {
    setIsPressed(true);
    handleIncrement();
    animatePress(); // Trigger GSAP Press

    intervalRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        handleIncrement();
        // Maybe pulse effect here if desired, but keep simple for now
      }, 120);
    }, 400);
  };

  const stopContinuousIncrement = () => {
    setIsPressed(false);
    animateRelease(); // Trigger GSAP Release

    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopContinuousIncrement();
  }, []);

  // --- Math ---
  const progress = Math.min(count / target, 1);
  const radius = 120; // Internal SVG radius (keeps stroke clean)
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center py-8 md:py-10">

      {/* Main Container - Sized to the Ring for Perfect Alignment */}
      <div className="relative flex items-center justify-center w-[min(70vw,300px)] h-[min(70vw,300px)]">

        {/* 1. Ripple Effect (Behind Ring) */}
        <div
          ref={rippleRef}
          className={cn(
            "absolute inset-0 rounded-full border border-jaap-primary/30 bg-jaap-primary/5 opacity-0 pointer-events-none",
            "scale-100" // GSAP handles scale
          )}
        />

        {/* 2. SVG Progress Ring (Absolute Full Fit) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -rotate-90 transition-opacity duration-300 opacity-100">
          <svg className="w-full h-full max-w-[300px] max-h-[300px] overflow-visible" viewBox="0 0 300 300">
            {/* ViewBox ensures internal 300x300 coord system matches expected path */}
            {/* Background Track */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-jaap-neutral/10"
            />

            {/* Active Progress Indicator */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-jaap-primary transition-all duration-100 ease-linear drop-shadow-md"
            />
          </svg>
        </div>

        {/* 3. The Button (Centered & Sized Relative to Ring) */}
        <button
          ref={buttonRef}
          className={cn(
            "relative z-10 w-[min(55vw,224px)] h-[min(55vw,224px)] rounded-full flex flex-col items-center justify-center",
            "bg-white backdrop-blur-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50", // Clean white paper look like screenshot
            "select-none cursor-pointer outline-none",
            "touch-none active:scale-95 transition-transform" // Native press fallback + GSAP
          )}
          onPointerDown={startContinuousIncrement}
          onPointerUp={stopContinuousIncrement}
          onPointerLeave={stopContinuousIncrement}
          onPointerCancel={stopContinuousIncrement}
          aria-label="Increment Count"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {/* Inner Shine/Gradient for depth */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-orange-50/30 pointer-events-none" />

          {/* Label */}
          <span className="text-[8px] md:text-[10px] font-bold tracking-[0.25em] uppercase text-jaap-neutral/60 mb-1 pointer-events-none relative z-20">
            Count
          </span>

          {/* Number Display - Custom Clamp for Font Size */}
          <span className={cn(
            "text-[clamp(3.5rem,15vw,4.5rem)] font-serif font-bold text-jaap-neutral tabular-nums tracking-tighter pointer-events-none drop-shadow-sm relative z-20", // Serif font matches screenshot style
          )}>
            {count}
          </span>

          {/* Target Status */}
          <span className="text-xs text-jaap-neutral/90 mt-2 font-medium pointer-events-none">
            Goal: {target}
          </span>
        </button>
      </div>

      {/* 4. Completion Badge */}
      <div className={cn(
        "mt-8 transition-all duration-500 transform",
        count >= target
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wide backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          Completed
        </span>
      </div>

    </div>
  );
}