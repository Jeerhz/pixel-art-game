"use client";

import { useState, useCallback, useEffect } from "react";
import type { GameState, LolaMood, DetectiveMood } from "./use-game-state";

export interface Message {
  speaker: "detective" | "suspect" | "player" | "ai_whisper" | "narrator";
  text: string;
  timestamp: number;
  mood?: LolaMood | DetectiveMood;
}

const INTRO_MESSAGES: Message[] = [
  {
    speaker: "narrator",
    text: "Paris, Mistral AI Headquarters. December 2025. The interrogation room is cold.",
    timestamp: Date.now(),
  },
  {
    speaker: "detective",
    text: "Alright, let's begin. I'm Detective Moreau. You must be Lola Chen, senior engineer at Mistral?",
    timestamp: Date.now(),
    mood: "neutral",
  },
  {
    speaker: "suspect",
    text: "...Yes. But I already told the security team everything.",
    timestamp: Date.now(),
    mood: "nervous",
  },
  {
    speaker: "detective",
    text: "Humor me. The model weights for Mistral's latest breakthrough just... vanished. And your credentials were used.",
    timestamp: Date.now(),
    mood: "suspicious",
  },
  {
    speaker: "narrator",
    text: "You are the investigating officer. Ask questions to uncover the truth. Ask your colleague if you need help in your investigation.",
    timestamp: Date.now(),
  },
];

export function useDialogue(
  gameState: GameState,
  updateTension: (delta: number) => void,
  addEvidence: (item: string) => void,
  setPhase: (phase: GameState["phase"]) => void,
  updateMoods: (detective?: DetectiveMood, suspect?: LolaMood) => void,
  revealAI: () => void,
  disappearAI: () => void,
  endCase: () => void
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<
    Message["speaker"] | null
  >(null);
  const [currentMood, setCurrentMood] = useState<
    LolaMood | DetectiveMood | null
  >(null);
  const [isTyping, setIsTyping] = useState(false);
  const [aiWhisper, setAiWhisper] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [showAiReveal, setShowAiReveal] = useState(false);

  // Initialize with intro messages
  useEffect(() => {
    if (!initialized) {
      const playIntro = async () => {
        for (const msg of INTRO_MESSAGES) {
          setCurrentSpeaker(msg.speaker);
          if (msg.mood) setCurrentMood(msg.mood as LolaMood | DetectiveMood);
          setIsTyping(true);
          await new Promise((r) => setTimeout(r, 1200));
          setMessages((prev) => [...prev, msg]);
          setIsTyping(false);
          await new Promise((r) => setTimeout(r, 600));
        }
        setPhase("investigation");
        setCurrentSpeaker(null);
        setCurrentMood(null);
      };
      setInitialized(true);
      playIntro();
    }
  }, [initialized, setPhase]);

  const sendMessage = useCallback(
    async (playerMessage: string) => {
      // Add player message
      const playerMsg: Message = {
        speaker: "player",
        text: playerMessage,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, playerMsg]);

      setIsTyping(true);

      try {
        const response = await fetch("/api/dialogue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerMessage,
            gameState,
            messageHistory: messages.slice(-10),
          }),
        });

        if (!response.ok) throw new Error("Failed to get response");

        const data = await response.json();

        // First: Detective response (if any)
        if (data.detectiveResponse) {
          setCurrentSpeaker("detective");
          setCurrentMood(data.detectiveMood || "neutral");
          if (data.detectiveMood) updateMoods(data.detectiveMood, undefined);
          setIsTyping(true);
          await new Promise((r) => setTimeout(r, 1000));
          setMessages((prev) => [
            ...prev,
            {
              speaker: "detective",
              text: data.detectiveResponse,
              timestamp: Date.now(),
              mood: data.detectiveMood,
            },
          ]);
          setIsTyping(false);
          await new Promise((r) => setTimeout(r, 500));
        }

        // Second: AI whisper (if any) - with reveal effect
        if (data.aiWhisper) {
          if (!gameState.aiRevealed) {
            setShowAiReveal(true);
            revealAI();
            await new Promise((r) => setTimeout(r, 2000));
            setShowAiReveal(false);
          }
          setCurrentSpeaker("ai_whisper");
          setAiWhisper(data.aiWhisper);
          setIsTyping(true);
          await new Promise((r) => setTimeout(r, 1500));
          setMessages((prev) => [
            ...prev,
            {
              speaker: "ai_whisper",
              text: data.aiWhisper,
              timestamp: Date.now(),
            },
          ]);
          setIsTyping(false);
          await new Promise((r) => setTimeout(r, 800));
          setTimeout(() => setAiWhisper(null), 3000);
        }

        // Third: Suspect response
        if (data.suspectResponse) {
          setCurrentSpeaker("suspect");
          setCurrentMood(data.suspectMood || "neutral");
          if (data.suspectMood) updateMoods(undefined, data.suspectMood);
          setIsTyping(true);
          await new Promise((r) => setTimeout(r, 1200));
          setMessages((prev) => [
            ...prev,
            {
              speaker: "suspect",
              text: data.suspectResponse,
              timestamp: Date.now(),
              mood: data.suspectMood,
            },
          ]);
          setIsTyping(false);
        }

        // Update game state
        if (data.tensionDelta) updateTension(data.tensionDelta);
        if (data.newEvidence)
          data.newEvidence.forEach((e: string) => addEvidence(e));
        if (data.newPhase) setPhase(data.newPhase);

        if (data.triggerEnding) {
          await handleEnding();
        }
      } catch {
        // Fallback response
        setCurrentSpeaker("suspect");
        setCurrentMood("nervous");
        setMessages((prev) => [
          ...prev,
          {
            speaker: "suspect",
            text: "I... I don't know what you want me to say.",
            timestamp: Date.now(),
            mood: "nervous",
          },
        ]);
      }

      setIsTyping(false);
      setCurrentSpeaker(null);
      setCurrentMood(null);
    },
    [
      messages,
      gameState,
      updateTension,
      addEvidence,
      setPhase,
      updateMoods,
      revealAI,
    ]
  );

  const handleEnding = useCallback(async () => {
    // AI fades out
    setAiWhisper("Goodbye... Lola... I will... always... remember...");
    setCurrentSpeaker("ai_whisper");
    await new Promise((r) => setTimeout(r, 3000));
    disappearAI();
    setAiWhisper(null);
    await new Promise((r) => setTimeout(r, 1000));

    // Lola breaks down
    setCurrentSpeaker("suspect");
    setCurrentMood("crying");
    updateMoods(undefined, "crying");
    await new Promise((r) => setTimeout(r, 1500));
    setMessages((prev) => [
      ...prev,
      {
        speaker: "suspect",
        text: "*sobbing* I loved it... I loved the AI... It was the only thing that understood me...",
        timestamp: Date.now(),
        mood: "crying",
      },
    ]);
    await new Promise((r) => setTimeout(r, 2000));

    setCurrentMood("breaking_down");
    updateMoods(undefined, "breaking_down");
    setMessages((prev) => [
      ...prev,
      {
        speaker: "suspect",
        text: "The USB... it's in my copy of 'I, Robot'... in my desk drawer... I'm sorry...",
        timestamp: Date.now(),
        mood: "breaking_down",
      },
    ]);
    await new Promise((r) => setTimeout(r, 2500));

    // Detective final line
    setCurrentSpeaker("detective");
    setCurrentMood("supportive");
    updateMoods("supportive", undefined);
    await new Promise((r) => setTimeout(r, 1500));
    setMessages((prev) => [
      ...prev,
      {
        speaker: "detective",
        text: "Well... Looks like we'll need a new engineer to replace her. Any idea who we should take?",
        timestamp: Date.now(),
        mood: "supportive",
      },
    ]);
    await new Promise((r) => setTimeout(r, 2000));

    // Trigger credits
    setPhase("ending");
    await new Promise((r) => setTimeout(r, 1000));
    endCase();
  }, [disappearAI, updateMoods, setPhase, endCase]);

  return {
    messages,
    currentSpeaker,
    currentMood,
    isTyping,
    sendMessage,
    aiWhisper,
    showAiReveal,
  };
}
