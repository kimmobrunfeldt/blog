import React from "react";
import {
  isPostPage,
  PageMetadata,
  PostMetadata,
  SiteData,
} from "src/types/siteData";
import take from "lodash/take";
import { H } from "src/components/H";
import { P } from "src/components/P";
import { NavBar } from "src/components/NavBar";
import { Footer } from "src/components/Footer";
import { FloatingProfilePicture } from "src/components/FloatingProfilePicture";
import { Link } from "src/components/Link";
import { PostSummary } from "src/components/PostSummary";
import { ButtonLink } from "src/components/ButtonLink";
import { ContentWrapper } from "src/components/ContentWrapper";
import * as twGlobals from "src/twGlobals";

type Props = {
  siteData: SiteData;
  pageData: PageMetadata;
};

function takeLatestPosts(siteData: SiteData, n: number): PostMetadata[] {
  return take(
    siteData.pages.filter(isPostPage).map((p) => p.data),
    n
  ).reverse();
}

function Index(props: Props): JSX.Element {
  return (
    <div className={`grid grid-rows-layout min-h-full ${twGlobals.gap}`}>
      <NavBar siteData={props.siteData} pageData={props.pageData} />
      <main
        className={`grid grid-rows-auto grid-cols-12 ${twGlobals.gap} gap-y-0`}
      >
        <div className="col-span-12 sm:col-start-2 sm:col-span-10 lg:row-start-1 lg:col-start-2 lg:col-span-5 xl:col-start-3 xl:col-span-4">
          <ContentWrapper>
            <H>Welcome</H>

            <P>
              This blog is about web-focused software development with a hint of
              design, business, and tiny perfect details.
            </P>
            <P>
              I’m Kimmo and I’ve been in the industry for nearly ten years:
              consulting enterprises, doing product development in different
              startups, and managing a{" "}
              <Link href="https://alvarcarto.com">webshop</Link> I co-founded.
            </P>

            <P>Hope you enjoy!</P>
          </ContentWrapper>
        </div>

        <div className="relative overflow-hidden col-span-12 lg:row-start-1 lg:col-start-6 lg:col-span-7 lg:-mt-10 xl:-col-start-5 xl:col-span-5">
          <FloatingProfilePicture className="load-fadein" />
        </div>

        <div className="col-span-12 sm:col-start-2 sm:col-span-10 xl:col-start-3 xl:col-span-6 lg:mt-8 xl:-mt-6">
          <ContentWrapper>
            <H
              className="mt-0 mb-0 pb-1 border-gray-2 dark:border-gray-8 border-b"
              color="text-gray-5"
              weight="font-bold"
              visualLevel={6}
            >
              Latest posts
            </H>
          </ContentWrapper>
        </div>

        <div className="col-span-12 sm:col-start-2 sm:col-span-10 xl:col-start-3 xl:col-span-6">
          <ContentWrapper className="pt-7">
            <div className="space-y-8">
              {takeLatestPosts(props.siteData, 3).map((post) => (
                <PostSummary key={post.slug} post={post} />
              ))}
            </div>
            <div className="pt-12 flex justify-center lg:pl-11 lg:justify-start">
              <ButtonLink href="/posts">See all posts</ButtonLink>
            </div>
          </ContentWrapper>
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
      "Blog about web-focused software development with a hint of design, business, and tiny perfect details. Welcome.",
  };
}

export default Index;
