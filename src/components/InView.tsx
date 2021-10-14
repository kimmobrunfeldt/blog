import React from "react";
import {
  InView as OriginalInView,
  IntersectionObserverProps,
} from "react-intersection-observer";

export type InViewProps = Omit<IntersectionObserverProps, "children"> & {
  onInView?: () => void;
};

export const InView = (propsIn: InViewProps) => {
  const props = {
    root: globalThis.window ? document.body : undefined,
    threshold: 0.5,
    triggerOnce: true,
    onInView: () => undefined,
    ...propsIn,
  };

  const { onInView, ...restProps } = props;

  const onChange: NonNullable<InViewProps["onChange"]> = (inView, entry) => {
    if (inView) {
      onInView();
    }

    if (props.onChange) {
      props.onChange(inView, entry);
    }
  };

  return (
    <OriginalInView {...restProps} onChange={onChange}>
      <div />
    </OriginalInView>
  );
};
