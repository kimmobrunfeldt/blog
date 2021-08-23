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
    text-rust-5
    font-bold
    py-0.5 px-2
    sm:py-1 sm:px-3
    border border-rust-5
    rounded
    focus:outline-none
    active:outline-none
    dark:text-rust-6 dark:active:text-rust-6
    dark:border-rust-6
  `,
};

export function Button({
  children,
  color = "default",
  className = "",
  disabled,
  ...otherProps
}: ButtonProps) {
  const buttonStyle = buttonStyles[color];
  const resolvedCls = `${className} ${
    disabled ? "border-gray-5 text-gray-5 cursor-not-allowed" : ""
  }`;

  const cursor = disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      {...otherProps}
      className={overrideTw(
        cn(cursor, "underline-effect-button", buttonStyle),
        resolvedCls
      )}
    >
      {children}
    </button>
  );
}
