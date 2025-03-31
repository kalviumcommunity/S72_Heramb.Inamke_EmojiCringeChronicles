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
          purple: '#A729F5',
          pink: '#FF47A1',
          yellow: '#FFD700',
        },
        secondary: {
          blue: '#00D4FF',
          green: '#50C878',
        },
        neutral: {
          white: '#F8F9FA',
          charcoal: '#2B2B2B',
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