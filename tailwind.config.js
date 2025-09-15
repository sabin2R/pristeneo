/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          mustard: { DEFAULT: '#E2B401', dark: '#C59A00', light: '#F3D64A' },
          leaf: '#2E7D32',
          ink: '#1F2937',
          bone: '#FAFAF9'
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          display: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif']
        }
      },
    },
    plugins: [],
  }
  