import React from "react";
import throttle from "lodash/throttle";
import { PostContext } from "./PostLayout";

const SCREEN_XL_WIDTH = 1280;

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
      const buffer =
        window.innerWidth > SCREEN_XL_WIDTH
          ? window.innerHeight / 2
          : window.innerHeight - window.innerHeight / 3;
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
  const throttledUpdateSlide = throttle(updateSlide, 50);

  function updatePositions() {
    // Get slide positions after mount
    const positions = childrenRef.current.map((el) => getCoords(el));
    // Reverse at this stage to minimize work in updateSlide
    revPositions.current = positions.reverse();

    updateSlide();
  }
  const throttledUpdatePositions = throttle(updatePositions, 50);

  React.useEffect(() => {
    updatePositions();

    window.addEventListener("resize", throttledUpdatePositions);
    return () => {
      window.removeEventListener("resize", throttledUpdatePositions);
    };
  }, [updatePositions]);

  React.useEffect(() => {
    updateSlide();

    window.addEventListener("scroll", throttledUpdateSlide);
    return () => {
      window.removeEventListener("scroll", throttledUpdateSlide);
    };
  }, [updateSlide]);

  const updateRefs = React.useCallback(function updateRefs(
    containerEl: HTMLDivElement
  ) {
    if (containerEl) {
      const children = Array.from(containerEl.children) as HTMLDivElement[];
      childrenRef.current = children;
    }
  },
  []);

  return (
    <div ref={updateRefs}>
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child as any, {
          active: slideIndex === index,
        });
      })}
    </div>
  );
};

export type SlideProps = {
  children: React.ReactNode;
  active: boolean;
};

export const Slide = ({ active, children }: SlideProps) => {
  return (
    <div
      className={`transition-opacity duration-700 ${
        active ? "opacity-100" : "opacity-20"
      }`}
    >
      {children}
    </div>
  );
};
