import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A1628',
          secondary: '#111E32',
          elevated: '#1A2B47',
          deep: '#050D1A',
        },
        border: { DEFAULT: '#1E2F4A' },
        text: {
          primary: '#E8EEF7',
          secondary: '#8A9CB5',
          tertiary: '#5A6B85',
        },
        accent: {
          DEFAULT: '#00D9FF',
          hover: '#33E1FF',
          glow: 'rgba(0, 217, 255, 0.15)',
        },
        metric: {
          green: '#00FF9F',
          amber: '#FFB800',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-headline)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        container: '1200px',
        content: '720px',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
      },
      boxShadow: {
        'glow-sm': '0 0 24px rgba(0, 217, 255, 0.15)',
        'glow-md': '0 0 48px rgba(0, 217, 255, 0.25)',
        'glow-lg': '0 0 60px rgba(0, 217, 255, 0.15)',
        'glow-xl': '0 0 72px rgba(0, 217, 255, 0.35)',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
