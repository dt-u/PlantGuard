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
        'agri-blue': '#3B82F6', // Standard Blue 500 for a bright "surveillance" look
        'agri-dark': '#064E3B',
      },
    },
  },
  plugins: [],
}
