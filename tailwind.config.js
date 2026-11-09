/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        coral: { 50: '#fff1f0', 100: '#ffe0dd', 400: '#ff7a6b', 500: '#ff5a5f', 600: '#e8434d' },
        bubble: { 500: '#ff3d8b', 600: '#e02a76' },
      },
      boxShadow: { card: '0 12px 40px -12px rgba(30, 20, 60, 0.35)' },
    },
  },
  plugins: [],
}
