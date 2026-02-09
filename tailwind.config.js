/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Asetetaan Saira oletusfontiksi
        sans: ['"Saira"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}