import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0B0F14",
        surface: "#121820",
        panel: "#161D26",
        border: "#1F2A36",
        muted: "#7C8B9B",
        text: "#DCE4EA",
        pulse: "#5EEAD4",
        warn: "#F5A524",
        crit: "#F1554C",
        wire: "#2C3B4A",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(94,234,212,0.15), 0 0 24px rgba(94,234,212,0.08)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        scan: "scan 2.4s linear infinite",
        blink: "blink 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
