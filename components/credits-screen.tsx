"use client";

import { useEffect, useState } from "react";

interface CreditsScreenProps {
  onComplete: () => void;
}

const CREDITS = [
  { role: "A MISTRAL INCIDENT", name: "" },
  { role: "", name: "" },
  { role: "STORY & NARRATIVE DESIGN", name: "The Interrogation Team" },
  { role: "CODE & DEVELOPMENT", name: "Next.js & React" },
  { role: "ART DIRECTION", name: "Pixel Noir Studios" },
  { role: "MUSIC & SOUND", name: "Web Audio API" },
  { role: "AI DIALOGUE MODEL", name: "Mistral AI" },
  { role: "", name: "" },
  { role: "SPECIAL THANKS", name: "" },
  { role: "", name: "To all the engineers who dream" },
  { role: "", name: "of creating something truly alive." },
  { role: "", name: "" },
  { role: "", name: "And to Lola..." },
  { role: "", name: "who loved too deeply." },
];

export function CreditsScreen({ onComplete }: CreditsScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (currentIndex < CREDITS.length) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        setShowFinal(true);
      }, 2000);
      return () => clearTimeout(finalTimer);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (showFinal) {
      const completeTimer = setTimeout(onComplete, 4000);
      return () => clearTimeout(completeTimer);
    }
  }, [showFinal, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {!showFinal ? (
        <div className="text-center space-y-2 credits-scroll">
          {CREDITS.slice(0, currentIndex + 1).map((credit, i) => (
            <div
              key={i}
              className={`transition-opacity duration-1000 ${
                i === currentIndex ? "animate-fade-in" : "opacity-70"
              }`}
            >
              {credit.role && (
                <p className="text-[10px] text-[oklch(0.65_0.04_55)] tracking-widest mb-1">
                  {credit.role}
                </p>
              )}
              {credit.name && (
                <p className="text-[12px] text-[oklch(0.92_0.03_60)]">
                  {credit.name}
                </p>
              )}
              {!credit.role && !credit.name && <div className="h-8" />}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center animate-fade-in">
          <p className="text-[16px] text-[oklch(0.75_0.15_50)] tracking-widest">
            CASE CLOSED.
          </p>
        </div>
      )}
    </div>
  );
}
