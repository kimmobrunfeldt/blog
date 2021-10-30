import path from "path";
import glob from "glob";
import { promisify } from "util";

const globAsync = promisify(glob);

const files = await globAsync("output/*.pcss");

for (let i = 0; i < files.length; ++i) {
  const file = files[i];
  const dirName = path.dirname(file);
  const withoutExt = path.basename(file, path.extname(file));
  const basePath = path.join(dirName, withoutExt);

  await $`NODE_ENV=production postcss "${basePath}.pcss" -o "${basePath}.css" --verbose`;
  await $`rm -f "${basePath}.pcss"`;
}
