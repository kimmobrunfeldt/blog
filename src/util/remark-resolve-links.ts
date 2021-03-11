import visit from "unist-util-visit";

export function resolveLinks() {
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

      if (linkUrl.startsWith("/")) {
        node.url = `https://kimmo.blog${node.url}`;
      }
    });
  };
}
