import React from "react";
import { ContentWrapper } from "src/components/ContentWrapper";
import { Link, linkStyles } from "src/components/Link";
import { Icon } from "@iconify/react";
import { AnyPage, SiteData } from "src/types/siteData";
import * as twGlobals from "src/twGlobals";
import githubOutline from "@iconify/icons-teenyicons/github-outline";
import twitterOutline from "@iconify/icons-teenyicons/twitter-outline";
import rssIcon from "@iconify/icons-teenyicons/wifi-full-outline";
import sunIcon from "@iconify/icons-teenyicons/sun-outline";
import moonIcon from "@iconify/icons-teenyicons/moon-outline";
import { AppContext } from "src/components/App";

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
  const context = React.useContext(AppContext);

  const currentPath = pageData.path;
  const postPaths = siteData.pages
    .filter((page) => page.type === "post")
    .map((page) => page.data.path);
  const isPostActive =
    postPaths.includes(currentPath) || currentPath === "/posts";

  const [stateTheme, setStateTheme] = React.useState("light");
  const [themeButtonHidden, setThemeButtonHidden] = React.useState(true);

  React.useEffect(() => {
    setStateTheme(context.theme);
    setThemeButtonHidden(false);
  }, [context.theme]);

  return (
    <header
      {...otherProps}
      className={`grid grid-cols-12 ${twGlobals.gap} pt-3 pb-10 lg:pt-10 lg:pb-20 font-bold ${className}`}
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

          <button
            type="button"
            style={{ top: "1px" }}
            className={`${
              linkStyles.rust
            } transition-opacity duration-300 block relative ${
              themeButtonHidden ? "opacity-0" : "opacity-100"
            }`}
            title={
              stateTheme === "light"
                ? "Change to dark theme"
                : "Change to light theme"
            }
            aria-label={stateTheme === "light" ? "Dark theme" : "Light theme"}
            onClick={() =>
              context.setTheme(stateTheme === "light" ? "dark" : "light")
            }
          >
            <span style={{ fontSize: "1.1em" }}>
              <Icon
                className="box-content p-2"
                icon={stateTheme === "light" ? sunIcon : moonIcon}
              />
            </span>
          </button>

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
                className="underline-effect underline-effect-w-half hidden sm:block"
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
                className="underline-effect underline-effect-w-half hidden sm:block"
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
