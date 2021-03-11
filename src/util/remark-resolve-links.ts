import visit from "unist-util-visit";

export function resolveLinks() {
  return (tree: any) => {
    visit(tree, ["link", "image"], (node) => {
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
