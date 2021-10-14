import React from "react";
import { PostContext } from "./PostLayout";

export type SlidesProps = {
  children: React.ReactNode;
};

export const Slides = ({ children }: SlidesProps) => {
  const { setSlideIndex } = React.useContext(PostContext);

  return React.Children.map(children, (c) => c);
};

export type SlideProps = {
  children: React.ReactNode;
};

export const Slide = (props: SlideProps) => {
  return <div {...props} />;
};
