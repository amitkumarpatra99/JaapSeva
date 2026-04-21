"use client";

import { useState, useEffect } from "react";
import { RotateCcw, Lock, History, Volume2, VolumeX, Zap, ZapOff, Plus, Trash2 } from "lucide-react";
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
  {
    id: "radha",
    name: "Radha Naam",
    hindi: "राधा राधा",
    english: "Radha Radha",
    symbol: "🌸",
    suggestedTarget: 108
  },
  {
    id: "ram",
    name: "Ram Naam",
    hindi: "श्री राम",
    english: "Sri Ram",
    symbol: "🏹",
    suggestedTarget: 108
  },
  {
    id: "ganesh",
    name: "Ganesha Mantra",
    hindi: "ॐ गं गणपतये नमः",
    english: "Om Gam Ganapataye Namaha",
    symbol: "🐘",
    suggestedTarget: 11
  },
  {
    id: "hanuman",
    name: "Hanuman Mantra",
    hindi: "ॐ हनुमते नमः",
    english: "Om Hanumate Namaha",
    symbol: "🐒",
    suggestedTarget: 108
  },
  {
    id: "krishna",
    name: "Krishna Mantra",
    hindi: "ॐ नमो भगवते वासुदेवाय",
    english: "Om Namo Bhagavate Vasudevaya",
    symbol: "🪈",
    suggestedTarget: 108
  },
  {
    id: "shiva",
    name: "Shiva Panchakshari",
    hindi: "ॐ नमः शिवाय",
    english: "Om Namah Shivaya",
    symbol: "🌙",
    suggestedTarget: 108
  },
  {
    id: "om",
    name: "Om",
    hindi: "ॐ",
    english: "Omm",
    symbol: "ॐ",
    suggestedTarget: 108
  },
  {
    id: "hare-krishna",
    name: "Hare Krishna Mahamantra",
    hindi: "हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे, हरे राम हरे राम, राम राम हरे हरे",
    english: "Hare Krishna Hare Krishna, Krishna Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Hare",
    symbol: "🦚",
    suggestedTarget: 108
  },
  {
    id: "gayatri",
    name: "Gayatri Mantra",
    hindi: "ॐ भूर्भुवः स्वः, तत्सवितुर्वरेण्यं, भर्गो देवस्य धीमहि, धियो यो नः प्रचोदयात्",
    english: "Om Bhur Bhuva Svaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat",
    symbol: "☀️",
    suggestedTarget: 108
  },
  {
    id: "mahamrityunjaya",
    name: "Mahamrityunjaya",
    hindi: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्, उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्",
    english: "Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam, Urvarukamiva Bandhanan Mrityormukshiya Maamritat",
    symbol: "🔱",
    suggestedTarget: 11
  },
  {
    id: "lakshmi",
    name: "Lakshmi Mantra",
    hindi: "ॐ श्रीं महालक्ष्म्यै नमः",
    english: "Om Shreem Mahalakshmyai Namaha",
    symbol: "🪷",
    suggestedTarget: 11
  },
  {
    id: "saraswati",
    name: "Saraswati Mantra",
    hindi: "ॐ ऐं सरस्वत्यै नमः",
    english: "Om Aim Saraswatyai Namaha",
    symbol: "🦢",
    suggestedTarget: 7
  },
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
    // If the removed mantra was selected, select the first default mantra
    if (selectedMantra.id === id) {
      onMantraSelect(MANTRAS[0]);
      if (!isLocked) onTargetSelect(MANTRAS[0].suggestedTarget);
    }
  };

  const allMantras = [...MANTRAS, ...customMantras];

  return (

    <div className="w-full max-w-sm flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200">

      {/* Unified Glass Control Capsule matching Modal Style */}
      {/* old: bg-white/5 ... */}
      {/* new: bg-white/10 backdrop-blur-2xl border-white/20 shadow... */}
      <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-[2rem] p-2 flex flex-col gap-2">

        {/* Mantra Selector Row */}
        <div className="flex items-center bg-jaap-primary/5 rounded-[1.5rem] p-1.5 border border-jaap-primary/20 gap-1 overflow-x-auto custom-scrollbar">
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
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-[1.1rem] font-bold text-[9px] md:text-[10px] tracking-wider transition-all duration-300 min-w-[60px]",
                  selectedMantra.id === mantra.id
                    ? "bg-jaap-primary text-background shadow-md"
                    : "text-foreground/60 hover:bg-jaap-primary/10 hover:text-foreground",
                  isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                )}
              >
                <span className="text-base leading-none">{mantra.symbol}</span>
                <span className="leading-tight text-center whitespace-nowrap">{mantra.name}</span>
              </button>
              {mantra.id.startsWith("custom-") && (
                <button
                  onClick={() => handleRemoveMantra(mantra.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  title="Remove custom mantra"
                >
                  <Trash2 size={8} />
                </button>
              )}
            </div>
          ))}

          {/* Add Custom Mantra Button */}
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isLocked}
            className={cn(
              "flex-shrink-0 flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-[1.1rem] font-bold text-[9px] md:text-[10px] tracking-wider transition-all duration-300 min-w-[60px] border-2 border-dashed",
              "text-foreground/60 hover:bg-jaap-primary/10 hover:text-foreground border-foreground/20 hover:border-jaap-primary/40",
              isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
            )}
            title="Add custom mantra"
          >
            <Plus size={16} />
            <span className="leading-tight text-center whitespace-nowrap">Add</span>
          </button>
        </div>

        {/* Presets Row (count targets) */}
        <div className="flex justify-between items-center bg-jaap-primary/5 rounded-[1.5rem] p-1.5 border border-jaap-primary/20 gap-2">
          {PRESETS.map((target) => (
            <button
              key={target}
              onClick={() => onTargetSelect(target)}
              disabled={isLocked}
              className={cn(
                "flex-1 py-4 md:py-3 rounded-[1.2rem] font-bold text-sm md:text-xs tracking-wider transition-all duration-300",
                selectedTarget === target
                  ? "bg-jaap-primary text-background shadow-md scale-100"
                  : "text-foreground/60 hover:bg-jaap-primary/10 hover:text-foreground",
                isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
              )}
            >
              {target}
            </button>
          ))}
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex items-center justify-between px-2 pb-1 pt-1 gap-2">

          {/* Left Group */}
          <div className="flex flex-1 gap-2">
            <button
              onClick={onUndo}
              disabled={isLocked}
              className="flex-1 flex justify-center items-center gap-2 text-foreground/60 hover:text-foreground transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-jaap-primary/10 group disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <RotateCcw size={18} className="-scale-x-100 group-hover:-rotate-12 transition-transform" />
            </button>

            <button
              onClick={onShowHistory}
              className="flex-1 flex justify-center items-center gap-2 text-foreground/60 hover:text-foreground transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-jaap-primary/10"
              title="History"
            >
              <History size={18} />
            </button>
          </div>

          <div className="w-px h-8 bg-foreground/10" />

          {/* Center Lock */}
          <button
            onClick={onLockToggle}
            className={cn(
              "flex-[1.5] flex justify-center items-center gap-2 transition-all text-xs font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl border shadow-sm mx-1",
              isLocked
                ? "bg-jaap-primary text-background border-jaap-primary/20 shadow-md"
                : "bg-jaap-primary/5 text-foreground hover:text-foreground/80 hover:bg-jaap-primary/10 border-jaap-primary/20 hover:shadow-md active:scale-95"
            )}
          >
            <Lock size={18} />
            <span className="hidden md:inline">{isLocked ? "Unlock" : "Lock"}</span>
            {/* Show only icon or smaller text on very small screens if needed, but flex should handle it. Hiding text on mobile to save space. */}
            <span className="md:hidden">{isLocked ? "Unlock" : "Lock"}</span>
          </button>

          <div className="w-px h-8 bg-foreground/10" />

          {/* Right Group: Sound, Haptic, Reset */}
          <div className="flex flex-[1.5] gap-1">

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={cn(
                "flex-1 flex justify-center items-center gap-2 transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-jaap-primary/10",
                soundEnabled ? "text-foreground" : "text-foreground/40"
              )}
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Haptic Toggle */}
            <button
              onClick={onToggleHaptic}
              className={cn(
                "flex-1 flex justify-center items-center gap-2 transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-jaap-primary/10",
                hapticEnabled ? "text-foreground" : "text-foreground/40"
              )}
              title={hapticEnabled ? "Disable Vibration" : "Enable Vibration"}
            >
              {hapticEnabled ? <Zap size={18} /> : <ZapOff size={18} />}
            </button>

            {/* Reset */}
            <button
              onClick={onResetRequest}
              className="flex-1 flex justify-center items-center gap-2 text-foreground/60 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest py-4 md:py-3 rounded-2xl hover:bg-jaap-primary/10 group"
              title="Reset"
            >
              <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>

      </div>

      {/* Theme Switcher */}
      <div className="mt-4">
        <ThemeSwitcher />
      </div>

      {/* Add Mantra Modal */}
      <AddMantraModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMantra}
      />
    </div >
  );
}
