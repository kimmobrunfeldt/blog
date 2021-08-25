import React from "react";
import Tippy from "@tippyjs/react";

export type AbbrProps = {
  children?: React.ReactNode;
  title?: string;
};

export function Abbr({ title, children }: AbbrProps) {
  return (
    <Tippy content={title}>
      <abbr title={title}>{children}</abbr>
    </Tippy>
  );
}
