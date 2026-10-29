import { GraphFunction } from '../types';

export const GRAPH_FUNCTIONS: GraphFunction[] = [
  {
    id: 'heart',
    name: "Adela's Cardioid (Heart of Mathematics)",
    formulaLatex: "(x^2 + y^2 - 1)^3 - x^2 y^3 = 0",
    description: "The classic algebraic heart curve, symbolizing a teacher's love for mathematics and students.",
    fn: (x, a) => {
      // Upper and lower branches for standard function plot approximation
      const x2 = x * x;
      const top = Math.sqrt(Math.max(0, 1 - x2)) + Math.pow(Math.abs(x), 2/3) * (a / 2);
      return top;
    },
    defaultA: 2.0,
    defaultB: 1.0,
    labelA: "Heart Curvature (Love)",
    labelB: "Scale Factor",
    minA: 0.5,
    maxA: 3.5,
    minB: 0.5,
    maxB: 2.0,
    domain: [-1.8, 1.8],
    color: '#00f3ff',
  },
  {
    id: 'patience',
    name: "Infinite Patience Curve",
    formulaLatex: "f(x) = \\text{Adela} \\cdot \\arctan(k \\cdot x)",
    description: "As student questions approach infinity, a teacher's patience smoothly reaches the supreme horizontal asymptote.",
    fn: (x, k, amp) => {
      return amp * Math.atan(k * x);
    },
    defaultA: 1.5,
    defaultB: 2.2,
    labelA: "Curvature Rate k",
    labelB: "Asymptote Ceiling (Patience)",
    minA: 0.2,
    maxA: 4.0,
    minB: 0.5,
    maxB: 4.0,
    domain: [-6, 6],
    color: '#a855f7',
  },
  {
    id: 'growth',
    name: "Student Knowledge Sigmoid",
    formulaLatex: "K(t) = \\frac{L}{1 + e^{-k(t - t_0)}}",
    description: "Logistic learning curve representing the student's breakthrough under inspiring instruction.",
    fn: (x, k, L) => {
      return L / (1 + Math.exp(-k * x));
    },
    defaultA: 1.2,
    defaultB: 3.0,
    labelA: "Teaching Intensity (k)",
    labelB: "Max Knowledge Potential (L)",
    minA: 0.2,
    maxA: 3.0,
    minB: 1.0,
    maxB: 5.0,
    domain: [-5, 5],
    color: '#10b981',
  },
  {
    id: 'wave',
    name: "Harmonic Wave of Inspiration",
    formulaLatex: "\\psi(x) = A \\cdot e^{-\\gamma x} \\cos(\\omega x)",
    description: "Oscillatory resonance: How a great lecture reverberates in a student's memory across time.",
    fn: (x, w, amp) => {
      const gamma = 0.25;
      return amp * Math.exp(-gamma * Math.abs(x)) * Math.cos(w * x);
    },
    defaultA: 3.0,
    defaultB: 2.5,
    labelA: "Frequency ω (Insight)",
    labelB: "Amplitude A (Impact)",
    minA: 1.0,
    maxA: 6.0,
    minB: 0.5,
    maxB: 4.0,
    domain: [-5, 5],
    color: '#f59e0b',
  },
];
