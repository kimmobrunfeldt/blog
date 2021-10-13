import React from "react";
import isUndefined from "lodash/isUndefined";
import { ImmutableSVG } from "./SVG";
import { initialize } from "./presentation";
import { linkStyles } from "../Link";
import { overrideTw } from "src/util/site";
import { Icon } from "@iconify/react";
import leftIcon from "@iconify/icons-teenyicons/left-circle-outline";
import rightIcon from "@iconify/icons-teenyicons/right-circle-outline";
import clockwiseIcon from "@iconify/icons-teenyicons/clockwise-outline";
import cn from "classnames";
import Tippy from "@tippyjs/react";

export type PresenticProps = {
  src: string;
  className?: string;
  svgContainerClassName?: string;
  width?: React.CSSProperties["width"];
  height?: string;
  alt: JSX.IntrinsicElements["img"]["alt"];
  title?: JSX.IntrinsicElements["img"]["title"];
  duration?: number;
  maxWidth?: React.CSSProperties["maxWidth"];
  initialAnimateToSlide?: number;
  initialAnimateDuration?: number;
  initialAnimationTriggerTop?: string;
  slide?: number;
};

export function Presentic({
  src,
  alt,
  title,
  initialAnimateToSlide,
  className = "",
  svgContainerClassName = "",
  initialAnimateDuration = 1600,
  initialAnimationTriggerTop = "30%",
  slide,
  duration = 800,
  width = "100%",
  maxWidth,
  height = "100%",
}: PresenticProps) {
  const isControlled = !isUndefined(slide);

  const [presentation, setPresentation] = React.useState<
    ReturnType<typeof initialize> | undefined
  >(undefined);

  const [slideIndex, setSlideIndex] = React.useState(0);
  const svgRef = React.useCallback((divEl: HTMLDivElement) => {
    if (divEl !== null) {
      const svgEl = divEl.children[0] as SVGSVGElement;

      const p = initialize(document, svgEl, {
        initialAnimateToSlide,
        initialAnimateDuration,
        initialAnimationTriggerTop,
        duration,
        onSlideChange: (index) => setSlideIndex(index),
        disableClickToNext: isControlled,
      });

      const original = {
        width: parseFloat(svgEl.getAttribute("width") || "1"),
        height: parseFloat(svgEl.getAttribute("height") || "1"),
      };
      if (isUndefined(width)) {
        svgEl.removeAttribute("width");
      } else {
        svgEl.setAttribute("width", String(width));
      }

      if (isUndefined(height)) {
        svgEl.removeAttribute("height");
      } else {
        if (height === "autoLock") {
          const newPxWidth = svgEl.clientWidth;
          const lockedPxHeight =
            (newPxWidth / original.width) * original.height;
          svgEl.setAttribute("height", `${lockedPxHeight}`);
        } else {
          svgEl.setAttribute("height", String(height));
        }
      }

      setPresentation(p);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (!isUndefined(presentation)) {
        presentation.destroy();
      }
    };
  }, []);

  if (isControlled) {
    React.useEffect(() => {
      if (presentation) {
        // TODO: Remove when ts 4.4 upgrade
        presentation.animateToSlide(slide!);
      }
    }, [slide]);
  }

  function canClickNext() {
    return (
      !isUndefined(presentation) && slideIndex <= presentation.length() - 2
    );
  }

  function next() {
    if (presentation) {
      // Calling next will loop over the slides back to start, if the last
      // slide was reached
      presentation.next();
    }
  }

  function canClickPrevious() {
    return !isUndefined(presentation) && slideIndex >= 1;
  }

  function previous() {
    if (canClickPrevious()) {
      presentation!.previous();
    }
  }

  const disabledCls = "cursor-not-allowed text-gray-3 dark:text-gray-7";
  const buttons = (
    <ul className="flex flex-row justify-end mb-2">
      <li>
        <Tippy content="Previous slide">
          <button
            type="button"
            className={cn(
              canClickPrevious() ? linkStyles.rust : disabledCls,
              "block top-[1px]"
            )}
            title={"Previous"}
            aria-label={"Previous animation state"}
            onClick={previous}
            disabled={!canClickPrevious()}
          >
            <span style={{ fontSize: "1.3em" }}>
              <Icon className="box-content p-2" icon={leftIcon} />
            </span>
          </button>
        </Tippy>
      </li>
      <li>
        <Tippy content={canClickNext() ? "Next slide" : "Back to start"}>
          <button
            type="button"
            className={cn(linkStyles.rust, "block top-[1px]")}
            title={canClickNext() ? "Next" : "Back to start"}
            aria-label={canClickNext() ? "Next slide" : "Back to start"}
            onClick={next}
          >
            <span style={{ fontSize: "1.3em" }}>
              {/* Keep both in DOM at first to load the icon */}
              <Icon
                className={cn("box-content p-2", {
                  hidden: canClickNext(),
                })}
                icon={clockwiseIcon}
              />

              <Icon
                className={cn("box-content p-2", {
                  hidden: !canClickNext(),
                })}
                icon={rightIcon}
              />
            </span>
          </button>
        </Tippy>
      </li>
    </ul>
  );

  return (
    <div className={overrideTw("mt-12 mb-16 select-none", className)}>
      {!isControlled && buttons}
      <ImmutableSVG
        alt={alt}
        title={title}
        className={svgContainerClassName}
        maxWidth={maxWidth}
        ref={svgRef}
        src={src}
      />
    </div>
  );
}
