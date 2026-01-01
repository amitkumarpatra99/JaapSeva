"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmJson?: string; // Optional custom text for confirm button
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jaap-primary/10 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-jaap-primary tracking-wide">{title}</h3>
            <button
              onClick={onClose}
              className="text-jaap-neutral/60 hover:text-jaap-primary transition-colors p-1 hover:bg-white/50 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-jaap-neutral/80 font-medium leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl border border-jaap-neutral/20 text-jaap-neutral font-bold text-sm hover:bg-white/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
