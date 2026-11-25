"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";

// The Sake app's AmbientSound (client/src/components/AmbientSound.tsx): a small toggle that plays a
// soundscape synthesized with the Web Audio API (no audio files): rain on tiles, brewery morning,
// mountain wind, Fushimi canal. Same filters, levels and 1.5s fade in / 0.5s fade out as the app.
// Client-only by nature: nothing is created until the visitor clicks, and everything is stopped
// when the page unmounts. Changed: `type="button"` and `aria-pressed` for screen readers.

export type SoundType = "rain" | "brewery" | "wind" | "stream";

type Label = { en: string; ja: string };

const DEFAULT_LABELS: Record<SoundType, Label> = {
  rain: { en: "Rain on tiles", ja: "瓦に降る雨" },
  brewery: { en: "Brewery morning", ja: "蔵の朝" },
  wind: { en: "Mountain wind", ja: "山の風" },
  stream: { en: "Fushimi canal", ja: "伏見の水路" },
};

type Stoppable = AudioScheduledSourceNode;

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const length = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function noiseSource(ctx: AudioContext) {
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 10);
  noise.loop = true;
  return noise;
}

function setupRain(ctx: AudioContext, gain: GainNode): Stoppable[] {
  const noise = noiseSource(ctx);
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 800;
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 200;
  noise.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gain);
  noise.start();
  return [noise];
}

function setupBrewery(ctx: AudioContext, gain: GainNode): Stoppable[] {
  const noise = noiseSource(ctx);
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 200;
  noise.connect(lowpass);
  lowpass.connect(gain);
  noise.start();
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 60;
  const oscGain = ctx.createGain();
  oscGain.gain.value = 0.03;
  osc.connect(oscGain);
  oscGain.connect(gain);
  osc.start();
  return [noise, osc];
}

function setupWind(ctx: AudioContext, gain: GainNode): Stoppable[] {
  const noise = noiseSource(ctx);
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 400;
  bandpass.Q.value = 0.5;
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 200;
  lfo.connect(lfoGain);
  lfoGain.connect(bandpass.frequency);
  lfo.start();
  noise.connect(bandpass);
  bandpass.connect(gain);
  noise.start();
  return [noise, lfo];
}

function setupStream(ctx: AudioContext, gain: GainNode): Stoppable[] {
  const noise = noiseSource(ctx);
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 1200;
  bandpass.Q.value = 1.5;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 2000;
  noise.connect(bandpass);
  bandpass.connect(lowpass);
  lowpass.connect(gain);
  noise.start();
  return [noise];
}

const SETUP = { rain: setupRain, brewery: setupBrewery, wind: setupWind, stream: setupStream };

function stopAll(sources: Stoppable[]) {
  for (const s of sources) {
    try {
      s.stop();
    } catch {
      /* already stopped */
    }
  }
}

export function AmbientSound({ type, label }: { type: SoundType; label?: Label }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Stoppable[]>([]);
  const current = label ?? DEFAULT_LABELS[type];

  const toggle = useCallback(() => {
    if (playing) {
      const ctx = ctxRef.current;
      const gain = gainRef.current;
      if (ctx && gain) {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        const sources = sourcesRef.current;
        setTimeout(() => {
          stopAll(sources);
          void ctx.close();
        }, 600);
      }
      sourcesRef.current = [];
      ctxRef.current = null;
      gainRef.current = null;
      setPlaying(false);
      return;
    }
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5);
    ctxRef.current = ctx;
    gainRef.current = gain;
    sourcesRef.current = SETUP[type](ctx, gain);
    setPlaying(true);
  }, [playing, type]);

  useEffect(
    () => () => {
      stopAll(sourcesRef.current);
      void ctxRef.current?.close();
    },
    [],
  );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      title={t(current.en, current.ja)}
      className={
        playing
          ? "inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-[0.12em] uppercase border transition-all duration-500 border-[oklch(0.78_0.12_85/0.5)] bg-[oklch(0.78_0.12_85/0.08)] text-[oklch(0.78_0.12_85)]"
          : "inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-[0.12em] uppercase border transition-all duration-500 border-[oklch(0.28_0.04_270)] text-muted-foreground hover:border-[oklch(0.78_0.12_85/0.3)] hover:text-foreground"
      }
    >
      {playing ? <Volume2 aria-hidden="true" size={12} /> : <VolumeX aria-hidden="true" size={12} />}
      <span>{t(current.en, current.ja)}</span>
    </button>
  );
}
