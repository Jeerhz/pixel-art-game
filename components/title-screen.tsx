"use client";

import { useState, useEffect } from "react";

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen bg-[oklch(0.12_0.02_45)] flex flex-col items-center justify-center p-8 scanlines relative overflow-hidden"
      onClick={onStart}
    >
      {/* Flickering lamp effect */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-[oklch(0.75_0.15_50)] rounded-full blur-3xl opacity-30 lamp-flicker" />

      {/* Title */}
      <div className="text-center space-y-8 relative z-10">
        <div className="space-y-2">
          <p className="text-[oklch(0.75_0.15_50)] text-xs tracking-widest uppercase animate-pulse">
            A Mistral AI Powered Experience
          </p>
          <h1 className="text-[oklch(0.92_0.03_60)] text-2xl md:text-4xl leading-relaxed pixel-art tracking-tight">
            The MISTRAL
          </h1>
          <h1 className="text-[oklch(0.75_0.15_50)] text-3xl md:text-5xl leading-relaxed pixel-art">
            AIncident
          </h1>
        </div>

        {/* Pixel art decoration */}
        <div className="flex justify-center gap-2 my-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[oklch(0.75_0.15_50)]"
              style={{ opacity: 0.3 + i * 0.15 }}
            />
          ))}
        </div>

        <p className="text-[oklch(0.65_0.04_55)] text-[10px] md:text-xs max-w-md mx-auto leading-relaxed">
          {
            "Paris, 2025. The weights of Mistral's latest model have vanished. One suspect. One interrogation room. The truth must come out."
          }
        </p>

        {/* Start prompt */}
        {showPrompt && (
          <div className="mt-12 animate-pulse">
            <p className="text-[oklch(0.75_0.15_50)] text-[10px] tracking-widest">
              {"[ CLICK ANYWHERE TO BEGIN ]"}
            </p>
          </div>
        )}
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex gap-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-[oklch(0.75_0.15_50)]"
              style={{ opacity: Math.random() * 0.5 + 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
