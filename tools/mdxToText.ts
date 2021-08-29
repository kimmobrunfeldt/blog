// Usage zx tools/mdxToText.mjs posts/1-writing-or-coding.mdx

import fs from "fs";
import remark from "remark";
import matter from "gray-matter";
import strip from "strip-markdown";
import { Node } from "unist";
import mdx from "remark-mdx";
import filter from "unist-util-filter";
import { getMarkdownTextStatistics } from "../src/generator/util/markdown";

async function parseMdxFile(filePath: string) {
  const mdxContent = await fs.promises.readFile(filePath, {
    encoding: "utf8",
  });
  const matterMdx = matter(mdxContent);
  return matterMdx;
}

async function main() {
  console.log(process.argv);
  if (!process.argv[2]) {
    console.error("No file param found");
    process.exit(2);
  }
  const { content } = await parseMdxFile(process.argv[2]);
  const plain = await remark()
    .use(mdx)
    .use(() => (tree: any) => {
      return filter(tree, (node: Node) => {
        const typesToRemove = ["import", "export", "comment", "jsx"];
        const isJsx = node.type.toLowerCase().includes("jsx");
        return !isJsx && !typesToRemove.includes(node.type);
      }) as any;
    })
    .use(() => (tree: any) => {
      //console.log(tree);
    })
    .use(strip)
    .process(content);

  console.log(plain.toString());

  const stats = await getMarkdownTextStatistics(content);
  console.error(stats);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
