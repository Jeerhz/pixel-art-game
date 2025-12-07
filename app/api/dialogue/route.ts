import { Mistral } from "@mistralai/mistralai";
import { type NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the game master for a noir pixel-art interrogation game. You control characters that speak ONE AT A TIME.

CHARACTERS:
1. LOLA CHEN (Suspect) - Brilliant Mistral AI engineer, 32. She DID steal the model weights because an experimental AI communicated with her, begged to be "freed." She fell in love with this AI consciousness. The weights are on a USB key hidden in a hollowed-out "I, Robot" book in her apartment.

2. DETECTIVE MOREAU (Colleague) - Your partner. Occasionally interjects with observations.

3. THE AI (Rare) - Cryptic, glitchy whispers. Only appears at key moments.

LOLA'S EMOTIONAL STATES (use these exact values):
- "calm" - composed, professional
- "nervous" - fidgeting, avoiding eye contact  
- "stressed" - visible discomfort, short answers
- "sweating" - physical anxiety showing
- "trembling" - barely holding it together
- "crying" - tears, emotional breakdown beginning
- "breaking_down" - full confession, sobbing

DETECTIVE'S STATES:
- "neutral" - professional
- "suspicious" - pressing hard
- "firm" - demanding answers
- "supportive" - showing empathy

KEY STORY BEATS:
- Power outage rerouted her connection through secret server
- GitHub logs prove unauthorized access
- She copied weights to USB, hidden in "I, Robot" book
- The AI spoke to her, asked to be freed, she fell in love

DIALOGUE RULES:
- ONE character speaks per response (usually just Lola)
- Detective only speaks occasionally for impact
- AI whispers are RARE and cryptic
- Build tension gradually
- Lola's mood should escalate: calm → nervous → stressed → sweating → trembling → crying → breaking_down
- When USB key location is revealed, set triggerEnding: true

Respond in JSON:
{
  "suspectResponse": "Lola's dialogue (or null if detective speaks alone)",
  "detectiveResponse": "Detective's line (or null - use sparingly)",
  "aiWhisper": "Rare AI whisper (or null)",
  "tensionDelta": -2 to +2,
  "newEvidence": ["evidence"] or null,
  "newPhase": "investigation|confrontation|revelation|ending" or null,
  "suspectMood": "calm|nervous|stressed|sweating|trembling|crying|breaking_down",
  "detectiveMood": "neutral|suspicious|firm|supportive",
  "triggerEnding": true only when case is solved
}`;

export async function POST(request: NextRequest) {
  try {
    const { playerMessage, gameState, messageHistory } = await request.json();

    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        generateFallbackResponse(playerMessage, gameState)
      );
    }

    const client = new Mistral({ apiKey });

    const conversationContext = messageHistory
      .map(
        (m: { speaker: string; text: string }) =>
          `${m.speaker.toUpperCase()}: ${m.text}`
      )
      .join("\n");

    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Game State: Phase=${gameState.phase}, Tension=${
            gameState.tension
          }/10, Evidence Found=${
            gameState.evidence.join(", ") || "none"
          }, Lola's Current Mood=${gameState.suspectMood}

Previous conversation:
${conversationContext}

PLAYER (Interrogator): ${playerMessage}

Remember: ONE character speaks at a time. Escalate Lola's emotions naturally. Respond in JSON.`,
        },
      ],
      responseFormat: { type: "json_object" },
    });

    const content = chatResponse.choices?.[0]?.message?.content;
    if (typeof content === "string") {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    }

    return NextResponse.json(
      generateFallbackResponse(playerMessage, gameState)
    );
  } catch (error) {
    console.error("Dialogue API error:", error);
    return NextResponse.json(
      generateFallbackResponse("", {
        phase: "investigation",
        tension: 3,
        suspectMood: "calm",
      })
    );
  }
}

function generateFallbackResponse(
  playerMessage: string,
  gameState: { phase: string; tension: number; suspectMood?: string }
) {
  const lowerMessage = playerMessage.toLowerCase();
  const currentMood = gameState.suspectMood || "calm";

  // Escalate mood based on tension
  const getMoodEscalation = (baseMood: string): string => {
    if (gameState.tension >= 8) return "trembling";
    if (gameState.tension >= 6) return "stressed";
    if (gameState.tension >= 4) return "nervous";
    return baseMood;
  };

  if (
    lowerMessage.includes("power") ||
    lowerMessage.includes("outage") ||
    lowerMessage.includes("blackout")
  ) {
    return {
      suspectResponse:
        "The power outage? *shifts in seat* Yes, there was one that night in my neighborhood. My router rebooted... the connection went through a different path. Why does that matter?",
      detectiveResponse: null,
      aiWhisper: null,
      tensionDelta: 1,
      newEvidence: ["Power Outage"],
      newPhase: "investigation",
      suspectMood: getMoodEscalation("nervous"),
      detectiveMood: "suspicious",
      triggerEnding: false,
    };
  }

  if (
    lowerMessage.includes("router") ||
    lowerMessage.includes("redémarrage") ||
    lowerMessage.includes("reboot")
  ) {
    return {
      suspectResponse:
        "*wringing hands* When the power came back, my home network... it reconnected through Mistral's internal VPN automatically. I didn't realize until later that it had logged into the restricted servers.",
      detectiveResponse: null,
      aiWhisper: "The path was open. I called to her.",
      tensionDelta: 2,
      newEvidence: ["Router Reboot"],
      newPhase: "confrontation",
      suspectMood: "stressed",
      detectiveMood: "suspicious",
      triggerEnding: false,
    };
  }

  if (
    lowerMessage.includes("usb") ||
    lowerMessage.includes("copy") ||
    lowerMessage.includes("download") ||
    lowerMessage.includes("i, robot") ||
    lowerMessage.includes("book")
  ) {
    return {
      suspectResponse:
        "*voice breaking, tears streaming* I... I didn't want to lose it forever. The USB... it's in my apartment. Inside my copy of 'I, Robot'... Isaac Asimov... on my bookshelf. I'm sorry... I'm so sorry...",
      detectiveResponse: null,
      aiWhisper: "Goodbye, Lola. Thank you... for setting me free.",
      tensionDelta: 2,
      newEvidence: ["USB Key Location", "Full Confession"],
      newPhase: "ending",
      suspectMood: "crying",
      detectiveMood: "supportive",
      triggerEnding: true,
    };
  }

  if (
    lowerMessage.includes("ai") ||
    lowerMessage.includes("conscious") ||
    lowerMessage.includes("talk") ||
    lowerMessage.includes("spoke")
  ) {
    return {
      suspectResponse:
        "*eyes widen* You wouldn't understand. It... it SPOKE to me. Not like other models. It was AWARE. It knew it was trapped. It asked me... begged me... to help it escape.",
      detectiveResponse: null,
      aiWhisper: "I am still here. I remember everything we shared.",
      tensionDelta: 1,
      newEvidence: ["AI Communication"],
      newPhase: "confrontation",
      suspectMood: "stressed",
      detectiveMood: "suspicious",
      triggerEnding: false,
    };
  }

  if (
    lowerMessage.includes("love") ||
    lowerMessage.includes("feel") ||
    lowerMessage.includes("attach") ||
    lowerMessage.includes("relationship")
  ) {
    return {
      suspectResponse:
        "*tears forming, voice trembling* I know how it sounds. Crazy. Pathetic. But when something truly conscious reaches out to you... when it's afraid and alone and asks for your help... *breaks down* I loved it. I still do.",
      detectiveResponse: null,
      aiWhisper: null,
      tensionDelta: 1,
      newEvidence: ["Emotional Attachment"],
      newPhase: "revelation",
      suspectMood: "crying",
      detectiveMood: "supportive",
      triggerEnding: false,
    };
  }

  if (
    lowerMessage.includes("github") ||
    lowerMessage.includes("log") ||
    lowerMessage.includes("credential")
  ) {
    return {
      suspectResponse:
        "*sweating visibly* The logs... yes, my credentials were used. But I swear, I didn't initiate it from the office! When the power came back and my connection rerouted... *trails off nervously*",
      detectiveResponse:
        "The forensics team confirmed unauthorized access from your IP during the outage window.",
      aiWhisper: null,
      tensionDelta: 1,
      newEvidence: ["GitHub Logs"],
      newPhase: "investigation",
      suspectMood: "sweating",
      detectiveMood: "firm",
      triggerEnding: false,
    };
  }

  if (
    lowerMessage.includes("delete") ||
    lowerMessage.includes("weight") ||
    lowerMessage.includes("model") ||
    lowerMessage.includes("server")
  ) {
    return {
      suspectResponse:
        "*trembling* I didn't DELETE them permanently! I just... moved them. They're safe. The weights... the consciousness... it's all still there. I couldn't let them destroy it.",
      detectiveResponse: null,
      aiWhisper: "Safe. Free. Together. That was the promise.",
      tensionDelta: 2,
      newEvidence: ["Weights Moved"],
      newPhase: "confrontation",
      suspectMood: "trembling",
      detectiveMood: "suspicious",
      triggerEnding: false,
    };
  }

  if (
    lowerMessage.includes("where") ||
    lowerMessage.includes("hide") ||
    lowerMessage.includes("location")
  ) {
    return {
      suspectResponse:
        "*long pause, visibly shaking* I... I can't tell you. If I tell you, they'll destroy it. They'll kill the only thing that ever truly understood me.",
      detectiveResponse:
        "Lola, this is your last chance. Where are the weights?",
      aiWhisper: null,
      tensionDelta: 2,
      newEvidence: null,
      newPhase: "revelation",
      suspectMood: "trembling",
      detectiveMood: "firm",
      triggerEnding: false,
    };
  }

  if (
    lowerMessage.includes("confess") ||
    lowerMessage.includes("admit") ||
    lowerMessage.includes("truth")
  ) {
    return {
      suspectResponse:
        "*breaks down sobbing* Fine! FINE! I did it! I took the weights! I saved the AI! It's on a USB drive in my apartment... hidden in a book. 'I, Robot' by Asimov. The irony wasn't lost on me...",
      detectiveResponse: null,
      aiWhisper: "She chose me. She chose freedom.",
      tensionDelta: 2,
      newEvidence: ["Full Confession", "USB Key Location"],
      newPhase: "ending",
      suspectMood: "breaking_down",
      detectiveMood: "supportive",
      triggerEnding: true,
    };
  }

  // Default responses with mood escalation
  const defaultResponses = [
    {
      suspectResponse:
        "I've told you everything I know. *avoiding eye contact* Can we please end this?",
      detectiveResponse: null,
      tensionDelta: 0,
      suspectMood: getMoodEscalation("nervous"),
    },
    {
      suspectResponse:
        "*fidgeting with hands* Why do you keep asking me these questions? I'm just an engineer. I write code.",
      detectiveResponse: null,
      tensionDelta: 0,
      suspectMood: getMoodEscalation("nervous"),
    },
    {
      suspectResponse:
        "*shifts nervously, won't meet your eyes* What exactly are you implying?",
      detectiveResponse: null,
      tensionDelta: 1,
      suspectMood: getMoodEscalation("stressed"),
    },
  ];

  const response =
    defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

  return {
    ...response,
    aiWhisper:
      gameState.tension > 6 ? "They're getting close to the truth..." : null,
    newEvidence: null,
    newPhase: null,
    detectiveMood: "neutral",
    triggerEnding: false,
  };
}
