import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0891b2",
          dark: "#0e7490",
          light: "#06b6d4",
        },
        button: {
          DEFAULT: "#0891b2",
          dark: "#0369a1",
          light: "#06b6d4",
        },
        footer: {
          bg: "#1e293b",
          muted: "#9ca3af",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans, ui-sans-serif)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 24px -4px rgba(15, 23, 42, 0.08)",
        "card-hover":
          "0 4px 12px rgba(15, 23, 42, 0.06), 0 12px 40px -8px rgba(15, 23, 42, 0.12)",
      },
      // FIX IS HERE: Move shake inside "keyframes"
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
      // This links the keyframes to the animation name
      animation: {
        shake: 'shake 0.2s ease-in-out 0s 2',
      },
    },
  },
  plugins: [],
};

export default config;
