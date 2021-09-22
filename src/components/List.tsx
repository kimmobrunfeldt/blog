import React from "react";
import { InlineIcon } from "src/components/InlineIcon";
import { classNames } from "src/mdxComponents";

export function UnorderedList(props: JSX.IntrinsicElements["ul"]) {
  return <ul className={classNames.ul.replace("list-disc", "")} {...props} />;
}

export type ItemProps = JSX.IntrinsicElements["li"] & {
  icon?: any;
};

export function Item({ icon, children }: ItemProps) {
  return (
    <li className={`${classNames.li} flex flex-row items-center space-x-4`}>
      {icon && <InlineIcon icon={icon} />}
      <span>{children}</span>
    </li>
  );
}
