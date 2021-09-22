import React from "react";
import { Icon } from "@iconify/react";
import { classNames } from "src/mdxComponents";

export function UnorderedList(props: JSX.IntrinsicElements["ul"]) {
  return <ul className={classNames.ul.replace("list-disc", "")} {...props} />;
}

export type ItemProps = JSX.IntrinsicElements["li"] & {
  icon?: any;
};

export function Item({ icon, children }: ItemProps) {
  return (
    <li className={`${classNames.li} flex flex-row items-start space-x-4`}>
      {icon && (
        <Icon
          className="relative flex-shrink-0 top-[4px]"
          width={18}
          height={18}
          icon={icon}
        />
      )}
      <span>{children}</span>
    </li>
  );
}
