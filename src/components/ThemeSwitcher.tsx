"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = ["saffron", "ocean", "forest", "dark"];

export function ThemeSwitcher({ disabled }: { disabled?: boolean }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const cycleTheme = () => {
        const currentIndex = THEMES.indexOf(theme || "saffron");
        const nextIndex = (currentIndex + 1) % THEMES.length;
        setTheme(THEMES[nextIndex]);
    };

    return (
        <button
            onClick={cycleTheme}
            disabled={disabled}
            className="p-3.5 rounded-full bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Change Theme"
        >
            <Palette size={18} />
        </button>
    );
}
