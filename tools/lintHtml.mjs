import glob from "glob";
import { promisify } from "util";

const globAsync = promisify(glob);

const files = await globAsync("output/*.html");
// Remove light house reports
const filtered = files.filter((name) => !name.endsWith("perf/index.html"));

for (let i = 0; i < filtered.length; ++i) {
  const file = filtered[i];
  await $`html-validate ${file}`;
}

try {
  await $`bash tools/link-check.sh`;
} catch (e) {
  if (e) {
    console.error("FOUND DEAD LINKS!");
    console.log("but ignoring them...");
  }
}
