import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  glow?: boolean;
}

export const MathView: React.FC<MathViewProps> = ({ 
  math, 
  block = false, 
  className = '',
  glow = false 
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return `<span class="text-red-400">[Math Render Error: ${math}]</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-block ${glow ? 'filter drop-shadow-[0_0_12px_rgba(0,243,255,0.45)]' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
