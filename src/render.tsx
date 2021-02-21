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
import { mapSeriesAsync } from "src/util/promise";
import { getProjectPath, renderTemplate } from "src/util/index";
import { PostLayout } from "src/components";
import { pages as PAGES } from "src/pages/_exports";
import * as COMPONENTS from "src/components";
import { theme as prismTheme } from "src/prismTheme";
import * as siteData from "./types/siteData";

type PageComponent = typeof PAGES[0];
type File = {
  path: string;
  content: string;
};
type SiteInput = {
  pages: PageComponent[];
  mdxFileNames: string[];
};

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
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

function getFileNameFromPath(path: string): string {
  if (path === "/") {
    return "index";
  }

  const basename = _.last(path.split("/"));
  if (!basename) {
    throw new Error(`Unexpected path: '${path}'`);
  }

  return basename;
}

async function getFilesForOneReactPage(
  page: PageComponent,
  siteData: siteData.SiteData
): Promise<File[]> {
  const pageData = await page.getData();

  const fileName = getFileNameFromPath(pageData.path).toLowerCase();
  const pageHydrateName = `${fileName}-hydrate`;
  const htmlContent = ReactDOMServer.renderToString(
    <page.Component pageData={pageData} siteData={siteData} />
  );
  const relativePathToRoot = "./";
  const html = renderTemplate(TEMPLATES.pageHtml, {
    title: getTitle(pageData.title),
    description: pageData.description,
    keywords: pageData.tags.join(", "),
    htmlContent,
    hydrateScriptPath: `./${pageHydrateName}.js`,
    relativePathToRoot,
    headAfter: "",
  });

  const pageHydrateContent = renderTemplate(TEMPLATES.pageHydrate, {
    // The convention for page components are with capitalized first letter:
    // Index.tsx, Posts.tsx etc
    pageImportPath: `../src/pages/${_.capitalize(fileName)}`,
    pagePath: pageData.path,
    relativePathToRoot,
  });

  return [
    {
      path: `${fileName}.html`,
      content: html,
    },
    {
      path: `${pageHydrateName}.tsx`,
      content: pageHydrateContent,
    },
  ];
}

async function getFilesForReactPages(
  pages: PageComponent[],
  siteData: siteData.SiteData
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
  const mdxContent = await readFileAsync(
    getProjectPath(`posts/${mdxFileName}`),
    {
      encoding: "utf8",
    }
  );
  const matterMdx = matter(mdxContent);
  return matterMdx;
}

async function getFilesForOneMdxPage(mdxFileName: string): Promise<File[]> {
  const matterMdx = await parseMdxFile(mdxFileName);
  const postData = await getPostData(mdxFileName);

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
    <PostLayout html={renderedMdxSource.renderedOutput} data={postData} />
  );
  const html = renderTemplate(TEMPLATES.pageHtml, {
    title: getTitle(postData.title),
    description: postData.description,
    keywords: postData.tags.join(","),
    htmlContent,
    hydrateScriptPath: `./${pageHydrateName}.js`,
    relativePathToRoot,
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

async function getFilesForMdxPages(mdxFileNames: string[]): Promise<File[]> {
  const files = await mapSeriesAsync(mdxFileNames, getFilesForOneMdxPage);
  return _.flatten(files);
}

async function getPostData(
  mdxFilePath: string
): Promise<siteData.PostMetadata> {
  const { data, content } = await parseMdxFile(mdxFilePath);
  const plain = remark().use(stripMarkdown).processSync(content).toString();
  const charCount = plain.replace(/\s+/, "").length;

  const validate = new Ajv({ strict: false }).compile(
    siteData.PostMetadataSchema
  );

  const postData = {
    title: data.title,
    createdAt: data.createdAt,
    slug: data.slug,
    tags: data.tags,
    description: data.description,
    path: `/posts/${data.slug}`,
    charCount,
  };

  const isValid = validate(postData);
  if (!isValid) {
    console.error(validate.errors);
    throw new Error(`Invalid data found for MDX post '${mdxFilePath}'`);
  }
  return postData;
}

async function getSiteData(input: SiteInput): Promise<siteData.SiteData> {
  const postPages = await mapSeriesAsync(input.mdxFileNames, getPostData);
  const regularPages = await mapSeriesAsync(input.pages, async (page) =>
    page.getData()
  );
  const allPages: siteData.AnyPage[] = _.flatten<siteData.AnyPage>([
    postPages.map((pageData) => ({ type: "post" as const, data: pageData })),
    regularPages.map((pageData) => ({ type: "page" as const, data: pageData })),
  ]);

  return {
    pages: allPages,
  };
}

async function writeFiles(files: File[]): Promise<void> {
  await mapSeriesAsync(files, async (file) => {
    const absPath = getProjectPath(`output/${file.path}`);
    const relativeToOutput = path.relative(getProjectPath("."), absPath);

    if (!_.startsWith(relativeToOutput, "output")) {
      throw new Error(`File path outside output directory: ${file.path}`);
    }

    await fs.promises.mkdir(path.dirname(absPath), { recursive: true });
    await writeFileAsync(relativeToOutput, file.content, { encoding: "utf8" });
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

  const files = _.flatten([
    await getFilesForReactPages(PAGES, siteData),
    await getFilesForMdxPages(mdxFileNames),
    {
      path: "site-data.json",
      content: JSON.stringify(siteData, null, 2),
    },
    {
      path: "prism-theme.css",
      content: renderTemplate(TEMPLATES.prismTheme, prismTheme),
    },
  ]);

  await writeFiles(files);
}

if (require.main === module) {
  main().catch((err) => {
    console.log(err);
    process.exit(1);
  });
}
