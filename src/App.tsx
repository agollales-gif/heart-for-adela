import React, { useRef } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { AutoMathHero } from './components/AutoMathHero';
import { TeacherGrapher } from './components/TeacherGrapher';
import { FormalProof } from './components/FormalProof';
import { TributeTerminal } from './components/TributeTerminal';
import { Footer } from './components/Footer';
import { Activity, BookOpen, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const proofRef = useRef<HTMLDivElement>(null);
  const grapherRef = useRef<HTMLDivElement>(null);
  const tributeRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Background Interactive Math Canvas & Coordinate Grid */}
      <BackgroundCanvas />

      {/* Sleek Minimalist Terminal Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 font-mono text-xs group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(0,243,255,0.4)] transition-all">
              A
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-white tracking-wider">
                ADELA.MATH
              </span>
              <span className="text-zinc-600 text-xs hidden sm:inline">•</span>
              <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">
                The Best Teacher
              </span>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <nav className="flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => scrollToSection(proofRef)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Formal Proof</span>
            </button>

            <button
              onClick={() => scrollToSection(grapherRef)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Curves Lab</span>
            </button>

            <button
              onClick={() => scrollToSection(tributeRef)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Dedication</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* Core Automatic Reduction Animation (Runs immediately on page load) */}
        <AutoMathHero onScrollToExplore={() => scrollToSection(proofRef)} />

        {/* Section Divider */}
        <div className="w-full max-w-5xl px-4 py-8 flex items-center gap-4 text-xs font-mono text-zinc-600">
          <div className="h-[1px] flex-1 bg-zinc-800/80"></div>
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
            MATHEMATICAL DOCUMENTATION & EXPLORATION
          </span>
          <div className="h-[1px] flex-1 bg-zinc-800/80"></div>
        </div>

        {/* Section 1: Formal Mathematical Manuscript & Proof */}
        <div ref={proofRef} className="w-full scroll-mt-16">
          <FormalProof />
        </div>

        {/* Section 2: Interactive Function Visualizer */}
        <div ref={grapherRef} className="w-full scroll-mt-16">
          <TeacherGrapher />
        </div>

        {/* Section 3: Personalized Dedication Terminal */}
        <div ref={tributeRef} className="w-full scroll-mt-16">
          <TributeTerminal />
        </div>

      </main>

      {/* Terminal Footer */}
      <Footer />

    </div>
  );
};

export default App;
