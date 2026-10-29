# Adela — The Best Teacher: Mathematical Tribute Web Application

A minimalist, high-contrast, dark-mode single-page interactive web application dedicated to a mathematics teacher named **Adela**.

---

## 🌟 Overview & Key Features

### 1. The Core Calculus Reduction Animation
Upon page load, an engaging, step-by-step mathematical reduction sequence plays:
1. **Initial State ($t = 0\text{s}$)**:
   $$\frac{d}{dx} \left( \int_{0}^{\text{Adela}} (\text{Patience} \cdot x) \, dx \right) + \text{Dedication}^{0}$$
2. **Intermediate Reductions**:
   - **Step 1 (Zero Exponent Law)**: $\text{Dedication}^0 \longrightarrow 1$
   - **Step 2 (Definite Integration)**: $\frac{d}{dx} \left( \left[ \frac{\text{Patience} \cdot x^2}{2} \right]_0^{\text{Adela}} \right) + 1$
   - **Step 3 (Fundamental Theorem of Calculus)**: Differentiation and integration resolve into $\text{Patience} \cdot \text{Adela} + 1$
   - **Step 4 (Harmonic Reduction)**: Unifying mentorship constants into $\text{Adela}$
   - **Step 5 (Singularity Collapse)**: $\mathbf{A}_{\text{dela}} \longrightarrow \mathbf{A}$
3. **Final Reveal State**:
   - The equation smoothly resolves into a bold, glowing uppercase letter $\mathbf{A}$.
   - Subtitle: **"The Best Teacher — Adela"**
   - Accompanied by celebratory particle bursts and procedural audio chimes.

### 2. Interactive Timeline & Scrubber Controls
- Play, Pause, Replay, and Step-by-Step interactive scrub bar.
- Playback speed options ($0.5\times$, $1.0\times$, $1.5\times$, $2.0\times$).
- Step explanations drawer detailing the calculus rationale and LaTeX source.
- Keyboard shortcuts: `Space` (Play/Pause), `←`/`→` (Step navigation), `R` (Restart).

### 3. Interactive Graphing Laboratory
- Visualizes real mathematical functions celebrating teaching:
  - **Adela's Cardioid (Heart of Mathematics)**: $(x^2+y^2-1)^3 - x^2 y^3 = 0$
  - **Infinite Patience Curve**: $f(x) = \text{Adela} \cdot \arctan(k \cdot x)$
  - **Student Knowledge Growth (Sigmoid)**: $K(t) = \frac{L}{1 + e^{-k(t-t_0)}}$
  - **Harmonic Wave of Inspiration**: $\psi(x) = A e^{-\gamma x} \cos(\omega x)$
- Real-time parameter sliders, coordinate HUD crosshair, and smooth 60 FPS canvas rendering.

### 4. Formal Mathematical Proof (Manuscript)
- Formatted as a peer-reviewed academic manuscript with rigorous and heartwarming axioms, lemmas, $\epsilon$-$\delta$ continuity of understanding, and Q.E.D. sign-off.

### 5. Personalized Dedication Terminal
- Customize appreciation messages, generate LaTeX dedication cards, and celebrate with dynamic confetti.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (dark mode `#0a0a0a` terminal theme, neon cyan accents)
- **Math Engine**: KaTeX (`v0.16.21`) for pristine mathematical typography
- **Visuals**: HTML5 Canvas mathematical particle & coordinate grid system
- **Audio**: Zero-dependency Web Audio API procedural synthesis

---

## 🚀 Running Locally
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```
