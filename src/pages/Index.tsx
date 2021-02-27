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
  Header,
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
      <Header siteData={props.siteData} pageData={props.pageData} />
      <main className={`grid grid-cols-12 gap-global`}>
        <div className="md:col-start-3 col-span-4">
          <ContentWrapper>
            <H>Welcome</H>
            <HLevel>
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
              <div className="pt-20" />
              <H
                className="mt-0 mb-0 pb-1 border-gray-2 border-b font-sans"
                color="gray-5"
                visualLevel={6}
              >
                Latest post
              </H>
              <div className="pt-7" />
              <PostSummary post={getLatestPost(props.siteData)} />
              <div className="pt-16" />
              <Link href="/posts" type="button">
                See all posts
              </Link>
            </HLevel>
          </ContentWrapper>
        </div>
        <div className="col-span-4 -mt-10">
          <FloatingProfilePicture className="-right-14" />
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
