import React from "react";
import { Link } from "src/components";
import { Icon } from "@iconify/react";
import githubOutline from "@iconify/icons-teenyicons/github-outline";
import twitterOutline from "@iconify/icons-teenyicons/twitter-outline";
import * as twGlobals from "src/twGlobals";

export type HeaderProps = JSX.IntrinsicElements["header"] & {
  className?: string;
  currentPath: string;
};

export function Header({
  className = "",
  currentPath,
  ...otherProps
}: HeaderProps) {
  return (
    <header
      {...otherProps}
      className={`grid grid-cols-12 ${twGlobals.gridGap} py-10 font-bold ${className}`}
    >
      <div className="col-start-3 col-span-8 flex flex-row justify-between">
        <ul className="flex flex-row items-center space-x-4">
          <li>
            {/* Requires deploy at domain root */}
            <Link
              className={currentPath === "/" ? "underline" : ""}
              color="rust"
              href="/"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              className={currentPath.startsWith("/posts") ? "underline" : ""}
              color="rust"
              href="/posts"
            >
              Posts
            </Link>
          </li>
        </ul>

        <ul className="flex flex-row items-center">
          <li>
            <Link
              color="rust"
              title="Github"
              href="https://github.com/kimmobrunfeldt"
            >
              <Icon className="box-content p-2" icon={githubOutline} />
            </Link>
          </li>
          <li>
            <Link
              color="rust"
              title="Twitter"
              href="https://twitter.com/kimmobrunfeldt"
            >
              <Icon className="box-content p-2 -mr-2" icon={twitterOutline} />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
