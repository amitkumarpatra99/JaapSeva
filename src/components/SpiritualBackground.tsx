"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SpiritualBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const raysRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // 1. Rotating Divine Rays (The Aura)
        gsap.to(raysRef.current, {
            rotation: 360,
            duration: 60,
            repeat: -1,
            ease: "none",
        });

        // 2. Floating Prana Particles (Energy Sparks)
        const particleCount = 20;
        const particles = document.querySelectorAll(".prana-particle");

        particles.forEach((particle) => {
            // Random initial position
            gsap.set(particle, {
                x: gsap.utils.random(0, window.innerWidth),
                y: gsap.utils.random(window.innerHeight, window.innerHeight + 100),
                scale: gsap.utils.random(0.5, 1.5),
                opacity: gsap.utils.random(0.3, 0.7),
            });

            // Rising Animation
            gsap.to(particle, {
                y: -100, // Move off top screen
                x: "+=random(-100, 100)", // Random sway
                duration: gsap.utils.random(10, 20),
                repeat: -1,
                ease: "none",
                delay: gsap.utils.random(0, 10),
            });

            // Pulse Animation
            gsap.to(particle, {
                opacity: 0,
                duration: gsap.utils.random(2, 4),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

            {/* 1. Base Gradient (Warm Atmosphere) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-jaap-secondary/10 via-background to-background" />

            {/* 2. Rotating Divine Rays */}
            <div
                ref={raysRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] opacity-20"
                style={{
                    background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--color-jaap-primary) 20deg, transparent 40deg, transparent 60deg, var(--color-jaap-secondary) 80deg, transparent 100deg, transparent 180deg, var(--color-jaap-primary) 200deg, transparent 220deg, transparent 300deg, var(--color-jaap-secondary) 320deg, transparent 360deg)"
                }}
            />

            {/* 3. Floating Prana Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="prana-particle absolute w-2 h-2 rounded-full bg-jaap-accent blur-[1px]"
                />
            ))}

            {/* 4. Soft Vignette to focus center */}
            <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,_var(--background)_90%)]" />

        </div>
    );
}
