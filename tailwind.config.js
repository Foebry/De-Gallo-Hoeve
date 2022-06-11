/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "3/2": "3/2",
        "3/4": "3/4",
        "6x": "6/1",
      },
      maxWidth: {
        "2xs": "300px",
        "8xl": "88rem",
        "15p": "15%",
      },
      minWidth: {
        "3xs": "135px",
        "2xs": "200px",
      },
      minHeight: {
        xs: "350px",
      },
      borderRadius: {
        "4xl": "38px",
      },
      boxShadow: {
        "2sm": "3px -2px 2px #1e1e1e",
        sm: "5px -5px 5px #1e1e1e",
        md: "-10px 10px 10px #1e1e1e;",
      },
      spacing: {
        "4p": "4%",
        "5p": "5%",
        "7p": "7%",
        "13p": "13%",
        "15p": "15%",
        "25p": "25%",
        "80p": "80%",
        "98p": "98%",
        full: "100%",
        18: "75px",
        30: "125px",
        76: "300px",
        "50vh": "50vh",
      },
      fontSize: {
        "5vmax": "5vmax",
      },
    },
    colors: {
      black: {
        100: "#",
        200: "#252525",
      },
      gray: {
        200: "#3f918b",
        300: "#40909b",
      },
      red: {
        500: "#d0402f",
      },
      grey: {
        100: "#efefef",
        200: "#dfdfdf",
        300: "#cfcfcf",
        400: "#bebebe",
        500: "#b6b6b6",
        550: "#acacac",
        600: "#9a9a9a",
        700: "#888888",
        800: "#767676",
        900: "#646464",
      },
      green: {
        400: "#82b119",
        500: "#8ab419",
      },
    },
  },
  plugins: [],
};
