import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Heart, 
  Sparkles, 
  Copy, 
  Check, 
  Info
} from 'lucide-react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { MathView } from './components/MathView';
import { playStepSound, playRevealChord, toggleSound, isSoundEnabled } from './utils/audio';

export const App: React.FC = () => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());
  const [copied, setCopied] = useState<boolean>(false);
  const [showFormulaInfo, setShowFormulaInfo] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasCelebratedRef = useRef<boolean>(false);

  const DRAW_DURATION_MS = 3800; // 3.8 seconds to smoothly trace the heart

  // Trigger heart confetti celebration
  const festoMeZemer = useCallback(() => {
    try {
      // Confetti with heart-themed vibrant colors
      const count = 140;
      const defaults = {
        origin: { y: 0.62 },
        colors: ['#ff2a6d', '#00f3ff', '#ff758c', '#ffd166', '#ffffff', '#a855f7'],
      };

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.6),
        spread: 75,
        startVelocity: 45,
      });

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.4),
        spread: 110,
        startVelocity: 30,
        decay: 0.92,
      });
    } catch {
      // ignore
    }
  }, []);

  // Parametric heart formula
  const getHeartCoord = (t: number, scale: number) => {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return {
      x: x * scale,
      y: y * scale,
    };
  };

  // Restart drawing from beginning
  const riluajVizatimin = useCallback(() => {
    startTimeRef.current = null;
    hasCelebratedRef.current = false;
    setIsCompleted(false);
    playStepSound(480);
  }, []);

  // Main automatic drawing loop on page load
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localPulse = 0;

    const render = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / DRAW_DURATION_MS);

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.parentElement?.clientWidth || 400;
      const displayHeight = Math.min(360, displayWidth * 0.85);

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const originX = displayWidth / 2;
      const originY = displayHeight / 2 - 8;
      const scale = Math.min(displayWidth, displayHeight) / 38;

      const totalAngle = Math.PI * 2;
      const currentAngle = progress * totalAngle;

      // Draw glowing heart path up to current angle
      if (progress > 0) {
        ctx.save();
        ctx.translate(originX, originY);

        // Gentle heartbeat scale when completed
        if (progress >= 1) {
          localPulse += 0.05;
          const beatScale = 1 + Math.sin(localPulse * 2.2) * 0.035;
          ctx.scale(beatScale, beatScale);

          // Soft inner radiant glow
          const radial = ctx.createRadialGradient(0, 0, 10, 0, 0, scale * 18);
          radial.addColorStop(0, 'rgba(255, 42, 109, 0.22)');
          radial.addColorStop(0.6, 'rgba(0, 243, 255, 0.12)');
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

        // Draw the glowing outline stroke
        ctx.beginPath();
        const start = getHeartCoord(0, scale);
        ctx.moveTo(start.x, start.y);

        for (let a = 0; a <= currentAngle; a += 0.02) {
          const pt = getHeartCoord(a, scale);
          ctx.lineTo(pt.x, pt.y);
        }

        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Secondary romantic pink glow
        ctx.strokeStyle = 'rgba(255, 42, 109, 0.85)';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#ff2a6d';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Glowing pen particle at the leading head
        if (progress < 1) {
          const leadPt = getHeartCoord(currentAngle, scale);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00f3ff';
          ctx.shadowBlur = 25;
          ctx.beginPath();
          ctx.arc(leadPt.x, leadPt.y, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Check completion
      if (progress >= 1 && !hasCelebratedRef.current) {
        hasCelebratedRef.current = true;
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

  // Audio toggle
  const ndryshoZerin = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playStepSound(520);
  };

  // Copy dedication text
  const kopjoMesazhin = () => {
    const text = "Për mësuesen më të mirë, Adela: Faleminderit që çdo orë mësimi e bëtë me pasion, durim dhe shumë dashuri. Ju jeni zemra e matematikës dhe mësuesja më e mirë në botë! ❤️";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      
      {/* Background Math Canvas */}
      <BackgroundCanvas />

      {/* Minimal Top Header */}
      <header className="w-full z-20 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 font-mono text-xs shadow-[0_0_10px_rgba(0,243,255,0.25)]">
              A
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-white tracking-wider">
                MËSUESJA ADELA
              </span>
              <span className="text-zinc-600 text-xs hidden sm:inline">•</span>
              <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">
                Ekuacioni i Dashurisë për Matematikën
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={ndryshoZerin}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition-all ${
                soundOn 
                  ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' 
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
              }`}
              title="Aktivizo ose çaktivizo tingullin"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundOn ? 'ZËRI' : 'PA ZË'}</span>
            </button>

            {/* Replay */}
            <button
              onClick={riluajVizatimin}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors text-xs font-mono"
              title="Riluaj vizatimin e zemrës"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Riluaj</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Single Page: Centered Heart Equation & Animated Reveal */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 md:py-10 flex flex-col items-center justify-center z-10">
        
        {/* Subtle Category Badge */}
        <div className="mb-4 flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-zinc-900/90 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.15)] flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-current animate-pulse" />
            EKUACIONI I ZEMRËS PËR MËSUESEN
          </span>
        </div>

        {/* The Mathematical Equation Card */}
        <div className="w-full mb-6 p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 shadow-2xl backdrop-blur-md text-center">
          
          <div className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <span>Formula e Zemrës së Matematikës</span>
            <button 
              onClick={() => setShowFormulaInfo((v) => !v)}
              className="text-zinc-400 hover:text-cyan-400"
              title="Mëso më shumë rreth ekuacionit"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* KaTeX formula display */}
          <div className="py-2 px-2 overflow-x-auto text-xl sm:text-2xl md:text-3xl text-white font-mono flex items-center justify-center">
            <MathView 
              math="(x^2 + y^2 - 1)^3 - x^2 y^3 = 0" 
              block={true}
              glow={true}
            />
          </div>

          {showFormulaInfo && (
            <div className="mt-3 pt-3 border-t border-zinc-800 text-xs font-mono text-zinc-400 text-left animate-in fade-in duration-300 space-y-1">
              <p>
                Kjo është lakorja e famshme algjebrike e zemrës. Në formë parametrike llogaritet si:
              </p>
              <div className="py-1 text-center text-cyan-300 font-mono">
                <MathView math="x(t) = 16\sin^3(t), \quad y(t) = 13\cos(t) - 5\cos(2t) - 2\cos(3t) - \cos(4t)" />
              </div>
            </div>
          )}

        </div>

        {/* Centerpiece: Automatic Animated Glowing Heart Canvas */}
        <div className="relative w-full flex flex-col items-center justify-center">
          
          {/* Radial Ambient Glow */}
          <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-r from-pink-500/20 via-cyan-500/20 to-purple-500/20 blur-[90px] pointer-events-none animate-pulse-glow" />

          {/* Interactive Heart Viewport */}
          <div className="relative w-full max-w-md flex flex-col items-center justify-center min-h-[300px]">
            <canvas
              ref={canvasRef}
              className="w-full block"
            />

            {/* Glowing Letter "A" Inside the Heart on Completion */}
            {isCompleted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-in zoom-in-75 fade-in duration-700">
                <div className="text-6xl sm:text-7xl md:text-8xl font-black text-white select-none filter drop-shadow-[0_0_25px_rgba(0,243,255,0.9)] drop-shadow-[0_0_50px_rgba(255,42,109,0.7)] mt-[-10px]">
                  A
                </div>
              </div>
            )}
          </div>

          {/* Subtitle & Title Reveal */}
          <div className="mt-4 text-center space-y-2">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white glow-cyan">
              Mësuesja më e mirë — Adela
            </h1>
            
            <p className="text-sm sm:text-base text-cyan-200/90 font-sans max-w-lg mx-auto">
              Ju nuk na mësuat thjesht formula, ju e dhatë çdo mësim me zemër.
            </p>
          </div>

        </div>

        {/* Heartfelt Dedication Message Card */}
        <div className="w-full mt-8 p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                MESAZHI I MIRËNJOHJES
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={festoMeZemer}
                className="px-2.5 py-1 rounded bg-pink-950/50 border border-pink-500/40 text-pink-300 hover:bg-pink-900/50 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-current text-pink-400" />
                <span>Festo</span>
              </button>

              <button
                onClick={kopjoMesazhin}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'U kopjua!' : 'Kopjo'}</span>
              </button>
            </div>
          </div>

          <blockquote className="text-sm sm:text-base text-zinc-300 font-sans italic border-l-2 border-pink-500 pl-4 py-1 leading-relaxed">
            "I dashur mësuese Adela, faleminderit për durimin e pafund, për buzëqeshjen dhe përkushtimin me të cilin na mësuat të dashurojmë matematikën. Çdo ekuacion bëhet i thjeshtë kur shpjegohet nga një mësuese e jashtëzakonshme si ju. <strong>Ju jeni vërtet më e mira!</strong>"
          </blockquote>

          <div className="mt-3 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Nga nxënësit tuaj mirënjohës</span>
            <span className="text-cyan-400 font-semibold">Për: Zysh Adelën</span>
          </div>
        </div>

      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full border-t border-zinc-900 bg-zinc-950/80 text-xs font-mono text-zinc-500 py-4 px-4 z-20">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-zinc-400">
            <span>Krijuar me shumë dashuri për</span>
            <span className="text-white font-bold">Mësuese Adelën</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-current inline" />
          </div>

          <div className="text-[11px] text-zinc-600">
            (x² + y² - 1)³ - x²y³ = 0 • Shqip
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
