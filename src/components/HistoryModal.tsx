"use client";

import { X, Calendar, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HistorySession } from "@/types";
import ConfirmationModal from "@/components/ConfirmationModal";

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistorySession[];
    onClearHistory: () => void;
    onDeleteHistoryItem: (id: string) => void;
}

export default function HistoryModal({ isOpen, onClose, history, onClearHistory, onDeleteHistoryItem }: HistoryModalProps) {
    const [mounted, setMounted] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        // Prevent scrolling when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Modal Content - Matches Glass Theme */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] w-full max-w-md h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-6 border-b border-jaap-primary/20 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground tracking-wide drop-shadow-sm flex items-center gap-2">
                        <Clock size={20} />
                        History
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-foreground hover:text-foreground/80 transition-colors p-1 hover:bg-jaap-primary/20 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-foreground/80 text-center p-8">
                            <Calendar size={48} className="mb-4 opacity-80" />
                            <p className="text-sm">No sessions recorded yet.</p>
                            <p className="text-xs mt-1">Complete a target to save session!</p>
                        </div>
                    ) : (
                        history.slice().reverse().map((session) => (
                            <div
                                key={session.id}
                                className="bg-jaap-primary/5 border border-jaap-primary/20 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-jaap-primary/10"
                            >
                                <div>
                                    {/* Mantra badge */}
                                    {session.mantraName && (
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/90 mb-1 flex items-center gap-1">
                                            <span>{session.mantraSymbol}</span>
                                            <span>{session.mantraName}</span>
                                        </p>
                                    )}
                                    <p className="text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1">
                                        {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        <span className="mx-1">•</span>
                                        {new Date(session.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-lg font-bold text-foreground">
                                        {session.count} <span className="text-xs text-foreground/90 font-medium">/ {session.target}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-jaap-primary/20 flex items-center justify-center text-foreground">
                                        <div className="w-2 h-2 rounded-full bg-current" />
                                    </div>
                                    <button
                                        onClick={() => setItemToDelete(session.id)}
                                        className="h-8 w-8 rounded-full hover:bg-red-500/20 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-jaap-primary/20 bg-jaap-primary/5">
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        disabled={history.length === 0}
                        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/80 hover:text-foreground hover:bg-jaap-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RotateCcw size={14} /> Clear History
                    </button>
                </div>

            </div>

            <ConfirmationModal
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={() => { onClearHistory(); setShowClearConfirm(false); }}
                title="Clear History?"
                message="All session history will be permanently deleted. This cannot be undone."
            />

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (itemToDelete) {
                        onDeleteHistoryItem(itemToDelete);
                        setItemToDelete(null);
                    }
                }}
                title="Delete Session?"
                message="This session will be permanently deleted from your history."
            />
        </div>,
        document.body
    );
}
