import visit from "unist-util-visit";

type Options = {
  currentPath?: string;
};

export function resolveLinks(opts: Options = { currentPath: "/" }) {
  return (tree: any) => {
    // Visit all nodes that have .url attribute
    // https://github.com/syntax-tree/mdast
    visit(tree, ["link", "image", "definition"], (node) => {
      if (!node.url) {
        return;
      }
      const linkUrl = node.url as string;

      if (linkUrl.startsWith("http") || linkUrl.startsWith("//")) {
        return;
      }

      node.url = new URL(
        linkUrl,
        `https://kimmo.blog${opts.currentPath}`
      ).toString();
    });
  };
}
