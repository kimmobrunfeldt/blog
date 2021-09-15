import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import multiInput from "rollup-plugin-multi-input";
import progress from "rollup-plugin-progress";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { string } from "rollup-plugin-string";

// Rollup is quite specific of the directory structure
// For example ".tmp-output-rollup" would break the typescript support
const INPUT = ["output-tmp-rollup/**/*.tsx", "output-tmp-rollup/**/*.ts"];

const plugins = [
  multiInput({
    relative: "output-tmp-rollup/",
  }),
  progress(),
  replace({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  }),
  nodeResolve({
    browser: true,
    dedupe: ["react", "react-dom", "lodash"],
    rootDir: __dirname,
  }),
  string({
    // Required to be specified
    include: "**/*.txt",
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig: "tsconfig.json",
    sourceMap: process.env.NODE_ENV !== "production",
    inlineSources: process.env.NODE_ENV !== "production",
    inlineSourceMap: process.env.NODE_ENV !== "production",
  }),
];

if (process.env.NODE_ENV === "production") {
  plugins.push(terser());
}

export default {
  input: INPUT,
  watch: {
    include: INPUT,
    exclude: "**/*.js",
  },
  output: {
    dir: "output",
    format: "esm",
    chunkFileNames: "[name].js",
    sourcemap: process.env.NODE_ENV !== "production" ? "inline" : undefined,
  },
  manualChunks(id) {
    if (id.includes("node_modules/")) {
      const [_head, tail] = id.split("node_modules/");
      const pathComponents = tail.split("/");
      let depName = pathComponents[0];

      if (tail[0] === "@") {
        depName = `${pathComponents[0]}/${pathComponents[1]}`;
      }

      if (depName === "react" || depName === "react-dom") {
        // To fix error where react-dom was loaded before react
        return "node_modules/react-and-dom";
      }

      return `node_modules/${depName}`;
    }
  },
  plugins,
};
