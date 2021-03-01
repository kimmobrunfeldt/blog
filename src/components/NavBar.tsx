import React from "react";
import { ContentWrapper } from "src/components/ContentWrapper";
import { Link } from "src/components/Link";
import { Icon } from "@iconify/react";
import githubOutline from "@iconify/icons-teenyicons/github-outline";
import twitterOutline from "@iconify/icons-teenyicons/twitter-outline";
import rssIcon from "@iconify/icons-teenyicons/wifi-full-outline";
import { AnyPage, SiteData } from "src/types/siteData";

export type NavBarProps = JSX.IntrinsicElements["header"] & {
  className?: string;
  pageData: AnyPage["data"];
  siteData: SiteData;
};

export function NavBar({
  className = "",
  siteData,
  pageData,
  ...otherProps
}: NavBarProps) {
  const currentPath = pageData.path;
  const postPaths = siteData.pages
    .filter((page) => page.type === "post")
    .map((page) => page.data.path);
  const isPostActive =
    postPaths.includes(currentPath) || currentPath === "/posts";

  return (
    <header
      {...otherProps}
      className={`grid grid-cols-12 gap-global pt-3 pb-10 lg:pt-10 lg:pb-20 font-bold ${className}`}
    >
      <div className="col-span-12 sm:col-start-2 sm:col-span-10 xl:col-start-3 xl:col-span-8">
        <ContentWrapper className="flex flex-row justify-between">
          <ul className="flex flex-row items-center space-x-4">
            <li>
              {/* Requires deploy at domain root */}
              <Link
                className={
                  currentPath === "/"
                    ? "underline-effect active"
                    : "underline-effect"
                }
                color="rust"
                underline={false}
                href="/"
              >
                Index
              </Link>
            </li>
            <li>
              <Link
                className={
                  isPostActive ? "underline-effect active" : "underline-effect"
                }
                color="rust"
                underline={false}
                href="/posts"
              >
                Posts
              </Link>
            </li>
          </ul>

          <ul className="flex flex-row items-center -m-2 space-x-1">
            <li>
              <Link
                color="rust"
                underline={false}
                className="underline-effect underline-effect-w-half"
                title="RSS"
                aria-label="RSS Feed"
                href="/rss.xml"
              >
                <span style={{ fontSize: "1.1em" }}>
                  <Icon className="box-content p-2 rss-icon" icon={rssIcon} />
                </span>
              </Link>
            </li>
            <li>
              <Link
                color="rust"
                underline={false}
                className="underline-effect underline-effect-w-half"
                title="Github"
                aria-label="Github profile"
                href="https://github.com/kimmobrunfeldt"
              >
                <Icon className="box-content p-2" icon={githubOutline} />
              </Link>
            </li>
            <li>
              <Link
                color="rust"
                underline={false}
                className="underline-effect underline-effect-w-half"
                title="Twitter"
                aria-label="Twitter profile"
                href="https://twitter.com/kimmobrunfeldt"
              >
                <Icon className="box-content p-2" icon={twitterOutline} />
              </Link>
            </li>
          </ul>
        </ContentWrapper>
      </div>
    </header>
  );
}
