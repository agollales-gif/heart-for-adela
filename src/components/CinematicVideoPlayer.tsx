import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Download, 
  Sparkles, 
  Smartphone, 
  Monitor,
  Repeat,
  Share2,
  Check
} from 'lucide-react';
import { MathView } from './MathView';
import { playCinematicChord, playClimaxCelebration } from '../utils/videoAudio';
import { CanvasVideoRecorder } from '../utils/videoRecorder';

const TOTAL_DURATION = 16.0; // Total video duration in seconds

interface VideoChapter {
  time: number;
  title: string;
}

const CHAPTERS: VideoChapter[] = [
  { time: 0.0, title: "Prologue: A Tribute" },
  { time: 2.5, title: "The Calculus Equation" },
  { time: 5.8, title: "Exponent Rule Reduction" },
  { time: 8.8, title: "Fundamental Theorem of Calculus" },
  { time: 11.8, title: "Convergence to Identity" },
  { time: 13.8, title: "Final Reveal: Adela" },
];

export const CinematicVideoPlayer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16-9' | '9-16'>('16-9');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const recorderRef = useRef<CanvasVideoRecorder>(new CanvasVideoRecorder());
  const lastChordPlayedRef = useRef<number>(-1);
  const hasCelebratedRef = useRef<boolean>(false);

  // Format time (00:04.2)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  // Get active chapter
  const currentChapter = [...CHAPTERS].reverse().find((c) => currentTime >= c.time) || CHAPTERS[0];

  // Confetti trigger
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f3ff', '#a855f7', '#ffffff', '#ffd166']
      });
    } catch {
      // ignore
    }
  }, []);

  // Play audio chimes on chapter transitions
  useEffect(() => {
    if (isMuted || !isPlaying) return;

    if (currentTime >= 0.0 && currentTime < 2.5 && lastChordPlayedRef.current !== 0) {
      lastChordPlayedRef.current = 0;
      playCinematicChord([220, 329.63, 440], 2.2); // A minor / ambient
    } else if (currentTime >= 2.5 && currentTime < 5.8 && lastChordPlayedRef.current !== 1) {
      lastChordPlayedRef.current = 1;
      playCinematicChord([220, 277.18, 329.63, 440], 2.2); // A major
    } else if (currentTime >= 5.8 && currentTime < 8.8 && lastChordPlayedRef.current !== 2) {
      lastChordPlayedRef.current = 2;
      playCinematicChord([293.66, 369.99, 440, 587.33], 2.0); // D major
    } else if (currentTime >= 8.8 && currentTime < 11.8 && lastChordPlayedRef.current !== 3) {
      lastChordPlayedRef.current = 3;
      playCinematicChord([329.63, 415.30, 493.88, 659.25], 2.0); // E major
    } else if (currentTime >= 11.8 && currentTime < 13.8 && lastChordPlayedRef.current !== 4) {
      lastChordPlayedRef.current = 4;
      playCinematicChord([220, 329.63, 440, 493.88], 1.8); // Asus2
    } else if (currentTime >= 13.8 && lastChordPlayedRef.current !== 5) {
      lastChordPlayedRef.current = 5;
      playClimaxCelebration();
    }
  }, [currentTime, isMuted, isPlaying]);

  // Main playback animation ticker
  useEffect(() => {
    let animId: number;
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            if (isRecording) {
              recorderRef.current.stopRecording();
              setIsRecording(false);
            }

            if (isLooping) {
              hasCelebratedRef.current = false;
              lastChordPlayedRef.current = -1;
              return 0;
            } else {
              setIsPlaying(false);
              return TOTAL_DURATION;
            }
          }

          // Trigger confetti once on climax
          if (next >= 13.8 && !hasCelebratedRef.current) {
            hasCelebratedRef.current = true;
            triggerCelebration();
          }

          return next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed, isLooping, isRecording, triggerCelebration]);

  // Canvas background rendering inside the video frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      const w = (canvas.width = canvas.parentElement?.clientWidth || 960);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 540);

      ctx.clearRect(0, 0, w, h);

      // 1. Sleek cinema vignette & deep space background
      const grad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, Math.max(w, h) * 0.75);
      grad.addColorStop(0, '#0f1118');
      grad.addColorStop(0.6, '#08080a');
      grad.addColorStop(1, '#020203');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. High-precision coordinate grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3. Dynamic calculus wave curve
      ctx.save();
      ctx.beginPath();
      const waveY = h * 0.62;
      for (let x = 0; x < w; x += 4) {
        const y = waveY + Math.sin(x * 0.008 + t) * 25 + Math.cos(x * 0.015 - t * 0.7) * 12;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 4. Subtle camera spotlight at center
      const spotGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 280);
      spotGrad.addColorStop(0, 'rgba(0, 243, 255, 0.07)');
      spotGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
      spotGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Auto-hide controls timer
  const handleUserActivity = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 2800);
  };

  // Replay
  const handleReplay = () => {
    hasCelebratedRef.current = false;
    lastChordPlayedRef.current = -1;
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Export Video
  const handleExportVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsRecording(true);
    handleReplay();
    recorderRef.current.startRecording(canvas);
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 select-none">
      
      {/* Top Video Header / Mode Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between pb-3 px-2 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-white font-bold tracking-wider">ADELA_TRIBUTE_VIDEO.mp4</span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-cyan-400 text-[11px] hidden sm:inline">4K UHD • 60 FPS</span>
        </div>

        {/* Video Mode Selector: 16:9 Cinema or 9:16 Shorts */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setAspectRatio('16-9')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              aspectRatio === '16-9' 
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' 
                : 'text-zinc-400 hover:text-white'
            }`}
            title="16:9 Cinema Widescreen Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">16:9 Cinema</span>
          </button>

          <button
            onClick={() => setAspectRatio('9-16')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              aspectRatio === '9-16' 
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' 
                : 'text-zinc-400 hover:text-white'
            }`}
            title="9:16 Vertical Short / Reels Mode"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">9:16 Short</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport Container */}
      <div
        ref={containerRef}
        onMouseMove={handleUserActivity}
        onTouchStart={handleUserActivity}
        className={`relative overflow-hidden rounded-2xl bg-black border border-zinc-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] transition-all duration-300 ${
          aspectRatio === '16-9' 
            ? 'w-full max-w-5xl aspect-video' 
            : 'w-full max-w-sm aspect-[9/16]'
        }`}
      >
        {/* Background Render Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
        />

        {/* Recording Watermark / HUD */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
          {isRecording ? (
            <span className="px-2.5 py-1 rounded-md bg-red-600/90 text-white font-mono text-[11px] font-bold tracking-widest uppercase animate-pulse flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              REC • EXPORTING VIDEO
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-zinc-400 font-mono text-[10px] tracking-wider uppercase backdrop-blur-md">
              CHAPTER: {currentChapter.title}
            </span>
          )}
        </div>

        {/* Video Timecode HUD in Top Right */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 font-bold backdrop-blur-md">
            {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
          </span>
        </div>

        {/* Video Content Canvas / Animated Scene Layers */}
        <div 
          onClick={() => setIsPlaying((p) => !p)}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 cursor-pointer text-center"
        >
          {/* ========================================================= */}
          {/* SCENE 0: 0.0s – 2.5s (PROLOGUE / INTRO) */}
          {/* ========================================================= */}
          {currentTime >= 0.0 && currentTime < 2.5 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40">
                A MATHEMATICAL TRIBUTE
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                For Teacher Adela
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-mono max-w-md">
                Calculus of Dedication & Boundless Patience
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCENE 1: 2.5s – 5.8s (INITIAL CALCULUS FORMULATION) */}
          {/* ========================================================= */}
          {currentTime >= 2.5 && currentTime < 5.8 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center space-y-4">
              <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase bg-zinc-900/90 border border-zinc-700/80 px-3 py-1 rounded-full">
                INITIAL FORMULATION • t = 0s
              </span>
              
              <div className="text-xl sm:text-3xl md:text-5xl text-white font-mono tracking-wide py-2">
                <MathView 
                  math="\frac{d}{dx} \left( \int_{0}^{\text{Adela}} (\text{Patience} \cdot x) \, dx \right) + \text{Dedication}^{0}" 
                  block={true}
                  glow={true}
                />
              </div>

              <p className="text-xs sm:text-sm text-cyan-300/80 font-sans max-w-lg">
                Accumulating patience over the domain of student learning.
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCENE 2: 5.8s – 8.8s (EXPONENT RULE: Dedication^0 = 1) */}
          {/* ========================================================= */}
          {currentTime >= 5.8 && currentTime < 8.8 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center space-y-4">
              <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase bg-amber-950/50 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                STEP 1 // ZERO EXPONENT RULE (u⁰ = 1)
              </span>

              <div className="text-xl sm:text-3xl md:text-5xl text-white font-mono tracking-wide py-2">
                <MathView 
                  math="\frac{d}{dx} \left( \int_{0}^{\text{Adela}} (\text{Patience} \cdot x) \, dx \right) + 1" 
                  block={true}
                  glow={true}
                />
              </div>

              <p className="text-xs sm:text-sm text-amber-200/90 font-sans max-w-lg">
                Dedication is non-zero and unwavering: <span className="font-mono font-bold text-amber-400">Dedication⁰ = 1</span>.
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCENE 3: 8.8s – 11.8s (FUNDAMENTAL THEOREM OF CALCULUS) */}
          {/* ========================================================= */}
          {currentTime >= 8.8 && currentTime < 11.8 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center space-y-4">
              <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/50 border border-cyan-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                STEP 2 // FUNDAMENTAL THEOREM OF CALCULUS
              </span>

              <div className="text-2xl sm:text-4xl md:text-6xl text-white font-mono tracking-wide py-3">
                <MathView 
                  math="\text{Patience} \cdot \text{Adela} + 1" 
                  block={true}
                  glow={true}
                />
              </div>

              <p className="text-xs sm:text-sm text-cyan-200/90 font-sans max-w-lg">
                Differentiation inverts the integral, resolving the boundary product.
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCENE 4: 11.8s – 13.8s (HARMONIC IDENTITY CONVERGENCE) */}
          {/* ========================================================= */}
          {currentTime >= 11.8 && currentTime < 13.8 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center space-y-4">
              <span className="text-[11px] font-mono tracking-widest text-purple-400 uppercase bg-purple-950/50 border border-purple-500/40 px-3 py-1 rounded-full">
                STEP 3 // IDENTITY CONVERGENCE
              </span>

              <div className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-widest py-2">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Adela
                </span>
              </div>

              <p className="text-xs sm:text-sm text-purple-200/90 font-sans max-w-md">
                All parameters normalize into the singular name of inspiration.
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCENE 5: 13.8s – 16.0s (FINAL REVEAL & CLIMAX) */}
          {/* ========================================================= */}
          {currentTime >= 13.8 && (
            <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center space-y-3">
              
              {/* Giant Glowing Letter A */}
              <div className="relative group">
                <div className="text-8xl sm:text-9xl md:text-[13rem] font-black tracking-tight leading-none text-white select-none filter drop-shadow-[0_0_40px_rgba(0,243,255,0.9)] drop-shadow-[0_0_80px_rgba(0,243,255,0.5)]">
                  A
                </div>
                <div className="absolute -top-4 -right-4 text-cyan-300 animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>

              {/* The Subtitle */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white glow-cyan tracking-tight">
                  The Best Teacher — Adela
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-mono text-cyan-300/90 tracking-widest uppercase">
                  Q.E.D. • Quod Erat Demonstrandum
                </p>
              </div>

              {/* End of Video Quick Action Bar */}
              {!isPlaying && (
                <div className="pt-3 flex flex-wrap items-center justify-center gap-2 animate-in fade-in duration-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReplay();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold font-mono text-xs hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Watch Again</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportVideo();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-xs hover:border-cyan-400 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download Video</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyShare();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-xs hover:border-pink-400 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-pink-400" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Share Video'}</span>
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Center Pause/Play Big Flash Icon */}
        {!isPlaying && currentTime < TOTAL_DURATION && (
          <div 
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-[0_0_35px_rgba(0,243,255,0.8)] transition-transform hover:scale-110">
              <Play className="w-10 h-10 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIDEO CONTROLS OVERLAY (AUTOHIDES ON INACTIVITY) */}
        {/* ========================================================= */}
        <div 
          className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-opacity duration-300 ${
            controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Continuous Scrub Bar */}
          <div className="relative w-full h-3 flex items-center cursor-pointer group mb-3">
            {/* Scrubber Background Track */}
            <div className="w-full h-1 bg-zinc-700/60 rounded-full overflow-hidden relative">
              {/* Chapter ticks */}
              {CHAPTERS.map((ch, idx) => (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-[2px] bg-white/30 z-10"
                  style={{ left: `${(ch.time / TOTAL_DURATION) * 100}%` }}
                  title={ch.title}
                />
              ))}

              {/* Progress fill */}
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 relative"
                style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
              />
            </div>

            {/* Draggable Scrubber Head */}
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f3ff] -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform pointer-events-none"
              style={{ left: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            />

            {/* Hidden Input Range for smooth dragging */}
            <input
              type="range"
              min={0}
              max={TOTAL_DURATION}
              step={0.05}
              value={currentTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setCurrentTime(val);
                lastChordPlayedRef.current = -1;
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between text-white text-xs font-mono">
            {/* Left controls: Play/Pause, Replay, Time */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (currentTime >= TOTAL_DURATION) {
                    handleReplay();
                  } else {
                    setIsPlaying((p) => !p);
                  }
                }}
                className="p-1 text-white hover:text-cyan-400 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {currentTime >= TOTAL_DURATION ? (
                  <RotateCcw className="w-5 h-5" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </button>

              {/* Audio Mute/Unmute */}
              <button
                onClick={() => setIsMuted((m) => !m)}
                className={`p-1 transition-colors ${isMuted ? 'text-zinc-500' : 'text-cyan-400'}`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Current Time Display */}
              <span className="text-zinc-300 font-bold tracking-wider">
                {formatTime(currentTime)} <span className="text-zinc-500 font-normal">/</span> {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            {/* Right controls: Speed, Loop, Export, Fullscreen */}
            <div className="flex items-center gap-2">
              {/* Loop Toggle */}
              <button
                onClick={() => setIsLooping((l) => !l)}
                className={`p-1 transition-colors ${isLooping ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Loop Video"
              >
                <Repeat className="w-4 h-4" />
              </button>

              {/* Speed Button */}
              <button
                onClick={() => {
                  const speeds = [1.0, 1.5, 2.0, 0.5];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-bold text-[11px]"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {/* Export Video */}
              <button
                onClick={handleExportVideo}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors"
                title="Export Video as .webm"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Save</span>
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-1 text-zinc-400 hover:text-white transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Video Quick Subtitle Banner below player */}
      <div className="w-full max-w-5xl mt-4 px-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">CURRENT CHAPTER:</span>
          <span className="text-zinc-300">{currentChapter.title}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>Click video to Play / Pause</span>
          <span>•</span>
          <span>Drag scrub bar to jump to any frame</span>
        </div>
      </div>

    </div>
  );
};
