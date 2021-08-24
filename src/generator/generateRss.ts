import fs from "fs";
import { promisify } from "util";
import RSS from "rss";
import glob from "glob";
import { isPostPage } from "src/types/siteData";
import { getSiteData } from "src/generator/render";
import { getProjectPath } from "src/generator/util";

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
      "Blog about web-focused software development with a hint of design, business, and tiny perfect details.",
    feed_url: "https://kimmo.blog/rss.xml",
    site_url: "https://kimmo.blog",
    image_url: "https://kimmo.blog/icon-square.png",
    custom_namespaces: {
      content: "http://purl.org/rss/1.0/modules/content/",
    },
  });

  posts.forEach((post) => {
    const coverImageUrl = post.coverImage.startsWith("http")
      ? post.coverImage
      : `https://kimmo.blog${post.coverImage}`;

    feed.item({
      title: post.title,
      description: post.description,
      url: `https://kimmo.blog${post.path}`,
      guid: post.path,
      categories: post.tags,
      date: post.createdAt,
      enclosure: {
        url: coverImageUrl,
        type: "image/jpeg",
      },
      custom_elements: [
        {
          "content:encoded": {
            _cdata: post.html,
          },
        },
        {
          "content:media": {
            _attr: {
              url: coverImageUrl,
              type: "image/jpeg",
            },
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
