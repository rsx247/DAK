/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5A5F',        // Airbnb red/coral
        secondary: '#004E89',
        success: '#2A9D8F',
        warning: '#F4A261',
        background: '#FFFFFF',     // White background
        text: '#222222',           // Airbnb dark text
        textSecondary: '#717171',  // Airbnb secondary text
        textTertiary: '#B0B0B0',   // Airbnb tertiary text
        border: '#EBEBEB',         // Airbnb border
        redLine: '#FF5A5F',
        community: '#2A9D8F',
        religious: '#004E89',
        foodBank: '#E63946',
        foodRescue: '#2A9D8F',
        commercial: '#FF6B35',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-x': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
}





