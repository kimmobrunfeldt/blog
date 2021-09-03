import fs from "fs";
import { promisify } from "util";
import RSS from "rss";
import glob from "glob";
import { URL } from "url";
import { getSiteData } from "src/generator/render";
import { getProjectPath } from "src/generator/util";
import cheerio from "cheerio";
import { getPosts } from "src/util/site";

const globAsync = promisify(glob);

const OUTPUT_PATH = getProjectPath("output/rss.xml");

function resolveUrl(url: string, baseUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url, baseUrl);
  } catch (e) {
    return url;
  }

  if (!["https:", "http:"].includes(parsed.protocol)) {
    return url;
  }

  return parsed.toString();
}

function resolveAllLinks(html: string, baseUrl: string): string {
  const $ = cheerio.load(html);
  const elements = [
    { tag: "img", attr: "src" },
    { tag: "video", attr: "src" },
    { tag: "source", attr: "src" },
    { tag: "a", attr: "href" },
  ];

  elements.forEach((item) => {
    $(item.tag).each((i, el) => {
      const originalUrl = $(el).attr(item.attr);
      if (!originalUrl) {
        return;
      }

      $(el).attr(item.attr, resolveUrl(originalUrl, baseUrl));
    });
  });

  return $.html();
}

async function main() {
  const mdxFileNames = await globAsync("*.mdx", {
    cwd: getProjectPath("posts/"),
  });
  const siteData = await getSiteData({
    pages: [],
    mdxFileNames,
  });

  const posts = getPosts(siteData);

  const feed = new RSS({
    title: "kimmo.blog",
    description:
      "Blog about web-focused software development with a hint of business, design, and tiny perfect details.",
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

    const absolutePostUrl = `https://kimmo.blog${post.path}`;

    feed.item({
      title: post.title,
      description: post.description,
      url: absolutePostUrl,
      guid: absolutePostUrl,
      categories: post.tags,
      date: post.createdAt,
      enclosure: {
        url: coverImageUrl,
        type: "image/jpeg",
      },
      custom_elements: [
        {
          "content:encoded": {
            // The markdown elements already have absolute urls,
            // but the custom components might still use relative urls
            _cdata: resolveAllLinks(post.html, absolutePostUrl),
          },
        },
        {
          "content:media": {
            _attr: {
              url: coverImageUrl,
              type: "image/jpeg",
              medium: "image",
              "xmlns:media": "http://search.yahoo.com/mrss/",
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
