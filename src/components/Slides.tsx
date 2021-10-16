import React from "react";
import throttle from "lodash/throttle";
import { PostContext } from "./PostLayout";
import isArray from "lodash/isArray";
import { isFunction } from "lodash";

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

  function updateSlide() {
    // Start searching from the bottom-most slide towards up.
    const index = revPositions.current.findIndex((p) => {
      // Set next slide when content reaches top 1/3 of viewport
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
      console.log("set new slide!", newSlide);
      setSlideIndex(newSlide);
    }
  }
  const throttledUpdateSlide = throttle(updateSlide, 100);

  function updatePositions() {
    // Get slide positions after mount
    const positions = childrenRef.current.map((el) => getCoords(el));
    // Reverse at this stage to minimize work in updateSlide
    revPositions.current = positions.reverse();

    updateSlide();
  }
  const throttledUpdatePositions = throttle(updatePositions, 100);

  React.useEffect(() => {
    updatePositions();

    window.addEventListener("resize", throttledUpdatePositions);
    return () => {
      window.removeEventListener("resize", throttledUpdatePositions);
    };
  }, []);

  React.useEffect(() => {
    updateSlide();

    window.addEventListener("scroll", throttledUpdateSlide);
    return () => {
      window.removeEventListener("scroll", throttledUpdateSlide);
    };
  }, []);

  function updateRefs(containerEl: HTMLDivElement) {
    if (containerEl) {
      const children = Array.from(containerEl.children) as HTMLDivElement[];
      childrenRef.current = children;
    }
  }

  return <div ref={updateRefs}>{children}</div>;
};

Slides.whyDidYouRender = true;

export type SlideProps = {
  children: React.ReactNode;
  slide: number;
};

export const Slide = ({ slide, children }: SlideProps) => {
  const { slideIndex } = React.useContext(PostContext);

  return (
    <div
      className={`transition-opacity duration-700 ${
        slideIndex === slide ? "opacity-100" : "opacity-30"
      }`}
    >
      {children}
    </div>
  );
};
