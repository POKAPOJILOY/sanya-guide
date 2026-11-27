import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFFBF3",
        milk: "#FFFBF3",
        card: "#FFFFFF",
        accent: "#F2689C",
        deep: "#D63D7C",
        pastel: "#FFDCE8",
        blush: "#FFE9F1",
        ink: "#3D2233",
        muted: "#8A6B7A",
        choco: "#4A2C2A",
        gold: "#E5C58B",
        strawberry: "#D64560",
        butter: "#F2CE6B",
        butterSoft: "#FCF0D4",
        sky: "#7FB3E0",
        skySoft: "#E1EEF9",
        pistachio: "#A9CB8F",
        pistachioSoft: "#EBF3E0",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        narrow: [
          "var(--font-narrow)",
          "var(--font-narrow-alt)",
          "sans-serif",
        ],
        "narrow-alt": ["var(--font-narrow-alt)", "sans-serif"],
        "display-alt": ["var(--font-narrow-alt)", "sans-serif"],
        pixel: ["Pixeloid Sans", "monospace"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(214,61,124,0.08)",
        lift: "0 14px 40px rgba(214,61,124,0.16)",
      },
      borderRadius: {
        card: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
