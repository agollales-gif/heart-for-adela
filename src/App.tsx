import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { MathView } from './components/MathView';
import { playRevealChord } from './utils/audio';

const DRAW_DURATION_MS = 3400; // Duration to draw heart curve
const PAUSE_DURATION_MS = 3600; // Time to pulse before automatically restarting
const TOTAL_CYCLE_MS = DRAW_DURATION_MS + PAUSE_DURATION_MS;

export const App: React.FC = () => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const cycleStartTimeRef = useRef<number | null>(null);
  const hasCelebratedThisCycleRef = useRef<boolean>(false);

  // Trigger professional pink & white celebration confetti
  const festoMeZemer = useCallback(() => {
    try {
      const count = 120;
      const defaults = {
        origin: { y: 0.55 },
        colors: ['#ff4d79', '#ffffff', '#fb7185', '#fda4af', '#ffe4e6', '#ffd166'],
      };

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.65),
        spread: 75,
        startVelocity: 42,
      });

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.35),
        spread: 105,
        startVelocity: 26,
        decay: 0.92,
      });
    } catch {
      // ignore
    }
  }, []);

  // Smooth parametric heart coordinates
  const getHeartCoord = (t: number, scale: number) => {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return {
      x: x * scale,
      y: y * scale,
    };
  };

  // Main continuous auto-looping animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pulseTime = 0;

    const render = (timestamp: number) => {
      if (!cycleStartTimeRef.current) cycleStartTimeRef.current = timestamp;
      const elapsedInCycle = (timestamp - cycleStartTimeRef.current) % TOTAL_CYCLE_MS;

      // When starting a new cycle, reset celebration flag
      if (elapsedInCycle < 100 && hasCelebratedThisCycleRef.current) {
        hasCelebratedThisCycleRef.current = false;
        setIsCompleted(false);
      }

      // Drawing phase: 0 to 1 over DRAW_DURATION_MS
      const drawProgress = Math.min(1, elapsedInCycle / DRAW_DURATION_MS);
      const inCompletedPhase = elapsedInCycle >= DRAW_DURATION_MS;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.parentElement?.clientWidth || 400;
      const displayHeight = Math.min(340, displayWidth * 0.85);

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const originX = displayWidth / 2;
      const originY = displayHeight / 2 - 8;
      const scale = Math.min(displayWidth, displayHeight) / 38;

      const totalAngle = Math.PI * 2;
      const currentAngle = drawProgress * totalAngle;

      ctx.save();
      ctx.translate(originX, originY);

      // Heartbeat pulse during the completed holding phase
      if (inCompletedPhase) {
        pulseTime += 0.055;
        const beat = 1 + Math.sin(pulseTime * 2.4) * 0.038;
        ctx.scale(beat, beat);

        // Soft pink inner radiant glow
        const radial = ctx.createRadialGradient(0, 0, 5, 0, 0, scale * 18);
        radial.addColorStop(0, 'rgba(255, 77, 121, 0.28)');
        radial.addColorStop(0.5, 'rgba(255, 140, 170, 0.12)');
        radial.addColorStop(1, 'transparent');
        ctx.fillStyle = radial;

        ctx.beginPath();
        const startPt = getHeartCoord(0, scale);
        ctx.moveTo(startPt.x, startPt.y);
        for (let a = 0; a <= totalAngle; a += 0.03) {
          const pt = getHeartCoord(a, scale);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.fill();
      }

      // Draw the glowing pink & white heart outline
      if (drawProgress > 0) {
        ctx.beginPath();
        const start = getHeartCoord(0, scale);
        ctx.moveTo(start.x, start.y);

        for (let a = 0; a <= currentAngle; a += 0.02) {
          const pt = getHeartCoord(a, scale);
          ctx.lineTo(pt.x, pt.y);
        }

        // Outer professional pink glow
        ctx.strokeStyle = '#ff3366';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ff4d79';
        ctx.shadowBlur = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Inner crisp white core line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Leading glowing white pen point
        if (drawProgress < 1) {
          const leadPt = getHeartCoord(currentAngle, scale);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ff4d79';
          ctx.shadowBlur = 24;
          ctx.beginPath();
          ctx.arc(leadPt.x, leadPt.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // Trigger completion event once per cycle
      if (inCompletedPhase && !hasCelebratedThisCycleRef.current) {
        hasCelebratedThisCycleRef.current = true;
        setIsCompleted(true);
        playRevealChord();
        festoMeZemer();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [festoMeZemer]);


  return (
    <div className="relative min-h-screen bg-[#080709] text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      
      {/* Background Math Canvas */}
      <BackgroundCanvas />

      {/* Main Single Page: Clean, Focused, No Header */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center z-10">
        
        {/* The Mathematical Equation Card in White & Pink */}
        <div className="w-full mb-6 p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-pink-500/20 shadow-[0_0_30px_rgba(255,77,121,0.08)] backdrop-blur-md text-center">
          <div className="py-2 px-2 overflow-x-auto text-xl sm:text-2xl md:text-3xl text-white font-mono flex items-center justify-center">
            <MathView 
              math="(x^2 + y^2 - 1)^3 - x^2 y^3 = 0" 
              block={true}
              glow={true}
            />
          </div>
        </div>

        {/* Centerpiece: Automatically Looping Glowing Heart */}
        <div className="relative w-full flex flex-col items-center justify-center my-2">
          
          {/* Subtle Ambient Pink Glow */}
          <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-r from-pink-500/20 via-rose-400/15 to-white/10 blur-[85px] pointer-events-none animate-pulse-glow" />

          {/* Canvas Viewport */}
          <div className="relative w-full max-w-sm flex flex-col items-center justify-center min-h-[290px]">
            <canvas
              ref={canvasRef}
              className="w-full block"
            />

            {/* Glowing White Letter "A" Inside Heart on Completion */}
            {isCompleted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-in zoom-in-75 fade-in duration-500">
                <div className="text-6xl sm:text-7xl md:text-8xl font-black text-white select-none filter drop-shadow-[0_0_30px_rgba(255,77,121,0.95)] drop-shadow-[0_0_60px_rgba(255,255,255,0.7)] mt-[-10px]">
                  A
                </div>
              </div>
            )}
          </div>

          {/* Main Subtitle */}
          <div className="mt-3 text-center space-y-1">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              <span className="bg-gradient-to-r from-white via-pink-100 to-rose-300 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(255,77,121,0.5)]">
                Mësuesja më e mirë — Adela
              </span>
            </h1>
          </div>

        </div>

        {/* Heartfelt Dedication Message Card in Professional Pink & White */}
        <div className="w-full mt-6 p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-pink-500/20 shadow-[0_0_35px_rgba(255,77,121,0.08)] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-pink-500/15 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-mono font-bold text-pink-200 uppercase tracking-wider">
                DEDIKIM ME ZEMËR
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={festoMeZemer}
                className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-500/30 text-pink-300 hover:bg-pink-900/40 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-current text-pink-400" />
                <span>Festo</span>
              </button>
            </div>
          </div>

          <blockquote className="text-sm sm:text-base text-zinc-100 font-sans italic border-l-2 border-pink-500 pl-4 py-1 leading-relaxed">
            "E dashur mësuese Adela, Thank you for being our teacher—you're simply the best! Thank you for your endless patience, your smile, and your dedication. You're amazing!"
          </blockquote>
        </div>

      </main>

      {/* Clean Minimal Footer in Soft Pink & White */}
      <footer className="w-full border-t border-zinc-900/80 bg-zinc-950/80 text-xs font-mono text-zinc-500 py-4 px-4 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-center">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Për</span>
            <span className="text-white font-bold">Mësuese Adelën</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-current inline" />
          </div>

          <div className="text-[11px] text-zinc-500">
            (x² + y² - 1)³ - x²y³ = 0
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
