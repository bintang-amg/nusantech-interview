/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#e50914",
          dark: "#b20710",
        },
      },
    },
  },
  plugins: [],
};
