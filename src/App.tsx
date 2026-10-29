import React, { useState, useCallback } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navbar, ActiveTab } from './components/Navbar';
import { MathAnimationHero } from './components/MathAnimationHero';
import { TeacherGrapher } from './components/TeacherGrapher';
import { FormalProof } from './components/FormalProof';
import { TributeTerminal } from './components/TributeTerminal';
import { Footer } from './components/Footer';
import { toggleSound, isSoundEnabled } from './utils/audio';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('animation');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(isSoundEnabled());
  const [heroResetKey, setHeroResetKey] = useState<number>(0);

  const handleToggleSound = useCallback(() => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  }, []);

  const handleReplayAnimation = useCallback(() => {
    setActiveTab('animation');
    setHeroResetKey((k) => k + 1);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Dynamic Mathematical Particles & Grid Canvas */}
      <BackgroundCanvas />

      {/* Main Terminal Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onReplayAnimation={handleReplayAnimation}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-start pb-16">
        {activeTab === 'animation' && (
          <MathAnimationHero
            key={heroResetKey}
            onOpenProof={() => setActiveTab('proof')}
            onOpenGrapher={() => setActiveTab('grapher')}
          />
        )}

        {activeTab === 'grapher' && <TeacherGrapher />}

        {activeTab === 'proof' && <FormalProof />}

        {activeTab === 'tribute' && <TributeTerminal />}
      </main>

      {/* Minimalist Terminal Footer */}
      <Footer />

    </div>
  );
};

export default App;
