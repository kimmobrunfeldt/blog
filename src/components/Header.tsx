import React from "react";
import { Link } from "src/components";
import { Icon } from "@iconify/react";
import githubOutline from "@iconify/icons-teenyicons/github-outline";
import twitterOutline from "@iconify/icons-teenyicons/twitter-outline";
import { AnyPage, SiteData } from "src/types/siteData";

export type HeaderProps = JSX.IntrinsicElements["header"] & {
  className?: string;
  pageData: AnyPage["data"];
  siteData: SiteData;
};

export function Header({
  className = "",
  siteData,
  pageData,
  ...otherProps
}: HeaderProps) {
  const currentPath = pageData.path;
  const postPaths = siteData.pages
    .filter((page) => page.type === "post")
    .map((page) => page.data.path);
  const isPostActive = postPaths.includes(currentPath) || currentPath === "/";

  return (
    <header
      {...otherProps}
      className={`grid grid-cols-12 gap-global pt-10 pb-16 font-bold ${className}`}
    >
      <div className="col-start-3 col-span-8 flex flex-row justify-between">
        <ul className="flex flex-row items-center space-x-4">
          <li>
            <Link
              className={
                isPostActive ? "underline-effect active" : "underline-effect"
              }
              color="rust"
              href="/"
            >
              Posts
            </Link>
          </li>
          <li>
            {/* Requires deploy at domain root */}
            <Link
              className={
                currentPath === "/about"
                  ? "underline-effect active"
                  : "underline-effect"
              }
              color="rust"
              href="/about"
            >
              About
            </Link>
          </li>
        </ul>

        <ul className="flex flex-row items-center -m-2">
          <li>
            <Link
              color="rust"
              className="underline-effect underline-effect-w-half"
              title="Github"
              href="https://github.com/kimmobrunfeldt"
            >
              <Icon className="box-content p-2" icon={githubOutline} />
            </Link>
          </li>
          <li>
            <Link
              color="rust"
              className="underline-effect underline-effect-w-half"
              title="Twitter"
              href="https://twitter.com/kimmobrunfeldt"
            >
              <Icon className="box-content p-2" icon={twitterOutline} />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
