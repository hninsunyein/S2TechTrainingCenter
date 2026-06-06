import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        teal: {
          DEFAULT: '#0ea5c8',
          dark: '#0284a8',
        },
        gold: '#f59e0b',
        brand: {
          green: '#22c55e',
          purple: '#a78bfa',
          pink: '#f472b6',
        },
      },
      borderRadius: {
        card: '12px',
        card2: '18px',
      },
      animation: {
        blink: 'blink 2s infinite',
        fadeUp: 'fadeUp 0.35s ease',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
