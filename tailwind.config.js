const defaultTheme = require("tailwindcss/defaultTheme");
const colorAlgorithm = require("@k-vyn/coloralgorithm");
const colorboxColors = require("./colorbox.json");

// https://colorbox.io/
const generatedColors = colorboxColors.map(({ properties, options }) => {
  const output = colorAlgorithm.generate(properties, options);
  return output.find((item) => !item.inverted);
});

const colors = generatedColors.reduce((accColor, color) => {
  const colorSteps = color.colors.reduce((accStep, step) => {
    return {
      ...accStep,
      [step.step]: step.hex,
    };
  }, {});

  return {
    ...accColor,
    [color.name.toLowerCase()]: colorSteps,
  };
}, {});

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: [
      "./src/**/*.html",
      "./src/**/*.template",
      "./src/**/*.ts",
      "./src/**/*.tsx",
    ],
  },
  darkMode: "class",
  theme: {
    fontFamily: {
      heading: ["freight-display-pro", ...defaultTheme.fontFamily.sans],
      sans: ["Charter", ...defaultTheme.fontFamily.sans],
    },
    colors: {
      ...colors,
      white: "white",
      black: "black",
      transparent: "transparent",
    },
    extend: {
      gridTemplateRows: {
        layout: "auto 1fr auto",
      },
      lineHeight: {
        normal: "1.6",
      },
      gap: {
        "global-xl": defaultTheme.spacing["8"],
        "global-lg": defaultTheme.spacing["8"],
        "global-md": defaultTheme.spacing["6"],
        "global-sm": defaultTheme.spacing["6"],
        global: defaultTheme.spacing["2"],
      },
      spacing: {
        paragraph: defaultTheme.spacing["6"],
      },
    },
  },
  variants: {
    // https://tailwindcss.com/docs/configuring-variants#default
    margin: ["children", "responsive", "DEFAULT"],
    padding: ["children", "responsive", "DEFAULT"],
    display: ["children", "responsive", "DEFAULT"],
    minWidth: ["children", "responsive", "DEFAULT"],
    whitespace: ["children", "responsive", "DEFAULT"],
  },
  plugins: [require("tailwindcss-children")],
};
