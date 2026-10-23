/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)', // fondo de la página
        card: 'rgb(var(--card) / <alpha-value>)',     // tarjetas
        ink: 'rgb(var(--ink) / <alpha-value>)',       // texto principal
        mute: 'rgb(var(--mute) / <alpha-value>)',     // texto secundario
        line: 'rgb(var(--line) / <alpha-value>)',     // bordes
        inv: 'rgb(var(--inv) / <alpha-value>)',       // tarjeta invertida / botón primario
        'inv-ink': 'rgb(var(--inv-ink) / <alpha-value>)',
        ok: 'rgb(var(--ok) / <alpha-value>)',         // activo, completado, en sitio
        info: 'rgb(var(--info) / <alpha-value>)',     // métricas, en camino
        hot: 'rgb(var(--hot) / <alpha-value>)',       // progreso y acciones destacadas
        warn: 'rgb(var(--warn) / <alpha-value>)',     // pausado, atención
      },
      borderRadius: { card: '1.75rem', tile: '1.25rem' },
      boxShadow: {
        soft: '0 1px 2px rgb(16 24 40 / .04), 0 8px 24px -12px rgb(16 24 40 / .12)',
        lift: '0 2px 4px rgb(16 24 40 / .06), 0 18px 36px -14px rgb(16 24 40 / .22)',
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'] },
      transitionTimingFunction: { soft: 'cubic-bezier(.22,1,.36,1)' },
    },
  },
};
