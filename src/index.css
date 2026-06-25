@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

html, body {
  font-size: 110% !important; /* +10% Font Size */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-sans);
  background-color: #09090b; /* Zinc 950 */
  color: #ffffff; /* pure white for maximum contrast */
}

/* Color Contrast Boost (Fixes blurriness of text labels in dark mode) */
:not(.light-theme) .text-zinc-400 {
  color: #cbd5e1 !important; /* Slate 300 - much higher contrast */
}
:not(.light-theme) .text-zinc-500 {
  color: #94a3b8 !important; /* Slate 400 */
}
:not(.light-theme) .text-zinc-300 {
  color: #f8fafc !important; /* Slate 50 - extremely high contrast */
}
:not(.light-theme) .text-white\/60 {
  color: rgba(255, 255, 255, 0.9) !important; /* pure legible text */
}
:not(.light-theme) .text-white\/50 {
  color: rgba(255, 255, 255, 0.85) !important;
}
:not(.light-theme) .text-white\/40 {
  color: rgba(255, 255, 255, 0.75) !important;
}

/* Light Theme High Contrast fixes */
.light-theme .text-zinc-400,
.light-theme .text-zinc-500,
.light-theme .text-zinc-600,
.light-theme .text-white\/60,
.light-theme .text-white\/50 {
  color: #18181b !important; /* zinc-900 black for deep crisp contrast */
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
  20%, 40%, 60%, 80% { transform: translateX(6px); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite ease-in-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Glassmorphism utility */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.glass-premium {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
}

.frosted-gradient {
  background: radial-gradient(circle at top left, #2D3436, #000000);
}

.frosted-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.frosted-input:focus {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.frosted-btn-primary {
  background: #ffffff;
  color: #000000;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
}

.frosted-btn-primary:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.frosted-btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  transition: all 0.2s ease;
}

.frosted-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

