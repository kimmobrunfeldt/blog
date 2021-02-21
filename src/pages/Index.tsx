import React from "react";
import { isPostPage, PageMetadata, SiteData } from "src/types/siteData";
import { H, Level, P, Link, Header, Footer, PostSummary } from "src/components";
import * as twGlobals from "src/twGlobals";

type Props = {
  siteData: SiteData;
  pageData: PageMetadata;
};

function Index(props: Props): JSX.Element {
  const postPages = props.siteData.pages.filter(isPostPage);
  return (
    <div className={`grid grid-rows-layout min-h-full ${twGlobals.gridGap}`}>
      <Header currentPath={props.pageData.path} />
      <main className={`grid grid-cols-12 ${twGlobals.gridGap}`}>
        <div className="col-start-3 col-span-8">
          <H>kimmo.blog</H>
          <Level>
            <H>Introduction</H>
            <div>
              <P>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn't anything embarrassing
                hidden in the middle of text. All the Lorem Ipsum generators on
                the Internet tend to repeat predefined chunks as necessary,
                making this the first true generator on the Internet. It uses a
                dictionary of over 200 Latin words, combined with a handful of
                model sentence structures, to generate Lorem Ipsum which looks
                reasonable. The generated Lorem Ipsum is therefore always free
                from repetition, injected humour, or non-characteristic words
                etc.
              </P>
            </div>

            <H>Posts</H>
            <ul>
              {postPages.map((page) => {
                return (
                  <li className="mt-8" key={page.data.path}>
                    <PostSummary data={page.data} />
                  </li>
                );
              })}
            </ul>
          </Level>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getData(): Promise<PageMetadata> {
  return {
    title: "Index",
    path: "/",
    tags: ["blog", "tech"],
    description: "Welcome to my blog.",
  };
}

export default Index;
