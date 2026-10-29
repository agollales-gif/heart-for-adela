// Elegant, subtle procedural audio feedback using the Web Audio API
// Completely zero-asset, lightweight, and gentle for educational/mathematical feel

let audioCtx: AudioContext | null = null;
let soundEnabled = false;

export const toggleSound = (enabled?: boolean): boolean => {
  if (enabled !== undefined) {
    soundEnabled = enabled;
  } else {
    soundEnabled = !soundEnabled;
  }
  
  if (soundEnabled && !audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended' && soundEnabled) {
    audioCtx.resume();
  }

  return soundEnabled;
};

export const isSoundEnabled = (): boolean => soundEnabled;

// Play a subtle mathematical step click/tick
export const playStepSound = (pitch = 440, type: OscillatorType = 'sine') => {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.25, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {
    console.debug('Audio error:', e);
  }
};

// Play a celestial chord / harmonic resolution when letter "A" appears
export const playRevealChord = () => {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) return;
    const notes = [440, 554.37, 659.25, 880]; // A major chord (A4, C#5, E5, A5)
    
    notes.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.04);

      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05 / (idx + 1), audioCtx.currentTime + 0.05 + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + idx * 0.04);
      osc.stop(audioCtx.currentTime + 2.0);
    });
  } catch (e) {
    console.debug('Audio chord error:', e);
  }
};
