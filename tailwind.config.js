/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D04A02',
        surface: '#FAFAFA',
        'text-primary': '#1A1A2E',
        'text-secondary': '#6B7280',
        success: '#059669',
        warning: '#D97706',
        danger: '#DC2626',
        info: '#2563EB',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
