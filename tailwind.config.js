type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Seja específico
    // Evite padrões muito amplos como "./**/*.tsx"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}