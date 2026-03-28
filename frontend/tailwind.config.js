/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Headings: warm, slightly rounded
        display: ['"Nunito"', 'sans-serif'],
        // Body: clean and readable
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        soup: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f4d9a8',
          300: '#ebbf6e',
          400: '#e0a040',
          500: '#d4882a',  // warm amber – primary brand colour
          600: '#b86e1f',
          700: '#8f521a',
          800: '#6e3f18',
          900: '#4a2b10',
        },
        fridge: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // cool sky blue – secondary
          600: '#0284c7',
          700: '#0369a1',
        }
      }
    },
  },
  plugins: [],
}
