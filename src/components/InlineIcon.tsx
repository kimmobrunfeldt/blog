import React from "react";
import { Icon, IconifyIcon } from "@iconify/react";

export type InlineIconProps = IconifyIcon & {
  children?: React.ReactNode;
  className?: string;
};

export function InlineIcon({
  children,
  className,
  ...otherProps
}: InlineIconProps) {
  return (
    <Icon
      {...otherProps}
      className={`inline-block ${className ? className : ""}`}
    ></Icon>
  );
}
