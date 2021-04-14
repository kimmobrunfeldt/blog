import path from "path";
import fs from "fs";
import { promisify } from "util";
import React from "react";
import remark from "remark";
import stripMarkdown from "strip-markdown";
import ReactDOMServer from "react-dom/server";
import glob from "glob";
import matter, { GrayMatterFile } from "gray-matter";
import _ from "lodash";
import Ajv from "ajv";
import renderMdxToString from "next-mdx-remote/render-to-string";
import { components as mdxComponents } from "src/mdxComponents";
import { mapSeriesAsync } from "src/generator/util/promise";
import { getProjectPath, renderTemplate } from "src/generator/util/index";
import { PostLayout } from "src/components/PostLayout";
import { pages as PAGES } from "src/pages/_exports";
import * as COMPONENTS from "src/components";
import {
  theme as prismTheme,
  darkTheme as prismDarkTheme,
} from "src/generator/prismTheme";
import {
  SiteData,
  PostMetadata,
  AnyPage,
  isPostPage,
  PostMetadataSchema,
} from "src/types/siteData";
import { resolveLinks } from "src/generator/util/remark-resolve-links";
import { Root } from "src/components/Root";
import { trimCodeBlocks } from "./util/trim-code-blocks";

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

  const fileDir = getStaticFileDir(pageData.path.toLowerCase());
  const pageHydratePath = getRelativePathFromRoot(fileDir, "hydrate");
  const htmlContent = ReactDOMServer.renderToString(
    <Root>
      <page.Component pageData={pageData} siteData={siteData} />
    </Root>
  );
  const relativePathToRoot = `${getRelativePathToRoot(fileDir)}/`;
  const html = renderTemplate(TEMPLATES.pageHtml, {
    title: getTitle(pageData.title),
    description: pageData.description,
    keywords: pageData.tags.join(", "),
    htmlContent,
    hydrateScriptPath: "./hydrate.js",
    relativePathToRoot,
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
  const postData = { ...partialPostData, orderNumber };

  const renderedMdxSource = await renderMdxToString(matterMdx.content, {
    components: {
      ...COMPONENTS,
      ...mdxComponents,
    },
    mdxOptions: {
      remarkPlugins: [],
    },
  });
  const relativePathToRoot = "../../";
  const postName = path.basename(mdxFileName, ".mdx").toLowerCase();
  const postPageTsxContent = renderTemplate(TEMPLATES.post, {
    renderedOutputPath: `./renderedOutput.txt`,
    compiledSourcePath: `./compiledSource.txt`,
    relativePathToRoot,
    slug: postData.slug,
  });

  const pageHydrateName = `${postName}-post-hydrate`;
  const htmlContent = ReactDOMServer.renderToString(
    <PostLayout
      siteData={siteData}
      data={postData}
      html={renderedMdxSource.renderedOutput}
    />
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
      path: `posts/${matterMdx.data.slug}/renderedOutput.txt`,
      content: renderedMdxSource.renderedOutput,
    },
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
  const plain = remark().use(stripMarkdown).processSync(content).toString();

  const postPath = `/posts/${data.slug}/`;
  const renderedMdxSource = await renderMdxToString(content, {
    components: {
      ...COMPONENTS,
    },
    mdxOptions: {
      remarkPlugins: [[resolveLinks, { currentPath: postPath }]],
    },
  });
  const charCount = plain.replace(/\s+/, "").length;

  const validate = new Ajv({ strict: false }).compile(PostMetadataSchema);

  const postData = {
    title: data.title,
    createdAt: data.createdAt,
    coverImage: data.coverImage,
    slug: data.slug,
    tags: data.tags,
    description: data.description,
    path: postPath,
    charCount,
    html: renderedMdxSource.renderedOutput,
  };

  const isValid = validate(postData);
  if (!isValid) {
    console.error(validate.errors);
    throw new Error(`Invalid data found for MDX post '${mdxFilePath}'`);
  }
  return postData;
}

export async function getSiteData(input: SiteInput): Promise<SiteData> {
  const postPages = await mapSeriesAsync(input.mdxFileNames, getPostData);
  const regularPages = await mapSeriesAsync(input.pages, async (page) =>
    page.getData()
  );

  const sortedPostPages: PostMetadata[] = _.orderBy(
    postPages,
    ["createdAt"],
    ["desc"]
  ).map((page, index) => ({
    ...page,
    orderNumber: postPages.length - index,
  }));
  const allPages: AnyPage[] = _.flatten<AnyPage>([
    sortedPostPages.map((pageData) => ({
      type: "post" as const,
      data: pageData,
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
