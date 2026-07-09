import type { Config } from "tailwindcss";

const config: Config = {
  // Locked to light mode: `dark:` utilities only apply under a `.dark` ancestor,
  // which the app never adds, so the site always renders in light ("white") mode
  // regardless of the visitor's OS theme.
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Single locked accent across the whole product.
        accent: {
          DEFAULT: "#059669", // emerald-600
          hover: "#047857", // emerald-700
          soft: "#10b981", // emerald-500 (dark-mode text)
        },
      },
    },
  },
  plugins: [],
};
export default config;
