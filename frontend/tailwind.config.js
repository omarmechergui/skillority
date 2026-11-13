/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        border: '#E2E8F0',
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          dark: '#1E40AF',
        },
        success: {
          DEFAULT: '#15803D',
          light: '#F0FDF4',
          border: '#BBF7D0',
        },
        warning: {
          DEFAULT: '#B45309',
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        danger: {
          DEFAULT: '#B91C1C',
          light: '#FEF2F2',
          border: '#FECACA',
        },
        secondary: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
          dark: '#B45309',
        },
        neutral: {
          slate: '#64748B',
          dark: '#0F172A',
          muted: '#94A3B8',
          light: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        md: '8px',
        sm: '6px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

