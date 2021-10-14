import React from "react";
import throttle from "lodash/throttle";
import { PostContext } from "./PostLayout";

export type SlidesProps = {
  children: React.Component;
};

function getCoords(elem: HTMLElement) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset,
  };
}

export const Slides = ({ children }: SlidesProps) => {
  const { setSlideIndex } = React.useContext(PostContext);
  const childrenRef = React.useRef<HTMLDivElement[]>([]);
  const revPositions = React.useRef<ReturnType<typeof getCoords>[]>([]);

  function onScroll() {
    console.log("sroll", window.scrollY);
    const index = revPositions.current.findIndex((p) => p.top > window.scrollY);
    const slide = index !== -1 ? index : 0;
    setSlideIndex(slide);
  }

  const throttledScroll = throttle(onScroll, 100);

  React.useEffect(() => {
    // Get slide positions after mount
    const positions = childrenRef.current.map((el) => getCoords(el));
    // Reverse at this stage to minimize work in onScroll
    revPositions.current = positions.reverse();
    console.log(positions.map((p) => p.top));

    const root = document.querySelector("#react-root");
    if (!root) {
      throw new Error("React root not found");
    }

    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, []);

  return React.Children.map(children, (child, index) => {
    return React.cloneElement(child as any, {
      ref: (el: HTMLDivElement) => {
        childrenRef.current[index] = el;
      },
    });
  });
};

export type SlideProps = {
  children: React.ReactNode;
};

export const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);
