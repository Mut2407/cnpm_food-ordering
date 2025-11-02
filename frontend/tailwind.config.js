/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hcm': "url('/assets/hcm.jpg')",
      },
    },
  },
  plugins: [],
}

