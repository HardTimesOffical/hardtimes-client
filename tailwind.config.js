/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      // Можно настроить цвета prose под оранжевый стиль
      typography: (theme) => ({
        orange: {
          css: {
            '--tw-prose-links': theme('colors.orange.500'),
            '--tw-prose-bullets': theme('colors.orange.400'),
            '--tw-prose-quote-borders': theme('colors.orange.200'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // <-- Этот плагин дает класс .prose
  ],
}