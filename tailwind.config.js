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
          dark: '#FFFFFF',
          midnight: '#F8FAFC',
          navy: '#FFFFFF',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#F1F5F9',
          gold: '#D97706',
          goldLight: '#F59E0B',
          goldGlow: '#FBBF24',
          goldDark: '#B45309',
          emerald: '#10B981',
          emeraldLight: '#34D399',
          emeraldDark: '#047857',
          pillBg: '#ECFDF5',
          glow: 'rgba(37, 99, 235, 0.08)',
        }
      },
      boxShadow: {
        'nur-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
      },
      backgroundImage: {
        'twilight-gradient': 'linear-gradient(180deg, #071526 0%, #050D18 100%)',
        'gold-badge': 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        'emerald-badge': 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)',
      }
    },
  },
  plugins: [],
}
