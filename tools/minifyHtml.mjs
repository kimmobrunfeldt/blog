import glob from "glob";
import { promisify } from "util";

const globAsync = promisify(glob);

const files = await globAsync("output/*.html");

for (let i = 0; i < files.length; ++i) {
  const file = files[i];
  const flags = [
    "--collapse-whitespace",
    "--remove-comments",
    "--remove-optional-tags",
    "--remove-redundant-attributes",
    "--remove-tag-whitespace",
    "--use-short-doctype",
  ];

  await $`html-minifier ${file} -o ${file} ${flags.join(" ")}`;
}
