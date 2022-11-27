import path from "path";
import fs from "fs";
import { promisify } from "util";
import React from "react";
import remarkAbbr from "remark-abbr";
import ReactDOMServer from "react-dom/server";
import glob from "glob";
import matter, { GrayMatterFile } from "gray-matter";
import _ from "lodash";
import Ajv from "ajv";
import { serialize } from "next-mdx-remote/serialize";
import { mapSeriesAsync } from "src/generator/util/promise";
import {
  getProjectPath,
  renderTemplate,
  roundToNearest,
} from "src/generator/util/index";
import { PostLayout } from "src/components/PostLayout";
import { pages as PAGES } from "src/pages/_exports";
import {
  theme as prismTheme,
  darkTheme as prismDarkTheme,
} from "src/generator/prismTheme";
import {
  SiteData,
  PostMetadata,
  AnyPage,
  PostMetadataSchema,
} from "src/types/siteData";
import { resolveLinks } from "src/generator/util/remarkResolveLinks";
import { Root } from "src/components/Root";
import {
  getMarkdownHeaders,
  getMarkdownTextStatistics,
  rehypeSlug,
} from "./util/markdown";
import { MDXRemote } from "src/components/MDXRemote";
import { isPostPage } from "src/util/site";

type PageComponent = typeof PAGES[0];
type File = {
  path: string;
  content: string;
};
type SiteInput = {
  pages: PageComponent[];
  mdxFileNames: string[];
};

const globAsync = promisify(glob);

const TEMPLATES = {
  pageHtml: fs.readFileSync(
    getProjectPath("src/templates/page.html.template"),
    {
      encoding: "utf8",
    }
  ),
  pageHydrate: fs.readFileSync(
    getProjectPath("src/templates/pageHydrate.tsx.template"),
    {
      encoding: "utf8",
    }
  ),
  post: fs.readFileSync(getProjectPath("src/templates/PostPage.tsx.template"), {
    encoding: "utf8",
  }),
  prismTheme: fs.readFileSync(
    getProjectPath("src/templates/prism-theme.css.template"),
    {
      encoding: "utf8",
    }
  ),
};

function getTitle(pageTitle: string): string {
  return `${pageTitle} - kimmo.blog`;
}

//  "/" -> ""
//  "/posts/" -> "posts"
//  "/posts/something/" -> "posts/something"
function getStaticFileDir(path: string): string {
  return _.trimStart(_.trimEnd(path, "/"), "/");
}

//  "/" -> "."
//  "/posts/" -> ".."
//  "/posts/something/" -> "../.."
function getRelativePathToRoot(fileDir: string): string {
  if (fileDir === "") {
    return ".";
  }

  const slashCount = _.sumBy(fileDir, (char) => (char === "/" ? 1 : 0));
  const pathToRoot = _.repeat("../", slashCount + 1);
  return _.trimEnd(pathToRoot, "/");
}

//  "", "index.html" -> "index.html"
//  "posts", "index.html" -> "posts/index.html"
function getRelativePathFromRoot(
  fileDir: string,
  relativePath: string
): string {
  if (fileDir === "") {
    return relativePath;
  }

  return `${fileDir}/${relativePath}`;
}

async function getFilesForOneReactPage(
  page: PageComponent,
  siteData: SiteData
): Promise<File[]> {
  const pageData = await page.getData();

  const isRootFile = pageData.path.endsWith(".html");
  const fileDir = isRootFile
    ? ""
    : getStaticFileDir(pageData.path.toLowerCase());

  const rootFileName = path.basename(
    _.last(pageData.path.split("/"))!,
    ".html"
  );
  const pageHydratePath = isRootFile
    ? getRelativePathFromRoot("", `${rootFileName}-hydrate`)
    : getRelativePathFromRoot(fileDir, "hydrate");
  const htmlContent = ReactDOMServer.renderToString(
    <Root>
      <page.Component pageData={pageData} siteData={siteData} />
    </Root>
  );
  const relativePathToRoot = `${getRelativePathToRoot(fileDir)}/`;
  const is404 = pageData.path.includes("/404");
  const html = renderTemplate(TEMPLATES.pageHtml, {
    title: getTitle(pageData.title),
    description: pageData.description,
    keywords: pageData.tags.join(", "),
    htmlContent,
    hydrateScriptPath:
      // Set hydrate path as specific when dealing with 404 page.
      // This is necessary since 404 page might be returned from any path
      is404 ? "/404-hydrate.js" : "./hydrate.js",
    // In case 404 page, point relative path to root
    relativePathToRoot: is404 ? "/" : relativePathToRoot,
    ogTitle: pageData.title,
    ogUrl: `https://kimmo.blog${pageData.path}`,
    ogImage: "https://kimmo.blog/social-cover.png",
    headAfter: "",
  });

  const pageHydrateContent = renderTemplate(TEMPLATES.pageHydrate, {
    // The convention for page components are with capitalized first letter:
    // Index.tsx, Posts.tsx etc
    pageImportPath: `src/pages/${page.fileName}`,
    pagePath: pageData.path,
    relativePathToRoot,
  });

  // Allow setting page path to e.g. 404.html and it'll be saved at root
  if (isRootFile) {
    return [
      {
        path: getRelativePathFromRoot("", _.last(pageData.path.split("/"))!),
        content: html,
      },
      {
        path: `${pageHydratePath}.tsx`,
        content: pageHydrateContent,
      },
    ];
  }

  return [
    {
      path: getRelativePathFromRoot(fileDir, "index.html"),
      content: html,
    },
    {
      path: `${pageHydratePath}.tsx`,
      content: pageHydrateContent,
    },
  ];
}

async function getFilesForReactPages(
  pages: PageComponent[],
  siteData: SiteData
): Promise<File[]> {
  return _.flatten(
    await mapSeriesAsync(pages, (page) =>
      getFilesForOneReactPage(page, siteData)
    )
  );
}

async function parseMdxFile(
  mdxFileName: string
): Promise<GrayMatterFile<string>> {
  const mdxContent = await fs.promises.readFile(
    getProjectPath(`posts/${mdxFileName}`),
    {
      encoding: "utf8",
    }
  );
  const matterMdx = matter(mdxContent);
  return matterMdx;
}

async function getFilesForOneMdxPage(
  mdxFileName: string,
  siteData: SiteData
): Promise<File[]> {
  const matterMdx = await parseMdxFile(mdxFileName);
  const partialPostData = await getPostData(mdxFileName);
  const orderNumber = siteData.pages
    .filter(isPostPage)
    // Use non-null assertion since the page should be found with path
    .find((page) => page.data.path === partialPostData.path)!.data.orderNumber;
  const postData = { ...partialPostData, orderNumber } as PostMetadata;

  const renderedMdxSource = await serialize(matterMdx.content, {
    mdxOptions: {
      remarkPlugins: [[remarkAbbr, {}]],
      rehypePlugins: [[rehypeSlug, {}]],
    },
  });
  const relativePathToRoot = "../../";
  const postName = path.basename(mdxFileName, ".mdx").toLowerCase();
  const postPageTsxContent = renderTemplate(TEMPLATES.post, {
    compiledSourcePath: `./compiledSource.txt`,
    relativePathToRoot,
    slug: postData.slug,
  });

  const pageHydrateName = `${postName}-post-hydrate`;
  const htmlContent = ReactDOMServer.renderToString(
    <Root>
      <PostLayout siteData={siteData} data={postData}>
        <MDXRemote compiledSource={renderedMdxSource.compiledSource} />
      </PostLayout>
    </Root>
  );
  const html = renderTemplate(TEMPLATES.pageHtml, {
    title: getTitle(postData.title),
    description: postData.description,
    keywords: postData.tags.join(","),
    htmlContent,
    hydrateScriptPath: `./${pageHydrateName}.js`,
    relativePathToRoot,
    ogTitle: postData.title,
    ogUrl: `https://kimmo.blog${postData.path}`,
    ogImage: postData.coverImage.startsWith("http")
      ? postData.coverImage
      : `https://kimmo.blog${postData.coverImage}`,
    headAfter: `<link rel="stylesheet" href="${relativePathToRoot}prism-theme.css" />`,
  });

  const postFileName = `${postName}-post`;
  const pageHydrateContent = renderTemplate(TEMPLATES.pageHydrate, {
    pageImportPath: `./${postFileName}`,
    pagePath: postData.path,
    relativePathToRoot,
  });

  return [
    {
      path: `posts/${matterMdx.data.slug}/compiledSource.txt`,
      content: renderedMdxSource.compiledSource,
    },
    {
      path: `posts/${matterMdx.data.slug}/${postFileName}.tsx`,
      content: postPageTsxContent,
    },
    {
      path: `posts/${matterMdx.data.slug}/${pageHydrateName}.tsx`,
      content: pageHydrateContent,
    },
    {
      path: `posts/${matterMdx.data.slug}/index.html`,
      content: html,
    },
  ];
}

async function getFilesForMdxPages(
  mdxFileNames: string[],
  siteData: SiteData
): Promise<File[]> {
  const files = await mapSeriesAsync(mdxFileNames, (filePath) =>
    getFilesForOneMdxPage(filePath, siteData)
  );
  return _.flatten(files);
}

async function getPostData(
  mdxFilePath: string
): Promise<Omit<PostMetadata, "orderNumber">> {
  const { data, content } = await parseMdxFile(mdxFilePath);
  const stats = await getMarkdownTextStatistics(content);
  const postPath = `/posts/${data.slug}/`;

  const renderedMdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        [remarkAbbr, {}],
        [resolveLinks, { currentPath: postPath }],
      ],
      rehypePlugins: [[rehypeSlug, {}]],
    },
  });

  const htmlContent = ReactDOMServer.renderToString(
    <MDXRemote compiledSource={renderedMdxSource.compiledSource} />
  );

  const validate = new Ajv({ strict: false }).compile(PostMetadataSchema);

  const postData = {
    layout: data.layout ?? "regular",
    presenticSource: data.presenticSource,
    title: data.title,
    createdAt: data.createdAt,
    coverImage: data.coverImage,
    slug: data.slug,
    tags: data.tags,
    showToc: data.showToc,
    description: data.description,
    preview: data.preview,
    path: postPath,
    charCount: stats.charCount,
    wordCount: roundToNearest(stats.wordCount, 10),
    readTimeMin: stats.readTimeMin,
    html: htmlContent,
    headers: await getMarkdownHeaders(content),
  };

  const isValid = validate(postData);
  if (!isValid) {
    console.error(validate.errors);
    throw new Error(`Invalid data found for MDX post '${mdxFilePath}'`);
  }

  if (data.layout === "presentic" && !data.presenticSource) {
    throw new Error("presenticSource must be defined if layout is presentic");
  }

  return postData;
}

export async function getSiteData(input: SiteInput): Promise<SiteData> {
  const postPages = await mapSeriesAsync(input.mdxFileNames, getPostData);
  const regularPages = await mapSeriesAsync(input.pages, async (page) =>
    page.getData()
  );

  const sortedPostPages = _.orderBy(postPages, ["createdAt"], ["asc"]).map(
    (page, index) => ({
      ...page,
      orderNumber: index + 1,
    })
  );
  const allPages: AnyPage[] = _.flatten<AnyPage>([
    sortedPostPages.map((pageData) => ({
      type: "post" as const,
      data: pageData as PostMetadata,
    })),
    regularPages.map((pageData) => ({ type: "page" as const, data: pageData })),
  ]);

  return {
    pages: allPages,
  };
}

async function writeFiles(files: File[]): Promise<void> {
  await mapSeriesAsync(files, async (file) => {
    const ext = path.extname(file.path);
    const isForRollup = [".tsx", ".ts", ".json", ".txt"].includes(ext);
    const absPath = isForRollup
      ? getProjectPath(`output-tmp-rollup/${file.path}`)
      : getProjectPath(`output/${file.path}`);

    const relativeToOutput = path.relative(getProjectPath("."), absPath);

    if (
      !_.startsWith(relativeToOutput, "output/") &&
      !_.startsWith(relativeToOutput, "output-tmp-rollup/")
    ) {
      throw new Error(`File path outside output directory: ${file.path}`);
    }

    await fs.promises.mkdir(path.dirname(absPath), { recursive: true });
    await fs.promises.writeFile(relativeToOutput, file.content, {
      encoding: "utf8",
    });
  });
}

async function main() {
  const mdxFileNames = await globAsync("*.mdx", {
    cwd: getProjectPath("posts/"),
  });
  const siteData = await getSiteData({
    pages: PAGES,
    mdxFileNames,
  });

  const minimalPages = siteData.pages.map((page) => {
    if (!isPostPage(page)) {
      return page;
    }

    const { html, ...other } = page.data;
    return {
      ...page,
      data: other,
    };
  });

  const files = _.flatten([
    await getFilesForReactPages(PAGES, siteData),
    await getFilesForMdxPages(mdxFileNames, siteData),
    {
      path: "site-data.json",
      content: JSON.stringify({ pages: minimalPages }, null, 2),
    },
    {
      path: "prism-theme.pcss",
      content: `
        ${renderTemplate(TEMPLATES.prismTheme, prismTheme)}

        .dark {
          ${renderTemplate(TEMPLATES.prismTheme, {
            ...prismTheme,
            ...prismDarkTheme,
          })}
        }
      `,
    },
  ]);

  await writeFiles(files);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    console.error(err.stack);
    process.exit(1);
  });
}
