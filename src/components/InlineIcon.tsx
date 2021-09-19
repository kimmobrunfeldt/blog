import React from "react";
import { Icon, IconifyIcon } from "@iconify/react";

export type InlineIconProps = IconifyIcon & {
  children?: React.ReactNode;
  className?: string;
};

export function InlineIcon({ children, ...otherProps }: InlineIconProps) {
  return <Icon {...otherProps} className={`inline-block`}></Icon>;
}
