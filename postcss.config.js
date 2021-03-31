const plugins = [
  require("postcss-import"),
  require("@tailwindcss/jit"),
  require("postcss-nested"),
  require("autoprefixer"),
];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    require("cssnano")({
      preset: [
        "default",
        {
          // To fix bug where one rule was removed from ChatDiscussion.css
          mergeRules: false,
        },
      ],
    })
  );
}

module.exports = {
  plugins,
};
