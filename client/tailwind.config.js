/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f0f10',
          secondary: '#18181b',
          card: '#1f1f23',
        },
        accent: {
          DEFAULT: '#22d3ee',
          hover: '#06b6d4',
        },
      },
    },
  },
  plugins: [],
}