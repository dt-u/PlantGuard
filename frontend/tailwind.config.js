/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-green': '#10B981',
        'agri-dark': '#064E3B',
      },
    },
  },
  plugins: [],
}
