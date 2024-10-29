import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const base = colors.slate;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        tsprimary: base[700],
        tssecondary: base[300],
        tstertiary: base[100],
        tsfaint: base[50],
      },
    },
  },
  plugins: [],
};
export default config;
