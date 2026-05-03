/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Light theme surfaces
        surface: {
          DEFAULT: '#DCF4FF',   // page background — light blue
          card:    '#FFFFFF',   // cards / panels
          hover:   '#EFF9FF',   // hover tint
          border:  '#B8E4F9',   // borders
          muted:   '#94A3B8',   // muted text
        },
      },
      keyframes: {
        slideInRight: {
          '0%':   { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in':        'fadeIn 0.2s ease-out',
        'scale-in':       'scaleIn 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
