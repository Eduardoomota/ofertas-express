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
    },
  },
  plugins: [],
};
export default config;
