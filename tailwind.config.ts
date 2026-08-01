import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F766E",
          dark: "#115E59",
          light: "#0D9488",
          tint: "#CCFBF1",
        },
        surface: "#F5F7F7",
      },
      keyframes: {
        "cart-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "cart-out": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-8px)" },
        },
      },
      animation: {
        "cart-in": "cart-in 180ms ease-out",
        "cart-out": "cart-out 160ms ease-in forwards",
      },
    },
  },
  plugins: [],
};
export default config;
