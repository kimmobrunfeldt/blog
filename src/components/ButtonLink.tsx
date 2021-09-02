import React from "react";
import cn from "classnames";
import { LinkCommonProps } from "src/components/Link";
import { overrideTw } from "src/util/site";

type LinkButtonProps = {
  color?: "default";
};

export type ButtonLinkProps = LinkCommonProps & LinkButtonProps;

export const buttonStyles = {
  default: `
    bg-transparent
    text-rust-5
    font-bold
    py-2 px-4
    border border-rust-5
    rounded
    focus:outline-none
    active:outline-none
    dark:text-rust-6 dark:active:text-rust-6
    dark:border-rust-6
  `,
};

export function ButtonLink({
  children,
  color = "default",
  className = "",
  ...otherProps
}: ButtonLinkProps) {
  const buttonStyle = buttonStyles[color];

  return (
    <a
      {...otherProps}
      className={overrideTw(
        cn("inline-block cursor-pointer underline-effect-button", buttonStyle),
        className
      )}
    >
      {children}
    </a>
  );
}
