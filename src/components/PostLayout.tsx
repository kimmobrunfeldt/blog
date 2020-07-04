import React from "react";

type Props = {
  children: React.ReactNode;
};

export function PostLayout(props: Props): JSX.Element {
  return <div>{props.children}</div>;
}
