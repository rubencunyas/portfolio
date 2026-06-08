/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        dark: '#151414',
        light: '#F8F6F0',
        ink: '#1A1A1A',
        accent: {
          blue: '#3031E4',
          orange: '#FE4201'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'Archivo SemiExpanded', 'system-ui', 'sans-serif']
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '9xl': ['8rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        '10xl': ['10rem', { lineHeight: '0.9', letterSpacing: '-0.05em' }]
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
