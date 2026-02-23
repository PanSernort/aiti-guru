/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F56D3',
        'primary-hover': '#3E44B8',
      },
      fontFamily: {
        cairo: ['Cairo', 'Noto Sans', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
