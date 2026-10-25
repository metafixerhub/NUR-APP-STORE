/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nur: {
          dark: '#050D18',
          midnight: '#081423',
          navy: '#0C1E34',
          surface: '#122944',
          border: '#1E3B60',
          hover: '#183454',
          gold: '#F59E0B',
          goldLight: '#FDE047',
          goldGlow: '#FBBF24',
          goldDark: '#D97706',
          emerald: '#10B981',
          emeraldLight: '#34D399',
          emeraldDark: '#043229',
          pillBg: '#052A24',
          glow: 'rgba(245, 158, 11, 0.15)',
        }
      },
      boxShadow: {
        'nur-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'nur-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'nur-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'twilight-gradient': 'linear-gradient(180deg, #071526 0%, #050D18 100%)',
        'gold-badge': 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        'emerald-badge': 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)',
        'card-glow': 'radial-gradient(ellipse at top, rgba(245, 158, 11, 0.08), transparent 70%)',
      }
    },
  },
  plugins: [],
}
