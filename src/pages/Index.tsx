import React from "react";
import {
  isPostPage,
  PageMetadata,
  PostMetadata,
  SiteData,
} from "src/types/siteData";
import {
  H,
  P,
  NavBar,
  Footer,
  HLevel,
  FloatingProfilePicture,
  Link,
  PostSummary,
} from "src/components";
import { ContentWrapper } from "src/components/ContentWrapper";

type Props = {
  siteData: SiteData;
  pageData: PageMetadata;
};

function getLatestPost(siteData: SiteData): PostMetadata {
  return siteData.pages.filter(isPostPage).map((p) => p.data)[0];
}

function Index(props: Props): JSX.Element {
  return (
    <div className={`grid grid-rows-layout min-h-full gap-global`}>
      <NavBar siteData={props.siteData} pageData={props.pageData} />
      <main
        className={`grid grid-rows-post-sm grid-cols-12 gap-global gap-y-0`}
      >
        <div className="col-span-12 sm:col-start-2 sm:col-span-10 xl:col-start-3 xl:col-span-8">
          <ContentWrapper className="md:grid md:grid-cols-12">
            <div className="col-span-12 md:col-span-5">
              <H>Welcome</H>

              <P>
                This blog is about web-focused software development with a hint
                of design, business, and neat little things.
              </P>
              <P>
                I’m Kimmo and I’ve been in the industry for nearly ten years:
                consulting enterprises, doing product development in different
                startups, and managing a{" "}
                <Link href="https://alvarcarto.com">webshop</Link> I co-founded.
              </P>

              <P>Hope you enjoy!</P>
            </div>

            <div className="col-span-12 md:col-span-7 lg:-mt-10 relative">
              <FloatingProfilePicture className="-right-14 fadein" />
            </div>
          </ContentWrapper>
        </div>

        <div className="grid row-start-2 grid-cols-12 gap-global col-span-12">
          <div className="col-span-12 sm:col-start-2 sm:col-span-10 xl:col-start-3 xl:col-span-8 pt-20">
            <ContentWrapper>
              <H
                className="mt-0 mb-0 pb-1 border-gray-2 border-b font-sans"
                color="gray-5"
                visualLevel={6}
              >
                Latest post
              </H>
            </ContentWrapper>
          </div>
        </div>
        <div className="grid row-start-3 grid-cols-12 gap-global col-span-12 z-10 bg-white">
          <div className="col-span-12 sm:col-start-2 sm:col-span-10 xl:col-start-3 xl:col-span-8">
            <ContentWrapper className="pt-7">
              <PostSummary post={getLatestPost(props.siteData)} />
              <div className="pt-12 flex justify-center lg:pl-11 lg:justify-start">
                <Link href="/posts" type="button">
                  See all posts
                </Link>
              </div>
            </ContentWrapper>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getData(): Promise<PageMetadata> {
  return {
    title: "Welcome",
    path: "/",
    tags: [
      "blog",
      "tech",
      "about",
      "typescript",
      "react",
      "frontend",
      "software development",
    ],
    description:
      "Welcome to my blog. This blog is about web-focused software development with a hint of design, business, and neat little things.",
  };
}

export default Index;
