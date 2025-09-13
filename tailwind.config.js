/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Army green palette - MANDATORY colors only
        "army-green": {
          DEFAULT: "#4B5320",
          light: "#6B7A3A",
          lighter: "#8FBC8F",
        },
        // Black palette - MANDATORY colors only
        dark: {
          DEFAULT: "#000000",
          light: "#1A1A1A",
          lighter: "#2D2D2D",
        },
      },
      fontFamily: {
        gilbert: ["Gilbert Mono", "Space Mono", "monospace"],
        mono: ["Space Mono", "monospace"],
      },
      // Remove all border radius - NO rounded corners
      borderRadius: {
        none: "0",
        DEFAULT: "0",
      },
      // Remove all shadows - flat design only
      boxShadow: {
        none: "none",
        DEFAULT: "none",
      },
    },
  },
  plugins: [],
};
