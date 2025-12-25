import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FDF8F3",
          light: "#FFFBF8",
        },
        sepia: {
          light: "#E8DCC6",
          DEFAULT: "#D4C4A8",
          dark: "#B8A082",
        },
        watercolor: {
          yellow: "#F5E6D3",
          pink: "#E8D4D4",
          green: "#D4E4D4",
          blue: "#D4D8E8",
        },
        text: {
          primary: "#3A3A3A",
          secondary: "#6B6B6B",
          muted: "#9A9A9A",
        },
      },
      fontFamily: {
        serif: ["Crimson Pro", "Georgia", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      fontSize: {
        "story-sm": ["1rem", { lineHeight: "1.7", letterSpacing: "0.01em" }],
        "story-base": ["1.125rem", { lineHeight: "1.75", letterSpacing: "0.01em" }],
        "story-lg": ["1.25rem", { lineHeight: "1.8", letterSpacing: "0.01em" }],
      },
      boxShadow: {
        "book": "0 2px 8px rgba(139, 119, 90, 0.12), 0 1px 3px rgba(139, 119, 90, 0.08)",
        "book-hover": "0 4px 16px rgba(139, 119, 90, 0.16), 0 2px 6px rgba(139, 119, 90, 0.1)",
        "page": "inset 0 0 0 1px rgba(139, 119, 90, 0.08), 0 2px 8px rgba(139, 119, 90, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
