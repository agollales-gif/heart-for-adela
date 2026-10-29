import React, { useState } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { CinematicVideoPlayer } from './components/CinematicVideoPlayer';
import { TeacherGrapher } from './components/TeacherGrapher';
import { FormalProof } from './components/FormalProof';
import { TributeTerminal } from './components/TributeTerminal';
import { Footer } from './components/Footer';
import { Video, Activity, BookOpen, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'grapher' | 'proof' | 'tribute'>('video');

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Dynamic Background Grid and Particles */}
      <BackgroundCanvas />

      {/* Sleek Minimal Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          
          <div 
            onClick={() => setActiveTab('video')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 font-mono text-xs group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(0,243,255,0.4)] transition-all">
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

          {/* Simple Tab Pills */}
          <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'video'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>Video Tribute</span>
            </button>

            <button
              onClick={() => setActiveTab('grapher')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'grapher'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Grapher</span>
            </button>

            <button
              onClick={() => setActiveTab('proof')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'proof'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Proof</span>
            </button>

            <button
              onClick={() => setActiveTab('tribute')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'tribute'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Card</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Focus: The Short Video Player */}
      <main className="flex-1 w-full flex flex-col items-center justify-center py-4 sm:py-8">
        {activeTab === 'video' && <CinematicVideoPlayer />}
        {activeTab === 'grapher' && <TeacherGrapher />}
        {activeTab === 'proof' && <FormalProof />}
        {activeTab === 'tribute' && <TributeTerminal />}
      </main>

      {/* Minimal Footer */}
      <Footer />

    </div>
  );
};

export default App;
