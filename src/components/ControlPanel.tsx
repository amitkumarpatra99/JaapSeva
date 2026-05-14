"use client";

import { useState, useEffect } from "react";
import { RotateCcw, Lock, Unlock, History, Volume2, VolumeX, Zap, ZapOff, Plus, Trash2 } from "lucide-react";
import { cn, getCustomMantras, addCustomMantra, removeCustomMantra } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";
import AddMantraModal from "./AddMantraModal";

export interface Mantra {
  id: string;
  name: string;
  hindi: string;
  english: string;
  symbol: string;
  suggestedTarget: number;
}

export const MANTRAS: Mantra[] = [
  { id: "radha", name: "Radha Naam", hindi: "राधा राधा", english: "Radha Radha", symbol: "🌸", suggestedTarget: 108 },
  { id: "ram", name: "Ram Naam", hindi: "श्री राम", english: "Sri Ram", symbol: "🏹", suggestedTarget: 108 },
  { id: "ganesh", name: "Ganesha Mantra", hindi: "ॐ गं गणपतये नमः", english: "Om Gam Ganapataye Namaha", symbol: "🐘", suggestedTarget: 11 },
  { id: "hanuman", name: "Hanuman Mantra", hindi: "ॐ हनुमते नमः", english: "Om Hanumate Namaha", symbol: "🐒", suggestedTarget: 108 },
  { id: "krishna", name: "Krishna Mantra", hindi: "ॐ नमो भगवते वासुदेवाय", english: "Om Namo Bhagavate Vasudevaya", symbol: "🪈", suggestedTarget: 108 },
  { id: "shiva", name: "Shiva Panchakshari", hindi: "ॐ नमः शिवाय", english: "Om Namah Shivaya", symbol: "🔱", suggestedTarget: 108 },
  { id: "om", name: "Om", hindi: "ॐ", english: "Omm", symbol: "ॐ", suggestedTarget: 108 },
  { id: "hare-krishna", name: "Hare Krishna Mahamantra", hindi: "हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे, हरे राम हरे राम, राम राम हरे हरे", english: "Hare Krishna Hare Krishna, Krishna Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Hare", symbol: "🦚", suggestedTarget: 108 },
  { id: "gayatri", name: "Gayatri Mantra", hindi: "ॐ भूर्भुवः स्वः, तत्सवितुर्वरेण्यं, भर्गो देवस्य धीमहि, धियो यो नः प्रचोदयात्", english: "Om Bhur Bhuva Svaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat", symbol: "☀️", suggestedTarget: 108 },
  { id: "mahamrityunjaya", name: "Mahamrityunjaya", hindi: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्, उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्", english: "Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam, Urvarukamiva Bandhanan Mrityormukshiya Maamritat", symbol: "🔱", suggestedTarget: 11 },
  { id: "lakshmi", name: "Lakshmi Mantra", hindi: "ॐ श्रीं महालक्ष्म्यै नमः", english: "Om Shreem Mahalakshmyai Namaha", symbol: "🪷", suggestedTarget: 11 },
  { id: "saraswati", name: "Saraswati Mantra", hindi: "ॐ ऐं सरस्वत्यै नमः", english: "Om Aim Saraswatyai Namaha", symbol: "🦢", suggestedTarget: 7 },
];

interface ControlPanelProps {
  selectedTarget: number;
  onTargetSelect: (target: number) => void;
  selectedMantra: Mantra;
  onMantraSelect: (mantra: Mantra) => void;
  onResetRequest: () => void;
  onUndo: () => void;
  onLockToggle: () => void;
  onShowHistory: () => void;
  isLocked: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hapticEnabled: boolean;
  onToggleHaptic: () => void;
}

const PRESETS = [7, 11, 108];

export default function ControlPanel({
  selectedTarget,
  onTargetSelect,
  selectedMantra,
  onMantraSelect,
  onResetRequest,
  onUndo,
  onLockToggle,
  onShowHistory,
  isLocked,
  soundEnabled,
  onToggleSound,
  hapticEnabled,
  onToggleHaptic,
}: ControlPanelProps) {
  const [customMantras, setCustomMantras] = useState<Mantra[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setCustomMantras(getCustomMantras());
  }, []);

  const handleAddMantra = (newMantra: Omit<Mantra, "id">) => {
    const addedMantra = addCustomMantra(newMantra);
    setCustomMantras(prev => [...prev, addedMantra]);
  };

  const handleRemoveMantra = (id: string) => {
    removeCustomMantra(id);
    setCustomMantras(prev => prev.filter(m => m.id !== id));
    if (selectedMantra.id === id) {
      onMantraSelect(MANTRAS[0]);
      if (!isLocked) onTargetSelect(MANTRAS[0].suggestedTarget);
    }
  };

  const allMantras = [...MANTRAS, ...customMantras];

  return (
    <div className="w-full max-w-full sm:max-w-md flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200">
      
      {/* Soft Rounded Solid Card Container */}
      <div className="w-full bg-background border border-foreground/10 shadow-lg rounded-[2rem] p-6 flex flex-col gap-6">
        
        {/* Section 1: Mantra Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest px-2">
            Select Mantra
          </label>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-3 pt-1 px-1">
            {allMantras.map((mantra) => (
              <div key={mantra.id} className="relative flex-shrink-0">
                <button
                  onClick={() => {
                    onMantraSelect(mantra);
                    if (!isLocked) onTargetSelect(mantra.suggestedTarget);
                  }}
                  disabled={isLocked}
                  title={`${mantra.hindi} • ${mantra.english}`}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 px-4 py-3.5 rounded-[1.5rem] font-medium text-[11px] tracking-wide transition-all min-w-[76px] border",
                    selectedMantra.id === mantra.id
                      ? "bg-jaap-primary text-background border-jaap-primary shadow-sm"
                      : "bg-foreground/5 text-foreground/80 border-transparent hover:bg-foreground/10",
                    isLocked && "opacity-50 cursor-not-allowed hover:bg-foreground/5"
                  )}
                >
                  <span className="text-xl leading-none">{mantra.symbol}</span>
                  <span className="leading-tight text-center whitespace-nowrap">{mantra.name}</span>
                </button>
                {mantra.id.startsWith("custom-") && (
                  <button
                    onClick={() => handleRemoveMantra(mantra.id)}
                    disabled={isLocked}
                    className={cn(
                      "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full border-2 border-background flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10",
                      isLocked && "opacity-50 cursor-not-allowed"
                    )}
                    title="Remove custom mantra"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            ))}

            {/* Add Custom Mantra Button */}
            <button
              onClick={() => setShowAddModal(true)}
              disabled={isLocked}
              className={cn(
                "flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-4 py-3.5 rounded-[1.5rem] font-medium text-[11px] tracking-wide transition-all min-w-[76px] border-2 border-dashed",
                "bg-transparent text-foreground/60 border-foreground/20 hover:border-jaap-primary hover:text-jaap-primary hover:bg-jaap-primary/5",
                isLocked && "opacity-50 cursor-not-allowed hover:border-foreground/20 hover:text-foreground/60 hover:bg-transparent"
              )}
              title="Add custom mantra"
            >
              <Plus size={20} />
              <span className="leading-tight text-center whitespace-nowrap">Add</span>
            </button>
          </div>
        </div>

        {/* Section 2: Target Count */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest px-2">
            Target Count
          </label>
          <div className="grid grid-cols-3 gap-3 px-1">
            {PRESETS.map((target) => (
              <button
                key={target}
                onClick={() => onTargetSelect(target)}
                disabled={isLocked}
                className={cn(
                  "py-3 rounded-full font-bold text-sm tracking-wider transition-all border",
                  selectedTarget === target
                    ? "bg-jaap-primary text-background border-jaap-primary shadow-sm"
                    : "bg-foreground/5 text-foreground/80 border-transparent hover:bg-foreground/10",
                  isLocked && "opacity-50 cursor-not-allowed hover:bg-foreground/5"
                )}
              >
                {target}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px w-[90%] mx-auto bg-foreground/10 my-1" />

        {/* Section 3: Utility Controls & Lock */}
        <div className="space-y-5 px-1">
          
          {/* Utilities Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2.5">
              <button
                onClick={onUndo}
                disabled={isLocked}
                className="p-3.5 rounded-full bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo Last Count"
              >
                <RotateCcw size={18} className="-scale-x-100" />
              </button>
              <button
                onClick={onShowHistory}
                disabled={isLocked}
                className="p-3.5 rounded-full bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="View History"
              >
                <History size={18} />
              </button>
              <ThemeSwitcher disabled={isLocked} />
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={onToggleSound}
                disabled={isLocked}
                className={cn(
                  "p-3.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  soundEnabled ? "bg-jaap-primary/10 text-jaap-primary" : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10"
                )}
                title={soundEnabled ? "Mute Sound" : "Enable Sound"}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                onClick={onToggleHaptic}
                disabled={isLocked}
                className={cn(
                  "p-3.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  hapticEnabled ? "bg-jaap-primary/10 text-jaap-primary" : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10"
                )}
                title={hapticEnabled ? "Disable Vibration" : "Enable Vibration"}
              >
                {hapticEnabled ? <Zap size={18} /> : <ZapOff size={18} />}
              </button>
              <button
                onClick={onResetRequest}
                disabled={isLocked}
                className="p-3.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reset Counter"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Prominent Pill Lock Button */}
          <button
            onClick={onLockToggle}
            className={cn(
              "w-full flex justify-center items-center gap-3 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all border-2",
              isLocked
                ? "bg-jaap-primary text-background border-jaap-primary shadow-md"
                : "bg-transparent text-foreground border-foreground/20 hover:border-jaap-primary hover:text-jaap-primary"
            )}
          >
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            <span>{isLocked ? "Controls Locked" : "Lock Controls"}</span>
          </button>
        </div>

      </div>

      {/* Add Mantra Modal */}
      <AddMantraModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMantra}
      />
    </div>
  );
}