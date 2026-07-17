# sonus.js

Synthesized UI sounds for React. One hook, zero audio files, zero dependencies - every sound is generated live with the Web Audio API from a small declarative recipe, and every play can be altered in real time (pitch, speed, volume, detune).

## Install

```sh
npm install sonus-js
```

## Usage

```tsx
import { useSounds } from "sonus-js";

function ClaimButton() {

  const { play } = useSounds();
  const [streak, setStreak] = useState(0);

  return (
    <button
      onClick={() => {
        setStreak((s) => s + 1);
        play("coin", { pitch: streak }); // each claim a semitone higher
      }}
    >
      Claim point
    </button>
  );
}
```

## Real-time modifiers

Every `play(name, options)` accepts:

| Option   | Meaning                                                    |
| -------- | ---------------------------------------------------------- |
| `pitch`  | Semitone shift, fractional allowed (`1` = one semitone up) |
| `rate`   | Time-stretch (`2` = twice as fast)                         |
| `volume` | Per-play volume multiplier (0–1)                           |
| `detune` | Extra cents applied to tone layers                         |

## Built-in sounds

`chime` `sparkle` `droplet` `bloom` `whisper` `tick` `press` `release` `toggle` `success` `error` `page` `loading` `ready` `coin` `pop` `swoosh` `levelup` `congrats` `confetti` `cheer` `click` `redeem` `reward` `shine` `notify` `send` `unlock`

## Custom sounds

Recipes are plain objects - extend the palette without touching engine code:

```tsx
import { defineSounds, useSounds } from "sonus-js";

const mySounds = defineSounds({
  laser: {
    masterGain: 0.4,
    layers: [
      { kind: "tone", waveform: "sawtooth", frequency: 1800, glideTo: 200, glideTime: 0.12, attack: 0.002, decay: 0.14, peak: 0.05 },
    ],
  },
});

const { play } = useSounds({ sounds: mySounds });
play("laser", { pitch: 2 });
```

A recipe is a `masterGain` plus layers: `tone` (oscillator with optional glide/detune) and `noise` (filtered noise with optional filter sweep), plus an optional `shimmer` echo tail. See [src/sounds.ts](src/sounds.ts) for the full types and all built-in recipes.

## Global controls

`setEnabled(false)` mutes everything; `setVolume(0.5)` scales everything. Both are reactive inside `useSounds()` (`enabled`, `volume`) and shared across all hook instances.

## License

MIT