"use client";

import { useEffect, useState } from "react";
import Counter from "@/components/Counter";
import ControlPanel from "@/components/ControlPanel";
import StatsDisplay from "@/components/StatsDisplay";
import ConfirmationModal from "@/components/ConfirmationModal";


export default function Home() {
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<Record<string, number>>({});
  const [malasCompleted, setMalasCompleted] = useState(0);
  const [isMalaMode, setIsMalaMode] = useState(true);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // Lock/Focus Mode
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedCount = localStorage.getItem("jaap-count");
    const savedTotal = localStorage.getItem("jaap-total-count");
    const savedTarget = localStorage.getItem("jaap-target");
    const savedStreak = localStorage.getItem("jaap-streak");
    const savedHistory = localStorage.getItem("jaap-history");
    const savedMalas = localStorage.getItem("jaap-malas-completed");
    const savedMalaMode = localStorage.getItem("jaap-mala-mode");

    if (savedCount) setCount(parseInt(savedCount, 10));
    if (savedTotal) setTotalCount(parseInt(savedTotal, 10));
    if (savedTarget) setTarget(parseInt(savedTarget, 10));
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedMalas) setMalasCompleted(parseInt(savedMalas, 10));
    if (savedMalaMode) setIsMalaMode(savedMalaMode === "true");

    setIsLoaded(true);
  }, []);

  // Persist changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("jaap-count", count.toString());
      localStorage.setItem("jaap-total-count", totalCount.toString());
      localStorage.setItem("jaap-target", target.toString());
      localStorage.setItem("jaap-streak", streak.toString());
      localStorage.setItem("jaap-history", JSON.stringify(history));
      localStorage.setItem("jaap-malas-completed", malasCompleted.toString());
      localStorage.setItem("jaap-mala-mode", isMalaMode.toString());
    }
  }, [count, totalCount, target, streak, history, malasCompleted, isMalaMode, isLoaded]);



  const getTodayString = () => new Date().toISOString().split('T')[0];

  const updateStreakAndHistory = (increment: boolean = true) => {
    const today = getTodayString();

    // Update History
    setHistory(prev => ({
      ...prev,
      [today]: Math.max(0, (prev[today] || 0) + (increment ? 1 : -1))
    }));

    if (increment) {
      const lastActive = localStorage.getItem("jaap-last-active-date");
      if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (lastActive === yesterdayString) {
          setStreak(prev => prev + 1);
        } else {
          setStreak(1);
        }
        localStorage.setItem("jaap-last-active-date", today);
      }
    }
  };

  const handleIncrement = () => {
    updateStreakAndHistory(true);
    setTotalCount(prev => prev + 1);

    setCount((prev) => {
      const newCount = prev + 1;
      if (isMalaMode && newCount >= target) {
        setMalasCompleted(m => m + 1);
        try { if (navigator.vibrate) navigator.vibrate([50, 50, 50]); } catch (e) { /* ignore */ }
        return 0;
      }
      return newCount;
    });

    try { if (navigator.vibrate) navigator.vibrate(5); } catch (e) { /* ignore */ }
  };

  const handleUndo = () => {
    // Basic logic: Undo last tap if count > 0 // Or undo mala?
    // For now, simple count undo.
    if (count > 0) {
      setCount(c => c - 1);
      setTotalCount(t => Math.max(0, t - 1));
      updateStreakAndHistory(false);
    } else if (malasCompleted > 0 && count === 0) {
      // Undo a mala completion
      setMalasCompleted(m => m - 1);
      setCount(target - 1);
      setTotalCount(t => Math.max(0, t - 1));
      updateStreakAndHistory(false);
    }
  };

  const handleReset = () => {
    setCount(0);
    // Optional: Reset Malas for the session? Or just count? 
    // Usually just count. 
  };

  const handleTargetSelect = (newTarget: number) => {
    setTarget(newTarget);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowUp") {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === "ArrowDown" || e.key === "Backspace") {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          handleUndo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count, totalCount, isMalaMode, target, malasCompleted]); // Re-bind when state changes (since handlers aren't memorized)

  if (!isLoaded) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden bg-background text-foreground transition-colors duration-500 font-sans selection:bg-jaap-primary/30">

      {/* Background Ambience - Warm Spiritual Theme */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-jaap-secondary/20 via-background to-background" />

      {/* Glassmorphism Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-jaap-primary/20 rounded-full blur-[100px] animate-pulse pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-jaap-accent/20 rounded-full blur-[100px] animate-pulse pointer-events-none mix-blend-multiply delay-1000" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-jaap-secondary/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />

      {/* Subtle Texture Pattern (Dots) */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.2) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="z-10 w-full max-w-md flex flex-col items-center gap-12 animate-in fade-in duration-1000 slide-in-from-bottom-4 py-8">

        <div className="text-center space-y-2 relative">
          {/* Header Glow */}
          <div className="absolute -inset-x-10 -inset-y-10 bg-white/40 blur-3xl rounded-full z-0 pointer-events-none" />
          <h1 className="text-6xl font-serif font-bold tracking-tight text-foreground relative z-10 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-jaap-primary via-jaap-accent to-jaap-secondary py-2">
            JaapSeva
          </h1>
          <p className="text-xs text-jaap-neutral tracking-[0.4em] font-bold uppercase relative z-10 opacity-80">
            Mantra Counter
          </p>
        </div>

        <div className={isLocked ? "opacity-30 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
          <StatsDisplay
            target={target}
            currentCount={count}
            streak={streak}
            malasCompleted={malasCompleted}
            totalCount={totalCount}
          />
        </div>



        <Counter
          count={count}
          target={target}
          onIncrement={handleIncrement}
        />

        {/* Controls or Unlock Button */}
        {!isLocked ? (
          <ControlPanel
            selectedTarget={target}
            onTargetSelect={handleTargetSelect}
            onResetRequest={() => setIsResetModalOpen(true)}
            onUndo={handleUndo}
            onLockToggle={() => setIsLocked(true)}
          />
        ) : (
          <button
            onClick={() => setIsLocked(false)}
            className="flex flex-col items-center gap-2 text-jaap-neutral/50 hover:text-jaap-primary transition-colors animate-pulse px-6 py-4"
          >
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <span className="text-xs font-medium uppercase tracking-widest">Tap to Unlock</span>
          </button>
        )}
      </div>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
        title="Reset Counter?"
        message="Are you sure you want to reset your current Jaap count to zero? This action cannot be undone."
      />
    </main>
  );
}
