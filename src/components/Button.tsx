import React from "react";
import cn from "classnames";
import { overrideTw } from "src/util/site";

export type ButtonProps = JSX.IntrinsicElements["button"] & {
  children?: React.ReactNode;
  className?: string;
  color?: "default";
};

export const buttonStyles = {
  default: `
    bg-transparent
    text-white
    py-1 px-3
    border border-rust-5 bg-rust-5
    rounded
    focus:outline-none
    focus:text-underline
  `,
};

export function Button({
  children,
  color = "default",
  className = "",
  ...otherProps
}: ButtonProps) {
  const buttonStyle = buttonStyles[color];

  return (
    <button
      {...otherProps}
      className={overrideTw(cn("cursor-pointer", buttonStyle), className)}
    >
      {children}
    </button>
  );
}
