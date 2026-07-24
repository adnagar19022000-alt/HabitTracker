/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14181F",
        paper: "#F7F4EE",
        moss: {
          DEFAULT: "#4C6B4F",
          light: "#6B8A6E",
          dark: "#37503A",
        },
        clay: {
          DEFAULT: "#C1653B",
          light: "#D68A63",
          dark: "#9B4E2C",
        },
        gold: {
          DEFAULT: "#D4A94A",
          light: "#E3C077",
        },
        slate: {
          DEFAULT: "#5B6470",
          light: "#88919C",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
