import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  char: string;
  alpha: number;
  baseAlpha: number;
  rotation: number;
  vRot: number;
  color: string;
}

const MATH_SYMBOLS = [
  '∫', 'dx', '∂/∂x', 'π', '∑', '∞', '∇', 'lim', 'λ', 'e', 
  'θ', 'f(x)', 'ℝ', 'x²', 'dy/dx', '±', '∈', '∀', '∃', '❤'
];

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const particleCount = Math.min(Math.floor((width * height) / 22000), 45);
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 8 + 12,
      char: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      alpha: Math.random() * 0.15 + 0.04,
      baseAlpha: Math.random() * 0.15 + 0.04,
      rotation: (Math.random() - 0.5) * 0.3,
      vRot: (Math.random() - 0.5) * 0.005,
      color: Math.random() > 0.4 ? '255, 117, 140' : '255, 255, 255',
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle soft grid
      const gridSize = 48;
      ctx.strokeStyle = 'rgba(255, 182, 193, 0.025)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Subtle soft pink wave
      ctx.save();
      ctx.beginPath();
      const waveY = height * 0.55;
      for (let x = 0; x < width; x += 6) {
        const y = waveY + Math.sin(x * 0.006 + time) * 30 + Math.cos(x * 0.012 - time * 0.7) * 12;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255, 105, 180, 0.035)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 3. Floating symbols
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        let currentAlpha = p.baseAlpha;
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            currentAlpha = Math.min(0.4, p.baseAlpha + (1 - dist / 140) * 0.3);
            p.x += (dx / dist) * 0.7;
            p.y += (dy / dist) * 0.7;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px "Fira Code", monospace`;
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
