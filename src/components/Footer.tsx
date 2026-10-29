import React from 'react';
import { Terminal, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950/90 text-xs font-mono text-zinc-500 py-6 px-4 z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <span>ADELA MATHEMATICAL TRIBUTE ENGINE // SYSTEM ACTIVE</span>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
          <span>for Mathematics Teacher Adela</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-zinc-600">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            KaTeX 0.16.21
          </span>
          <span>•</span>
          <span>React 19 + TypeScript</span>
        </div>

      </div>
    </footer>
  );
};
