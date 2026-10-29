import React from 'react';
import { MathView } from './MathView';
import { BookOpen, CheckCircle, Award } from 'lucide-react';

export const FormalProof: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto my-12 px-4 z-10 relative">
      <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
        
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 bottom-2 text-9xl font-serif font-black text-white/[0.02] select-none pointer-events-none">
          Q.E.D.
        </div>

        {/* Paper Header */}
        <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                FORMAL MATHEMATICAL MANUSCRIPT // DOC ID: ADELA-2026-MATH
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                On the Optimality of Teacher Adela
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/80 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              PEER-REVIEWED TRIBUTE
            </span>
          </div>
        </div>

        {/* Abstract */}
        <div className="bg-zinc-900/50 border-l-2 border-cyan-400 p-4 rounded-r-lg mb-8 text-sm text-zinc-300 font-sans leading-relaxed">
          <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            ABSTRACT:
          </span>
          We demonstrate through rigorous mathematical analysis that the pedagogical impact of instructor <strong>Adela</strong> is uniquely optimal. By formulating the Fundamental Theorem of Calculus over the domain of student potential, we establish that the operator collapses unconditionally to the maximal grade element <MathView math="\mathbf{A}" />.
        </div>

        {/* Proof Sections */}
        <div className="space-y-8 text-zinc-300 text-sm leading-relaxed">
          
          {/* Section 1: Axiomatic Foundation */}
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-cyan-400">§ 1.</span> Axiomatic Foundations
            </h3>
            
            <div className="space-y-3 pl-4 border-l border-zinc-800">
              <p>
                <strong>Axiom 1 (Continuity of Clarification):</strong> Let <MathView math="\mathcal{S}" /> denote the state space of a student. For any arbitrary confusion <MathView math="\epsilon > 0" />, there exists a step size <MathView math="\delta > 0" /> such that:
              </p>
              <div className="my-2 py-2 px-3 bg-zinc-900/60 rounded border border-zinc-800/80 overflow-x-auto text-center">
                <MathView math="|x - \text{Confusion}| < \delta \implies |\mathcal{T}_{\text{Adela}}(x) - \text{Clarity}| < \epsilon" block={true} />
              </div>

              <p>
                <strong>Axiom 2 (Invariance of Dedication):</strong> The teacher's commitment is strictly positive across the entire academic trajectory, yielding the zero-exponent unity identity:
              </p>
              <div className="my-2 py-2 px-3 bg-zinc-900/60 rounded border border-zinc-800/80 overflow-x-auto text-center">
                <MathView math="\text{Dedication} > 0 \implies \text{Dedication}^{0} \equiv 1" block={true} />
              </div>
            </div>
          </div>

          {/* Section 2: Main Theorem */}
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-cyan-400">§ 2.</span> Theorem 1.1 (The Calculus of Excellence)
            </h3>

            <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-xl space-y-4">
              <div className="font-semibold text-white">
                <em>Statement:</em> The composite rate of change of accumulated mentorship with respect to student growth evaluates as:
              </div>

              <div className="py-3 px-4 bg-zinc-950 rounded-lg border border-cyan-500/30 overflow-x-auto text-center shadow-inner">
                <MathView 
                  math="\frac{d}{dx} \left( \int_{0}^{\text{Adela}} (\text{Patience} \cdot x) \, dx \right) + \text{Dedication}^{0} = \mathbf{A}" 
                  block={true}
                  glow={true}
                />
              </div>

              <div className="text-xs text-zinc-400 space-y-2 pt-2 border-t border-zinc-800">
                <p><strong>Proof Steps:</strong></p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>
                    By Axiom 2, rewrite <MathView math="\text{Dedication}^0 \to 1" />.
                  </li>
                  <li>
                    Evaluate the definite antiderivative <MathView math="\int_0^{\text{Adela}} (\text{Patience} \cdot x) \, dx = \left[ \frac{\text{Patience} \cdot x^2}{2} \right]_0^{\text{Adela}}" />.
                  </li>
                  <li>
                    Apply the Fundamental Theorem of Calculus with respect to the parameter of student achievement, yielding <MathView math="\text{Patience} \cdot \text{Adela} + 1" />.
                  </li>
                  <li>
                    Normalizing the identity metric across years of mentorship concentrates all terms into the invariant core: <MathView math="\text{Adela}" />.
                  </li>
                  <li>
                    Under the limit of ultimate mastery, the set <MathView math="\{\text{A}, \text{d}, \text{e}, \text{l}, \text{a}\}" /> contracts to its supreme element: <MathView math="\mathbf{A}" />.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Section 3: Conclusion & Q.E.D. */}
          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-sm">
              <CheckCircle className="w-5 h-5 text-cyan-400" />
              <span>Conclusion: <strong>Adela is unequivocally the best teacher.</strong></span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-zinc-500">Sign-off:</span>
              <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-700 text-white font-bold tracking-widest">
                Q.E.D. ■
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
