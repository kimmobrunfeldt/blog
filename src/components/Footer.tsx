import React from "react";

export type FooterProps = JSX.IntrinsicElements["footer"] & {
  className?: string;
};

export function Footer({ className = "", ...otherProps }: FooterProps) {
  return (
    <footer
      {...otherProps}
      className={`py-10 mt-20 font-bold text-sm text-center ${className}`}
    >
      <a
        className="cursor-pointer underline-effect-trigger inline-block"
        href="/"
      >
        <span className="text-gray-7 font-heading">kimmo</span>
        <span className="text-rust-6 font-heading underline-effect underline-effect-w-half inline-block">
          .blog
        </span>
      </a>
    </footer>
  );
}
