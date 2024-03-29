import React from "react";
import { MDXRemote as OriginalMDXRemote } from "next-mdx-remote";
import Tippy, { TippyProps } from "@tippyjs/react";
import * as components from "src/components";
import { info, success, warning, error } from "src/components/Toast";
import { components as mdxComponents } from "src/mdxComponents";
import { PostContext } from "src/components";
import { Icon } from "@iconify/react";
import tickOutlineIcon from "@iconify/icons-teenyicons/tick-outline";
import xOutlineIcon from "@iconify/icons-teenyicons/x-outline";
import xSmallOutlineIcon from "@iconify/icons-teenyicons/x-small-outline";
import moodSmileOutlineIcon from "@iconify/icons-teenyicons/mood-smile-outline";
import moodSadOutlineIcon from "@iconify/icons-teenyicons/mood-sad-outline";
import thumbUpOutlineIcon from "@iconify/icons-teenyicons/thumb-up-outline";
import thumbDownOutlineIcon from "@iconify/icons-teenyicons/thumb-down-outline";
import eyeOutlineIcon from "@iconify/icons-teenyicons/eye-outline";

const icons = {
  tickOutlineIcon,
  xOutlineIcon,
  xSmallOutlineIcon,
  moodSmileOutlineIcon,
  moodSadOutlineIcon,
  thumbUpOutlineIcon,
  thumbDownOutlineIcon,
  eyeOutlineIcon,
};

const TippyWrapper = ({ children, ...props }: TippyProps) => {
  // This wrapper is required to solve some issue with forward ref
  return (
    <Tippy {...props}>
      <span>{children}</span>
    </Tippy>
  );
};

export type MDXRemoteProps = {
  compiledSource: string;
};

export const MDXRemote = ({ compiledSource }: MDXRemoteProps) => {
  const [props, _setProps] = React.useState({
    lazy: true,
    compiledSource,
    // Note: if the scope object changes (===), mdx content is remounted
    //       because the content is reconstructed with Reflect.construct
    scope: { info, success, warning, error, ...icons },
    components: {
      ...components,
      ...mdxComponents,
      Icon,
      Tippy: TippyWrapper,
    },
  });

  return <OriginalMDXRemote {...props} />;
};
