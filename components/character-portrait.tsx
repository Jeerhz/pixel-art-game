"use client";

import type { LolaMood, DetectiveMood } from "@/hooks/use-game-state";

interface CharacterPortraitProps {
  character: "detective" | "suspect";
  isActive: boolean;
  mood: LolaMood | DetectiveMood;
  showAiGlow?: boolean;
  showAiReveal?: boolean;
  large?: boolean;
}

export function CharacterPortrait({
  character,
  isActive,
  mood,
  showAiGlow = false,
  showAiReveal = false,
  large = false,
}: CharacterPortraitProps) {
  const isDetective = character === "detective";
  const size = large
    ? "w-48 h-64 md:w-64 md:h-80"
    : "w-24 h-32 md:w-32 md:h-44";

  return (
    <div
      className={`
      relative transition-all duration-300
      ${isActive ? "scale-105" : "scale-100 opacity-70"}
      ${showAiReveal ? "ai-reveal-effect" : ""}
    `}
    >
      {/* AI glow effect for Lola */}
      {showAiGlow && !isDetective && (
        <div className="absolute inset-0 bg-[oklch(0.7_0.2_180)] rounded-lg blur-xl opacity-30 animate-pulse" />
      )}

      {/* AI reveal dramatic effect */}
      {showAiReveal && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 bg-[oklch(0.7_0.2_180)] opacity-50 animate-pulse" />
          <div className="absolute inset-0 ai-glitch-heavy" />
        </div>
      )}

      {/* Portrait frame */}
      <div
        className={`
        relative ${size}
        border-4 border-[oklch(0.75_0.15_50)]
        bg-[oklch(0.18_0.025_40)]
        ${isActive ? "shadow-lg shadow-[oklch(0.75_0.15_50)/30]" : ""}
        ${showAiGlow && !isDetective ? "ai-glitch" : ""}
      `}
      >
        {/* Pixel art character */}
        <svg viewBox="0 0 64 88" className="w-full h-full pixel-art">
          {isDetective ? (
            <DetectiveSprite mood={mood as DetectiveMood} />
          ) : (
            <SuspectSprite mood={mood as LolaMood} showAiGlow={showAiGlow} />
          )}
        </svg>

        {/* Name plate */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="bg-[oklch(0.25_0.03_45)] px-2 py-1 border border-[oklch(0.75_0.15_50)]">
            <p className="text-[8px] text-[oklch(0.92_0.03_60)] tracking-wider">
              {isDetective ? "DET. MOREAU" : "LOLA CHEN"}
            </p>
          </div>
        </div>

        {/* Emotion indicator */}
        {!isDetective && (
          <div className="absolute -top-2 -right-2">
            <EmotionIndicator mood={mood as LolaMood} />
          </div>
        )}
      </div>
    </div>
  );
}

function EmotionIndicator({ mood }: { mood: LolaMood }) {
  const getEmotionStyle = () => {
    switch (mood) {
      case "calm":
        return { color: "bg-green-500", pulse: false };
      case "nervous":
        return { color: "bg-yellow-500", pulse: true };
      case "stressed":
        return { color: "bg-orange-500", pulse: true };
      case "sweating":
        return { color: "bg-orange-600", pulse: true };
      case "trembling":
        return { color: "bg-red-400", pulse: true };
      case "crying":
        return { color: "bg-blue-400", pulse: true };
      case "breaking_down":
        return { color: "bg-red-600", pulse: true };
      default:
        return { color: "bg-gray-400", pulse: false };
    }
  };

  const style = getEmotionStyle();

  return (
    <div
      className={`w-3 h-3 rounded-full ${style.color} ${
        style.pulse ? "animate-pulse" : ""
      }`}
    />
  );
}

function DetectiveSprite({ mood }: { mood: DetectiveMood }) {
  const eyeY = mood === "suspicious" ? 32 : 34;
  const getMouthPath = () => {
    switch (mood) {
      case "supportive":
        return "M26,52 Q32,56 38,52";
      case "firm":
        return "M26,54 L38,54";
      case "suspicious":
        return "M26,52 Q32,50 38,52";
      default:
        return "M26,52 Q32,54 38,52";
    }
  };

  return (
    <g>
      {/* Hair */}
      <rect x="18" y="12" width="28" height="16" fill="#3d3029" />
      <rect x="16" y="16" width="4" height="20" fill="#3d3029" />
      <rect x="44" y="16" width="4" height="20" fill="#3d3029" />

      {/* Face */}
      <rect x="20" y="24" width="24" height="32" fill="#e8c9a0" />

      {/* Eyes */}
      <rect x="24" y={eyeY} width="6" height="4" fill="#1a1512" />
      <rect x="34" y={eyeY} width="6" height="4" fill="#1a1512" />
      <rect x="26" y={eyeY} width="2" height="2" fill="#ffffff" />
      <rect x="36" y={eyeY} width="2" height="2" fill="#ffffff" />

      {/* Eyebrows */}
      {mood === "suspicious" && (
        <>
          <rect
            x="24"
            y="28"
            width="6"
            height="2"
            fill="#3d3029"
            transform="rotate(-10, 27, 29)"
          />
          <rect
            x="34"
            y="28"
            width="6"
            height="2"
            fill="#3d3029"
            transform="rotate(10, 37, 29)"
          />
        </>
      )}
      {mood === "firm" && (
        <>
          <rect x="24" y="30" width="6" height="2" fill="#3d3029" />
          <rect x="34" y="30" width="6" height="2" fill="#3d3029" />
        </>
      )}

      {/* Nose */}
      <rect x="30" y="40" width="4" height="6" fill="#d4b896" />

      {/* Mouth */}
      <path d={getMouthPath()} stroke="#8b6b4a" strokeWidth="2" fill="none" />

      {/* Collar / Shirt */}
      <rect x="16" y="56" width="32" height="32" fill="#4a3828" />
      <polygon points="24,56 32,68 40,56" fill="#f4d9a0" />

      {/* Tie */}
      <rect x="30" y="60" width="4" height="20" fill="#c97b3a" />

      {/* Badge */}
      <rect x="18" y="62" width="8" height="6" fill="#c9a63a" />
    </g>
  );
}

function SuspectSprite({
  mood,
  showAiGlow,
}: {
  mood: LolaMood;
  showAiGlow: boolean;
}) {
  const getEyeY = () => {
    switch (mood) {
      case "nervous":
      case "stressed":
        return 33;
      case "crying":
      case "breaking_down":
        return 35;
      default:
        return 34;
    }
  };

  const getMouthPath = () => {
    switch (mood) {
      case "calm":
        return "M26,52 Q32,54 38,52";
      case "nervous":
        return "M28,52 L36,52";
      case "stressed":
        return "M26,54 Q32,52 38,54";
      case "sweating":
        return "M28,54 L36,54";
      case "trembling":
        return "M26,54 Q32,50 38,54";
      case "crying":
        return "M26,56 Q32,52 38,56";
      case "breaking_down":
        return "M26,58 Q32,52 38,58";
      default:
        return "M26,52 Q32,54 38,52";
    }
  };

  const showTears = mood === "crying" || mood === "breaking_down";
  const showSweat =
    mood === "sweating" || mood === "stressed" || mood === "trembling";

  return (
    <g
      className={
        mood === "trembling" || mood === "breaking_down"
          ? "trembling-animation"
          : ""
      }
    >
      {/* Hair - long dark hair */}
      <rect x="14" y="10" width="36" height="24" fill="#1a1512" />
      <rect x="12" y="18" width="6" height="40" fill="#1a1512" />
      <rect x="46" y="18" width="6" height="40" fill="#1a1512" />
      <rect x="14" y="32" width="4" height="20" fill="#1a1512" />
      <rect x="46" y="32" width="4" height="20" fill="#1a1512" />

      {/* Face */}
      <rect x="20" y="24" width="24" height="32" fill="#f0d9c0" />

      {/* Sweat drops */}
      {showSweat && (
        <>
          <ellipse cx="18" cy="38" rx="2" ry="3" fill="#7ab8d4" opacity="0.8">
            <animate
              attributeName="cy"
              values="38;42;38"
              dur="1s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse
            cx="46"
            cy="35"
            rx="1.5"
            ry="2.5"
            fill="#7ab8d4"
            opacity="0.6"
          >
            <animate
              attributeName="cy"
              values="35;40;35"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </ellipse>
        </>
      )}

      {/* Eyes */}
      <rect x="24" y={getEyeY()} width="6" height="4" fill="#2d4a3a" />
      <rect x="34" y={getEyeY()} width="6" height="4" fill="#2d4a3a" />
      <rect x="26" y={getEyeY()} width="2" height="2" fill="#ffffff" />
      <rect x="36" y={getEyeY()} width="2" height="2" fill="#ffffff" />

      {/* Tears */}
      {showTears && (
        <>
          <ellipse cx="26" cy="42" rx="2" ry="3" fill="#7ab8d4" opacity="0.9">
            <animate
              attributeName="cy"
              values="42;50;42"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="38" cy="43" rx="2" ry="3" fill="#7ab8d4" opacity="0.9">
            <animate
              attributeName="cy"
              values="43;51;43"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </ellipse>
          {mood === "breaking_down" && (
            <>
              <ellipse
                cx="24"
                cy="45"
                rx="1.5"
                ry="2"
                fill="#7ab8d4"
                opacity="0.7"
              >
                <animate
                  attributeName="cy"
                  values="45;52;45"
                  dur="1.3s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <ellipse
                cx="40"
                cy="44"
                rx="1.5"
                ry="2"
                fill="#7ab8d4"
                opacity="0.7"
              >
                <animate
                  attributeName="cy"
                  values="44;51;44"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </ellipse>
            </>
          )}
        </>
      )}

      {/* AI glow in eyes */}
      {showAiGlow && (
        <>
          <rect
            x="24"
            y={getEyeY()}
            width="6"
            height="4"
            fill="#4af0c0"
            opacity="0.5"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.7;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="34"
            y={getEyeY()}
            width="6"
            height="4"
            fill="#4af0c0"
            opacity="0.5"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.7;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
        </>
      )}

      {/* Eyebrows - emotional */}
      {(mood === "crying" || mood === "breaking_down") && (
        <>
          <rect
            x="24"
            y="30"
            width="6"
            height="2"
            fill="#1a1512"
            transform="rotate(10, 27, 31)"
          />
          <rect
            x="34"
            y="30"
            width="6"
            height="2"
            fill="#1a1512"
            transform="rotate(-10, 37, 31)"
          />
        </>
      )}
      {(mood === "stressed" || mood === "trembling") && (
        <>
          <rect
            x="24"
            y="30"
            width="6"
            height="2"
            fill="#1a1512"
            transform="rotate(-5, 27, 31)"
          />
          <rect
            x="34"
            y="30"
            width="6"
            height="2"
            fill="#1a1512"
            transform="rotate(5, 37, 31)"
          />
        </>
      )}

      {/* Nose */}
      <rect x="30" y="40" width="4" height="5" fill="#e0c9b0" />

      {/* Mouth */}
      <path d={getMouthPath()} stroke="#a67b6a" strokeWidth="2" fill="none" />

      {/* Red cheeks when emotional */}
      {(mood === "crying" || mood === "breaking_down") && (
        <>
          <ellipse cx="22" cy="46" rx="4" ry="2" fill="#e88080" opacity="0.4" />
          <ellipse cx="42" cy="46" rx="4" ry="2" fill="#e88080" opacity="0.4" />
        </>
      )}

      {/* Neck */}
      <rect x="28" y="54" width="8" height="6" fill="#f0d9c0" />

      {/* Shirt / Engineer hoodie */}
      <rect x="14" y="58" width="36" height="30" fill="#2a3a4a" />

      {/* Hoodie strings */}
      <rect x="26" y="60" width="2" height="12" fill="#f4d9a0" />
      <rect x="36" y="60" width="2" height="12" fill="#f4d9a0" />

      {/* Mistral logo hint on shirt */}
      <rect x="28" y="68" width="8" height="2" fill="#c97b3a" />
      <rect x="28" y="72" width="8" height="2" fill="#c97b3a" />
    </g>
  );
}
