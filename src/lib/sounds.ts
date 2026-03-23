// Web Audio API sound effects system for Code Racer
const audioCtx = () => {
  if (!(window as any).__codeRacerAudioCtx) {
    (window as any).__codeRacerAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__codeRacerAudioCtx as AudioContext;
};

const playTone = (freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) => {
  try {
    const ctx = audioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

const playNoise = (duration: number, volume = 0.05) => {
  try {
    const ctx = audioCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    src.buffer = buffer;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
  } catch {}
};

export const SFX = {
  correct: () => {
    playTone(880, 0.1, "sine", 0.12);
    setTimeout(() => playTone(1100, 0.1, "sine", 0.12), 80);
    setTimeout(() => playTone(1320, 0.15, "sine", 0.15), 160);
  },
  wrong: () => {
    playTone(300, 0.15, "sawtooth", 0.1);
    setTimeout(() => playTone(220, 0.25, "sawtooth", 0.08), 120);
  },
  boost: () => {
    const ctx = audioCtx();
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
    playNoise(0.3, 0.06);
  },
  combo: () => {
    [660, 880, 1100, 1320].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.08, "sine", 0.1), i * 60)
    );
  },
  click: () => playTone(1000, 0.05, "sine", 0.08),
  hover: () => playTone(1200, 0.03, "sine", 0.04),
  countdown: () => playTone(440, 0.15, "square", 0.1),
  raceStart: () => {
    playTone(440, 0.1, "square", 0.12);
    setTimeout(() => playTone(880, 0.3, "square", 0.15), 100);
  },
  victory: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.2, "sine", 0.12), i * 150)
    );
  },
  engine: (speed: number) => {
    const freq = 60 + speed * 1.5;
    playTone(freq, 0.15, "sawtooth", 0.02);
  },
};
