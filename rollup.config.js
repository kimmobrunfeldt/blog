import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import multiInput from "rollup-plugin-multi-input";
import json from "@rollup/plugin-json";
import { string } from "rollup-plugin-string";

export default {
  input: ["output/**/*.tsx", "output/**/*.ts"],
  output: {
    dir: "output/",
    format: "esm",
  },
  manualChunks(id) {
    console.log("ID", id);
    if (id.includes("node_modules")) {
      return "vendor";
    }
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    nodeResolve({
      browser: true,
      dedupe: ["react", "react-dom", "lodash"],
      rootDir: __dirname,
    }),
    {
      transform(code, id) {
        console.log(id);
        //console.log(code);
        // not returning anything, so doesn't affect bundle
      },
    },
    string({
      // Required to be specified
      include: "**/*.txt",
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: "tsconfig.json",
    }),
    multiInput({
      relative: "output/",
    }),
  ],
};
