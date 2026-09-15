// Web Audio API synthesizer helper for browser-based sound effects
// Does not require external MP3/WAV files and works 100% offline.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a clean sine wave tone
 */
export function playTone(frequency: number = 700, durationMs: number = 80, volume: number = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Smooth envelope attack and release to prevent audio clicking
    const now = ctx.currentTime;
    const duration = durationMs / 1000;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.005);
    gain.gain.setValueAtTime(volume, now + duration - 0.005);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    console.warn("Audio playback not permitted or supported:", err);
  }
}

/**
 * Play a Morse dot beep (default ~60ms)
 */
export function playMorseDot() {
  playTone(700, 60, 0.2);
}

/**
 * Play a Morse dash beep (default ~180ms)
 */
export function playMorseDash() {
  playTone(700, 180, 0.2);
}

/**
 * Play a gentle completion chime for timer sessions
 */
export function playChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Harmonic two-tone chord
    const frequencies = [587.33, 880]; // D5, A5
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + idx * 0.12;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    });
  } catch (err) {
    console.warn("Chime playback not permitted or supported:", err);
  }
}
