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
  const { slideIndex, setSlideIndex } = React.useContext(PostContext);
  const childrenRef = React.useRef<HTMLDivElement[]>([]);
  const revPositions = React.useRef<ReturnType<typeof getCoords>[]>([]);

  function onScroll() {
    // Start searching from the bottom-most slide towards up.
    const index = revPositions.current.findIndex((p) => {
      const buffer = window.innerHeight / 3;
      return window.scrollY > p.top - buffer;
    });
    const lastIndex = revPositions.current.length - 1;
    const newSlide =
      index !== -1
        ? // Positions is reversed, so reverse indexes too
          lastIndex - index
        : // If no matching slides were found -> window is scrolled above first
          // slide, which means we want first slide to show
          0;

    if (newSlide !== slideIndex) {
      setSlideIndex(newSlide);
    }
  }

  const throttledScroll = throttle(onScroll, 100);

  React.useEffect(() => {
    // Get slide positions after mount
    const positions = childrenRef.current.map((el) => getCoords(el));
    // Reverse at this stage to minimize work in onScroll
    revPositions.current = positions.reverse();

    onScroll();
    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, []);

  return React.Children.map(children, (child, index) => {
    return React.cloneElement(child as any, {
      active: index === slideIndex,
      ref: (el: HTMLDivElement) => {
        childrenRef.current[index] = el;
      },
    });
  });
};

export type SlideProps = {
  children: React.ReactNode;
  active: boolean;
};

export const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  ({ active, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`transition-opacity duration-700 ${
          active ? "opacity-100" : "opacity-30"
        }`}
        {...props}
      />
    );
  }
);
