import React from "react";
import { PageMetadata, SiteData } from "src/types/siteData";
import { H } from "src/components/H";
import { P } from "src/components/P";
import { NavBar } from "src/components/NavBar";
import { Footer } from "src/components/Footer";
import { Link } from "src/components/Link";
import { ContentWrapper } from "src/components/ContentWrapper";
import * as twGlobals from "src/twGlobals";
import { SubscribeEnvelope } from "src/components/SubscribeEnvelope";

type Props = {
  siteData: SiteData;
  pageData: PageMetadata;
};

function NotFound404(props: Props): JSX.Element {
  return (
    <div className={`grid grid-rows-layout min-h-full ${twGlobals.gap}`}>
      <NavBar siteData={props.siteData} pageData={props.pageData} />
      <main
        className={`grid grid-rows-auto grid-cols-12 ${twGlobals.gap} gap-y-0`}
      >
        <div className="col-span-12 sm:col-start-2 sm:col-span-10 lg:row-start-1 lg:col-start-2 lg:col-span-5 xl:col-start-3 xl:col-span-4">
          <ContentWrapper>
            <H>Page not found</H>

            <P>Unfortunately the page you were looking for was not found.</P>

            <P>
              If you navigated here via an external link that should work,
              please contact me via{" "}
              <Link href="https://twitter.com/kimmobrunfeldt">Twitter</Link>.
              One of my goals for the blog is to keep the pages alive around as
              long as possible.
            </P>
          </ContentWrapper>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getData(): Promise<PageMetadata> {
  return {
    title: "Not found",
    path: "/404",
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

export default NotFound404;
