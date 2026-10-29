// Cinematic Web Audio engine synchronized to the video playback timeline

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

const getAudioContext = (): AudioContext | null => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setMasterVolume = (volume: number) => {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime);
  }
};

// Play a cinematic pad chord at key video chapters
export const playCinematicChord = (notes: number[], duration = 2.0, type: OscillatorType = 'sine') => {
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;
  const targetOutput = masterGain;

  notes.forEach((freq, idx) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Smooth envelope: gentle attack and warm decay
      const startTime = ctx.currentTime + idx * 0.03;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.06 / (notes.length * 0.7), startTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(targetOutput);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  });
};

// Climax chord for the final reveal of the letter "A"
export const playClimaxCelebration = () => {
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;
  const targetOutput = masterGain;

  // Majestic A-Major chord with sparkling high harmonics (A2, A3, E4, A4, C#5, E5, A5)
  const frequencies = [110, 220, 329.63, 440, 554.37, 659.25, 880];
  
  frequencies.forEach((freq, i) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i < 2 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const delay = i * 0.04;
      const startTime = ctx.currentTime + delay;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.07 / (i + 1), startTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.2);

      osc.connect(gain);
      gain.connect(targetOutput);

      osc.start(startTime);
      osc.stop(startTime + 3.5);
    } catch (e) {
      console.debug('Climax audio error:', e);
    }
  });
};
