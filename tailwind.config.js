const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.js',
    './components/**/*.js',
    './layouts/**/*.js',
    './lib/**/*.js',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.blue,
        secondary: colors.indigo,
        gray: colors.neutral,
      },
      animation: {
        'magical-fade': 'magicalFade 2s ease-in-out infinite',
        'magical-pulse': 'magicalPulse 2s ease-in-out infinite',
        'magical-float': 'magicalFloat 3s ease-in-out infinite',
      },
      keyframes: {
        magicalFade: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
        magicalPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        magicalFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')} !important`,
              },
              code: { color: theme('colors.primary.400') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.primary.800'),
              textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.secondary.700'),
              textShadow: '0 0 8px rgba(99, 102, 241, 0.5)',
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.primary.700'),
              textShadow: '0 0 6px rgba(59, 130, 246, 0.5)',
            },
            'h4,h5,h6': {
              color: theme('colors.secondary.600'),
              textShadow: '0 0 4px rgba(99, 102, 241, 0.5)',
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
            code: {
              color: theme('colors.pink.500'),
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            details: {
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
            hr: {
              borderColor: theme('colors.primary.300'),
              borderWidth: '2px',
              borderStyle: 'dashed',
            },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.primary.500'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.primary.500'),
            },
            strong: {
              color: theme('colors.secondary.600'),
              textShadow: '0 0 4px rgba(99, 102, 241, 0.5)',
            },
            blockquote: {
              color: theme('colors.primary.800'),
              borderLeftColor: theme('colors.primary.400'),
              borderLeftWidth: '4px',
              backgroundColor: theme('colors.primary.50'),
              borderRadius: '0.25rem',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')} !important`,
              },
              code: { color: theme('colors.primary.400') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.primary.400'),
              textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.secondary.400'),
              textShadow: '0 0 8px rgba(99, 102, 241, 0.5)',
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.primary.300'),
              textShadow: '0 0 6px rgba(59, 130, 246, 0.5)',
            },
            'h4,h5,h6': {
              color: theme('colors.secondary.300'),
              textShadow: '0 0 4px rgba(99, 102, 241, 0.5)',
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
            details: {
              backgroundColor: theme('colors.gray.800'),
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
            hr: {
              borderColor: theme('colors.primary.600'),
              borderWidth: '2px',
              borderStyle: 'dashed',
            },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.primary.400'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.primary.400'),
            },
            strong: {
              color: theme('colors.secondary.300'),
              textShadow: '0 0 4px rgba(99, 102, 241, 0.5)',
            },
            thead: {
              th: {
                color: theme('colors.primary.300'),
                backgroundColor: theme('colors.gray.700'),
              },
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.primary.700'),
              },
            },
            blockquote: {
              color: theme('colors.primary.300'),
              borderLeftColor: theme('colors.primary.600'),
              borderLeftWidth: '4px',
              backgroundColor: theme('colors.gray.800'),
              borderRadius: '0.25rem',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
