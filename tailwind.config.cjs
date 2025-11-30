/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './app/**/*.{ts,tsx,js,jsx}',
    './public/**/*.{html,css}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3DDC84',
        accent: '#7129ee',
        background: '#100d16',
        detail: '#141420'
      }
    }
  },
  plugins: []
};
