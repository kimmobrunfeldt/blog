import React from "react";
import isUndefined from "lodash/isUndefined";
import { ImmutableSVG } from "./SVG";
import { initialize } from "./presentation";
import { linkStyles } from "../Link";
import { Icon } from "@iconify/react";
import leftIcon from "@iconify/icons-teenyicons/left-circle-outline";
import rightIcon from "@iconify/icons-teenyicons/right-circle-outline";
import cn from "classnames";
import Tippy from "@tippyjs/react";

export type PresenticProps = {
  src: string;
  width: React.CSSProperties["width"];
  height: string;
  alt: JSX.IntrinsicElements["img"]["alt"];
  title?: JSX.IntrinsicElements["img"]["title"];
  initialAnimateToSlide?: number;
  initialAnimateDuration?: number;
  initialAnimationTriggerTop?: string;
  duration?: number;
  maxWidth?: React.CSSProperties["maxWidth"];
};

export function Presentic({
  src,
  alt,
  title,
  initialAnimateToSlide,
  initialAnimateDuration = 1600,
  initialAnimationTriggerTop = "30%",
  duration = 800,
  width = "100%",
  maxWidth,
  height,
}: PresenticProps) {
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
          svgEl.setAttribute("height", height);
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

  function canClickNext() {
    return (
      !isUndefined(presentation) && slideIndex <= presentation.length() - 2
    );
  }

  function next() {
    if (canClickNext()) {
      presentation!.next();
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
  return (
    <div className="mt-12 mb-16 select-none">
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
          <Tippy content="Next slide">
            <button
              type="button"
              className={cn(
                canClickNext() ? linkStyles.rust : disabledCls,
                "block top-[1px]"
              )}
              title={"Next"}
              aria-label={"Next animation state"}
              onClick={next}
              disabled={!canClickNext()}
            >
              <span style={{ fontSize: "1.3em" }}>
                <Icon className="box-content p-2" icon={rightIcon} />
              </span>
            </button>
          </Tippy>
        </li>
      </ul>

      <ImmutableSVG
        alt={alt}
        title={title}
        maxWidth={maxWidth}
        ref={svgRef}
        src={src}
      />
    </div>
  );
}
