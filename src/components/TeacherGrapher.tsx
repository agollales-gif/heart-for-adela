import React, { useState, useEffect, useRef } from 'react';
import { GRAPH_FUNCTIONS } from '../data/graphFunctions';
import { MathView } from './MathView';
import { Activity, RefreshCw, Crosshair } from 'lucide-react';

export const TeacherGrapher: React.FC = () => {
  const [selectedFuncId, setSelectedFuncId] = useState<string>(GRAPH_FUNCTIONS[0].id);
  const currentFunc = GRAPH_FUNCTIONS.find((f) => f.id === selectedFuncId) || GRAPH_FUNCTIONS[0];

  const [paramA, setParamA] = useState<number>(currentFunc.defaultA);
  const [paramB, setParamB] = useState<number>(currentFunc.defaultB);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset parameters when changing function
  const handleSelectFunc = (id: string) => {
    setSelectedFuncId(id);
    const target = GRAPH_FUNCTIONS.find((f) => f.id === id);
    if (target) {
      setParamA(target.defaultA);
      setParamB(target.defaultB);
    }
  };

  const handleResetParams = () => {
    setParamA(currentFunc.defaultA);
    setParamB(currentFunc.defaultB);
  };

  // Render the graph on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    const height = (canvas.height = 380);

    ctx.clearRect(0, 0, width, height);

    // Coordinate mapping parameters
    const originX = width / 2;
    const originY = height / 2 + (currentFunc.id === 'heart' ? 20 : 0);
    const scaleX = (width / (currentFunc.domain[1] - currentFunc.domain[0])) * 0.85;
    const scaleY = scaleX;

    const toCanvasX = (mathX: number) => originX + mathX * scaleX;
    const toCanvasY = (mathY: number) => originY - mathY * scaleY;
    const toMathX = (cx: number) => (cx - originX) / scaleX;

    // 1. Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    const step = 1;
    for (let x = Math.floor(currentFunc.domain[0]); x <= Math.ceil(currentFunc.domain[1]); x += step) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();
    }

    const yMax = Math.ceil(height / scaleY / 2);
    for (let y = -yMax; y <= yMax; y += step) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();
    }

    // 2. Draw Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;

    // X axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis tick labels
    ctx.font = '10px "Fira Code", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.textAlign = 'center';

    for (let x = -5; x <= 5; x += 1) {
      if (x === 0) continue;
      const cx = toCanvasX(x);
      if (cx > 20 && cx < width - 20) {
        ctx.fillText(x.toString(), cx, originY + 14);
      }
    }

    // 3. Draw the Curve
    ctx.save();
    ctx.strokeStyle = currentFunc.color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = currentFunc.color;
    ctx.shadowBlur = 12;

    if (currentFunc.id === 'heart') {
      // Upper branch
      ctx.beginPath();
      let first = true;
      for (let cx = 0; cx < width; cx += 2) {
        const mx = toMathX(cx);
        if (mx >= -1.0 && mx <= 1.0) {
          const x2 = mx * mx;
          const y = Math.sqrt(Math.max(0, 1 - x2)) + Math.pow(Math.abs(mx), 2/3) * (paramA / 2);
          const cy = toCanvasY(y);
          if (first) {
            ctx.moveTo(cx, cy);
            first = false;
          } else {
            ctx.lineTo(cx, cy);
          }
        }
      }
      ctx.stroke();

      // Lower branch
      ctx.beginPath();
      first = true;
      for (let cx = width; cx >= 0; cx -= 2) {
        const mx = toMathX(cx);
        if (mx >= -1.0 && mx <= 1.0) {
          const x2 = mx * mx;
          const y = -Math.sqrt(Math.max(0, 1 - x2)) + Math.pow(Math.abs(mx), 2/3) * (paramA / 2);
          const cy = toCanvasY(y);
          if (first) {
            ctx.moveTo(cx, cy);
            first = false;
          } else {
            ctx.lineTo(cx, cy);
          }
        }
      }
      ctx.stroke();
    } else {
      // Standard function plot
      ctx.beginPath();
      let first = true;
      for (let cx = 0; cx < width; cx += 2) {
        const mx = toMathX(cx);
        const my = currentFunc.fn(mx, paramA, paramB);
        const cy = toCanvasY(my);

        if (!isNaN(cy) && isFinite(cy) && cy >= -100 && cy <= height + 100) {
          if (first) {
            ctx.moveTo(cx, cy);
            first = false;
          } else {
            ctx.lineTo(cx, cy);
          }
        } else {
          first = true;
        }
      }
      ctx.stroke();
    }

    ctx.restore();

    // 4. Draw Crosshair & Tangent if mouse hovered
    if (mousePos) {
      const mx = toMathX(mousePos.x);
      const my = currentFunc.id === 'heart' 
        ? Math.sqrt(Math.max(0, 1 - Math.min(1, mx * mx))) + Math.pow(Math.abs(mx), 2/3) * (paramA / 2)
        : currentFunc.fn(mx, paramA, paramB);

      const cx = toCanvasX(mx);
      const cy = toCanvasY(my);

      // Vertical guide
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      // Horizontal guide
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point dot
      ctx.fillStyle = '#00f3ff';
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [selectedFuncId, paramA, paramB, mousePos, currentFunc]);

  // Mouse move on canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4 z-10 relative">
      <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* Terminal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
                MATHEMATICAL VISUALIZER // ADELA'S THEOREM
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                Interactive curves modeling inspiration, patience, and student growth
              </p>
            </div>
          </div>

          {/* Function Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            {GRAPH_FUNCTIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => handleSelectFunc(f.id)}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  selectedFuncId === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Graph Display Area */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Canvas Viewport (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="relative w-full rounded-xl border border-zinc-800 bg-[#070708] overflow-hidden group">
              <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full block cursor-crosshair"
              />

              {/* Live HUD Tooltip */}
              {mousePos && (
                <div className="absolute top-3 right-3 bg-zinc-900/90 border border-cyan-500/30 rounded px-2.5 py-1 text-[11px] font-mono text-cyan-300 shadow-lg pointer-events-none flex items-center gap-2">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    x: {(((mousePos.x - (canvasRef.current?.width || 700) / 2) / ((canvasRef.current?.width || 700) / 10))).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Formula display below canvas */}
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-zinc-400 bg-zinc-900/40 px-3 py-2 rounded-lg border border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">FORMULA:</span>
                <MathView math={currentFunc.formulaLatex} />
              </div>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">60 FPS • Realtime Canvas</span>
            </div>
          </div>

          {/* Controls & Description (1 Col) */}
          <div className="flex flex-col justify-between space-y-6 bg-zinc-900/30 border border-zinc-800/70 p-5 rounded-xl">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentFunc.color }} />
                  {currentFunc.name}
                </h3>
                <p className="mt-2 text-xs text-zinc-400 font-sans leading-relaxed">
                  {currentFunc.description}
                </p>
              </div>

              {/* Sliders for Parameter Tuning */}
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300">{currentFunc.labelA}:</span>
                  <span className="text-cyan-400 font-bold">{paramA.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={currentFunc.minA}
                  max={currentFunc.maxA}
                  step={0.05}
                  value={paramA}
                  onChange={(e) => setParamA(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="flex items-center justify-between text-xs font-mono pt-2">
                  <span className="text-zinc-300">{currentFunc.labelB}:</span>
                  <span className="text-purple-400 font-bold">{paramB.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={currentFunc.minB}
                  max={currentFunc.maxB}
                  step={0.05}
                  value={paramB}
                  onChange={(e) => setParamB(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>

            {/* Reset Parameters Button */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                onClick={handleResetParams}
                className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Parametric Render
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
