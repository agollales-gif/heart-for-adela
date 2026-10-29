import React from 'react';
import { RotateCcw, Volume2, VolumeX, Terminal, BookOpen, Activity, Heart } from 'lucide-react';

export type ActiveTab = 'animation' | 'grapher' | 'proof' | 'tribute';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onReplayAnimation: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onReplayAnimation,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Title */}
        <div 
          onClick={() => onSelectTab('animation')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 font-mono group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(0,243,255,0.4)] transition-all">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold font-mono text-white tracking-wider flex items-center gap-2">
              ADELA <span className="text-zinc-500 font-normal">|</span> <span className="text-cyan-400 font-medium text-xs">THE BEST TEACHER</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 hidden sm:block">
              MATHEMATICAL TRIBUTE & CALCULUS REDUCTION
            </span>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => onSelectTab('animation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'animation'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Animation Sequence</span>
          </button>

          <button
            onClick={() => onSelectTab('grapher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'grapher'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Graphing Lab</span>
          </button>

          <button
            onClick={() => onSelectTab('proof')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'proof'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Formal Proof</span>
          </button>

          <button
            onClick={() => onSelectTab('tribute')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'tribute'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Tribute Card</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Replay */}
          <button
            onClick={onReplayAnimation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-cyan-400 text-xs font-mono text-zinc-300 hover:text-white transition-all"
            title="Replay Calculus Reduction Animation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled 
                ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-400' 
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Mute audio' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-zinc-800/60 bg-zinc-950/90 py-2 px-2 text-xs font-mono">
        <button
          onClick={() => onSelectTab('animation')}
          className={`px-2 py-1 rounded ${activeTab === 'animation' ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-zinc-400'}`}
        >
          Animation
        </button>
        <button
          onClick={() => onSelectTab('grapher')}
          className={`px-2 py-1 rounded ${activeTab === 'grapher' ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-zinc-400'}`}
        >
          Grapher
        </button>
        <button
          onClick={() => onSelectTab('proof')}
          className={`px-2 py-1 rounded ${activeTab === 'proof' ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-zinc-400'}`}
        >
          Proof
        </button>
        <button
          onClick={() => onSelectTab('tribute')}
          className={`px-2 py-1 rounded ${activeTab === 'tribute' ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-zinc-400'}`}
        >
          Tribute
        </button>
      </div>
    </header>
  );
};
