/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#000000",
        accent: "#3b82f6", // blue accent color
        "accent-foreground": "#ffffff",
        border: "#e5e7eb",
      },
    },
  },
  plugins: [],
};
