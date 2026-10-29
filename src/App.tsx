import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Copy, 
  Check, 
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { MathView } from './components/MathView';
import { playStepSound, playRevealChord, toggleSound, isSoundEnabled } from './utils/audio';

interface MathStep {
  id: number;
  label: string;
  badge: string;
  latex: string;
  rule: string;
  description: string;
  durationMs: number;
}

const HAPAT_MATEMATIKORE: MathStep[] = [
  {
    id: 0,
    label: "t = 0.0s",
    badge: "FORMULIMI FILLESTAR",
    latex: "\\frac{d}{dx} \\left( \\int_{0}^{\\text{Adela}} (\\text{Durimi} \\cdot x) \\, dx \\right) + \\text{Përkushtimi}^{0}",
    rule: "Formulim Matematik i Mësimdhënies",
    description: "Akumulimi i durimit të pafund në domenin e nxënësve [0, Adela], i derivuar sipas rritjes së dijes.",
    durationMs: 3400,
  },
  {
    id: 1,
    label: "t = 3.4s",
    badge: "RREGULLA E EKSPONENTIT ZERO",
    latex: "\\frac{d}{dx} \\left( \\int_{0}^{\\text{Adela}} (\\text{Durimi} \\cdot x) \\, dx \\right) + 1",
    rule: "Përkushtimi⁰ = 1 (z⁰ = 1 për çdo z ≠ 0)",
    description: "Përkushtimi i mësueses është i palëkundur dhe konstant. Çdo vlerë e ngritur në fuqinë 0 thjeshtohet në 1.",
    durationMs: 3000,
  },
  {
    id: 2,
    label: "t = 6.4s",
    badge: "TEOREMA THEMELORE E KALKULUSIT",
    latex: "\\text{Durimi} \\cdot \\text{Adela} + 1",
    rule: "Teorema Themelore: d/dx ∫₀ˣ f(u)du = f(x)",
    description: "Derivimi neutralizon akumulimin e integralit, duke zbuluar thelbin e pastër: Durimi · Adela + 1.",
    durationMs: 3000,
  },
  {
    id: 3,
    label: "t = 9.4s",
    badge: "KONVERGJENCA DREJT EMRESIT",
    latex: "\\text{Adela}",
    rule: "Thjeshtimi Harmonik",
    description: "Të gjitha konstantet dhe vlerat arsimore konvergjojnë te emri i mësueses që frymëzon: Adela.",
    durationMs: 2600,
  },
  {
    id: 4,
    label: "t = 12.0s",
    badge: "PËRFUNDIMI • Ç.D.V.",
    latex: "\\mathbf{A}",
    rule: "Çfarë Duhej Të Vërtetohej (Q.E.D.)",
    description: "Vërtetimi u përmbyll me sukses: Adela është mësuesja më e mirë.",
    durationMs: 0,
  },
];

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());
  const [showProof, setShowProof] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const hasCelebratedRef = useRef<boolean>(false);

  // Confetti trigger
  const shpertheKonfeti = useCallback(() => {
    try {
      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f3ff', '#a855f7', '#38bdf8', '#ffd166', '#ffffff']
      });
    } catch {
      // ignore
    }
  }, []);

  // Jump to a specific step
  const kaloTeHapi = useCallback((index: number) => {
    setIsTransitioning(true);
    setCurrentStep(index);

    if (index === HAPAT_MATEMATIKORE.length - 1) {
      playRevealChord();
      if (!hasCelebratedRef.current) {
        hasCelebratedRef.current = true;
        shpertheKonfeti();
      }
    } else {
      playStepSound(440 + index * 60);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
  }, [shpertheKonfeti]);

  // Restart automated animation
  const riluajAnimacionin = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    hasCelebratedRef.current = false;
    kaloTeHapi(0);
  }, [kaloTeHapi]);

  // Automatic timed progression on page load
  useEffect(() => {
    const hapi = HAPAT_MATEMATIKORE[currentStep];
    if (hapi.durationMs > 0 && currentStep < HAPAT_MATEMATIKORE.length - 1) {
      timerRef.current = window.setTimeout(() => {
        kaloTeHapi(currentStep + 1);
      }, hapi.durationMs);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, kaloTeHapi]);

  // Sound toggle
  const ndryshoZerin = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playStepSound(520);
  };

  // Copy dedication text
  const kopjoDedikimin = () => {
    const message = "Për mësuesen më të mirë, Adela: Faleminderit për durimin e pafund, përkushtimin e palodhur dhe dashurinë me të cilën e bëni matematikën aq të bukur dhe të thjeshtë! Me mirënjohje të thellë.";
    navigator.clipboard.writeText(message);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
  };

  const activeStep = HAPAT_MATEMATIKORE[currentStep];
  const isFinal = currentStep === HAPAT_MATEMATIKORE.length - 1;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      
      {/* Background Interactive Math Canvas */}
      <BackgroundCanvas />

      {/* Sleek Minimalist Header */}
      <header className="w-full z-20 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 font-mono text-xs shadow-[0_0_10px_rgba(0,243,255,0.2)]">
              A
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-white tracking-wider">
                MËSUESJA ADELA
              </span>
              <span className="text-zinc-600 text-xs hidden sm:inline">•</span>
              <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">
                Dedikim Matematik
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
              title="Aktivizo ose çaktivizo zërin"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundOn ? 'ZËRI AKTIV' : 'PA ZË'}</span>
            </button>

            {/* Replay Button */}
            <button
              onClick={riluajAnimacionin}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors text-xs font-mono"
              title="Rifillo animacionin nga fillimi"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Riluaj</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Single Page Viewport */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center z-10">
        
        {/* Step Badge */}
        <div className="mb-5 flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-zinc-900/90 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.15)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            {activeStep.badge}
          </span>
          <span className="text-xs font-mono text-zinc-600">
            [{currentStep + 1}/{HAPAT_MATEMATIKORE.length}]
          </span>
        </div>

        {/* Ambient Radial Glow */}
        <div 
          className={`absolute pointer-events-none transition-all duration-1000 rounded-full blur-[100px] ${
            isFinal 
              ? 'w-96 h-96 bg-cyan-500/25 animate-pulse-glow' 
              : 'w-72 h-72 bg-cyan-500/10'
          }`}
        />

        {/* Mathematical Equation Card */}
        <div 
          className={`relative w-full min-h-[280px] md:min-h-[340px] flex flex-col items-center justify-center p-6 md:p-12 rounded-3xl border transition-all duration-700 backdrop-blur-md ${
            isFinal 
              ? 'bg-zinc-950/90 border-cyan-400/50 shadow-[0_0_60px_rgba(0,243,255,0.25)]' 
              : 'bg-zinc-950/70 border-zinc-800/80 shadow-[0_0_30px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Decorative Corner Accents */}
          <div className="absolute top-3 left-4 text-[10px] font-mono text-zinc-600 select-none">⎡ f(x)</div>
          <div className="absolute top-3 right-4 text-[10px] font-mono text-zinc-600 select-none">d/dx ⎤</div>
          <div className="absolute bottom-3 left-4 text-[10px] font-mono text-zinc-600 select-none">⎣ ∫ dx</div>
          <div className="absolute bottom-3 right-4 text-[10px] font-mono text-zinc-600 select-none">Ç.D.V. ⎦</div>

          {/* Morphing Area */}
          <div 
            className={`transition-all duration-300 text-center flex flex-col items-center justify-center w-full ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {isFinal ? (
              /* Final Reveal: Glowing "A" and Subtitle in Albanian */
              <div className="flex flex-col items-center justify-center py-2 animate-in fade-in zoom-in-95 duration-700">
                
                {/* Glowing Monogram A */}
                <div 
                  className="relative group cursor-pointer" 
                  onClick={shpertheKonfeti}
                  title="Kliko për të festuar me konfeti!"
                >
                  <div className="text-8xl sm:text-9xl md:text-[14rem] font-black tracking-tight leading-none text-white select-none transition-transform duration-300 hover:scale-105">
                    <span className="bg-gradient-to-b from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_0_40px_rgba(0,243,255,0.85)] drop-shadow-[0_0_80px_rgba(0,243,255,0.4)]">
                      A
                    </span>
                  </div>
                  
                  <div className="absolute -top-3 -right-3 text-cyan-300 animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>

                {/* Subtitle in Albanian */}
                <div className="mt-4 md:mt-6 text-center space-y-2">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white glow-cyan">
                    Mësuesja më e mirë — Adela
                  </h1>
                  
                  <p className="text-sm md:text-base text-cyan-200/90 font-sans max-w-xl mx-auto leading-relaxed">
                    Aty ku durimi i pafund dhe përkushtimi i palodhur konvergjojnë në frymëzim.
                  </p>
                </div>

                {/* Badges & Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-950/70 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Ç.D.V. • ÇFARË DUHEJ TË VËRTETOHEJ
                  </span>

                  <button
                    onClick={shpertheKonfeti}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Festo me Konfeti
                  </button>

                  <button
                    onClick={riluajAnimacionin}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    Riluaj Animacionin
                  </button>
                </div>
              </div>
            ) : (
              /* Step-by-Step Mathematical Formula */
              <div className="w-full flex flex-col items-center justify-center py-4">
                
                {/* KaTeX Math View */}
                <div className="overflow-x-auto max-w-full px-2 py-4 flex items-center justify-center">
                  <div className="text-xl sm:text-3xl md:text-5xl text-slate-100 font-mono tracking-wide">
                    <MathView 
                      math={activeStep.latex} 
                      block={true}
                      glow={currentStep > 1}
                    />
                  </div>
                </div>

                {/* Rule in Albanian */}
                <div className="mt-5 flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">RREGULLA:</span>
                  <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-300">
                    {activeStep.rule}
                  </span>
                </div>

                {/* Description in Albanian */}
                <p className="mt-3 text-xs sm:text-sm md:text-base text-zinc-400 font-sans max-w-xl text-center leading-relaxed">
                  {activeStep.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step Progression Scrubber */}
        <div className="mt-6 flex items-center gap-2">
          {HAPAT_MATEMATIKORE.map((s, idx) => {
            const isActive = idx === currentStep;
            const isPassed = idx < currentStep;

            return (
              <button
                key={s.id}
                onClick={() => kaloTeHapi(idx)}
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

        {/* Heartfelt Dedication Card (Albanian Tribute Note) */}
        <div className="w-full mt-8 p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-400">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-sm font-mono font-bold text-white tracking-wide uppercase">
                  DEDIKIM ME MIRËNJOHJE PËR ZYSH ADELËN
                </h2>
                <span className="text-[11px] font-sans text-zinc-400">
                  Nga nxënësit tuaj që ju vlerësojnë pa masë
                </span>
              </div>
            </div>

            <button
              onClick={kopjoDedikimin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'U kopjua!' : 'Kopjo Mesazhin'}</span>
            </button>
          </div>

          <blockquote className="text-sm sm:text-base text-zinc-300 font-sans italic border-l-2 border-cyan-400 pl-4 py-1 leading-relaxed">
            "I dashur mësuese Adela, faleminderit për durimin e pafund dhe pasionin me të cilin na mësuat të shohim bukurinë e çdo formule. Falë përkushtimit tuaj, matematika nuk është thjesht lëndë, por një mënyrë për të zgjidhur me besim çdo sfidë të jetës. <strong>Ju jeni vërtet mësuesja më e mirë!</strong>"
          </blockquote>

          {/* Collapsible Proof Toggle Button */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <button
              onClick={() => setShowProof((v) => !v)}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showProof ? 'Fshih Vërtetimin Matematik' : 'Shfaq Vërtetimin Matematik (Teorema e Mësueses)'}</span>
              {showProof ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <span className="text-zinc-500 hidden sm:inline">
              Matematikë • Mirënjohje • Përsosmëri
            </span>
          </div>

          {/* Expandable Mathematical Proof in Albanian */}
          {showProof && (
            <div className="mt-4 p-4 rounded-xl bg-zinc-900/60 border border-cyan-500/20 text-xs font-mono space-y-3 animate-in fade-in duration-300">
              <div className="text-cyan-300 font-bold border-b border-zinc-800 pb-2">
                TEOREMA 1.1: OPTIMALITETI DHE PËRSOSMËRIA E MËSUESES ADELA
              </div>

              <div className="space-y-2 text-zinc-300 font-sans text-xs leading-relaxed">
                <p>
                  <strong>Aksioma 1 (Vazhdueshmëria e Kuptimit):</strong> Për çdo paqartësi <MathView math="\epsilon > 0" />, ekziston një shpjegim i durueshëm i Zysh Adelës <MathView math="\delta > 0" /> i tillë që:
                </p>
                <div className="py-1.5 px-3 bg-black/50 rounded border border-zinc-800 text-center font-mono overflow-x-auto">
                  <MathView math="|x - \text{Paqartësia}| < \delta \implies |f(x) - \text{Kuptimi}| < \epsilon" block={true} />
                </div>

                <p>
                  <strong>Aksioma 2 (Invarianca e Përkushtimit):</strong> Përkushtimi i saj është pozitiv dhe konstant në çdo orë mësimi:
                </p>
                <div className="py-1.5 px-3 bg-black/50 rounded border border-zinc-800 text-center font-mono overflow-x-auto">
                  <MathView math="\text{Përkushtimi} > 0 \implies \text{Përkushtimi}^{0} \equiv 1" block={true} />
                </div>

                <p>
                  <strong>Përfundim:</strong> Duke integruar dhe derivuar mbi të gjithë rrugëtimin shkollor, vlera konvergjon pa kushte te nota maksimale <MathView math="\mathbf{A}" />. <strong>Ç.D.V. (Quod Erat Demonstrandum) ■</strong>
                </p>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full border-t border-zinc-900 bg-zinc-950/80 text-xs font-mono text-zinc-500 py-4 px-4 z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Krijuar me</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
            <span>për mësuesen më të mirë — <strong>Adela</strong></span>
          </div>

          <div className="text-[11px] text-zinc-600">
            KaTeX 0.16.21 • React 19 + TypeScript • Shqip
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
