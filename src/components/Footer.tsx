import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "./Link";
import codeIcon from "@iconify/icons-teenyicons/code-outline";
import githubOutline from "@iconify/icons-teenyicons/github-outline";
import twitterOutline from "@iconify/icons-teenyicons/twitter-outline";

export type FooterProps = JSX.IntrinsicElements["footer"] & {
  className?: string;
};

export function Footer({ className = "", ...otherProps }: FooterProps) {
  return (
    <footer
      {...otherProps}
      className={`py-8 mb-20 font-bold text-sm ${className}`}
    >
      <div className="-ml-4 flex justify-center items-center space-x-4">
        <a
          className="cursor-pointer underline-effect-trigger inline-block"
          href="/"
        >
          <span className="text-gray-7 dark:text-gray-5 font-heading">
            kimmo
          </span>
          <span className="text-rust-6 font-heading underline-effect underline-effect-w-half inline-block">
            .blog
          </span>
        </a>

        <span className="text-gray-4 dark:text-gray-5">
          <Icon icon={codeIcon} />
        </span>

        <ul
          style={{ top: "1px" }}
          className="relative flex flex-row justify-center items-center space-x-1"
        >
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
      </div>
    </footer>
  );
}
