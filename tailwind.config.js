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

const makeShadow = (name, rgb) => {
  let obj = {};

  obj[name + "-xs"] = `0 0 0 1px rgba(${rgb}, 0.05)`;
  obj[name + "-xs"] = `0 0 0 1px rgba(${rgb}, 0.05)`;
  obj[name + "-sm"] = `0 1px 2px 0 rgba(${rgb}, 0.05)`;
  obj[name] = `0 1px 3px 0 rgba(${rgb}, 0.1), 0 1px 2px 0 rgba(${rgb}, 0.06)`;
  obj[
    name + "-md"
  ] = `0 4px 6px -1px rgba(${rgb}, 0.1), 0 2px 4px -1px rgba(${rgb}, 0.06)`;
  obj[
    name + "-lg"
  ] = `0 10px 15px -3px rgba(${rgb}, 0.1), 0 4px 6px -2px rgba(${rgb}, 0.05)`;
  obj[
    name + "-xl"
  ] = `0 20px 25px -5px rgba(${rgb}, 0.1), 0 10px 10px -5px rgba(${rgb}, 0.04)`;
  obj[name + "-2xl"] = `0 25px 50px -12px rgba(${rgb}, 0.25)`;
  obj[name + "-inner"] = `inset 0 2px 4px 0 rgba(${rgb}, 0.06)`;
  return obj;
};

module.exports = {
  mode: "jit",
  important: true,
  purge: ["./src/**/*.{js,jsx,ts,tsx,html,template}", "./posts/**/*.mdx"],
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
        paragraph: defaultTheme.spacing["5"],
      },
      boxShadow: {
        ...makeShadow("white", "255, 255, 255"),
      },
    },
  },
  plugins: [require("tailwindcss-children")],
};
