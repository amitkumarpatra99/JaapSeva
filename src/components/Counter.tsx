import { useState, useRef, useEffect, useCallback } from "react";
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
    if (isLocked) return;
    onIncrement();
  };

  // --- GSAP Animations ---
  const { contextSafe } = useGSAP({ scope: containerRef });

  const animatePress = contextSafe(useCallback(() => {
    if (!buttonRef.current || !rippleRef.current) return;
    
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
  }, []));

  const animateRelease = contextSafe(useCallback(() => {
    if (!buttonRef.current || !rippleRef.current) return;

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
  }, []));

  // --- Handlers ---
  const startContinuousIncrement = () => {
    if (isLocked) return;
    setIsPressed(true);
    handleIncrement();
    animatePress(); // Trigger GSAP Press

    intervalRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        handleIncrement();
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

  // Safe unmount handling
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // --- Math ---
  const radius = 120; // Internal SVG radius (keeps stroke clean)
  const MALA_BEADS = 108;
  const currentCycleCount = count === 0 ? 0 : ((count - 1) % MALA_BEADS) + 1;

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

        {/* 2. SVG Progress Ring (Absolute Full Fit) - The Mala */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 opacity-100">
          <svg className="w-full h-full max-w-[300px] max-h-[300px] overflow-visible" viewBox="0 0 300 300">
            {/* ViewBox ensures internal 300x300 coord system matches expected path */}
            
            <defs>
              <radialGradient id="bead-highlight" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="40%" stopColor="white" stopOpacity="0.3" />
                <stop offset="100%" stopColor="black" stopOpacity="0.2" />
              </radialGradient>
            </defs>

            {/* Background thin string to connect the beads */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="currentColor"
              strokeWidth="0.75"
              fill="none"
              className="text-jaap-neutral/20"
            />

            {/* Tassel at the bottom (Guru Bead anchor) */}
            <g className={cn("transition-colors duration-700", count > 0 ? "text-jaap-primary" : "text-jaap-neutral/40")}>
               <circle cx="150" cy="278" r="2.5" fill="currentColor" />
               <path d="M 148 280 L 142 298 M 150 280 L 150 300 M 152 280 L 158 298" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
            </g>

            {/* The 108 Beads */}
            {Array.from({ length: MALA_BEADS }).map((_, i) => {
              // Start from bottom (Math.PI / 2) and go clockwise
              const angle = (Math.PI / 2) + (i / MALA_BEADS) * 2 * Math.PI;
              const cx = +(150 + radius * Math.cos(angle)).toFixed(4);
              const cy = +(150 + radius * Math.sin(angle)).toFixed(4);
              
              const isActive = i < currentCycleCount;
              const isLatestActive = count > 0 && i === currentCycleCount - 1;
              const isTarget = target <= MALA_BEADS && (i + 1) === target;
              const isGuru = i === 0;

              const r = isGuru ? 5.5 : isLatestActive ? 5 : isTarget ? 4.5 : 3.5;

              return (
                <g
                  key={i}
                  className={cn(
                    "transition-all duration-500 ease-out",
                    isActive ? "text-jaap-primary drop-shadow-[0_0_5px_rgba(var(--jaap-primary-rgb),0.8)]" : "text-jaap-neutral/30",
                    isTarget && !isActive && "text-jaap-primary/40 animate-pulse",
                    isLatestActive && "drop-shadow-[0_0_12px_rgba(var(--jaap-primary-rgb),1)] scale-125"
                  )}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                >
                  <circle cx={cx} cy={cy} r={r} fill="currentColor" />
                  <circle cx={cx} cy={cy} r={r} fill="url(#bead-highlight)" />
                </g>
              );
            })}
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