/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f13',
        surface: '#18181f',
        surfaceHover: '#23232c',
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5'
        },
        accent: '#ec4899',
        border: '#2e2e38',
        muted: '#94a3b8'
      },
      aspectRatio: {
        '16/9': '16 / 9',
        '9/16': '9 / 16'
      }
    },
  },
  plugins: [],
}
