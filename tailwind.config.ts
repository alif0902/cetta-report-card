import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: "#8CC63F",
        leafdark: "#4E7A1E",
        leafsoft: "#E8F3D3",
        ink: "#1C1C1C",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Poppins'", "sans-serif"],
        jp: ["'Noto Sans JP'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
