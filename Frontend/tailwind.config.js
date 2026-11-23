/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          hover: '#047857',
          light: '#D1FAE5',
        },
        success: '#10B981',
        danger: '#EA580C', // برتقالي بدل الأحمر
        warning: '#D97706',
        background: '#F1F5F9',
        textMain: '#0F172A',
        textSub: '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}