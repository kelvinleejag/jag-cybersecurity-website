import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#05080F',
          surface: '#0B1220',
          surfaceElevated: '#0F1A2E',
          surfaceMuted: '#080D17',
          primary: '#0A1628',
          secondary: '#111E32',
          elevated: '#1A2B47',
          deep: '#050D1A',
        },
        border: {
          DEFAULT: '#1E2F4A',
          subtle: 'rgba(148, 163, 184, 0.08)',
          default: 'rgba(148, 163, 184, 0.14)',
          strong: 'rgba(34, 211, 238, 0.30)',
          glow: 'rgba(34, 211, 238, 0.50)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          tertiary: '#94A3B8',
          quaternary: '#64748B',
          inverse: '#0F172A',
          onAccent: '#05080F',
        },
        brand: {
          cyan: '#22D3EE',
          cyanBright: '#67E8F9',
          cyanDeep: '#0891B2',
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981',
        },
        accent: {
          DEFAULT: '#22D3EE',
          hover: '#67E8F9',
          glow: 'rgba(34, 211, 238, 0.15)',
        },
        metric: {
          green: '#10B981',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        eyebrow: ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        body: ['clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', { lineHeight: '1.6' }],
        bodyLg: ['clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)', { lineHeight: '1.6' }],
        h3: ['clamp(1.5rem, 1.3rem + 1vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h2: ['clamp(2rem, 1.6rem + 2vw, 3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h1: ['clamp(2.75rem, 2rem + 3.75vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        hero: ['clamp(3.5rem, 2.5rem + 5vw, 7.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        container: '1280px',
        containerWide: '1280px',
        content: '720px',
        narrow: '960px',
      },
      spacing: {
        section: 'clamp(5rem, 4rem + 5vw, 9rem)',
        sectionInner: 'clamp(3rem, 2rem + 3vw, 5rem)',
        gutter: 'clamp(1.5rem, 1rem + 2vw, 3rem)',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        '2xl': '1920px',
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        'glow-sm': '0 0 24px rgba(34, 211, 238, 0.12)',
        'glow-md': '0 0 48px rgba(34, 211, 238, 0.20)',
        'glow-lg': '0 0 60px rgba(34, 211, 238, 0.12)',
        'glow-xl': '0 0 72px rgba(34, 211, 238, 0.25)',
        cardHover: '0 0 0 1px rgba(34, 211, 238, 0.2), 0 20px 40px -20px rgba(34, 211, 238, 0.15)',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
        hero: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '200ms',
        base: '400ms',
        slow: '800ms',
        hero: '1200ms',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'draw-stroke': {
          '0%':   { strokeDashoffset: '1' },
          '100%': { strokeDashoffset: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.04' },
          '50%':      { opacity: '0.10' },
        },
        'glow-bloom': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-in-left': 'slide-in-left 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'draw-stroke': 'draw-stroke 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulse-glow 6s ease-in-out infinite',
        'glow-bloom': 'glow-bloom 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
