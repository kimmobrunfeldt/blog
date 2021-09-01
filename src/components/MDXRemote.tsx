import React from "react";
import { MDXRemote as OriginalMDXRemote } from "next-mdx-remote";
import * as components from "src/components";
import { info, success, warning, error } from "src/components/Toast";
import { components as mdxComponents } from "src/mdxComponents";

export type MDXRemoteProps = {
  compiledSource: string;
};

export const MDXRemote = ({ compiledSource }: MDXRemoteProps) => {
  const mdxRemoteProps = {
    compiledSource,
    scope: { info, success, warning, error },
    components: {
      ...components,
      ...mdxComponents,
    },
  };

  return <OriginalMDXRemote {...mdxRemoteProps} />;
};
