import { useRef, useState } from "react";
import { defineSounds, useSounds, type PlayOptions } from "sonus-js";

const customSounds = defineSounds({
  laser: {
    masterGain: 0.4,
    layers: [
      { kind: "tone", waveform: "sawtooth", frequency: 1800, glideTo: 200, glideTime: 0.12, attack: 0.002, decay: 0.14, peak: 0.05 },
    ],
  },
});

export default function App() {
  const { play, names, enabled, setEnabled, volume, setVolume } = useSounds({ sounds: customSounds });
  const [pitch, setPitch] = useState(0);
  const [rate, setRate] = useState(1);
  const [streak, setStreak] = useState(0);
  const streakRef = useRef(0);
  const streakTimer = useRef<number>();

  const modifiers: PlayOptions = { pitch, rate };

  const claimPoint = () => {
    streakRef.current += 1;
    setStreak(streakRef.current);
    play("coin", { pitch: Math.min(streakRef.current - 1, 14) });
    window.clearTimeout(streakTimer.current);
    streakTimer.current = window.setTimeout(() => {
      streakRef.current = 0;
      setStreak(0);
    }, 1500);
  };

  return (
    <main>
      <header>
        <h1>sonus.js</h1>
        <p>
          Synthesized UI sounds for React - one hook, zero audio files, alterable in real time.
        </p>
      </header>

      <section className="card">
        <h2>Claim points</h2>
        <p className="hint">
          Each claim replays the same <code>coin</code> recipe one semitone higher -{" "}
          <code>play("coin", {"{ pitch: streak }"})</code>. Pause 1.5s and the streak resets.
        </p>
        <div className="claim-row">
          <button className="claim" onClick={claimPoint}>
            Claim point
          </button>
          <span className="streak">
            {streak > 0 ? `+${streak}` : " "}
          </span>
        </div>
      </section>

      <section className="card">
        <h2>Palette</h2>
        <p className="hint">Every button plays with the modifiers below applied live.</p>
        <div className="grid">
          {names.map((name) => (
            <button key={name} onClick={() => play(name, modifiers)}>
              {name}
              {name === "laser" && <span className="badge">custom</span>}
            </button>
          ))}
        </div>
        <div className="sliders">
          <label>
            pitch <b>{pitch > 0 ? `+${pitch}` : pitch} st</b>
            <input type="range" min={-12} max={12} step={1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} />
          </label>
          <label>
            rate <b>{rate.toFixed(2)}×</b>
            <input type="range" min={0.5} max={2} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Global</h2>
        <div className="sliders">
          <label>
            volume <b>{Math.round(volume * 100)}%</b>
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
          </label>
          <label className="toggle">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            sounds {enabled ? "on" : "off"}
          </label>
        </div>
      </section>

    </main>
  );
}
