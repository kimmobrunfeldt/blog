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
    // https://github.com/FullHuman/purgecss/blob/5314e41edf328e2ad2639549e1587b82a964a42e/docs/configuration.md
    options: {
      // for whitelisting patterns, regex or exact string
      safelist: [],
    },
  },
  darkMode: "media",
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
        post: "auto auto",
        "post-sm": "auto auto auto",
      },
      lineHeight: {
        normal: "1.6",
      },
      gap: {
        global: defaultTheme.spacing["6"],
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
