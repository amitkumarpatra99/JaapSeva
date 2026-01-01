"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmJson?: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-sm">{title}</h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-white/80 font-medium leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl border border-white/10 text-white/70 font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-2xl bg-black text-white font-bold text-sm shadow-lg hover:scale-[1.02] border border-white/10 transition-all"
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
