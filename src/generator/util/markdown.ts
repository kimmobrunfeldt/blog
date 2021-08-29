import remark from "remark";
import { Node } from "unist";
import mdastToString from "mdast-util-to-string";
import remarkMdx from "remark-mdx";

const READING_WORDS_PER_MINUTE = 200;

function countText(text: string) {
  const char = text.replace(/\s+/, "").length;
  const word = text.trim().split(/\s+/).length;
  const readTimeMin = word / READING_WORDS_PER_MINUTE;

  return {
    char,
    word,
    readTimeMin,
  };
}

export async function getMarkdownTextStatistics(mdContent: string) {
  let charCount = 0;
  let wordCount = 0;
  let readTimeMin = 0;

  function visitor(node: Node) {
    const text = mdastToString(node);
    const counts = countText(text);
    charCount += counts.char;
    wordCount += counts.word;

    if (node.type === "code") {
      readTimeMin += counts.readTimeMin * 1.5;
    } else if (
      node.type === "image" ||
      (node.type === "mdxJsxFlowElement" && node.name === "Image")
    ) {
      readTimeMin += 0.3;
    } else if (node.type === "mdxJsxFlowElement" && node.name === "Presentic") {
      readTimeMin += 0.5;
    } else if (node.type === "mdxJsxFlowElement" && node.name === "Video") {
      readTimeMin += 0.5;
    } else {
      readTimeMin += counts.readTimeMin;
    }
  }

  await remark()
    .use(remarkMdx)
    .use(() => (tree: any) => {
      // https://github.com/syntax-tree/mdast
      tree.children.forEach(visitor);
      // console.log(JSON.stringify(tree, null, 2));
    })
    .process(mdContent);

  return {
    charCount,
    wordCount,
    readTimeMin,
  };
}
