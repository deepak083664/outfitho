/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000', // Black
        secondary: '#1E3A8A', // Dark Blue
        accent: '#F3F4F6', // Light Gray
        background: '#FFFFFF', // White
        surface: '#FAFAFA', // Slight off-white for cards
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'sleek': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
