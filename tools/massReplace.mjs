// This used to be a sed command, but the char escaping didn't work on macOS
// like it used to work with Linux

import arg from "arg";
import glob from "glob";
import { promisify } from "util";

const globAsync = promisify(glob);

const args = arg({
  "--find": String,
  "--replace": String,
});

if (args._.length !== 2 || !args["--find"] || !args["--replace"]) {
  console.log(
    "Usage: <script.js> 'file/**/pattern*.js' --find <regex> --replace <text>"
  );
  process.exit(2);
}

const files = await globAsync(args._[1]);

for (let i = 0; i < files.length; ++i) {
  const file = files[i];
  const content = await fs.promises.readFile(file, { encoding: "utf-8" });
  const newContent = content.replace(
    new RegExp(args["--find"], "g"),
    args["--replace"]
  );
  await fs.promises.writeFile(file, newContent, { encoding: "utf-8" });
}
