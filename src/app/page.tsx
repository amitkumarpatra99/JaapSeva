"use client";

import { useState, useRef } from "react";
import Counter from "@/components/Counter";
import ControlPanel, { MANTRAS, Mantra } from "@/components/ControlPanel";
import StatsDisplay from "@/components/StatsDisplay";
import ConfirmationModal from "@/components/ConfirmationModal";
import HistoryModal from "@/components/HistoryModal";
import SpiritualBackground from "@/components/SpiritualBackground";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useSound from "@/hooks/useSound";
import { useJaapCounter } from "@/hooks/useJaapCounter";
import { useSettings } from "@/hooks/useSettings";

gsap.registerPlugin(useGSAP);

export default function Home() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMantra, setSelectedMantra] = useState<Mantra>(MANTRAS[0]);

  // Custom Hooks
  const { soundEnabled, setSoundEnabled, hapticEnabled, setHapticEnabled } = useSettings();
  const { playClick, playMalaComplete, playReset } = useSound(soundEnabled, hapticEnabled);

  const {
    count,
    target,
    setTarget,
    streak,
    bestStreak,
    streakStartDate,
    lastActiveDate,
    malasCompleted,
    totalCount,
    history,
    isLocked,
    setIsLocked,
    handleIncrement,
    handleUndo,
    confirmReset,
    clearHistory,
    deleteHistoryItem
  } = useJaapCounter(soundEnabled, hapticEnabled, playClick, playMalaComplete, playReset, selectedMantra);

  // Refs for Animation
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useGSAP(() => {
    // 1. Intro Animation Sequence
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (contentRef.current) {
      tl.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2 }
      )
        .fromTo(".anim-item",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          "-=0.8"
        );
    }

  }, { scope: containerRef });

  const handleResetRequest = () => {
    if (!isLocked) setShowConfirm(true);
  };

  const handleConfirmReset = () => {
    confirmReset();
    setShowConfirm(false);
  };

  return (
    <main ref={containerRef} className="flex min-h-[100dvh] flex-col items-center justify-center p-3 md:p-6 relative overflow-hidden bg-background text-foreground transition-colors duration-500 font-sans selection:bg-jaap-primary/30">

      {/* NEW Animated Spiritual Background */}
      <SpiritualBackground />

      <div ref={contentRef} className="z-10 w-full max-w-md flex flex-col items-center gap-6 md:gap-10 py-2 md:py-4 opacity-0">

        <div className="text-center space-y-1 md:space-y-2 relative anim-item">
          {/* Header Glow */}
          <div className="absolute -inset-x-10 -inset-y-10 bg-white/40 blur-3xl rounded-full z-0 pointer-events-none" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-jaap-primary relative z-10 drop-shadow-sm py-2">
            JaapSeva
          </h1>
          <p className="text-[10px] md:text-xs text-jaap-neutral tracking-[0.4em] font-bold uppercase relative z-10 opacity-80">
            Mantra Counter
          </p>
          <p className="text-sm md:text-base text-jaap-primary/80 font-semibold relative z-10 tracking-wide transition-all duration-500">
            {selectedMantra.symbol} {selectedMantra.hindi}
          </p>
          <p className="text-xs md:text-sm text-jaap-neutral/80 relative z-10 tracking-wide transition-all duration-500">
            {selectedMantra.english}
          </p>
        </div>

        <div className={`anim-item ${isLocked ? "opacity-30 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}`}>
          <StatsDisplay
            target={target}
            currentCount={count}
            streak={streak}
            bestStreak={bestStreak}
            streakStartDate={streakStartDate}
            lastActiveDate={lastActiveDate}
            malasCompleted={malasCompleted}
            totalCount={totalCount}
          />
        </div>

        <div className="anim-item">
          <Counter
            count={count}
            target={target}
            onIncrement={handleIncrement}
            isLocked={isLocked}
          />
        </div>

        {/* Controls */}
        <div className="anim-item w-full flex justify-center">
          <ControlPanel
            selectedTarget={target}
            onTargetSelect={(t) => { if (!isLocked) setTarget(t); }}
            selectedMantra={selectedMantra}
            onMantraSelect={(m) => setSelectedMantra(m)}
            onResetRequest={handleResetRequest}
            onUndo={handleUndo}
            onLockToggle={() => setIsLocked(!isLocked)}
            onShowHistory={() => setShowHistory(true)}
            isLocked={isLocked}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            hapticEnabled={hapticEnabled}
            onToggleHaptic={() => setHapticEnabled(!hapticEnabled)}
          />
        </div>

        {/* Footer - JaapSeva by MR PATRA */}
           <div className="anim-item mt-4 mb-2 flex flex-row items-center gap-2.5 text-[10px] md:text-xs font-mono tracking-widest uppercase bg-background/80 backdrop-blur-md border border-jaap-primary/20 shadow-[0_0_15px_rgba(var(--jaap-primary-rgb),0.15)] px-6 py-3 rounded-full relative overflow-hidden group">
          {/* Subtle hover effect for the pill */}
          <div className="absolute inset-0 bg-jaap-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-foreground/70 hover:text-jaap-primary transition-colors cursor-pointer relative z-10 font-bold"
          >
            JaapSeva
          </button>
          
          <span className="opacity-30 text-[8px] relative z-10">by</span>
          
          <a
            href="https://mrpatra.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-jaap-primary font-extrabold hover:text-jaap-accent transition-colors relative z-10 drop-shadow-sm"
          >
            MR PATRA
          </a>
        </div>

      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmReset}
        title="Reset Counter?"
        message="Are you sure you want to reset? This action cannot be undone."
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onClearHistory={clearHistory}
        onDeleteHistoryItem={deleteHistoryItem}
      />
    </main>
  );
}
