/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './client/**/*.{js,jsx,ts,tsx}',
  ],
  corePlugins: {
    // Keep existing Bootstrap and Semantic UI defaults intact during migration.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
