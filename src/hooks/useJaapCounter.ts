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
  const [bestStreak, setBestStreak] = useState(0);
  const [streakStartDate, setStreakStartDate] = useState<string | null>(null);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [malasCompleted, setMalasCompleted] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedCount = localStorage.getItem(STORAGE_KEYS.COUNT);
    const savedTarget = localStorage.getItem(STORAGE_KEYS.TARGET);
    const savedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);
    const savedBestStreak = localStorage.getItem(STORAGE_KEYS.BEST_STREAK);
    const savedStreakStartDate = localStorage.getItem(STORAGE_KEYS.STREAK_START_DATE);
    const savedLastActiveDate = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
    const savedMalas = localStorage.getItem(STORAGE_KEYS.MALAS);
    const savedTotal = localStorage.getItem(STORAGE_KEYS.TOTAL);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);

    if (savedCount) setCount(parseInt(savedCount));
    if (savedTarget) setTarget(parseInt(savedTarget));
    if (savedMalas) setMalasCompleted(parseInt(savedMalas));
    if (savedTotal) setTotalCount(parseInt(savedTotal));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    if (savedBestStreak) setBestStreak(parseInt(savedBestStreak));
    if (savedStreakStartDate) setStreakStartDate(savedStreakStartDate);
    if (savedLastActiveDate) setLastActiveDate(savedLastActiveDate);

    if (savedStreak) {
      const parsedStreak = parseInt(savedStreak);
      if (savedLastActiveDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastActive = new Date(savedLastActiveDate);
        lastActive.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          setStreak(0);
          setStreakStartDate(null);
        } else {
          setStreak(parsedStreak);
        }
      } else {
        setStreak(parsedStreak);
      }
    }
  }, []);

  // Save Effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUNT, count.toString());
    localStorage.setItem(STORAGE_KEYS.TARGET, target.toString());
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    localStorage.setItem(STORAGE_KEYS.BEST_STREAK, bestStreak.toString());
    if (streakStartDate) localStorage.setItem(STORAGE_KEYS.STREAK_START_DATE, streakStartDate);
    else localStorage.removeItem(STORAGE_KEYS.STREAK_START_DATE);
    if (lastActiveDate) localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, lastActiveDate);
    else localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
    localStorage.setItem(STORAGE_KEYS.MALAS, malasCompleted.toString());
    localStorage.setItem(STORAGE_KEYS.TOTAL, totalCount.toString());
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [count, target, streak, bestStreak, streakStartDate, lastActiveDate, malasCompleted, totalCount, history]);

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
      
      const todayStr = new Date().toISOString();
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      
      let currentStreak = streak;
      
      if (!lastActiveDate) {
        currentStreak = 1;
        setStreakStartDate(todayStr);
      } else {
        const lastDate = new Date(lastActiveDate);
        lastDate.setHours(0, 0, 0, 0);
        const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak += 1;
        } else if (diffDays === 0) {
          currentStreak = Math.max(1, currentStreak);
          if (!streakStartDate) setStreakStartDate(todayStr);
        } else {
          currentStreak = 1;
          setStreakStartDate(todayStr);
        }
      }
      
      setStreak(currentStreak);
      setBestStreak(prev => Math.max(prev, currentStreak));
      setLastActiveDate(todayStr);

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

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((session) => session.id !== id));
  };

  return {
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
    deleteHistoryItem,
  };
}
