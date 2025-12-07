"use client";

import { CharacterPortrait } from "./character-portrait";
import { InterrogationRoom } from "./interrogation-room";
import type {
  LolaMood,
  DetectiveMood,
  GameState,
} from "@/hooks/use-game-state";
import type { Message } from "@/hooks/use-dialogue";

interface ScenePanelProps {
  phase: GameState["phase"];
  currentSpeaker: Message["speaker"] | null;
  detectiveMood: DetectiveMood;
  suspectMood: LolaMood;
  aiWhisper: string | null;
  showAiReveal: boolean;
  aiDisappeared: boolean;
}

export function ScenePanel({
  phase,
  currentSpeaker,
  detectiveMood,
  suspectMood,
  aiWhisper,
  showAiReveal,
  aiDisappeared,
}: ScenePanelProps) {
  const showDetective = currentSpeaker === "detective";
  const showSuspect =
    currentSpeaker === "suspect" || currentSpeaker === "ai_whisper";

  return (
    <div className="h-full relative bg-[oklch(0.15_0.02_45)] overflow-hidden">
      {/* Background room */}
      <div className="absolute inset-0 opacity-40">
        <InterrogationRoom phase={phase} />
      </div>

      {/* AI reveal effect overlay */}
      {showAiReveal && (
        <div className="absolute inset-0 z-30 ai-reveal-overlay">
          <div className="absolute inset-0 bg-[oklch(0.7_0.2_180)] opacity-20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[16px] text-[oklch(0.7_0.2_180)] ai-glitch-heavy tracking-widest">
              THE AI REVEALS ITSELF
            </p>
          </div>
        </div>
      )}

      {/* Character display area */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        {/* Show the speaking character prominently */}
        {showDetective && (
          <div className="animate-fade-in">
            <CharacterPortrait
              character="detective"
              isActive={true}
              mood={detectiveMood}
              large={true}
            />
          </div>
        )}

        {showSuspect && !aiDisappeared && (
          <div className="animate-fade-in">
            <CharacterPortrait
              character="suspect"
              isActive={true}
              mood={suspectMood}
              showAiGlow={!!aiWhisper || currentSpeaker === "ai_whisper"}
              showAiReveal={showAiReveal}
              large={true}
            />
          </div>
        )}

        {/* When no one is speaking, show both characters smaller */}
        {!currentSpeaker && !aiDisappeared && (
          <div className="flex gap-8 items-end">
            <CharacterPortrait
              character="detective"
              isActive={false}
              mood={detectiveMood}
            />
            <CharacterPortrait
              character="suspect"
              isActive={false}
              mood={suspectMood}
              showAiGlow={false}
            />
          </div>
        )}

        {/* AI disappeared state */}
        {aiDisappeared && currentSpeaker === "suspect" && (
          <div className="animate-fade-in">
            <CharacterPortrait
              character="suspect"
              isActive={true}
              mood={suspectMood}
              showAiGlow={false}
              large={true}
            />
          </div>
        )}
      </div>

      {/* Phase indicator */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-[oklch(0.12_0.02_45)]/90 border border-[oklch(0.75_0.15_50)] px-3 py-2">
          <p className="text-[8px] text-[oklch(0.65_0.04_55)] tracking-wider">
            PHASE
          </p>
          <p className="text-[10px] text-[oklch(0.75_0.15_50)]">
            {getPhaseLabel(phase)}
          </p>
        </div>
      </div>

      {/* Tension meter */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-[oklch(0.12_0.02_45)]/90 border border-[oklch(0.75_0.15_50)] px-3 py-2">
          <p className="text-[8px] text-[oklch(0.65_0.04_55)] tracking-wider">
            {suspectMood.toUpperCase().replace("_", " ")}
          </p>
        </div>
      </div>
    </div>
  );
}

function getPhaseLabel(phase: GameState["phase"]) {
  switch (phase) {
    case "introduction":
      return "CASE BRIEFING";
    case "investigation":
      return "INTERROGATION";
    case "confrontation":
      return "CONFRONTATION";
    case "revelation":
      return "REVELATION";
    case "ending":
      return "THE END";
    case "credits":
      return "CREDITS";
    default:
      return "INTERROGATION";
  }
}
