const defaultTheme = require("tailwindcss/defaultTheme");

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
    extend: {
      colors: {
        "rust-500": "#BE8D6A",
      },
    },
  },
};
