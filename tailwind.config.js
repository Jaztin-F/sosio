/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // <- tells Tailwind to scan your React files
  ],
  theme: {
    extend: {

    
        backgroundImage: {
    'hero': "url('/BG.png')",
  },
    },
  },
  plugins: [],
}
