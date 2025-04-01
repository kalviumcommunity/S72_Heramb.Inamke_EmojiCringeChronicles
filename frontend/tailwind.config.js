/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#7C3AED', // More vibrant purple
          pink: '#EC4899', // More vibrant pink
          yellow: '#F59E0B', // Warm amber
        },
        secondary: {
          blue: '#3B82F6', // Bright blue
          green: '#10B981', // Emerald green
        },
        neutral: {
          white: '#F3F4F6', // Lighter gray
          charcoal: '#1F2937', // Darker gray
          card: '#FFFFFF', // Pure white for cards
          background: '#E5E7EB', // Light gray background
        },
        accent: {
          purple: '#9333EA', // Secondary purple
          pink: '#BE185D', // Secondary pink
          yellow: '#D97706', // Secondary amber
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}