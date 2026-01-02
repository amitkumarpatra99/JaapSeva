"use client";

import { useState, useEffect, useRef } from "react";
import Counter from "@/components/Counter";
import ControlPanel from "@/components/ControlPanel";
import StatsDisplay from "@/components/StatsDisplay";
import ConfirmationModal from "@/components/ConfirmationModal";
import HistoryModal from "@/components/HistoryModal";
import SpiritualBackground from "@/components/SpiritualBackground";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useSound from "@/hooks/useSound";

gsap.registerPlugin(useGSAP);

export default function Home() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [streak, setStreak] = useState(0);
  const [malasCompleted, setMalasCompleted] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // Sound Hook
  const { playClick, playMalaComplete, playReset } = useSound(soundEnabled, hapticEnabled);

  // Refs for Animation
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useGSAP(() => {
    // 1. Intro Animation Sequence
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2 }
    )
      .fromTo(".anim-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        "-=0.8"
      );

  }, { scope: containerRef });

  // Initialize from LocalStorage
  useEffect(() => {
    const savedCount = localStorage.getItem("jaap_count");
    const savedTarget = localStorage.getItem("jaap_target");
    const savedStreak = localStorage.getItem("jaap_streak");
    const savedMalas = localStorage.getItem("jaap_malas");
    const savedTotal = localStorage.getItem("jaap_total");
    const savedHistory = localStorage.getItem("jaap_history");
    const savedSound = localStorage.getItem("jaap_sound");
    const savedHaptic = localStorage.getItem("jaap_haptic");

    if (savedCount) setCount(parseInt(savedCount));
    if (savedTarget) setTarget(parseInt(savedTarget));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedMalas) setMalasCompleted(parseInt(savedMalas));
    if (savedTotal) setTotalCount(parseInt(savedTotal));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    if (savedHaptic !== null) setHapticEnabled(savedHaptic === "true");
  }, []);

  // Save Effect
  useEffect(() => {
    localStorage.setItem("jaap_count", count.toString());
    localStorage.setItem("jaap_target", target.toString());
    localStorage.setItem("jaap_streak", streak.toString());
    localStorage.setItem("jaap_malas", malasCompleted.toString());
    localStorage.setItem("jaap_total", totalCount.toString());
    localStorage.setItem("jaap_history", JSON.stringify(history));
    localStorage.setItem("jaap_sound", soundEnabled.toString());
    localStorage.setItem("jaap_haptic", hapticEnabled.toString());
  }, [count, target, streak, malasCompleted, totalCount, history, soundEnabled, hapticEnabled]);

  const saveSession = () => {
    const newSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      count: target, // Assuming session saves when target reached
      target: target,
    };
    setHistory((prev) => [...prev, newSession]);
  };

  const handleIncrement = () => {
    if (isLocked) return;

    // Determine if next count is completion
    const newCount = count + 1;

    // Play feedback BEFORE state update logic (re-render might delay slightly)
    if (newCount === target) {
      playMalaComplete();
    } else {
      playClick();
    }

    setCount(newCount);
    setTotalCount((prev) => prev + 1);

    if (newCount === target) {
      // Mala Complete!
      setMalasCompleted((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      saveSession();
      setCount(0); // Reset count after mala
    }
  };

  const handleUndo = () => {
    if (count > 0 && !isLocked) {
      setCount((prev) => prev - 1);
      setTotalCount((prev) => Math.max(0, prev - 1));
      // Optional: Sound for undo? Maybe soft click.
      playClick();
    }
  };

  const handleResetRequest = () => {
    if (!isLocked) setShowConfirm(true);
  };

  const confirmReset = () => {
    setCount(0);
    setShowConfirm(false);
    playReset();
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <main ref={containerRef} className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden bg-background text-foreground transition-colors duration-500 font-sans selection:bg-jaap-primary/30">

      {/* NEW Animated Spiritual Background */}
      <SpiritualBackground />

      <div ref={contentRef} className="z-10 w-full max-w-md flex flex-col items-center gap-8 md:gap-12 py-8 opacity-0">

        <div className="text-center space-y-2 relative anim-item">
          {/* Header Glow */}
          <div className="absolute -inset-x-10 -inset-y-10 bg-white/40 blur-3xl rounded-full z-0 pointer-events-none" />
          <h1 className="text-6xl font-serif font-bold tracking-tight text-jaap-primary relative z-10 drop-shadow-sm py-2">
            JaapSeva
          </h1>
          <p className="text-xs text-jaap-neutral tracking-[0.4em] font-bold uppercase relative z-10 opacity-80">
            Mantra Counter
          </p>
        </div>

        <div className={`anim-item ${isLocked ? "opacity-30 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}`}>
          <StatsDisplay
            target={target}
            currentCount={count}
            streak={streak}
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
        <div className="anim-item mt-4 flex flex-row items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-jaap-neutral/60">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-jaap-primary transition-colors hover:underline underline-offset-4 cursor-pointer"
          >
            JaapSeva
          </button>
          <span className="opacity-40 text-[8px]">by</span>
          <a
            href="https://mrpatra.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-jaap-primary transition-colors hover:underline underline-offset-4 font-bold cursor-pointer"
          >
            MR PATRA
          </a>
        </div>

      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmReset}
        title="Reset Counter?"
        message="Are you sure you want to reset? This action cannot be undone."
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onClearHistory={clearHistory}
      />
    </main>
  );
}
