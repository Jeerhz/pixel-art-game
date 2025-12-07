"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/hooks/use-dialogue";

interface DialoguePanelProps {
  messages: Message[];
  currentSpeaker: Message["speaker"] | null;
  isTyping: boolean;
  aiWhisper: string | null;
}

export function DialoguePanel({
  messages,
  currentSpeaker,
  isTyping,
  aiWhisper,
}: DialoguePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case "detective":
        return "text-[oklch(0.75_0.15_50)]";
      case "suspect":
        return "text-[oklch(0.82_0.12_85)]";
      case "player":
        return "text-[oklch(0.92_0.03_60)]";
      case "ai_whisper":
        return "text-[oklch(0.7_0.2_180)]";
      case "narrator":
        return "text-[oklch(0.65_0.04_55)]";
      default:
        return "text-[oklch(0.65_0.04_55)]";
    }
  };

  const getSpeakerName = (speaker: string) => {
    switch (speaker) {
      case "detective":
        return "DET. MOREAU";
      case "suspect":
        return "LOLA";
      case "player":
        return "YOU";
      case "ai_whisper":
        return "???";
      case "narrator":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col bg-[oklch(0.12_0.02_45)] border-l-2 border-[oklch(0.75_0.15_50)] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-3 border-b border-[oklch(0.3_0.04_45)]">
        <h2 className="text-[10px] text-[oklch(0.75_0.15_50)] tracking-widest">
          DIALOGUE LOG
        </h2>
      </div>

      {/* AI Whisper overlay */}
      {aiWhisper && (
        <div className="shrink-0 mx-3 mt-2 p-2 bg-[oklch(0.15_0.05_180)] border border-[oklch(0.7_0.2_180)] rounded ai-glitch">
          <p className="text-[10px] text-[oklch(0.7_0.2_180)] italic">
            {"<"} {aiWhisper} {">"}
          </p>
        </div>
      )}

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-[oklch(0.3_0.04_45)]"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`
              ${message.speaker === "ai_whisper" ? "ai-glitch" : ""}
              ${message.speaker === "narrator" ? "text-center italic py-2" : ""}
              ${
                message.speaker === "player"
                  ? "border-l-2 border-[oklch(0.75_0.15_50)] pl-2"
                  : ""
              }
            `}
          >
            {message.speaker !== "narrator" && (
              <p
                className={`text-[9px] ${getSpeakerColor(
                  message.speaker
                )} font-bold mb-1`}
              >
                {getSpeakerName(message.speaker)}
              </p>
            )}
            <p
              className={`
              text-[11px] leading-relaxed
              ${
                message.speaker === "narrator"
                  ? "text-[oklch(0.65_0.04_55)]"
                  : "text-[oklch(0.85_0.03_60)]"
              }
              ${
                message.speaker === "ai_whisper"
                  ? "text-[oklch(0.7_0.2_180)] italic"
                  : ""
              }
            `}
            >
              {message.text}
            </p>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && currentSpeaker && (
          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] ${getSpeakerColor(
                currentSpeaker
              )} font-bold`}
            >
              {getSpeakerName(currentSpeaker)}
            </span>
            <span className="text-[10px] text-[oklch(0.65_0.04_55)]">
              <span className="typing-dots">...</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
