const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F9F9FA',
        brand: '#61F3E1',
        body: '#111827',
        calm: '#FAEBEB',
        mad: '#D74E47',
        sleep: '#E0E0E0',
        notice: '#FFAD0D',
        success: '#4FA355',
        'sleep-100': '#6B7280',
        'sleep-200': '#9CA3AF',
        'sleep-300': '#B3B3B3',
      },
      fontFamily: {
        sans: ['var(--font-play)', ...fontFamily.sans],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
