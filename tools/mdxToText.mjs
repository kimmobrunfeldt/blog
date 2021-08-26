// Usage zx tools/mdxToText.mjs posts/1-writing-or-coding.mdx

import fs from "fs";
import { remark } from "remark";
import matter from "gray-matter";
import strip from "strip-markdown";
import mdx from "remark-mdx";
import { filter } from "unist-util-filter";

async function parseMdxFile(filePath) {
  const mdxContent = await fs.promises.readFile(filePath, {
    encoding: "utf8",
  });
  const matterMdx = matter(mdxContent);
  return matterMdx;
}

const { content } = await parseMdxFile(process.argv[3]);

const plain = await remark()
  .use(mdx)
  .use(() => (tree) => {
    return filter(tree, (node) => {
      const typesToRemove = ["import", "export", "comment", "jsx"];
      const isJsx = node.type.toLowerCase().includes("jsx");
      return !isJsx && !typesToRemove.includes(node.type);
    });
  })
  .use(() => (tree) => {
    //console.log(tree);
  })
  .use(strip)
  .process(content);

console.log(plain.toString());
