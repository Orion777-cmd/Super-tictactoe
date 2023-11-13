/** @type {import('tailwindcss').Config} */
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
}

