/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B3BF9',
        'primary-hover': '#2E2EC7',
      },
    },
  },
  plugins: [],
};
