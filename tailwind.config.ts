import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const base = colors.slate;

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: base[700],
        secondary: base[300],
        tertiary: base[100],
        faint: base[50],
      },
    },
  },
  plugins: [],
};
export default config;