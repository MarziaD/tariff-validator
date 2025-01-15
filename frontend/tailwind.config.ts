import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#0D1117",
            foreground: "#C9D1D9",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#2C974B",
            },
            secondary: {
              foreground: "#FFFFFF",
              DEFAULT: "#30363D",
            },
            danger: {
              foreground: "#FFFFFF",
              DEFAULT: "#DA3633",
            },
          },
        },
      },
    }),
  ],
};

export default config;
