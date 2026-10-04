/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        surfaceHover: '#F2F2F2',
        surfaceSelected: '#E5E5E5',
        border: '#E5E5E5',
        textPrimary: '#0F0F0F',
        textSecondary: '#606060',
        muted: '#909090',
        primary: {
          DEFAULT: '#FF0000',
          hover: '#CC0000'
        },
        yt: {
          red: '#FF0000',
          redHover: '#CC0000',
          bg: '#FFFFFF',
          text: '#0F0F0F',
          textSec: '#606060',
          muted: '#909090',
          border: '#E5E5E5',
          hover: '#F2F2F2',
          badge: '#F2F2F2'
        }
      },
      aspectRatio: {
        '16/9': '16 / 9',
        '9/16': '9 / 16'
      }
    },
  },
  plugins: [],
};
