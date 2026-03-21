/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020202',
        surface: '#0d0d0d',
        surface2: '#161616',
        foreground: '#e0e0e0',
        cyan: {
          400: '#1fc8db',
          500: '#14a3b3',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
