import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function ({ addBase, config }) {
      addBase({
        'input[type="number"]::-webkit-outer-spin-button': {
          "-webkit-appearance": "none",
          margin: 0,
        },
        'input[type="number"]::-webkit-inner-spin-button': {
          "-webkit-appearance": "none",
          margin: 0,
        },
        'input[type="number"]': {
          "-moz-appearance": "textfield",
        },
      });
    },
  ],
};
export default config;
