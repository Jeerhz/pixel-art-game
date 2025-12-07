"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface PlayerInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onInputSound?: () => void;
}

export function PlayerInput({
  onSend,
  disabled,
  placeholder,
  isMuted,
  onToggleMute,
  onInputSound,
}: PlayerInputProps) {
  const [input, setInput] = useState("");

  const handleSend = useCallback(() => {
    if (input.trim() && !disabled) {
      onInputSound?.();
      onSend(input.trim());
      setInput("");
    }
  }, [input, disabled, onSend, onInputSound]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="bg-[oklch(0.15_0.02_45)] border-t-2 border-[oklch(0.75_0.15_50)] p-3">
      <div className="flex gap-2 items-center">
        <button
          onClick={onToggleMute}
          className="p-2 text-[oklch(0.75_0.15_50)] hover:text-[oklch(0.85_0.15_50)] transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <span className="text-[oklch(0.75_0.15_50)] text-xs">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="
            flex-1 bg-transparent 
            text-[oklch(0.92_0.03_60)] text-[11px]
            placeholder:text-[oklch(0.45_0.03_45)]
            focus:outline-none
            disabled:opacity-50
          "
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="
            px-3 py-1 
            bg-[oklch(0.75_0.15_50)] 
            text-[oklch(0.12_0.02_45)] 
            text-[10px] 
            hover:bg-[oklch(0.8_0.15_50)]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          "
        >
          SEND
        </button>
      </div>
    </div>
  );
}
