/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}",
  './src/components/**/*.{html,js,jsx,tsx}',
],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 20%, 100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(-10deg)' },
          '15%': { transform: 'rotate(10deg)' },
        },
        fireExpireObject: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        fireExpireObject: 'fireExpireObject 0.9s ease-in-out forwards',
        shake: 'shake 2s ease-in-out infinite', // Adjust the duration to control the pause
      },


    },
  },
  plugins: [],
}

