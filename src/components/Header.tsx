import React from "react";
import { Link } from "src/components";
import { Icon } from "@iconify/react";
import githubOutline from "@iconify/icons-teenyicons/github-outline";
import twitterOutline from "@iconify/icons-teenyicons/twitter-outline";

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
      className={`grid grid-cols-12 gap-global pt-10 pb-16 font-bold ${className}`}
    >
      <div className="col-start-3 col-span-8 flex flex-row justify-between">
        <ul className="flex flex-row items-center space-x-4">
          <li>
            {/* Requires deploy at domain root */}
            <Link
              className={currentPath === "/" ? "effects active" : "effects"}
              color="rust"
              href="/"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              className={
                currentPath.startsWith("/posts") ? "effects active" : "effects"
              }
              color="rust"
              href="/posts"
            >
              Posts
            </Link>
          </li>
        </ul>

        <ul className="flex flex-row items-center -m-2">
          <li>
            <Link
              color="rust"
              className="effects effects-w-half"
              title="Github"
              href="https://github.com/kimmobrunfeldt"
            >
              <Icon className="box-content p-2" icon={githubOutline} />
            </Link>
          </li>
          <li>
            <Link
              color="rust"
              className="effects effects-w-half"
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
