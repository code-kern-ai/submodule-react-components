const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      lime: colors.lime,
      green: colors.green,
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      rose: colors.rose,
    },
    fontFamily: {
      Inter: ["Inter var", "sans-serif"],
    },
    extend: {
      colors: {
        kernindigo: {
          DEFAULT: "#0C052E",
          dark: "#06023b",
          darker: "#4F46E5",
          "darker-1": "#312E81",
          light: "#EEF2FF",
          "dark-1": "#0000F5",
          "dark-2": "#4338CA",
        },
      },
      fontFamily: {
        sans: ["Inter var"],
      },
    },
  },
  plugins: [],
}