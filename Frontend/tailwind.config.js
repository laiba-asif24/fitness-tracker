/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12181B',        // near-black text/background
        paper: '#F7F5F0',      // warm off-white surface
        surface: '#FFFFFF',
        line: '#E3DFD6',
        pulse: '#FF5A36',      // energetic coral-orange accent (primary)
        volt: '#1F7A5C',       // deep green accent (secondary / success)
        slate: '#5B6169',      // muted text
      },
      fontFamily: {
        display: ['"Archivo Black"', '"Arial Black"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};
