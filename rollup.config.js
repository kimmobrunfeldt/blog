import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import multiInput from "rollup-plugin-multi-input";
import progress from "rollup-plugin-progress";
import json from "@rollup/plugin-json";
import rename from "rollup-plugin-rename";
import { string } from "rollup-plugin-string";

const INPUT = ["output-rollup/**/*.tsx", "output-rollup/**/*.ts"];

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
  },
  manualChunks(id) {
    if (id.includes("node_modules/")) {
      const [_head, tail] = id.split("node_modules/");
      const pathComponents = tail.split("/");
      let depName = pathComponents[0];
      if (tail[0] === "@") {
        depName = `${pathComponents[0]}/${pathComponents[1]}`;
      }

      return `node_modules/${depName}`;
    }

    /*if (id.includes("output-rollup/")) {
      const [_head, tail] = id.split("output-rollup/");
      console.log("tail", tail.split(".")[0]);
      return tail.split(".")[0];
    }*/
  },
  plugins: [
    multiInput({
      relative: "output-rollup/",
    }),
    progress(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
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
    }),
  ],
};
