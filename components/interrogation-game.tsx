"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ScenePanel } from "./scene-panel";
import { DialoguePanel } from "./dialogue-panel";
import { PlayerInput } from "./player-input";
import { TitleScreen } from "./title-screen";
import { CreditsScreen } from "./credits-screen";
import { useGameState } from "@/hooks/use-game-state";
import { useDialogue } from "@/hooks/use-dialogue";
import { useSound } from "@/hooks/use-sound";

export function InterrogationGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const prevSpeakerRef = useRef<string | null>(null);

  const {
    gameState,
    updateTension,
    addEvidence,
    setPhase,
    updateMoods,
    revealAI,
    disappearAI,
    endCase,
  } = useGameState();

  const {
    messages,
    currentSpeaker,
    isTyping,
    sendMessage,
    aiWhisper,
    showAiReveal,
  } = useDialogue(
    gameState,
    updateTension,
    addEvidence,
    setPhase,
    updateMoods,
    revealAI,
    disappearAI,
    endCase
  );

  const {
    isMuted,
    toggleMute,
    playVoiceBlip,
    playSound,
    playInputSound,
    startMainMusic,
    stopMainMusic,
    startAiMusic,
    stopAiMusic,
    resumeAudio,
  } = useSound();

  useEffect(() => {
    if (gameStarted && !showCredits && !gameState.caseEnded) {
      startMainMusic();
    }
  }, [gameStarted, showCredits, gameState.caseEnded, startMainMusic]);

  useEffect(() => {
    if (showAiReveal) {
      startAiMusic();
      playSound("ai");
    }
  }, [showAiReveal, startAiMusic, playSound]);

  useEffect(() => {
    if (gameState.aiDisappeared && !gameState.caseEnded) {
      stopAiMusic();
      // Brief pause before resuming main theme
      setTimeout(() => {
        startMainMusic();
      }, 1000);
    }
  }, [
    gameState.aiDisappeared,
    gameState.caseEnded,
    stopAiMusic,
    startMainMusic,
  ]);

  useEffect(() => {
    if (
      currentSpeaker &&
      isTyping &&
      currentSpeaker !== prevSpeakerRef.current
    ) {
      const isEmotional =
        gameState.suspectMood === "crying" ||
        gameState.suspectMood === "breaking_down";
      playVoiceBlip(currentSpeaker, 3, isEmotional);
    }
    prevSpeakerRef.current = currentSpeaker;
  }, [currentSpeaker, isTyping, gameState.suspectMood, playVoiceBlip]);

  useEffect(() => {
    if (gameState.caseEnded) {
      stopMainMusic();
      stopAiMusic();
      playSound("ending");
      setShowCredits(true);
    }
  }, [gameState.caseEnded, playSound, stopMainMusic, stopAiMusic]);

  const handleStartGame = useCallback(async () => {
    await resumeAudio();
    setGameStarted(true);
  }, [resumeAudio]);

  const handlePlayerMessage = useCallback(
    async (message: string) => {
      await sendMessage(message);
    },
    [sendMessage]
  );

  const handleCreditsComplete = useCallback(() => {
    setShowCredits(false);
    setGameStarted(false);
  }, []);

  if (!gameStarted) {
    return <TitleScreen onStart={handleStartGame} />;
  }

  if (showCredits) {
    return <CreditsScreen onComplete={handleCreditsComplete} />;
  }

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden scanlines">
      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Left panel - Scene with character */}
        <div className="w-1/2 h-full">
          <ScenePanel
            phase={gameState.phase}
            currentSpeaker={currentSpeaker}
            detectiveMood={gameState.detectiveMood}
            suspectMood={gameState.suspectMood}
            aiWhisper={aiWhisper}
            showAiReveal={showAiReveal}
            aiDisappeared={gameState.aiDisappeared}
          />
        </div>

        {/* Right panel - Dialogue */}
        <div className="w-1/2 h-full min-h-0 overflow-hidden">
          <DialoguePanel
            messages={messages}
            currentSpeaker={currentSpeaker}
            isTyping={isTyping}
            aiWhisper={aiWhisper}
          />
        </div>
      </div>

      {/* Bottom - Input bar */}
      <div className="shrink-0">
        <PlayerInput
          onSend={handlePlayerMessage}
          disabled={isTyping || gameState.caseEnded}
          placeholder="Type your question to the suspect..."
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onInputSound={playInputSound}
        />
      </div>
    </div>
  );
}
