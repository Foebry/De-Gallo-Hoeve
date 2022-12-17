/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/Typography/Typography.tsx",
  ],
  theme: {
    screens: {
      lg: "1280px",
      md: "900px",
      sm: "750px",
      xs: "625px",
      "2xs": "550px",
      "3xs": "480px",
      "4xs": "380px",
    },
    extend: {
      colors: {
        black: {
          100: "#252525",
          900: "#000000",
        },
        blue: {
          100: "#3f8fab",
          200: "#3b8baf",
          300: "#3787b3",
          400: "#3383b7",
          500: "#2f7fbb",
          600: "#2b7bbf",
          700: "#2777c3",
          800: "#2373c7",
          900: "#1f6fca",
        },
        gray: {
          100: "#f1f1f1",
          200: "#e1f1f1",
          300: "#d1e1f1",
          400: "#c1e1e1",
          500: "#b1d1e1",
          600: "#a2d2e2",
          700: "#92c2d2",
          800: "#82c2d2",
          900: "#72b2d2",
        },
        green: {
          100: "#40909b",
          200: "#3f918b",
          300: "#3e927b",
          400: "#3d936b",
          500: "#3c945b",
          600: "#3b954b",
          700: "#3a963b",
          800: "#39972b",
          900: "#38981b",
        },
        grey: {
          100: "#cdcdcd",
          200: "#cacaca",
          300: "#c8c8c8",
          400: "#c6c6c6",
          500: "#c4c4c4",
          600: "#c2c2c2",
          700: "#c0c0c0",
          800: "#b8b8b8",
          900: "#b6b6b6",
        },
        red: {
          100: "#e0931f",
          200: "#dc821e",
          300: "#d9721d",
          400: "#d5611c",
          500: "#d1511b",
          600: "#ce401a",
          700: "#ca3019",
          800: "#c62f19",
          900: "#c21e18",
        },
        shadow: {
          100: "#cdcdcd",
          500: "#1e1e1e",
        },
        yellow: {
          100: "#82b119",
          200: "#8ab419",
          300: "#92b719",
          400: "#9aba19",
          500: "#a7bd19",
          600: "#afc018",
          700: "#b7c318",
          800: "#bfc618",
          900: "#c7c918",
        },
        white: {
          900: "#ffffff",
        },
      },
      aspectRatio: {
        "3/2": "3/2",
        "3/4": "3/4",
        "6x": "6/1",
        "3x": "3/1",
      },
      maxWidth: {
        "5xs": "50px",
        "3xs": "200px",
        "2xs": "300px",
        "8xl": "88rem",
        "1/5": "20%",
        "1/4": "25%",
        "1/3": "33%",
        "2/5": "40%",
        "1/2": "50%",
        "2/3": "66%",
        "15p": "15%",
        fit: "fit-content",
      },
      minWidth: {
        "4xs": "75px",
        "3xs": "135px",
        "2xs": "200px",
        xs: "350px",
        s: "400px",
      },
      minHeight: {
        xs: "350px",
        s: "380px",
        "50vh": "50vh",
        full: "100vh",
        max: "max-content",
      },
      borderRadius: {
        "4xl": "38px",
      },
      boxShadow: {
        "2sm": "3px -2px 2px",
        sm: "5px -5px 5px #1e1e1e",
        md: "-10px 10px 10px",
      },
      spacing: {
        "4p": "4%",
        "5p": "5%",
        "7p": "7%",
        "13p": "13%",
        "15p": "15%",
        "25p": "25%",
        "80p": "80%",
        "90p": "90%",
        "95p": "95%",
        "98p": "98%",
        "166p": "166%",
        full: "100%",
        18: "75px",
        25: "100px",
        30: "125px",
        38: "150px",
        76: "300px",
        100: "400px",
        "50vh": "50vh",
        none: "none",
      },
      fontSize: {
        "5vmax": "5vmax",
        "8vmin": "8vmin",
      },
      rotate: {
        135: "135deg",
      },
    },
  },
  plugins: [],
};