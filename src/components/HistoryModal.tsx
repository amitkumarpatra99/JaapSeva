"use client";

import { X, Calendar, Clock, RotateCcw, Trash2 } from "lucide-react";
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
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        setMounted(true);
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

    const handleExportHistory = () => {
        if (!history.length) return;

        const rows = [
            ["Date", "Time", "Mantra", "Count", "Target"],
            ...history.slice().reverse().map((session) => {
                const date = new Date(session.date);
                const dateString = date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
                const timeString = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
                const mantra = session.mantraName ? `${session.mantraSymbol} ${session.mantraName}` : "—";
                return [dateString, timeString, mantra, session.count.toString(), session.target.toString()];
            }),
        ];

        const csvContent = rows
            .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
            .join("\r\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `jaapseva-history-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        setExporting(true);
        window.setTimeout(() => setExporting(false), 1800);
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Blurry, Highly Rounded Modal Content */}
            <div className="bg-background/60 backdrop-blur-xl border border-foreground/10 rounded-[2.5rem] shadow-2xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-6 border-b border-foreground/10 flex items-center justify-between bg-foreground/[0.02]">
                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                        <Clock size={20} className="text-foreground/60" />
                        History
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-foreground/50 hover:text-foreground transition-colors p-2 hover:bg-foreground/10 rounded-full"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto pl-5 pr-2 py-5 space-y-3 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-foreground/50 text-center p-8 mr-3">
                            <Calendar size={48} className="mb-4 opacity-40" />
                            <p className="text-sm font-medium">No sessions recorded yet.</p>
                            <p className="text-xs mt-2 opacity-70">Complete a target to save a session.</p>
                        </div>
                    ) : (
                        history.slice().reverse().map((session) => (
                            <div
                                key={session.id}
                                className="bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-foreground/5 rounded-[1.5rem] p-5 flex items-center justify-between transition-colors backdrop-blur-sm"
                            >
                                <div>
                                    {/* Mantra badge */}
                                    {session.mantraName && (
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/60 mb-1.5 flex items-center gap-2">
                                            <span className="text-base leading-none">{session.mantraSymbol}</span>
                                            <span>{session.mantraName}</span>
                                        </p>
                                    )}
                                    <p className="text-xs text-foreground/50 uppercase tracking-wider mb-2">
                                        {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        <span className="mx-2 opacity-50">•</span>
                                        {new Date(session.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-2xl font-light text-foreground tracking-tight">
                                        {session.count} <span className="text-sm text-foreground/40 font-normal tracking-widest ml-1">/ {session.target}</span>
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="h-2.5 w-2.5 rounded-full bg-jaap-primary/50 mr-1" />
                                    <button
                                        onClick={() => setItemToDelete(session.id)}
                                        className="h-10 w-10 rounded-full hover:bg-red-500/10 flex items-center justify-center text-foreground/30 hover:text-red-500 transition-colors"
                                        title="Delete Session"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-foreground/10 bg-foreground/[0.02] space-y-3">
                    <button
                        onClick={handleExportHistory}
                        disabled={history.length === 0}
                        className="w-full py-4 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{exporting ? "Exported" : "Export CSV"}</span>
                    </button>
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        disabled={history.length === 0}
                        className="w-full py-4 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RotateCcw size={16} /> Clear History
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