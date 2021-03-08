import React from "react";
import { Icon } from "@iconify/react";
import codeIcon from "@iconify/icons-teenyicons/code-outline";
import { Link } from "./Link";

export type FooterProps = JSX.IntrinsicElements["footer"] & {
  className?: string;
};

export function Footer({ className = "", ...otherProps }: FooterProps) {
  return (
    <footer
      {...otherProps}
      className={`py-10 mt-20 font-bold text-sm flex justify-center items-center space-x-4 ${className}`}
    >
      <a
        className="cursor-pointer underline-effect-trigger inline-block"
        href="/"
      >
        <span className="text-gray-7 dark:text-gray-5 font-heading">kimmo</span>
        <span className="text-rust-6 font-heading underline-effect underline-effect-w-half inline-block">
          .blog
        </span>
      </a>

      <span className="text-gray-4 dark:text-gray-5">
        <Icon icon={codeIcon} />
      </span>

      <Link
        style={{ top: "1px" }}
        className="relative text-xs underline-effect underline-effect-w-half"
        underline={false}
        color="rust"
        href="https://docs.google.com/forms/d/e/1FAIpQLSeqxCof8DcwK_DYCNyNmJfDj-bWG8tuxyEiAiuTQLdL6h4bpg/viewform?usp=sf_link"
      >
        Subscribe
      </Link>
    </footer>
  );
}
