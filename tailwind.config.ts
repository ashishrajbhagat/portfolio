import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stage: "#141414",
        s: {
          bg: "rgb(var(--s-bg-rgb) / <alpha-value>)",
          fg: "rgb(var(--s-fg-rgb) / <alpha-value>)",
          dim: "rgb(var(--s-dim-rgb) / <alpha-value>)",
          accent: "rgb(var(--s-accent-rgb) / <alpha-value>)",
          cyan: "rgb(var(--s-cyan-rgb) / <alpha-value>)",
          warm: "rgb(var(--s-warm-rgb) / <alpha-value>)",
          line: "var(--s-line)",
        },
        m: {
          bg: "rgb(var(--m-bg-rgb) / <alpha-value>)",
          fg: "rgb(var(--m-fg-rgb) / <alpha-value>)",
          dim: "rgb(var(--m-dim-rgb) / <alpha-value>)",
          amber: "rgb(var(--m-amber-rgb) / <alpha-value>)",
          teal: "rgb(var(--m-teal-rgb) / <alpha-value>)",
          rose: "rgb(var(--m-rose-rgb) / <alpha-value>)",
          gold: "rgb(var(--m-gold-rgb) / <alpha-value>)",
          red: "rgb(var(--m-red-rgb) / <alpha-value>)",
          line: "var(--m-line)",
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', "system-ui", "sans-serif"],
        sans: ['"Instrument Sans Variable"', "system-ui", "sans-serif"],
        title: ['"Fraunces Variable"', "Georgia", "serif"],
        space: ['"Space Grotesk Variable"', "system-ui", "sans-serif"],
        hud: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
