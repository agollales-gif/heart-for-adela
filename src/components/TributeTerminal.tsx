import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MathView } from './MathView';
import { Heart, Sparkles, Copy, Check, Award } from 'lucide-react';

const PRESET_TRIBUTES = [
  {
    title: "The Constant of Inspiration",
    latex: "\\frac{d}{dt}(\\text{Inspiration}) = 0 \\implies \\text{Inspiration} = \\text{Adela} \\cdot \\text{Const}",
    message: "Thank you for making complex calculus feel intuitive, elegant, and exciting.",
    author: "Mathematics Class of 2026"
  },
  {
    title: "Limit of Student Confidence",
    latex: "\\lim_{t \\to \\infty} \\text{Confidence}(t) = \\infty \\quad [\\text{Teacher: Adela}]",
    message: "You believed in our potential even before we learned to believe in ourselves.",
    author: "Every Student You Ever Taught"
  },
  {
    title: "Conservation of Wisdom",
    latex: "\\oint_{\\text{Classroom}} \\mathbf{Knowledge} \\cdot d\\mathbf{r} > 0",
    message: "The impact of a great math teacher cannot be measured by any finite integral.",
    author: "With Deepest Gratitude"
  }
];

export const TributeTerminal: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [customStudentName, setCustomStudentName] = useState<string>('A Grateful Student');
  const [personalNote, setPersonalNote] = useState<string>('Thank you for being the most remarkable math teacher!');

  const activeTribute = PRESET_TRIBUTES[selectedIdx];

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(activeTribute.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f3ff', '#a855f7', '#ffd166', '#ec4899']
    });
  };

  return (
    <section className="w-full max-w-4xl mx-auto my-12 px-4 z-10 relative">
      <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400 font-semibold">
                PERSONALIZED DEDICATION TERMINAL
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Tribute to Teacher Adela
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCelebrate}
              className="px-3 py-1.5 rounded-lg border border-pink-500/40 bg-pink-950/50 text-pink-300 hover:bg-pink-900/50 text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(236,72,153,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Celebrate Adela
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PRESET_TRIBUTES.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedIdx === idx 
                  ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/50 font-bold shadow-md' 
                  : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Tribute Card Preview */}
        <div className="relative rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/90 p-6 sm:p-8 shadow-xl overflow-hidden mb-8">
          
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award className="w-32 h-32 text-cyan-400" />
          </div>

          <div className="relative z-10 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              DEDICATION CARD FOR ADELA
            </span>

            {/* LaTeX Equation */}
            <div className="py-4 px-4 bg-black/60 rounded-xl border border-cyan-500/25 overflow-x-auto text-center">
              <MathView math={activeTribute.latex} block={true} glow={true} />
            </div>

            {/* Personal Note */}
            <blockquote className="text-base sm:text-lg text-zinc-200 font-sans italic border-l-2 border-cyan-400 pl-4 py-1">
              "{personalNote || activeTribute.message}"
            </blockquote>

            {/* Signature */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-zinc-800/80">
              <div>
                Dedicated by: <span className="text-white font-bold">{customStudentName || 'Grateful Student'}</span>
              </div>
              <div className="text-cyan-400 font-semibold">
                To: Adela — The Best Teacher
              </div>
            </div>
          </div>
        </div>

        {/* Customization Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              YOUR NAME / SENDER:
            </label>
            <input
              type="text"
              value={customStudentName}
              onChange={(e) => setCustomStudentName(e.target.value)}
              placeholder="e.g., Alex (Calculus Class 2026)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              YOUR DEDICATION MESSAGE:
            </label>
            <input
              type="text"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Write a heartfelt sentence for Adela..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-sans focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
          <button
            onClick={handleCopyLatex}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied LaTeX Code!' : 'Copy LaTeX Formula'}</span>
          </button>

          <span className="text-xs font-mono text-zinc-500">
            Rendered with KaTeX in Dark Terminal Theme
          </span>
        </div>

      </div>
    </section>
  );
};
