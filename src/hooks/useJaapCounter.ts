import { useState, useEffect } from "react";
import { STORAGE_KEYS, DEFAULTS } from "@/lib/constants";
import { HistorySession } from "@/types";

interface MantraInfo {
  id: string;
  name: string;
  symbol: string;
}

export function useJaapCounter(
  soundEnabled: boolean,
  hapticEnabled: boolean,
  playClick: () => void,
  playMalaComplete: () => void,
  playReset: () => void,
  activeMantra?: MantraInfo
) {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(DEFAULTS.TARGET);
  const [streak, setStreak] = useState(0);
  const [malasCompleted, setMalasCompleted] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedCount = localStorage.getItem(STORAGE_KEYS.COUNT);
    const savedTarget = localStorage.getItem(STORAGE_KEYS.TARGET);
    const savedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);
    const savedMalas = localStorage.getItem(STORAGE_KEYS.MALAS);
    const savedTotal = localStorage.getItem(STORAGE_KEYS.TOTAL);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);

    if (savedCount) setCount(parseInt(savedCount));
    if (savedTarget) setTarget(parseInt(savedTarget));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedMalas) setMalasCompleted(parseInt(savedMalas));
    if (savedTotal) setTotalCount(parseInt(savedTotal));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save Effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUNT, count.toString());
    localStorage.setItem(STORAGE_KEYS.TARGET, target.toString());
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    localStorage.setItem(STORAGE_KEYS.MALAS, malasCompleted.toString());
    localStorage.setItem(STORAGE_KEYS.TOTAL, totalCount.toString());
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [count, target, streak, malasCompleted, totalCount, history]);

  const saveSession = () => {
    const newSession: HistorySession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      count: target,
      target: target,
      mantraId: activeMantra?.id,
      mantraName: activeMantra?.name,
      mantraSymbol: activeMantra?.symbol,
    };
    setHistory((prev) => [...prev, newSession]);
  };

  const handleIncrement = () => {
    if (isLocked) return;

    const newCount = count + 1;

    if (newCount === target) {
      playMalaComplete();
    } else {
      playClick();
    }

    setCount(newCount);
    setTotalCount((prev) => prev + 1);

    if (newCount === target) {
      setMalasCompleted((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      saveSession();
      setCount(0);
    }
  };

  const handleUndo = () => {
    if (count > 0 && !isLocked) {
      setCount((prev) => prev - 1);
      setTotalCount((prev) => Math.max(0, prev - 1));
      playClick();
    }
  };

  const confirmReset = () => {
    setCount(0);
    playReset();
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    count,
    target,
    setTarget,
    streak,
    malasCompleted,
    totalCount,
    history,
    isLocked,
    setIsLocked,
    handleIncrement,
    handleUndo,
    confirmReset,
    clearHistory,
  };
}
