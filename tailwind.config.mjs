/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        dark: '#000000',
        light: '#EBEBED',
        ink: '#000000',
        sand: '#EBEBED',
        accent: {
          blue: '#5010BB',
          orange: {
            DEFAULT: '#00DC7E',
            deep: '#00B863',
          },
          wine: {
            DEFAULT: '#000000',
            deep: '#000000',
            soft: '#E4E4E7',
          },
          teal: {
            DEFAULT: '#00DC7E',
            deep: '#00B863',
            soft: '#E6FAF2',
          },
        },
        success: '#22c55e',
        warning: '#F59E0B',
        error: '#DC2626',
        info: '#3B82F6',
        surface: {
          primary: 'var(--surface-primary, #EBEBED)',
          secondary: 'var(--surface-secondary, #FFFFFF)',
          inverse: 'var(--surface-inverse, #000000)',
        },
        border: {
          DEFAULT: 'var(--border-color, rgba(0, 0, 0, 0.10))',
          inverse: 'var(--border-inverse, rgba(235, 235, 237, 0.12))',
        },
        fg: {
          primary: 'var(--fg-primary, #000000)',
          secondary: 'var(--fg-secondary, rgba(0, 0, 0, 0.65))',
          inverse: 'var(--fg-inverse, #EBEBED)',
          'inverse-secondary': 'var(--fg-inverse-secondary, rgba(235, 235, 237, 0.65))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Barlow Condensed', 'system-ui', 'sans-serif']
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '9xl': ['8rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        '10xl': ['10rem', { lineHeight: '0.9', letterSpacing: '-0.05em' }]
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        section: '6rem',
        'section-lg': '8rem',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.06)',
        'md': '0 8px 28px rgba(0,0,0,0.06)',
        'lg': '0 22px 70px rgba(0,0,0,0.12)',
        'xl': '0 32px 96px rgba(0,0,0,0.16)',
      },
      zIndex: {
        'backdrop': '10',
        'sticky': '20',
        'overlay': '40',
        'modal': '50',
        'toast': '60',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
      },
      transitionTimingFunction: {
        'enter': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'exit': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
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
