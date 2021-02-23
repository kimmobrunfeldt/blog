import fs from "fs";
import remark from "remark";
import unified from "unified";
import strip from "strip-markdown";
import remarkParse from "remark-parse";
import visit from "unist-util-visit";

function count() {
  return (tree: any) => {
    let words = 0;
    let chars = 0;

    visit(tree, "leaf", (node) => {
      console.log("node", node);
      console.log(node);
    });
  };
}

const tree = unified()
  .use(remarkParse)
  .parse(fs.readFileSync(__dirname + "/../posts/a.mdx", { encoding: "utf8" }));

const result = unified().use(count).runSync(tree);

//console.log(result);

const res = remark()
  .use(strip)
  .processSync(
    fs.readFileSync(__dirname + "/../posts/a.mdx", { encoding: "utf8" })
  );
console.log(String(res));
