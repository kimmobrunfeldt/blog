import fs from "fs";
import { promisify } from "util";
import RSS from "rss";
import glob from "glob";
import { isPostPage } from "src/types/siteData";
import { getSiteData } from "src/render";
import { getProjectPath } from "src/util";

const globAsync = promisify(glob);

const OUTPUT_PATH = getProjectPath("output/rss.xml");

async function main() {
  const mdxFileNames = await globAsync("*.mdx", {
    cwd: getProjectPath("posts/"),
  });
  const siteData = await getSiteData({
    pages: [],
    mdxFileNames,
  });

  const posts = siteData.pages.filter(isPostPage).map((page) => page.data);

  const feed = new RSS({
    title: "kimmo.blog",
    description:
      "This blog is about web-focused software development with a hint of design, business, and neat little things.",
    feed_url: "https://kimmo.blog/rss.xml",
    site_url: "https://kimmo.blog",
    // managingEditor: "me@kimmo.blog",
    custom_namespaces: {
      content: "http://purl.org/rss/1.0/modules/content/",
    },
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `https://kimmo.blog${post.path}`,
      guid: post.path,
      categories: post.tags,
      date: post.createdAt,
      custom_elements: [
        {
          "content:encoded": {
            _cdata: post.html,
          },
        },
      ],
    });
  });

  await fs.promises.writeFile(OUTPUT_PATH, feed.xml(), { encoding: "utf8" });
}

if (require.main === module) {
  main().catch((err) => {
    console.log(err);
    process.exit(1);
  });
}
