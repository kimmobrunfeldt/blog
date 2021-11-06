import remark from "remark";
import { Node } from "unist";
import mdastToString from "mdast-util-to-string";
import remarkMdx from "remark-mdx";
import Slugger from "github-slugger";
import hasProperty from "hast-util-has-property";
import headingRank from "hast-util-heading-rank";
import toString from "hast-util-to-string";
import visit from "unist-util-visit";
import { Header } from "src/types/siteData";

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

const slugs = new Slugger();

export async function getMarkdownHeaders(mdContent: string) {
  // Keep in sync with rehypeSlug
  slugs.reset();

  const headers: Header[] = [];

  function visitor(node: Node) {
    if (node.type !== "heading") {
      return;
    }

    const text = mdastToString(node);
    headers.push({
      level: node.depth as number,
      text,
      id: slugs.slug(text.trim()),
    });
  }

  await remark()
    .use(remarkMdx)
    .use(() => (tree: any) => {
      // https://github.com/syntax-tree/mdast
      visit(tree, visitor);
    })
    .process(mdContent);

  return headers;
}

export function rehypeSlug() {
  return (tree: any) => {
    slugs.reset();

    visit(tree, "element", (node: any) => {
      if (headingRank(node) && node.properties && !hasProperty(node, "id")) {
        node.properties.id = slugs.slug(toString(node).trim());
      }
    });
  };
}
