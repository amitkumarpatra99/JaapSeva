"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Sparkles, Droplets, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <button
                onClick={() => setTheme("saffron")}
                className={cn(
                    "p-2 rounded-xl transition-all hover:bg-white/10",
                    theme === "saffron" ? "bg-white/20 text-jaap-primary shadow-sm" : "text-jaap-neutral/60"
                )}
                title="Saffron (Default)"
            >
                <Sun size={16} />
            </button>
            <button
                onClick={() => setTheme("ocean")}
                className={cn(
                    "p-2 rounded-xl transition-all hover:bg-white/10",
                    theme === "ocean" ? "bg-white/20 text-jaap-primary shadow-sm" : "text-jaap-neutral/60"
                )}
                title="Ocean"
            >
                <Droplets size={16} />
            </button>
            <button
                onClick={() => setTheme("forest")}
                className={cn(
                    "p-2 rounded-xl transition-all hover:bg-white/10",
                    theme === "forest" ? "bg-white/20 text-jaap-primary shadow-sm" : "text-jaap-neutral/60"
                )}
                title="Forest"
            >
                <Leaf size={16} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={cn(
                    "p-2 rounded-xl transition-all hover:bg-white/10",
                    theme === "dark" ? "bg-white/20 text-jaap-primary shadow-sm" : "text-jaap-neutral/60"
                )}
                title="Temple (Spiritual)"
            >
                <Sparkles size={16} />
            </button>
        </div>
    );
}
