import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import { SOUNDS, type SoundName, type SoundRecipe, type Shimmer } from "./sounds.js";

const STOP_PADDING = 0.05;
const CLEANUP_MARGIN = 0.05;
const MIN_GAIN = 0.0001;

export type PlayOptions = {
  pitch?: number;
  rate?: number;
  volume?: number;
  detune?: number;
};

const store = {
  enabled: true,
  volume: 1,
  listeners: new Set<() => void>(),
  emit() {
    for (const fn of this.listeners) fn();
  },
};

function subscribe(fn: () => void): () => void {
  store.listeners.add(fn);
  return () => store.listeners.delete(fn);
}

export function setEnabled(value: boolean): void {
  if (typeof value !== "boolean" || store.enabled === value) return;
  store.enabled = value;
  store.emit();
}

export function setVolume(value: number): void {
  if (typeof value !== "number" || Number.isNaN(value)) return;
  const clamped = Math.min(1, Math.max(0, value));
  if (store.volume === clamped) return;
  store.volume = clamped;
  store.emit();
}

let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (sharedContext) return sharedContext;
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    sharedContext = new Ctor();
  } catch {
    return null;
  }
  return sharedContext;
}

function attachShimmer(
  context: AudioContext,
  source: AudioNode,
  destination: AudioNode,
  shimmer: Shimmer,
): AudioNode[] {
  const delay = context.createDelay(1);
  delay.delayTime.value = shimmer.delay;

  const feedbackFilter = context.createBiquadFilter();
  feedbackFilter.type = "lowpass";
  feedbackFilter.frequency.value = shimmer.lowpass;

  const feedbackGain = context.createGain();
  feedbackGain.gain.value = shimmer.feedback;

  const wetGain = context.createGain();
  wetGain.gain.value = shimmer.wet;

  source.connect(delay);
  delay.connect(feedbackFilter);
  feedbackFilter.connect(feedbackGain);
  feedbackGain.connect(delay);
  feedbackFilter.connect(wetGain);
  wetGain.connect(destination);

  return [delay, feedbackFilter, feedbackGain, wetGain];
}

function shimmerTail(shimmer?: Shimmer): number {
  if (!shimmer || shimmer.feedback <= 0) return 0;
  if (shimmer.feedback >= 1) return shimmer.delay;
  return shimmer.delay * (1 + Math.ceil(Math.log(0.001) / Math.log(shimmer.feedback)));
}

function renderRecipe(context: AudioContext, recipe: SoundRecipe, options: PlayOptions): void {
  const pitchFactor = 2 ** ((options.pitch ?? 0) / 12);
  const rate = options.rate && options.rate > 0 ? options.rate : 1;
  const volume = Math.min(1, Math.max(0, options.volume ?? 1)) * store.volume;
  if (volume <= 0) return;

  const now = context.currentTime;
  const master = context.createGain();
  master.gain.value = recipe.masterGain * volume;
  master.connect(context.destination);

  const shimmerNodes = recipe.shimmer
    ? attachShimmer(context, master, context.destination, recipe.shimmer)
    : [];

  let lastEnd = 0;
  for (const layer of recipe.layers) {
    const attack = layer.attack / rate;
    const decay = layer.decay / rate;
    const start = now + (layer.offset ?? 0) / rate;
    const duration = attack + decay + STOP_PADDING;
    lastEnd = Math.max(lastEnd, (layer.offset ?? 0) / rate + duration);

    const gain = context.createGain();
    gain.gain.setValueAtTime(MIN_GAIN, start);
    gain.gain.exponentialRampToValueAtTime(layer.peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(MIN_GAIN, start + attack + decay);

    if (layer.kind === "tone") {
      const oscillator = context.createOscillator();
      oscillator.type = layer.waveform;
      oscillator.frequency.setValueAtTime(layer.frequency * pitchFactor, start);
      const detune = (layer.detune ?? 0) + (options.detune ?? 0);
      if (detune) oscillator.detune.value = detune;
      if (layer.glideTo !== undefined) {
        const glideTime = (layer.glideTime ?? layer.attack + layer.decay) / rate;
        oscillator.frequency.exponentialRampToValueAtTime(layer.glideTo * pitchFactor, start + glideTime);
      }
      oscillator.connect(gain).connect(master);
      oscillator.start(start);
      oscillator.stop(start + duration);
    } else {
      const length = Math.max(1, Math.floor(duration * context.sampleRate));
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = 2 * Math.random() - 1;
      const source = context.createBufferSource();
      source.buffer = buffer;

      const filter = context.createBiquadFilter();
      filter.type = layer.filterType;
      filter.frequency.setValueAtTime(layer.filterFrequency * pitchFactor, start);
      if (layer.filterQ !== undefined) filter.Q.value = layer.filterQ;
      if (layer.filterGlideTo !== undefined) {
        filter.frequency.exponentialRampToValueAtTime(layer.filterGlideTo * pitchFactor, start + attack + decay);
      }

      source.connect(filter).connect(gain).connect(master);
      source.start(start);
      source.stop(start + duration);
    }
  }

  const cleanupAfterMs = (lastEnd + shimmerTail(recipe.shimmer) + CLEANUP_MARGIN) * 1000;
  setTimeout(() => {
    master.disconnect();
    for (const node of shimmerNodes) node.disconnect();
  }, cleanupAfterMs);
}

function trigger(recipe: SoundRecipe, options: PlayOptions): void {
  if (!store.enabled) return;
  if (typeof navigator !== "undefined" && navigator.userActivation?.hasBeenActive === false) return;

  const context = getAudioContext();
  if (!context) return;

  if (context.state === "running") {
    renderRecipe(context, recipe, options);
    return;
  }
  try {
    void context.resume().then(
      () => {
        if (store.enabled && context.state === "running") renderRecipe(context, recipe, options);
      },
      () => { },
    );
  } catch {
  }
}

export function play(sound: SoundName | SoundRecipe = "chime", options: PlayOptions = {}): void {
  const recipe = typeof sound === "string" ? SOUNDS[sound] : sound;
  if (!recipe || !Array.isArray(recipe.layers)) return;
  trigger(recipe, options);
}

export type UseSoundsOptions<Extra extends Record<string, SoundRecipe>> = {
  sounds?: Extra;
};

export function useSounds<Extra extends Record<string, SoundRecipe> = Record<never, SoundRecipe>>(
  options: UseSoundsOptions<Extra> = {},
) {
  type Name = SoundName | (keyof Extra & string);

  const customRef = useRef(options.sounds);
  customRef.current = options.sounds;

  const enabled = useSyncExternalStore(subscribe, () => store.enabled, () => true);
  const volume = useSyncExternalStore(subscribe, () => store.volume, () => 1);

  const playSound = useCallback((name: Name = "chime", playOptions: PlayOptions = {}) => {
    const recipe = customRef.current?.[name] ?? SOUNDS[name as SoundName];
    if (!recipe) return;
    trigger(recipe, playOptions);
  }, []);

  const names = useMemo(
    () => [...new Set([...Object.keys(SOUNDS), ...Object.keys(options.sounds ?? {})])] as Name[],
    [options.sounds],
  );

  return { play: playSound, names, enabled, setEnabled, volume, setVolume };
}
