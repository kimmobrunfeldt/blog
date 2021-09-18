import React from "react";
import { MDXRemote as OriginalMDXRemote } from "next-mdx-remote";
import * as components from "src/components";
import { info, success, warning, error } from "src/components/Toast";
import { components as mdxComponents } from "src/mdxComponents";
import { PostContext } from "src/components";
import { Icon } from "@iconify/react";
import tickOutlineIcon from "@iconify/icons-teenyicons/tick-outline";
import xOutlineIcon from "@iconify/icons-teenyicons/x-outline";
import xSmallOutlineIcon from "@iconify/icons-teenyicons/x-small-outline";

const icons = {
  tickOutlineIcon,
  xOutlineIcon,
  xSmallOutlineIcon,
};

export type MDXRemoteProps = {
  compiledSource: string;
};

export const MDXRemote = ({ compiledSource }: MDXRemoteProps) => {
  const ctx = React.useContext(PostContext);

  const mdxRemoteProps = {
    compiledSource,
    scope: { info, success, warning, error, ...icons, ...ctx },
    components: {
      ...components,
      ...mdxComponents,
      Icon,
    },
  };

  return <OriginalMDXRemote {...mdxRemoteProps} />;
};
