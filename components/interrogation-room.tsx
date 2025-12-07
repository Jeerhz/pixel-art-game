"use client";

interface InterrogationRoomProps {
  phase:
    | "introduction"
    | "investigation"
    | "confrontation"
    | "revelation"
    | "ending"
    | "credits";
}

export function InterrogationRoom({ phase }: InterrogationRoomProps) {
  return (
    <div className="w-full h-full relative bg-[oklch(0.15_0.02_45)] overflow-hidden">
      {/* Room background with pixel art style */}
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full pixel-art"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Back wall */}
        <rect x="0" y="0" width="400" height="180" fill="#2a1f1a" />

        {/* Wall texture lines */}
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * 24}
            x2="400"
            y2={i * 24}
            stroke="#352a24"
            strokeWidth="1"
          />
        ))}

        {/* Floor */}
        <rect x="0" y="180" width="400" height="120" fill="#1a1512" />

        {/* Floor tiles */}
        {[...Array(10)].map((_, i) => (
          <g key={i}>
            <line
              x1={i * 44}
              y1="180"
              x2={i * 44 + 20}
              y2="300"
              stroke="#251d18"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Ceiling lamp */}
        <g className="lamp-flicker">
          {/* Lamp cord */}
          <line
            x1="200"
            y1="0"
            x2="200"
            y2="40"
            stroke="#3d3029"
            strokeWidth="2"
          />

          {/* Lamp shade */}
          <polygon points="180,40 220,40 230,55 170,55" fill="#c97b3a" />

          {/* Light bulb glow */}
          <ellipse
            cx="200"
            cy="48"
            rx="15"
            ry="8"
            fill="#f4d9a0"
            opacity="0.9"
          />

          {/* Light cone */}
          <polygon
            points="170,55 230,55 280,180 120,180"
            fill="url(#lightGradient)"
            opacity="0.15"
          />
        </g>

        {/* Interrogation table */}
        <g>
          {/* Table top */}
          <rect x="120" y="200" width="160" height="8" fill="#4a3828" rx="1" />
          {/* Table shadow */}
          <rect
            x="125"
            y="208"
            width="150"
            height="4"
            fill="#1a1512"
            opacity="0.5"
          />
          {/* Table legs */}
          <rect x="135" y="208" width="8" height="40" fill="#3d2d1f" />
          <rect x="257" y="208" width="8" height="40" fill="#3d2d1f" />
        </g>

        {/* Chair left (empty - detective standing) */}
        <g>
          <rect x="90" y="220" width="30" height="25" fill="#3d2d1f" rx="2" />
          <rect x="88" y="215" width="34" height="8" fill="#4a3828" rx="1" />
          <rect x="93" y="245" width="6" height="20" fill="#2d1f15" />
          <rect x="111" y="245" width="6" height="20" fill="#2d1f15" />
        </g>

        {/* Chair right (Lola sitting) */}
        <g>
          <rect x="280" y="220" width="30" height="25" fill="#3d2d1f" rx="2" />
          <rect x="278" y="215" width="34" height="8" fill="#4a3828" rx="1" />
          <rect x="283" y="245" width="6" height="20" fill="#2d1f15" />
          <rect x="301" y="245" width="6" height="20" fill="#2d1f15" />
          {/* Chair back */}
          <rect x="280" y="185" width="30" height="35" fill="#4a3828" rx="2" />
        </g>

        {/* Evidence folder on table */}
        <rect x="175" y="195" width="25" height="18" fill="#c97b3a" rx="1" />
        <rect x="177" y="197" width="21" height="14" fill="#f4d9a0" rx="1" />

        {/* Coffee cup */}
        <g>
          <ellipse cx="150" cy="197" rx="8" ry="3" fill="#2d1f15" />
          <rect x="142" y="190" width="16" height="8" fill="#4a3828" rx="1" />
          <ellipse cx="150" cy="190" rx="8" ry="3" fill="#1a1512" />
        </g>

        {/* One-way mirror (back wall) */}
        <rect
          x="50"
          y="60"
          width="80"
          height="60"
          fill="#1a2a25"
          stroke="#3d3029"
          strokeWidth="3"
        />
        <rect
          x="55"
          y="65"
          width="70"
          height="50"
          fill="#0d1a15"
          opacity="0.8"
        />

        {/* Mirror reflection hint */}
        <line
          x1="60"
          y1="70"
          x2="75"
          y2="85"
          stroke="#2a3a35"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Door */}
        <rect
          x="300"
          y="50"
          width="50"
          height="130"
          fill="#3d2d1f"
          stroke="#4a3828"
          strokeWidth="2"
        />
        <circle cx="340" cy="115" r="4" fill="#c97b3a" />

        {/* Tape recorder on table */}
        {phase !== "introduction" && (
          <g>
            <rect
              x="205"
              y="193"
              width="20"
              height="12"
              fill="#2d1f15"
              rx="1"
            />
            <circle cx="210" cy="199" r="3" fill="#1a1512" />
            <circle cx="220" cy="199" r="3" fill="#1a1512" />
            {/* Recording light */}
            <circle cx="215" cy="194" r="2" fill="#ff4444">
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* Light gradient definition */}
        <defs>
          <linearGradient id="lightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f4d9a0" stopOpacity="1" />
            <stop offset="100%" stopColor="#f4d9a0" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[oklch(0.92_0.03_60)] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-10px) translateX(5px);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
