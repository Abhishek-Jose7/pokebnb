import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        card: "var(--bg-card)",
        border: "var(--border)",
        "poke-red": "var(--poke-red)",
        "poke-yellow": "var(--poke-yellow)",
        "poke-blue": "var(--poke-blue)",
        "poke-green": "var(--poke-green)",
        accent: "var(--accent)",
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-body)", "monospace"],
      },
      boxShadow: {
        card: "0 18px 50px rgba(0,0,0,0.28)",
        screen: "inset 0 0 0 2px rgba(255,255,255,0.08), 0 0 40px rgba(59,76,202,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
