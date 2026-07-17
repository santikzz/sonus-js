type BaseLayer = {
  offset?: number;
  attack: number;
  decay: number;
  peak: number;
};

export type ToneLayer = BaseLayer & {
  kind: "tone";
  waveform: OscillatorType;
  frequency: number;
  detune?: number;
  glideTo?: number;
  glideTime?: number;
};

export type NoiseLayer = BaseLayer & {
  kind: "noise";
  filterType: BiquadFilterType;
  filterFrequency: number;
  filterQ?: number;
  filterGlideTo?: number;
};

export type SoundLayer = ToneLayer | NoiseLayer;

export type Shimmer = {
  delay: number;
  feedback: number;
  wet: number;
  lowpass: number;
};

export type SoundRecipe = {
  masterGain: number;
  layers: SoundLayer[];
  shimmer?: Shimmer;
};

export function defineSounds<T extends Record<string, SoundRecipe>>(defs: T): T {
  return defs;
}

export const SOUNDS = {
  chime: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1046.5, attack: 0.008, decay: 0.25, peak: 0.085 },
      { kind: "tone", waveform: "sine", frequency: 1568, offset: 0.1, attack: 0.008, decay: 0.3, peak: 0.075 },
    ],
    shimmer: { delay: 0.13, feedback: 0.28, wet: 0.2, lowpass: 4200 },
  },
  sparkle: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1760, attack: 0.004, decay: 0.08, peak: 0.042 },
      { kind: "tone", waveform: "sine", frequency: 2217, offset: 0.05, attack: 0.004, decay: 0.085, peak: 0.038 },
      { kind: "tone", waveform: "sine", frequency: 2637, offset: 0.1, attack: 0.004, decay: 0.11, peak: 0.036 },
      { kind: "tone", waveform: "sine", frequency: 3520, offset: 0.15, attack: 0.004, decay: 0.14, peak: 0.03 },
    ],
    shimmer: { delay: 0.08, feedback: 0.32, wet: 0.2, lowpass: 6500 },
  },
  droplet: {
    masterGain: 0.55,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1250, glideTo: 520, glideTime: 0.15, attack: 0.005, decay: 0.22, peak: 0.07 },
    ],
    shimmer: { delay: 0.1, feedback: 0.22, wet: 0.14, lowpass: 3200 },
  },
  bloom: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 520, attack: 0.07, decay: 0.3, peak: 0.058 },
      { kind: "tone", waveform: "sine", frequency: 520, detune: 14, attack: 0.07, decay: 0.32, peak: 0.048 },
    ],
    shimmer: { delay: 0.16, feedback: 0.22, wet: 0.13, lowpass: 2600 },
  },
  whisper: {
    masterGain: 0.5,
    layers: [
      { kind: "noise", filterType: "lowpass", filterFrequency: 1300, filterQ: 0.8, attack: 0.045, decay: 0.18, peak: 0.045 },
    ],
  },
  tick: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 5200, filterQ: 1.7, attack: 0.001, decay: 0.02, peak: 0.13 },
      { kind: "tone", waveform: "sine", frequency: 2700, attack: 0.001, decay: 0.014, peak: 0.02 },
    ],
  },
  press: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 1600, filterQ: 1.3, attack: 0.001, decay: 0.022, peak: 0.12 },
    ],
  },
  release: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 4400, filterQ: 1.7, attack: 0.001, decay: 0.018, peak: 0.11 },
      { kind: "tone", waveform: "sine", frequency: 3100, offset: 0.008, attack: 0.001, decay: 0.055, peak: 0.022 },
    ],
  },
  toggle: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 2100, filterQ: 1.5, attack: 0.001, decay: 0.018, peak: 0.11 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 3600, filterQ: 1.5, offset: 0.028, attack: 0.001, decay: 0.022, peak: 0.095 },
    ],
  },
  success: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 880, attack: 0.005, decay: 0.1, peak: 0.055 },
      { kind: "tone", waveform: "sine", frequency: 1108.73, offset: 0.07, attack: 0.005, decay: 0.11, peak: 0.055 },
      { kind: "tone", waveform: "sine", frequency: 1318.51, offset: 0.14, attack: 0.005, decay: 0.2, peak: 0.065 },
    ],
    shimmer: { delay: 0.11, feedback: 0.24, wet: 0.15, lowpass: 4800 },
  },
  error: {
    masterGain: 0.42,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 800, filterQ: 1.2, attack: 0.001, decay: 0.04, peak: 0.12 },
      { kind: "tone", waveform: "triangle", frequency: 440, offset: 0.03, attack: 0.005, decay: 0.1, peak: 0.042 },
      { kind: "tone", waveform: "triangle", frequency: 349.23, offset: 0.11, attack: 0.005, decay: 0.16, peak: 0.038 },
    ],
  },
  page: {
    masterGain: 0.38,
    layers: [
      { kind: "noise", filterType: "lowpass", filterFrequency: 1900, filterQ: 0.8, attack: 0.008, decay: 0.09, peak: 0.1 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 4000, filterQ: 1.3, offset: 0.045, attack: 0.005, decay: 0.07, peak: 0.075 },
      { kind: "tone", waveform: "sine", frequency: 2500, offset: 0.08, attack: 0.002, decay: 0.05, peak: 0.022 },
    ],
  },
  loading: {
    masterGain: 0.42,
    layers: [
      { kind: "noise", filterType: "lowpass", filterFrequency: 1500, filterQ: 0.7, attack: 0.04, decay: 0.15, peak: 0.032 },
      { kind: "tone", waveform: "sine", frequency: 430, glideTo: 645, glideTime: 0.2, attack: 0.03, decay: 0.2, peak: 0.048 },
    ],
    shimmer: { delay: 0.12, feedback: 0.2, wet: 0.13, lowpass: 2900 },
  },
  ready: {
    masterGain: 0.45,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 3300, filterQ: 1.6, attack: 0.001, decay: 0.02, peak: 0.095 },
      { kind: "tone", waveform: "sine", frequency: 659.25, offset: 0.03, attack: 0.014, decay: 0.22, peak: 0.048 },
      { kind: "tone", waveform: "sine", frequency: 987.77, offset: 0.03, attack: 0.014, decay: 0.24, peak: 0.034 },
    ],
    shimmer: { delay: 0.14, feedback: 0.22, wet: 0.14, lowpass: 3800 },
  },
  coin: {
    masterGain: 0.45,
    layers: [
      { kind: "tone", waveform: "triangle", frequency: 987.77, attack: 0.002, decay: 0.07, peak: 0.07 },
      { kind: "tone", waveform: "triangle", frequency: 1318.51, offset: 0.07, attack: 0.002, decay: 0.16, peak: 0.08 },
      { kind: "tone", waveform: "sine", frequency: 2637, offset: 0.07, attack: 0.002, decay: 0.1, peak: 0.02 },
    ],
    shimmer: { delay: 0.09, feedback: 0.18, wet: 0.12, lowpass: 5000 },
  },
  pop: {
    masterGain: 0.45,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 320, glideTo: 900, glideTime: 0.05, attack: 0.002, decay: 0.07, peak: 0.09 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 2800, filterQ: 1.4, attack: 0.001, decay: 0.02, peak: 0.05 },
    ],
  },
  swoosh: {
    masterGain: 0.45,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 600, filterGlideTo: 4200, filterQ: 1.1, attack: 0.03, decay: 0.18, peak: 0.12 },
    ],
  },
  levelup: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 523.25, attack: 0.004, decay: 0.1, peak: 0.055 },
      { kind: "tone", waveform: "sine", frequency: 659.25, offset: 0.07, attack: 0.004, decay: 0.1, peak: 0.055 },
      { kind: "tone", waveform: "sine", frequency: 783.99, offset: 0.14, attack: 0.004, decay: 0.12, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 1046.5, offset: 0.21, attack: 0.004, decay: 0.24, peak: 0.07 },
    ],
    shimmer: { delay: 0.11, feedback: 0.28, wet: 0.18, lowpass: 5000 },
  },
  congrats: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "triangle", frequency: 523.25, attack: 0.004, decay: 0.14, peak: 0.05 },
      { kind: "tone", waveform: "triangle", frequency: 659.25, offset: 0.08, attack: 0.004, decay: 0.14, peak: 0.05 },
      { kind: "tone", waveform: "triangle", frequency: 783.99, offset: 0.16, attack: 0.004, decay: 0.16, peak: 0.055 },
      { kind: "tone", waveform: "sine", frequency: 1046.5, offset: 0.24, attack: 0.004, decay: 0.3, peak: 0.07 },
      { kind: "tone", waveform: "sine", frequency: 1318.51, offset: 0.32, attack: 0.004, decay: 0.4, peak: 0.06 },
    ],
    shimmer: { delay: 0.12, feedback: 0.3, wet: 0.2, lowpass: 5500 },
  },
  confetti: {
    masterGain: 0.5,
    layers: [
      { kind: "noise", filterType: "highpass", filterFrequency: 3500, filterQ: 0.8, attack: 0.004, decay: 0.12, peak: 0.045 },
      { kind: "tone", waveform: "sine", frequency: 2093, attack: 0.002, decay: 0.07, peak: 0.032 },
      { kind: "tone", waveform: "sine", frequency: 2793.83, offset: 0.03, attack: 0.002, decay: 0.06, peak: 0.028 },
      { kind: "tone", waveform: "sine", frequency: 2349.32, offset: 0.062, attack: 0.002, decay: 0.07, peak: 0.03 },
      { kind: "tone", waveform: "sine", frequency: 3135.96, offset: 0.095, attack: 0.002, decay: 0.08, peak: 0.026 },
      { kind: "tone", waveform: "sine", frequency: 2637, offset: 0.13, attack: 0.002, decay: 0.09, peak: 0.028 },
      { kind: "tone", waveform: "sine", frequency: 3520, offset: 0.17, attack: 0.002, decay: 0.11, peak: 0.022 },
    ],
    shimmer: { delay: 0.06, feedback: 0.3, wet: 0.18, lowpass: 6500 },
  },
  cheer: {
    masterGain: 0.48,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 900, filterGlideTo: 3200, filterQ: 1.2, attack: 0.12, decay: 0.35, peak: 0.09 },
      { kind: "tone", waveform: "sine", frequency: 523.25, attack: 0.1, decay: 0.32, peak: 0.03 },
      { kind: "tone", waveform: "sine", frequency: 659.25, detune: 8, attack: 0.1, decay: 0.34, peak: 0.028 },
      { kind: "tone", waveform: "sine", frequency: 783.99, offset: 0.05, attack: 0.1, decay: 0.36, peak: 0.026 },
    ],
    shimmer: { delay: 0.13, feedback: 0.25, wet: 0.15, lowpass: 4000 },
  },
  click: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 3000, filterQ: 1.5, attack: 0.001, decay: 0.015, peak: 0.12 },
      { kind: "tone", waveform: "sine", frequency: 1800, attack: 0.001, decay: 0.01, peak: 0.015 },
    ],
  },
  redeem: {
    masterGain: 0.48,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 5000, filterQ: 1.6, attack: 0.001, decay: 0.02, peak: 0.1 },
      { kind: "tone", waveform: "sine", frequency: 880, glideTo: 1760, glideTime: 0.09, attack: 0.003, decay: 0.12, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 2637, offset: 0.09, attack: 0.002, decay: 0.18, peak: 0.035 },
    ],
    shimmer: { delay: 0.1, feedback: 0.22, wet: 0.15, lowpass: 5000 },
  },
  reward: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 523.25, attack: 0.03, decay: 0.35, peak: 0.05 },
      { kind: "tone", waveform: "sine", frequency: 659.25, detune: 6, offset: 0.03, attack: 0.03, decay: 0.36, peak: 0.045 },
      { kind: "tone", waveform: "sine", frequency: 783.99, offset: 0.06, attack: 0.03, decay: 0.38, peak: 0.04 },
      { kind: "tone", waveform: "sine", frequency: 1046.5, offset: 0.12, attack: 0.02, decay: 0.42, peak: 0.05 },
    ],
    shimmer: { delay: 0.14, feedback: 0.28, wet: 0.18, lowpass: 4500 },
  },
  shine: {
    masterGain: 0.45,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 2093, attack: 0.01, decay: 0.45, peak: 0.045 },
      { kind: "tone", waveform: "sine", frequency: 3135.96, offset: 0.06, attack: 0.01, decay: 0.4, peak: 0.024 },
      { kind: "noise", filterType: "highpass", filterFrequency: 6000, filterQ: 0.7, attack: 0.03, decay: 0.2, peak: 0.02 },
    ],
    shimmer: { delay: 0.16, feedback: 0.35, wet: 0.25, lowpass: 7000 },
  },
  notify: {
    masterGain: 0.48,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 987.77, attack: 0.005, decay: 0.15, peak: 0.07 },
      { kind: "tone", waveform: "sine", frequency: 783.99, offset: 0.12, attack: 0.005, decay: 0.22, peak: 0.06 },
    ],
    shimmer: { delay: 0.11, feedback: 0.2, wet: 0.14, lowpass: 4000 },
  },
  send: {
    masterGain: 0.45,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 500, glideTo: 1100, glideTime: 0.08, attack: 0.003, decay: 0.1, peak: 0.07 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 2000, filterGlideTo: 4500, filterQ: 1.1, attack: 0.02, decay: 0.1, peak: 0.05 },
    ],
  },
  unlock: {
    masterGain: 0.45,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 2600, filterQ: 1.6, attack: 0.001, decay: 0.018, peak: 0.11 },
      { kind: "tone", waveform: "sine", frequency: 659.25, offset: 0.03, attack: 0.003, decay: 0.09, peak: 0.05 },
      { kind: "tone", waveform: "sine", frequency: 987.77, offset: 0.1, attack: 0.003, decay: 0.16, peak: 0.06 },
    ],
    shimmer: { delay: 0.09, feedback: 0.18, wet: 0.12, lowpass: 4500 },
  },
} as const satisfies Record<string, SoundRecipe>;

export type SoundName = keyof typeof SOUNDS;

export const soundNames = Object.keys(SOUNDS) as readonly SoundName[];
