import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Sliders
} from 'lucide-react';
import { ANIMATION_STEPS } from '../data/animationSteps';
import { MathView } from './MathView';
import { playStepSound, playRevealChord, toggleSound, isSoundEnabled } from '../utils/audio';

interface MathAnimationHeroProps {
  onOpenProof?: () => void;
  onOpenGrapher?: () => void;
}

export const MathAnimationHero: React.FC<MathAnimationHeroProps> = ({ 
  onOpenProof,
  onOpenGrapher 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [soundOn, setSoundOn] = useState<boolean>(false);
  const [showMathDetails, setShowMathDetails] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const stepTimerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const currentStep = ANIMATION_STEPS[currentStepIndex];
  const isFinalStep = currentStep.isFinal || currentStepIndex === ANIMATION_STEPS.length - 1;

  // Sound toggle handler
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) {
      playStepSound(520);
    }
  };

  // Trigger celebration confetti
  const fireCelebration = useCallback(() => {
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.65 },
        colors: ['#00f3ff', '#a855f7', '#38bdf8', '#ffd166', '#ffffff'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  // Jump to a specific step
  const goToStep = useCallback((index: number) => {
    if (index < 0 || index >= ANIMATION_STEPS.length) return;
    
    setIsTransitioning(true);
    setCurrentStepIndex(index);

    if (index === ANIMATION_STEPS.length - 1) {
      playRevealChord();
      fireCelebration();
    } else {
      playStepSound(440 + index * 60);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
  }, [fireCelebration]);

  // Restart sequence from t = 0
  const handleReplay = useCallback(() => {
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    setElapsedTime(0);
    goToStep(0);
    setIsPlaying(true);
  }, [goToStep]);

  // Next and Previous step triggers
  const handleNext = useCallback(() => {
    if (currentStepIndex < ANIMATION_STEPS.length - 1) {
      goToStep(currentStepIndex + 1);
    }
  }, [currentStepIndex, goToStep]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, goToStep]);

  // Automatic timeline timer
  useEffect(() => {
    if (!isPlaying) {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
      return;
    }

    if (isFinalStep) {
      setIsPlaying(false);
      return;
    }

    const stepDuration = currentStep.durationMs / speedMultiplier;

    stepTimerRef.current = window.setTimeout(() => {
      goToStep(currentStepIndex + 1);
    }, stepDuration);

    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [currentStepIndex, isPlaying, speedMultiplier, isFinalStep, currentStep.durationMs, goToStep]);

  // Elapsed time tracker for terminal aesthetic
  useEffect(() => {
    if (!isPlaying) {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      return;
    }

    elapsedTimerRef.current = window.setInterval(() => {
      setElapsedTime((prev) => prev + 0.1 * speedMultiplier);
    }, 100);

    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [isPlaying, speedMultiplier]);

  // Initialize sound state check
  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReplay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleReplay]);

  return (
    <section className="relative w-full min-h-[82vh] flex flex-col items-center justify-between px-4 py-8 z-10 max-w-6xl mx-auto">
      
      {/* Top Terminal Status Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-cyan-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-cyan-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="text-cyan-400 font-semibold tracking-wider uppercase">
            CALCULUS ENGINE // {isPlaying ? 'ACTIVE EXECUTION' : isFinalStep ? 'Q.E.D. CONVERGENCE' : 'PAUSED'}
          </span>
          <span className="text-zinc-500 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline">
            t = <span className="text-white font-bold">{elapsedTime.toFixed(1)}s</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-all ${
              soundOn 
                ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle procedural audio cues"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-mono">{soundOn ? 'AUDIO ON' : 'MUTED'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded px-1 py-0.5 text-[11px]">
            <span className="text-zinc-500 px-1.5 hidden md:inline">SPEED:</span>
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                  speedMultiplier === s 
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Math details toggle */}
          <button
            onClick={() => setShowMathDetails((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-all ${
              showMathDetails 
                ? 'border-purple-500/50 bg-purple-950/40 text-purple-300' 
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle step-by-step calculus notes"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">EXPLANATION</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: The Animated Equation / Tribute Reveal */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-6 md:my-10 relative">
        
        {/* Ambient Radial Neon Glow Backdrop */}
        <div 
          className={`absolute pointer-events-none transition-all duration-1000 rounded-full blur-[110px] ${
            isFinalStep 
              ? 'w-96 h-96 bg-cyan-500/25 animate-pulse-glow' 
              : 'w-72 h-72 bg-cyan-500/10'
          }`}
        />

        {/* Current Step Badge */}
        <div className="mb-5 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-zinc-900/90 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.15)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            {currentStep.badge}
          </span>
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
            [{currentStepIndex + 1}/{ANIMATION_STEPS.length}]
          </span>
        </div>

        {/* Main Equation Container */}
        <div 
          className={`relative w-full max-w-4xl min-h-[220px] md:min-h-[280px] flex flex-col items-center justify-center p-6 md:p-12 rounded-2xl border transition-all duration-500 backdrop-blur-md ${
            isFinalStep 
              ? 'bg-zinc-950/90 border-cyan-400/50 shadow-[0_0_50px_rgba(0,243,255,0.25)]' 
              : 'bg-zinc-950/70 border-zinc-800/90 shadow-[0_0_30px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Subtle Grid Corner Accents */}
          <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-600 select-none">⎡ x: 00</div>
          <div className="absolute top-2 right-2 text-[10px] font-mono text-zinc-600 select-none">y: ∞ ⎤</div>
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-zinc-600 select-none">⎣ d/dx</div>
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-zinc-600 select-none">∫ dt ⎦</div>

          {/* Morphing Equation Stage */}
          <div 
            className={`transition-all duration-300 text-center flex flex-col items-center justify-center ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {isFinalStep ? (
              /* Final Reveal State: Bold Glowing "A" and Subtitle */
              <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in-95 duration-700">
                
                {/* The Majestic Bold Glowing Letter A */}
                <div className="relative group cursor-pointer" onClick={fireCelebration} title="Click to celebrate!">
                  <div className="text-8xl sm:text-9xl md:text-[14rem] font-black tracking-tight leading-none text-white select-none transition-transform duration-300 hover:scale-105">
                    <span className="bg-gradient-to-b from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(0,243,255,0.85)] drop-shadow-[0_0_80px_rgba(0,243,255,0.4)]">
                      A
                    </span>
                  </div>
                  
                  {/* Subtle orbiting sparkles */}
                  <div className="absolute -top-3 -right-3 text-cyan-300 animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>

                {/* The Required Subtitle */}
                <div className="mt-4 md:mt-6 text-center space-y-2">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white glow-cyan">
                    The Best Teacher — Adela
                  </h1>
                  
                  <p className="text-sm md:text-lg text-cyan-200/80 font-mono tracking-wide max-w-xl mx-auto">
                    Where infinite dedication converges into inspiration.
                  </p>
                </div>

                {/* Q.E.D. Badge & Action Pills */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-950/70 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Q.E.D. • QUOD ERAT DEMONSTRANDUM
                  </span>

                  <button
                    onClick={fireCelebration}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Celebrate
                  </button>

                  {onOpenProof && (
                    <button
                      onClick={onOpenProof}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-purple-400" />
                      Read Formal Proof
                    </button>
                  )}

                  {onOpenGrapher && (
                    <button
                      onClick={onOpenGrapher}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                      Explore Curves
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Mathematical Equation Reduction Stages */
              <div className="w-full flex flex-col items-center justify-center py-6">
                
                {/* KaTeX Math Formula Rendering */}
                <div className="overflow-x-auto max-w-full px-2 py-4 flex items-center justify-center">
                  <div className="text-xl sm:text-2xl md:text-4xl text-slate-100 font-mono tracking-wide">
                    <MathView 
                      math={currentStep.latex} 
                      block={true}
                      glow={currentStepIndex > 2}
                    />
                  </div>
                </div>

                {/* Rule applied pill */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">RULE APPLIED:</span>
                  <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-300">
                    {currentStep.ruleApplied}
                  </span>
                </div>

                {/* Subtitle / Description of Step */}
                <p className="mt-3 text-sm md:text-base text-zinc-400 font-sans max-w-xl text-center leading-relaxed">
                  {currentStep.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mathematical Explanation Expandable Drawer */}
        {showMathDetails && (
          <div className="w-full max-w-3xl mt-4 p-4 rounded-xl bg-zinc-950/90 border border-purple-500/30 text-xs font-mono text-zinc-300 animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-500/20">
              <span className="text-purple-400 font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                MATHEMATICAL DERIVATION NOTES
              </span>
              <span className="text-zinc-500">Step {currentStepIndex + 1} of {ANIMATION_STEPS.length}</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-sm">
              {currentStep.mathExplanation}
            </p>
            <div className="mt-2 text-zinc-500 text-[11px] flex items-center gap-2">
              <span className="text-purple-400">LaTeX Source:</span>
              <code className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-300 break-all select-all">
                {currentStep.latex}
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline & Playback Controller */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-4 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-md">
        
        {/* Step dots scrubber */}
        <div className="w-full flex items-center justify-between px-2 relative">
          {/* Track line behind dots */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-zinc-800 z-0" />
          
          {/* Active progress fill */}
          <div 
            className="absolute left-6 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-cyan-500 to-purple-500 z-0 transition-all duration-300"
            style={{
              width: `${(currentStepIndex / (ANIMATION_STEPS.length - 1)) * 90}%`
            }}
          />

          {ANIMATION_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => goToStep(idx)}
                className={`relative z-10 flex flex-col items-center group focus:outline-none`}
                title={`${step.badge}: ${step.ruleApplied}`}
              >
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-cyan-400 text-black scale-125 ring-4 ring-cyan-500/30 shadow-[0_0_12px_rgba(0,243,255,0.8)]' 
                      : isPassed 
                        ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300' 
                        : 'bg-zinc-900 border border-zinc-700 text-zinc-500 group-hover:border-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {idx === ANIMATION_STEPS.length - 1 ? 'A' : idx}
                </div>
                <span className="absolute -bottom-5 text-[9px] font-mono text-zinc-500 hidden sm:block whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Playback Controls */}
        <div className="w-full flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs font-mono">
          <div className="flex items-center gap-2">
            {/* Previous Step */}
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous step (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => {
                if (isFinalStep) {
                  handleReplay();
                } else {
                  setIsPlaying((p) => !p);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(0,243,255,0.15)]"
              title="Play / Pause (Spacebar)"
            >
              {isFinalStep ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Sequence</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </>
              )}
            </button>

            {/* Next Step */}
            <button
              onClick={handleNext}
              disabled={currentStepIndex === ANIMATION_STEPS.length - 1}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next step (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Reset / Replay */}
            {!isFinalStep && (
              <button
                onClick={handleReplay}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                title="Restart from t = 0 (R)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Keyboard Hint */}
          <div className="hidden md:flex items-center gap-3 text-zinc-500 text-[11px]">
            <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Space</kbd> Play/Pause</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">←/→</kbd> Step</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">R</kbd> Replay</span>
          </div>
        </div>
      </div>

    </section>
  );
};
