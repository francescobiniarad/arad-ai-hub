/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FAFAFB',
          surface: '#FFFFFF',
          gold: '#C5A028',
          title: '#1A1B1F',
          body: '#4A4A4A',
          muted: '#A0A0A0',
          ice: '#F0F2F5',
          lavender: '#EBE8F3',
        },
        // Keep for backward compat on kanban column colors
        primary: {
          500: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        heading: ['Marcellus', 'Optima', 'serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
