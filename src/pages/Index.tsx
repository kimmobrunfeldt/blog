import React from "react";
import { PageMetadata, SiteData } from "src/types/siteData";
import {
  H,
  P,
  Header,
  Footer,
  HLevel,
  FloatingProfilePicture,
  Link,
} from "src/components";

type Props = {
  siteData: SiteData;
  pageData: PageMetadata;
};

function Index(props: Props): JSX.Element {
  return (
    <div className={`grid grid-rows-layout min-h-full gap-global`}>
      <Header currentPath={props.pageData.path} />
      <main className={`grid grid-cols-12 gap-global`}>
        <div className="col-start-3 col-span-4">
          <H visualLevel={2}>Welcome</H>
          <HLevel>
            <P>
              This blog is about web-focused software development with a hint of
              design, business, and neat little things.
            </P>
            <P>
              I’m Kimmo and I’ve been doing professional software development
              for nearly ten years. My career can be roughly divided into
              <em> 5 years </em>
              of consulting medium and large enterprises, <em> 4 years </em> of
              product development in different startups, and <em> one year </em>
              developing a <Link href="https://alvarcarto.com">webshop</Link> I
              co-founded.
            </P>

            <P>Goals for the blog are:</P>

            <ul className="pl-8 list-disc mb-paragraph">
              <li className="pl-3">At least a post per month</li>
              <li className="pl-3 pt-2">
                Emphasis on legibility, beautiful typography, and minimal visual
                look
              </li>
              <li className="pl-3 pt-2">
                Build next level tooling to present coding related concepts
              </li>
            </ul>

            <P>Hope you enjoy!</P>
          </HLevel>
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
    title: "About",
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
    description: "Welcome to my blog.",
  };
}

export default Index;
