import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Single accent — a calm, Linear-esque indigo
        accent: {
          DEFAULT: "#5b5bd6",
          soft: "#eeeefb",
          fg: "#4444c4",
        },
        // Confidence-state semantic colors (accessible, paired with icons + labels)
        grounded: {
          DEFAULT: "#1a7f52",
          soft: "#e8f5ee",
          fg: "#15623f",
        },
        inferred: {
          DEFAULT: "#b06d00",
          soft: "#fdf3e3",
          fg: "#8a5500",
        },
        uncertain: {
          DEFAULT: "#5b6472",
          soft: "#f3f4f6",
          fg: "#475160",
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "expand": {
          "0%": { opacity: "0", maxHeight: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", maxHeight: "400px", transform: "translateY(0)" },
        },
        "chip-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "expand": "expand 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "chip-in": "chip-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
