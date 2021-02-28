const plugins = [
  require("postcss-import"),
  require("tailwindcss"),
  require("postcss-nested"),
  require("autoprefixer"),
];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    require("cssnano")({
      preset: "default",
    })
  );
}

module.exports = {
  plugins,
};
