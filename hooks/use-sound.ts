"use client";

import { useRef, useCallback, useState, useEffect } from "react";

type SoundType = "lola" | "detective" | "ai" | "input" | "tension" | "ending";

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mainMusicRef = useRef<{
    oscillators: OscillatorNode[];
    gains: GainNode[];
  } | null>(null);
  const aiMusicRef = useRef<{
    oscillators: OscillatorNode[];
    gains: GainNode[];
  } | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      // Create master music gain node
      musicGainRef.current = audioContextRef.current.createGain();
      musicGainRef.current.gain.setValueAtTime(
        0.12,
        audioContextRef.current.currentTime
      );
      musicGainRef.current.connect(audioContextRef.current.destination);
    }
    return () => {
      stopMainMusic();
      stopAiMusic();
      audioContextRef.current?.close();
    };
  }, []);

  const resumeAudio = useCallback(async () => {
    if (
      audioContextRef.current &&
      audioContextRef.current.state === "suspended"
    ) {
      await audioContextRef.current.resume();
    }
  }, []);

  const playSound = useCallback(
    async (type: SoundType, options?: { emotional?: boolean }) => {
      if (isMuted || !audioContextRef.current) return;

      await resumeAudio();

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Add a low-pass filter for smoother sounds
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2000, ctx.currentTime);

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      switch (type) {
        case "lola":
          // Soft, breathy feminine voice - smooth sine with gentle attack
          oscillator.type = "sine";
          const lolaBase = options?.emotional ? 350 : 420;
          oscillator.frequency.setValueAtTime(lolaBase, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            lolaBase * 0.85,
            ctx.currentTime + 0.12
          );
          // Smooth envelope with attack
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.12
          );
          filter.frequency.setValueAtTime(
            options?.emotional ? 1200 : 1800,
            ctx.currentTime
          );
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.12);
          break;

        case "detective":
          // Deeper, authoritative voice - triangle wave for warmth
          oscillator.type = "triangle";
          oscillator.frequency.setValueAtTime(180, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            150,
            ctx.currentTime + 0.1
          );
          // Smooth envelope
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.015);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.1
          );
          filter.frequency.setValueAtTime(1000, ctx.currentTime);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.1);
          break;

        case "ai":
          // Eerie, glitchy AI sound with harmonics
          oscillator.type = "sawtooth";
          oscillator.frequency.setValueAtTime(500, ctx.currentTime);
          oscillator.frequency.setValueAtTime(700, ctx.currentTime + 0.04);
          oscillator.frequency.setValueAtTime(400, ctx.currentTime + 0.08);
          oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.12);
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.15
          );
          filter.frequency.setValueAtTime(3000, ctx.currentTime);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.15);
          break;

        case "input":
          oscillator.type = "square";
          oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            600,
            ctx.currentTime + 0.03
          );
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.005);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.05
          );
          filter.frequency.setValueAtTime(4000, ctx.currentTime);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.05);
          break;

        case "tension":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(80, ctx.currentTime);
          gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.5
          );
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.5);
          break;

        case "ending":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(330, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            220,
            ctx.currentTime + 2
          );
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 2);
          break;
      }
    },
    [isMuted, resumeAudio]
  );

  const playVoiceBlip = useCallback(
    (speaker: string, count = 3, emotional = false) => {
      if (isMuted) return;

      let type: SoundType = "lola";
      if (speaker === "detective") type = "detective";
      else if (speaker === "ai_whisper") type = "ai";
      else if (speaker === "suspect") type = "lola";

      for (let i = 0; i < count; i++) {
        const delay = i * 70 + Math.random() * 20;
        setTimeout(() => playSound(type, { emotional }), delay);
      }
    },
    [isMuted, playSound]
  );

  const playInputSound = useCallback(() => {
    if (isMuted) return;
    playSound("input");
  }, [isMuted, playSound]);

  const startMainMusic = useCallback(async () => {
    if (
      isMuted ||
      !audioContextRef.current ||
      !musicGainRef.current ||
      mainMusicRef.current
    )
      return;

    await resumeAudio();

    const ctx = audioContextRef.current;
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // Base drone - low D
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = "sine";
    bass.frequency.setValueAtTime(73.42, ctx.currentTime); // D2
    bassGain.gain.setValueAtTime(0.08, ctx.currentTime);
    bass.connect(bassGain);
    bassGain.connect(musicGainRef.current);
    oscillators.push(bass);
    gains.push(bassGain);

    // Fifth harmony - A
    const fifth = ctx.createOscillator();
    const fifthGain = ctx.createGain();
    fifth.type = "sine";
    fifth.frequency.setValueAtTime(110, ctx.currentTime); // A2
    fifthGain.gain.setValueAtTime(0.04, ctx.currentTime);
    fifth.connect(fifthGain);
    fifthGain.connect(musicGainRef.current);
    oscillators.push(fifth);
    gains.push(fifthGain);

    // Minor third - F
    const minor = ctx.createOscillator();
    const minorGain = ctx.createGain();
    minor.type = "triangle";
    minor.frequency.setValueAtTime(87.31, ctx.currentTime); // F2
    minorGain.gain.setValueAtTime(0.03, ctx.currentTime);
    minor.connect(minorGain);
    minorGain.connect(musicGainRef.current);
    oscillators.push(minor);
    gains.push(minorGain);

    // Subtle high shimmer
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    shimmerGain.gain.setValueAtTime(0.015, ctx.currentTime);
    // LFO for shimmer
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.3, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.01, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(shimmerGain.gain);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(musicGainRef.current);
    oscillators.push(shimmer, lfo);
    gains.push(shimmerGain, lfoGain);

    oscillators.forEach((osc) => osc.start(ctx.currentTime));

    mainMusicRef.current = { oscillators, gains };
  }, [isMuted, resumeAudio]);

  const stopMainMusic = useCallback(() => {
    if (!mainMusicRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    mainMusicRef.current.gains.forEach((gain) => {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    });
    setTimeout(() => {
      mainMusicRef.current?.oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch {}
      });
      mainMusicRef.current = null;
    }, 1100);
  }, []);

  const startAiMusic = useCallback(async () => {
    if (
      isMuted ||
      !audioContextRef.current ||
      !musicGainRef.current ||
      aiMusicRef.current
    )
      return;

    // First stop main music
    stopMainMusic();

    await resumeAudio();

    const ctx = audioContextRef.current;
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // Dissonant tritone base
    const base1 = ctx.createOscillator();
    const baseGain1 = ctx.createGain();
    base1.type = "sawtooth";
    base1.frequency.setValueAtTime(110, ctx.currentTime); // A2
    baseGain1.gain.setValueAtTime(0.05, ctx.currentTime);
    const filter1 = ctx.createBiquadFilter();
    filter1.type = "lowpass";
    filter1.frequency.setValueAtTime(400, ctx.currentTime);
    base1.connect(filter1);
    filter1.connect(baseGain1);
    baseGain1.connect(musicGainRef.current);
    oscillators.push(base1);
    gains.push(baseGain1);

    // Tritone - Eb (dissonant with A)
    const tritone = ctx.createOscillator();
    const tritoneGain = ctx.createGain();
    tritone.type = "sawtooth";
    tritone.frequency.setValueAtTime(155.56, ctx.currentTime); // Eb3
    tritoneGain.gain.setValueAtTime(0.04, ctx.currentTime);
    const filter2 = ctx.createBiquadFilter();
    filter2.type = "lowpass";
    filter2.frequency.setValueAtTime(500, ctx.currentTime);
    tritone.connect(filter2);
    filter2.connect(tritoneGain);
    tritoneGain.connect(musicGainRef.current);
    oscillators.push(tritone);
    gains.push(tritoneGain);

    // High frequency interference
    const interference = ctx.createOscillator();
    const intGain = ctx.createGain();
    interference.type = "square";
    interference.frequency.setValueAtTime(2000, ctx.currentTime);
    intGain.gain.setValueAtTime(0.008, ctx.currentTime);
    // Rapid modulation
    const modLfo = ctx.createOscillator();
    const modGain = ctx.createGain();
    modLfo.type = "square";
    modLfo.frequency.setValueAtTime(8, ctx.currentTime);
    modGain.gain.setValueAtTime(0.006, ctx.currentTime);
    modLfo.connect(modGain);
    modGain.connect(intGain.gain);
    interference.connect(intGain);
    intGain.connect(musicGainRef.current);
    oscillators.push(interference, modLfo);
    gains.push(intGain, modGain);

    // Pulsing sub bass
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(40, ctx.currentTime);
    subGain.gain.setValueAtTime(0.1, ctx.currentTime);
    const subLfo = ctx.createOscillator();
    const subLfoGain = ctx.createGain();
    subLfo.type = "sine";
    subLfo.frequency.setValueAtTime(2, ctx.currentTime);
    subLfoGain.gain.setValueAtTime(0.08, ctx.currentTime);
    subLfo.connect(subLfoGain);
    subLfoGain.connect(subGain.gain);
    sub.connect(subGain);
    subGain.connect(musicGainRef.current);
    oscillators.push(sub, subLfo);
    gains.push(subGain, subLfoGain);

    oscillators.forEach((osc) => osc.start(ctx.currentTime));

    aiMusicRef.current = { oscillators, gains };
  }, [isMuted, stopMainMusic, resumeAudio]);

  const stopAiMusic = useCallback(() => {
    if (!aiMusicRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    aiMusicRef.current.gains.forEach((gain) => {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    });
    setTimeout(() => {
      aiMusicRef.current?.oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch {}
      });
      aiMusicRef.current = null;
    }, 600);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (newMuted) {
        stopMainMusic();
        stopAiMusic();
      }
      return newMuted;
    });
  }, [stopMainMusic, stopAiMusic]);

  return {
    isMuted,
    toggleMute,
    playSound,
    playVoiceBlip,
    playInputSound,
    startMainMusic,
    stopMainMusic,
    startAiMusic,
    stopAiMusic,
    resumeAudio,
  };
}
