import fs from "fs";
import RSS from "rss";
import { SiteData, isPostPage } from "./types/siteData";
import siteDataJson from "../output-rollup/site-data.json";
import { getProjectPath } from "./util";

const OUTPUT_PATH = getProjectPath("output/rss.xml");

async function main() {
  const siteData = siteDataJson as SiteData;
  const posts = siteData.pages.filter(isPostPage).map((page) => page.data);

  const feed = new RSS({
    title: "kimmo.blog",
    description:
      "This blog is about web-focused software development with a hint of design, business, and neat little things.",
    feed_url: "https://kimmo.blog/rss.xml",
    site_url: "https://kimmo.blog",
    managingEditor: "Kimmo Brunfeldt",
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `https://kimmo.blog${post.path}`,
      guid: post.path,
      categories: post.tags,
      date: post.createdAt,
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
