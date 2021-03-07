import React from "react";
import cn from "classnames";
import { LinkCommonProps } from "src/components";
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
        cn("cursor-pointer underline-effect-button", buttonStyle),
        className
      )}
    >
      {children}
    </a>
  );
}
