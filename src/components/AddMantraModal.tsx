"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mantra } from "./ControlPanel";

interface AddMantraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (mantra: Omit<Mantra, "id">) => void;
}

export default function AddMantraModal({ isOpen, onClose, onAdd }: AddMantraModalProps) {
  const [name, setName] = useState("");
  const [hindi, setHindi] = useState("");
  const [english, setEnglish] = useState("");
  const [symbol, setSymbol] = useState("");
  const [suggestedTarget, setSuggestedTarget] = useState(108);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !hindi.trim() || !english.trim()) return;

    onAdd({
      name: name.trim(),
      hindi: hindi.trim(),
      english: english.trim(),
      symbol: symbol || "📿",
      suggestedTarget,
    });

    // Reset form
    setName("");
    setHindi("");
    setEnglish("");
    setSymbol("");
    setSuggestedTarget(108);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-background/95 backdrop-blur-2xl border border-jaap-primary/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-[2rem] p-6 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-jaap-primary">Add Custom Mantra</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-jaap-primary/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Mantra Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Personal Mantra"
              className="w-full px-3 py-2 border border-jaap-primary/30 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-jaap-primary focus:border-jaap-primary placeholder:text-foreground/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Hindi Text *
            </label>
            <input
              type="text"
              value={hindi}
              onChange={(e) => setHindi(e.target.value)}
              placeholder="e.g., ॐ शांति"
              className="w-full px-3 py-2 border border-jaap-primary/30 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-jaap-primary focus:border-jaap-primary placeholder:text-foreground/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              English Text *
            </label>
            <input
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="e.g., Om Shanti"
              className="w-full px-3 py-2 border border-jaap-primary/30 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-jaap-primary focus:border-jaap-primary placeholder:text-foreground/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Symbol (Emoji)
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., 🕉️ (leave empty for default 📿)"
              className="w-full px-3 py-2 border border-jaap-primary/30 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-jaap-primary focus:border-jaap-primary placeholder:text-foreground/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Suggested Target Count
            </label>
            <select
              value={suggestedTarget}
              onChange={(e) => setSuggestedTarget(Number(e.target.value))}
              className="w-full px-3 py-2 border border-jaap-primary/30 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-jaap-primary focus:border-jaap-primary"
            >
              <option value={11}>11</option>
              <option value={108}>108</option>
              <option value={1000}>1000</option>
              <option value={10000}>10000</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-foreground border border-jaap-primary/30 rounded-lg hover:bg-jaap-primary/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-jaap-primary text-background rounded-lg hover:bg-jaap-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Mantra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}