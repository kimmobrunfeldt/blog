import React from "react";
import { PageMetadata, SiteData } from "src/types/siteData";
import { H, P, Header, Footer, HLevel } from "src/components";

type Props = {
  siteData: SiteData;
  pageData: PageMetadata;
};

const BlobPath = (
  <path
    d="M94.1833 316.05C81.4533 287.406 77.0299 254 80.1251 218.858C83.2203 183.716 94.0536 147.26 116.078 118.958C138.149 90.9607 171.584 71.2355 204.999 66.8334C238.241 62.3135 271.243 72.6936 302.453 84.5935C333.488 96.3755 362.684 109.372 386.671 131.152C410.658 152.932 429.563 183.309 437.236 218.649C445.081 254.106 441.521 294.41 422.664 325.139C403.807 355.867 369.608 376.717 335.872 396.511C302.31 416.424 269.165 434.977 238.193 433.919C207.221 432.861 178.248 412.074 153.14 390.08C128.158 367.897 107.041 344.507 94.1833 316.05Z"
    fill="#BE8D6A"
    fillOpacity="0.22"
  />
);

const BlobPath2 = (
  <path
    d="M271.754 28.3563C297.889 43.683 319.908 66.9881 336.783 95.542C353.658 124.096 364.976 157.689 362.712 190.862C360.243 223.825 343.986 256.368 319.291 277.153C294.802 297.939 262.288 307.177 230.391 314.316C198.7 321.454 167.832 326.703 136.346 322.504C104.861 318.305 72.7582 304.868 47.0348 281.772C21.1056 258.677 1.76162 225.924 0.115319 192.541C-1.53098 159.158 14.7262 125.356 31.1892 92.6026C47.4463 59.8496 64.1151 28.3563 89.8385 13.0296C115.562 -2.29719 150.546 -1.45736 183.06 2.32183C215.574 6.31099 245.619 13.2395 271.754 28.3563Z"
    fill="#BE8D6A"
  />
);

function Index(props: Props): JSX.Element {
  return (
    <div className={`grid grid-rows-layout min-h-full gap-global`}>
      <Header currentPath={props.pageData.path} />
      <main className={`grid grid-cols-12 gap-global`}>
        <div className="col-start-3 col-span-4">
          <H visualLevel={2}>Welcome</H>
          <HLevel>
            <P>
              This blog is about software development with a hint of design,
              business, and neat little things.
            </P>
            <P>
              I’m Kimmo and I’ve been doing software development for nearly ten
              years. My career can be roughly divided into 5 years of consulting
              medium and large enterprises, 4 years of product development in
              different startups, and one year developing a webshop I
              co-founded.
            </P>

            <P>My goals for the blog are:</P>

            <ul className="pl-8 list-disc mb-paragraph">
              <li className="pl-3 leading-relaxed">
                Write at least a post per month
              </li>
              <li className="pl-3 leading-relaxed">
                Minimize visual clutter that disturbs reading{" "}
              </li>
              <li className="pl-3 leading-relaxed">
                Have legible and beautiful typography{" "}
              </li>
              <li className="pl-3 leading-relaxed">
                Make the best writing tools for a developer blog (i.e. spend lot
                of time coding the blog instead of writing)
              </li>
            </ul>

            <P>Hope you enjoy!</P>
          </HLevel>
        </div>
        <div className="col-span-4 -mt-10">
          <div className="relative -right-14">
            <div
              className="tk-blob absolute animated-blob-container"
              style={
                {
                  "--time": "40s",
                  "--amount": 1,
                  "--fill": "#BE8D6A",
                } as React.CSSProperties
              }
            >
              <svg
                width="550"
                height="537"
                viewBox="0 0 503 497"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {BlobPath}
              </svg>
            </div>

            <div className="absolute profile-image-position">
              <svg
                width="0"
                height="0"
                viewBox="0 0 363 324"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <clipPath id="blob">{BlobPath2}</clipPath>
                </defs>
              </svg>
              <img
                alt="Kimmo's picture"
                className="blob-mask"
                src="kimmo.jpg"
              />
            </div>
          </div>
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
