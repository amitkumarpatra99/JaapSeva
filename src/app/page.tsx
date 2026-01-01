"use client";

import { useEffect, useState } from "react";
import Counter from "@/components/Counter";
import ControlPanel from "@/components/ControlPanel";
import StatsDisplay from "@/components/StatsDisplay";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function Home() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem("jaap-count");
    const savedTarget = localStorage.getItem("jaap-target");
    
    if (savedCount) setCount(parseInt(savedCount, 10));
    if (savedTarget) setTarget(parseInt(savedTarget, 10));
    
    setIsLoaded(true);
  }, []);

  // Persist changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("jaap-count", count.toString());
      localStorage.setItem("jaap-target", target.toString());
    }
  }, [count, target, isLoaded]);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    
    // Optional: Add haptic feedback here if/when supported
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleTargetSelect = (newTarget: number) => {
    setTarget(newTarget);
    // If target changes, we don't necessarily reset count, user choice.
    // But usually people want to continue or reset manually.
    // We'll keep current count.
  };

  if (!isLoaded) {
    return null; // Or a loading spinner to prevent hydration mismatch
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-gradient-to-b from-transparent to-jaap-saffron/10" />
      
      <div className="z-10 w-full max-w-md flex flex-col items-center gap-8 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
            JaapSeva
          </h1>
          <p className="text-sm text-jaap-neutral uppercase tracking-widest font-medium">
            Mantra Counter
          </p>
        </div>

        {/* Stats */}
        <StatsDisplay target={target} currentCount={count} />

        {/* Main Interaction */}
        <Counter count={count} onIncrement={handleIncrement} />

        {/* Controls */}
        <ControlPanel 
          selectedTarget={target}
          onTargetSelect={handleTargetSelect}
          onResetRequest={() => setIsResetModalOpen(true)}
        />
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
