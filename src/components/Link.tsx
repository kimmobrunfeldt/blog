import React from "react";
import cn from "classnames";
import { overrideTw } from "src/util/site";

export type LinkProps = JSX.IntrinsicElements["a"] & {
  children?: React.ReactNode;
  className?: string;
  underline?: boolean;
  color?: string;
  type?: "link" | "button";
};

export const defaultLinkStyle =
  "text-amber-6 hover:text-amber-5 active:text-amber-7";

export const defaultButtonStyle = `
bg-transparent
text-rust-5
font-bold
py-2 px-4
border border-rust-5
rounded
`;

export function Link({
  children,
  color,
  underline = true,
  className = "",
  type = "link",
  ...otherProps
}: LinkProps) {
  const linkStyle = color
    ? defaultLinkStyle.replace(/amber/g, color)
    : defaultLinkStyle;

  const buttonStyle = color
    ? defaultButtonStyle.replace(/rust/g, color)
    : defaultButtonStyle;

  return (
    <a
      {...otherProps}
      className={overrideTw(
        cn(
          "cursor-pointer",
          type === "link" ? linkStyle : "",
          type === "button" ? buttonStyle : "",
          {
            "underline-effect-button": type === "button",
            "hover:underline": type === "link" && underline,
          }
        ),
        className
      )}
    >
      {children}
    </a>
  );
}
