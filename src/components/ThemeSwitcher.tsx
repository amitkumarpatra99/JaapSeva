"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Palette, Sun, Sparkles, Droplets, Leaf, Flower2, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "saffron", name: "Saffron", icon: Sun },
  { id: "ocean", name: "Ocean", icon: Droplets },
  { id: "forest", name: "Forest", icon: Leaf },
  { id: "dark", name: "Temple", icon: Sparkles },
  { id: "lotus", name: "Lotus", icon: Flower2 },
  { id: "twilight", name: "Twilight", icon: Moon },
];

export function ThemeSwitcher({ disabled }: { disabled?: boolean }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "p-3.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    isOpen ? "bg-jaap-primary/10 text-jaap-primary" : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                )}
                title="Change Theme"
            >
                <Palette size={18} />
            </button>

            {isOpen && !disabled && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 bg-background/95 backdrop-blur-md border border-foreground/10 rounded-[1.25rem] shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex flex-col p-1.5">
                        {THEMES.map((t) => {
                            const Icon = t.icon;
                            const isActive = theme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setTheme(t.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left",
                                        isActive
                                            ? "bg-jaap-primary text-background shadow-md"
                                            : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                                    )}
                                >
                                    <Icon size={16} className={isActive ? "text-background" : "text-foreground/50"} />
                                    {t.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
