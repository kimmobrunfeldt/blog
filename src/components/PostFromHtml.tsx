import React from "react";
import { PostLayout } from "src/components";

type Props = {
  html: string;
};

export function PostFromHtml(props: Props): JSX.Element {
  return (
    <PostLayout>
      <div dangerouslySetInnerHTML={{ __html: props.html }} />;
    </PostLayout>
  );
}
