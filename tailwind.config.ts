import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#173B2A",
        leaf: "#2F7D4E",
        sprout: "#8BCF73",
        mint: "#EEF8EA",
        cream: "#FAFCF7",
        sand: "#E9F2EA",
        amber: "#F4B860",
        ink: "#1F2A24",
        muted: "#647067",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 18px 55px rgba(23, 59, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
