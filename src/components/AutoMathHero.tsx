import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { MathView } from './MathView';
import { playStepSound, playRevealChord, toggleSound, isSoundEnabled } from '../utils/audio';

interface StepData {
  id: number;
  label: string;
  badge: string;
  latex: string;
  rule: string;
  detail: string;
  durationMs: number;
}

const STEPS: StepData[] = [
  {
    id: 0,
    label: "t = 0.0s",
    badge: "INITIAL CALCULATION",
    latex: "\\frac{d}{dx} \\left( \\int_{0}^{\\text{Adela}} (\\text{Patience} \\cdot x) \\, dx \\right) + \\text{Dedication}^{0}",
    rule: "Calculus & Exponential Formulation",
    detail: "Accumulating boundless patience over the domain of teaching [0, Adela], differentiated with respect to student growth.",
    durationMs: 3400,
  },
  {
    id: 1,
    label: "t = 3.4s",
    badge: "EXPONENT REDUCTION",
    latex: "\\frac{d}{dx} \\left( \\int_{0}^{\\text{Adela}} (\\text{Patience} \\cdot x) \\, dx \\right) + 1",
    rule: "Zero-Exponent Rule: Dedication⁰ = 1",
    detail: "Dedication is steadfast and non-zero. Any non-zero base raised to power 0 simplifies to 1.",
    durationMs: 3000,
  },
  {
    id: 2,
    label: "t = 6.4s",
    badge: "FUNDAMENTAL THEOREM",
    latex: "\\text{Patience} \\cdot \\text{Adela} + 1",
    rule: "Fundamental Theorem of Calculus: d/dx ∫₀ˣ f(u)du = f(x)",
    detail: "Differentiation inverts the accumulation of knowledge, evaluating the core product on the boundary.",
    durationMs: 3000,
  },
  {
    id: 3,
    label: "t = 9.4s",
    badge: "HARMONIC IDENTITY",
    latex: "\\text{Adela}",
    rule: "Convergence to Unique Identity",
    detail: "Mentorship constants normalize into the single invariant name at the heart of the equation: Adela.",
    durationMs: 2600,
  },
  {
    id: 4,
    label: "t = 12.0s",
    badge: "FINAL REVEAL • Q.E.D.",
    latex: "\\mathbf{A}",
    rule: "Quod Erat Demonstrandum",
    detail: "The mathematical proof concludes: Adela is the best teacher.",
    durationMs: 0,
  },
];

interface AutoMathHeroProps {
  onScrollToExplore?: () => void;
}

export const AutoMathHero: React.FC<AutoMathHeroProps> = ({ onScrollToExplore }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(isSoundEnabled());
  
  const timerRef = useRef<number | null>(null);
  const hasTriggeredConfettiRef = useRef<boolean>(false);

  // Trigger celebration confetti
  const fireCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 160,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#00f3ff', '#a855f7', '#38bdf8', '#ffd166', '#ffffff'],
      });
    } catch {
      // ignore
    }
  }, []);

  // Jump to step with audio & transition
  const stepTo = useCallback((index: number) => {
    setIsTransitioning(true);
    setCurrentStep(index);

    if (index === STEPS.length - 1) {
      playRevealChord();
      if (!hasTriggeredConfettiRef.current) {
        hasTriggeredConfettiRef.current = true;
        fireCelebration();
      }
    } else {
      playStepSound(440 + index * 70);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
  }, [fireCelebration]);

  // Restart automated animation from t = 0
  const handleReplay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    hasTriggeredConfettiRef.current = false;
    stepTo(0);
  }, [stepTo]);

  // Automatic progression logic on page load
  useEffect(() => {
    const step = STEPS[currentStep];
    if (step.durationMs > 0 && currentStep < STEPS.length - 1) {
      timerRef.current = window.setTimeout(() => {
        stepTo(currentStep + 1);
      }, step.durationMs);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, stepTo]);

  // Audio toggle
  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundActive(next);
    if (next) playStepSound(520);
  };

  const activeStepData = STEPS[currentStep];
  const isFinal = currentStep === STEPS.length - 1;

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-between px-4 py-8 z-10 max-w-5xl mx-auto">
      
      {/* Top Ambient Telemetry / Quick Controls Bar */}
      <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isFinal ? 'bg-emerald-400' : 'bg-cyan-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isFinal ? 'bg-emerald-500' : 'bg-cyan-500'}`}></span>
          </span>
          <span className="text-white font-bold tracking-wider">
            {isFinal ? 'REDUCTION COMPLETE' : 'AUTOMATIC MATHEMATICAL REDUCTION'}
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-cyan-400 hidden sm:inline">
            STEP {currentStep + 1} OF {STEPS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition-all ${
              soundActive 
                ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' 
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
            }`}
            title="Toggle procedural audio cues"
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundActive ? 'SOUND ON' : 'MUTED'}</span>
          </button>

          {/* Replay button */}
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            title="Restart animation from t = 0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: Automatic Mathematical Morphing Viewport */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-8 md:my-12 relative">
        
        {/* Ambient Radial Glow */}
        <div 
          className={`absolute pointer-events-none transition-all duration-1000 rounded-full blur-[100px] ${
            isFinal 
              ? 'w-96 h-96 bg-cyan-500/25 animate-pulse-glow' 
              : 'w-72 h-72 bg-cyan-500/10'
          }`}
        />

        {/* Step Badge */}
        <div className="mb-6 flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-zinc-900/90 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.15)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            {activeStepData.badge}
          </span>
        </div>

        {/* The Equation Stage */}
        <div 
          className={`relative w-full max-w-4xl min-h-[260px] md:min-h-[320px] flex flex-col items-center justify-center p-6 md:p-12 rounded-3xl border transition-all duration-700 backdrop-blur-md ${
            isFinal 
              ? 'bg-zinc-950/90 border-cyan-400/50 shadow-[0_0_60px_rgba(0,243,255,0.25)]' 
              : 'bg-zinc-950/70 border-zinc-800/80 shadow-[0_0_40px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Subtle math frame ticks */}
          <div className="absolute top-3 left-4 text-[10px] font-mono text-zinc-600 select-none">⎡ f(x)</div>
          <div className="absolute top-3 right-4 text-[10px] font-mono text-zinc-600 select-none">d/dx ⎤</div>
          <div className="absolute bottom-3 left-4 text-[10px] font-mono text-zinc-600 select-none">⎣ ∫ dx</div>
          <div className="absolute bottom-3 right-4 text-[10px] font-mono text-zinc-600 select-none">Q.E.D. ⎦</div>

          {/* Morphing Equation Stage */}
          <div 
            className={`transition-all duration-300 text-center flex flex-col items-center justify-center ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {isFinal ? (
              /* Final Reveal State: Bold Glowing "A" and Subtitle */
              <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in-95 duration-700">
                
                {/* Bold Glowing Uppercase Letter A */}
                <div 
                  className="relative group cursor-pointer" 
                  onClick={fireCelebration} 
                  title="Click to celebrate Adela!"
                >
                  <div className="text-8xl sm:text-9xl md:text-[14rem] font-black tracking-tight leading-none text-white select-none transition-transform duration-300 hover:scale-105">
                    <span className="bg-gradient-to-b from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_0_40px_rgba(0,243,255,0.85)] drop-shadow-[0_0_80px_rgba(0,243,255,0.4)]">
                      A
                    </span>
                  </div>
                  
                  {/* Floating sparkles */}
                  <div className="absolute -top-3 -right-3 text-cyan-300 animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>

                {/* Subtitle */}
                <div className="mt-4 md:mt-6 text-center space-y-2">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white glow-cyan">
                    The Best Teacher — Adela
                  </h1>
                  
                  <p className="text-xs sm:text-base md:text-lg text-cyan-200/90 font-mono tracking-wide max-w-xl mx-auto">
                    Where infinite dedication converges into inspiration.
                  </p>
                </div>

                {/* Q.E.D. Pill & Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-950/70 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Q.E.D. • QUOD ERAT DEMONSTRANDUM
                  </span>

                  <button
                    onClick={fireCelebration}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Celebrate
                  </button>

                  <button
                    onClick={handleReplay}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    Replay Animation
                  </button>
                </div>
              </div>
            ) : (
              /* Step-by-Step Mathematical Simplification */
              <div className="w-full flex flex-col items-center justify-center py-6">
                
                {/* KaTeX Math View */}
                <div className="overflow-x-auto max-w-full px-2 py-4 flex items-center justify-center">
                  <div className="text-xl sm:text-3xl md:text-5xl text-slate-100 font-mono tracking-wide">
                    <MathView 
                      math={activeStepData.latex} 
                      block={true}
                      glow={currentStep > 1}
                    />
                  </div>
                </div>

                {/* Mathematical rule banner */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">RULE APPLIED:</span>
                  <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-300">
                    {activeStepData.rule}
                  </span>
                </div>

                {/* Explanation text */}
                <p className="mt-3 text-xs sm:text-sm md:text-base text-zinc-400 font-sans max-w-xl text-center leading-relaxed">
                  {activeStepData.detail}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Timeline Indicator & Navigation Bar */}
      <div className="w-full flex flex-col items-center gap-3">
        {/* Subtle Step Dots */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, idx) => {
            const isActive = idx === currentStep;
            const isPassed = idx < currentStep;

            return (
              <button
                key={s.id}
                onClick={() => stepTo(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-8 bg-cyan-400 shadow-[0_0_10px_#00f3ff]' 
                    : isPassed 
                      ? 'w-3 bg-cyan-900' 
                      : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                }`}
                title={s.badge}
              />
            );
          })}
        </div>

        {/* Scroll hint to explore full interactive tribute */}
        {onScrollToExplore && (
          <button
            onClick={onScrollToExplore}
            className="mt-2 flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-cyan-400 transition-colors group"
          >
            <span>Explore Mathematical Proof & Interactive Curves</span>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>

    </section>
  );
};
