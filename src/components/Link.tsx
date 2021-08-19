import React from "react";
import cn from "classnames";
import { overrideTw } from "src/util/site";

type LinkAdditionalProps = {
  underline?: boolean;
  color?: "default" | "amber" | "rust";
};
export type LinkCommonProps = JSX.IntrinsicElements["a"] & {
  children?: React.ReactNode;
  className?: string;
};
export type LinkProps = LinkCommonProps & LinkAdditionalProps;

export const linkStyles = {
  default:
    "text-amber-6 hover:text-amber-5 active:text-amber-7 dark:text-rust-5 dark:active:text-rust-4",
  amber:
    "text-amber-6 hover:text-amber-5 active:text-amber-7 dark:text-amber-5 dark:active:text-amber-4",
  rust:
    "text-rust-6 hover:text-rust-5 active:text-rust-7 dark:text-rust-6 dark:active:text-rust-5",
};

export function Link({
  children,
  color = "default",
  underline = true,
  className = "",
  ...otherProps
}: LinkProps) {
  const linkStyle = linkStyles[color];

  return (
    <a
      {...otherProps}
      className={overrideTw(
        cn("cursor-pointer", linkStyle, {
          "hover:underline": underline,
        }),
        className
      )}
    >
      {children}
    </a>
  );
}
