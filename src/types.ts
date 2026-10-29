export interface AnimationStep {
  id: number;
  label: string;
  badge: string;
  latex: string;
  description: string;
  mathExplanation: string;
  ruleApplied: string;
  durationMs: number;
  highlightWords?: string[];
  isFinal?: boolean;
}

export interface GraphFunction {
  id: string;
  name: string;
  formulaLatex: string;
  description: string;
  fn: (x: number, paramA: number, paramB: number) => number;
  isImplicit?: boolean;
  implicitFn?: (x: number, y: number, paramA: number) => number;
  defaultA: number;
  defaultB: number;
  labelA: string;
  labelB: string;
  minA: number;
  maxA: number;
  minB: number;
  maxB: number;
  domain: [number, number];
  color: string;
}

export interface TributeQuote {
  id: number;
  author: string;
  quote: string;
  formula: string;
  context: string;
}
