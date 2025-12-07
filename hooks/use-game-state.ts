"use client";

import { useState, useCallback } from "react";

export type LolaMood =
  | "calm"
  | "neutral"
  | "nervous"
  | "stressed"
  | "sweating"
  | "trembling"
  | "crying"
  | "breaking_down";
export type DetectiveMood = "neutral" | "suspicious" | "firm" | "supportive";

export interface GameState {
  phase:
    | "introduction"
    | "investigation"
    | "confrontation"
    | "revelation"
    | "ending"
    | "credits";
  tension: number;
  evidence: string[];
  detectiveMood: DetectiveMood;
  suspectMood: LolaMood;
  revelationsUnlocked: string[];
  usbKeyFound: boolean;
  aiRevealed: boolean;
  aiDisappeared: boolean;
  caseEnded: boolean;
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    phase: "introduction",
    tension: 2,
    evidence: [],
    detectiveMood: "neutral",
    suspectMood: "calm",
    revelationsUnlocked: [],
    usbKeyFound: false,
    aiRevealed: false,
    aiDisappeared: false,
    caseEnded: false,
  });

  const updateTension = useCallback((delta: number) => {
    setGameState((prev) => ({
      ...prev,
      tension: Math.max(0, Math.min(10, prev.tension + delta)),
    }));
  }, []);

  const addEvidence = useCallback((item: string) => {
    setGameState((prev) => ({
      ...prev,
      evidence: prev.evidence.includes(item)
        ? prev.evidence
        : [...prev.evidence, item],
    }));
  }, []);

  const setPhase = useCallback((phase: GameState["phase"]) => {
    setGameState((prev) => ({ ...prev, phase }));
  }, []);

  const updateMoods = useCallback(
    (detective?: DetectiveMood, suspect?: LolaMood) => {
      setGameState((prev) => ({
        ...prev,
        ...(detective && { detectiveMood: detective }),
        ...(suspect && { suspectMood: suspect }),
      }));
    },
    []
  );

  const unlockRevelation = useCallback((revelation: string) => {
    setGameState((prev) => ({
      ...prev,
      revelationsUnlocked: prev.revelationsUnlocked.includes(revelation)
        ? prev.revelationsUnlocked
        : [...prev.revelationsUnlocked, revelation],
    }));
  }, []);

  const findUSBKey = useCallback(() => {
    setGameState((prev) => ({ ...prev, usbKeyFound: true }));
  }, []);

  const revealAI = useCallback(() => {
    setGameState((prev) => ({ ...prev, aiRevealed: true }));
  }, []);

  const disappearAI = useCallback(() => {
    setGameState((prev) => ({ ...prev, aiDisappeared: true }));
  }, []);

  const endCase = useCallback(() => {
    setGameState((prev) => ({ ...prev, caseEnded: true, phase: "credits" }));
  }, []);

  return {
    gameState,
    updateTension,
    addEvidence,
    setPhase,
    updateMoods,
    unlockRevelation,
    findUSBKey,
    revealAI,
    disappearAI,
    endCase,
  };
}
