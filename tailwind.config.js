import form from "@tailwindcss/forms";
import tailwindScrollbar from "tailwind-scrollbar";
import typography from "@tailwindcss/typography";
/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      default: "var(--font-sans)",
    },
    extend: {
      colors: {
        primary: "#7F56D9",
        secondary: "#D0D5DD",
        "primary-800": "#53389E",
        muted: "#F1F5F9",
      },
      boxShadow: {
        base: "0px 0px 64px rgba(132, 98, 254, 0.22)",
        default: "0px_1px_2px_0px_rgba(16,24,40,0.05)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [tailwindScrollbar({ nocompatible: true }), form, typography],
};
