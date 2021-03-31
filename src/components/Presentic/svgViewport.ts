import isString from "lodash/isString";
import isFunction from "lodash/isFunction";
import forEach from "lodash/forEach";
import get from "lodash/get";
import Tweenable from "shifty";
import * as svgUtil from "./svgUtil";
import { State } from "react-inlinesvg/esm";

export type View = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  fadeAOpacity?: number;
  fadeBOpacity?: number;
};

type ViewportOptionsWithDefaults = {
  duration: number;
  easing: string;
};

type ViewportOptionsWithoutDefaults = {
  injectCss?: string;
  svgClassNameOnMousedown?: string;
};

export type ViewportAnimateOptions = {
  duration?: number;
  easing?: string;
  fadeInElements?: SVGElement[];
  fadeOutElements?: SVGElement[];
};

export type ViewportOptions = Partial<ViewportOptionsWithDefaults> &
  ViewportOptionsWithoutDefaults;

// Provides easy way to animate movement of SVG viewport, including the
// SVG canvas rotation.
// Injects a root `g` element to `svgDocument` for rotation purposes
export function viewport(
  svgDocument: HTMLDocument,
  svgElement: SVGSVGElement,
  rootGroup: SVGElement,
  optsIn = {}
) {
  const opts: ViewportOptionsWithDefaults & ViewportOptionsWithoutDefaults = {
    duration: 800,
    easing: "easeInOutCubic",
    ...optsIn,
  };

  const { svgClassNameOnMousedown } = opts;

  function onPointerDown() {
    // Non-null assertion because these are only called when
    // the type is string
    svgUtil.addClass(svgElement, svgClassNameOnMousedown!);
  }

  function onPointerUp() {
    svgUtil.removeClass(svgElement, svgClassNameOnMousedown!);
  }

  function addListeners() {
    svgDocument.addEventListener("pointerdown", onPointerDown);
    svgDocument.addEventListener("pointerup", onPointerUp);
  }

  function removeListeners() {
    svgDocument.removeEventListener("pointerdown", onPointerDown);
    svgDocument.removeEventListener("pointerup", onPointerUp);
  }

  if (isString(svgClassNameOnMousedown)) {
    addListeners();
  }

  if (opts.injectCss) {
    const styleElement = svgDocument.createElementNS(
      "http://www.w3.org/2000/svg",
      "style"
    );
    styleElement.textContent = opts.injectCss;
    svgElement.appendChild(styleElement);
  }

  // Internal state all methods are sharing
  const initialViewBox = svgElement.viewBox.baseVal;
  const state = {
    tweenable: null as any,
    tweenValues: {
      x: initialViewBox.x,
      y: initialViewBox.y,
      width: initialViewBox.width,
      height: initialViewBox.height,
      rotation: 0,
      fadeAOpacity: 0,
      fadeBOpacity: 1,
    } as Required<View>,
  };

  function setTo(
    values: View & { fadeInOpacity: number; fadeOutOpacity: number },
    animateOptions: ViewportAnimateOptions = {}
  ): void {
    const viewBox = [values.x, values.y, values.width, values.height];
    svgElement.setAttribute("viewBox", viewBox.join(" "));

    // The rotation origin is also moving when in each animation frame
    // until it reaches the next slide's center
    const rotateOrigin = {
      x: values.x + values.width / 2,
      y: values.y + values.height / 2,
    };
    const rotate = [values.rotation, rotateOrigin.x, rotateOrigin.y];
    rootGroup.setAttribute("transform", "rotate(" + rotate.join(", ") + ")");

    forEach(animateOptions.fadeInElements, (el) =>
      el.setAttribute("opacity", String(values.fadeInOpacity))
    );
    forEach(animateOptions.fadeOutElements, (el) =>
      el.setAttribute("opacity", String(values.fadeOutOpacity))
    );

    // Save tween state on each frame
    forEach(values, (val, key) => {
      if (key in state.tweenValues) {
        state.tweenValues[key as keyof Required<View>] = val!;
      }
    });
  }

  // Example:
  //
  // animateTo({
  //   x: 10,
  //   y: 20,
  //   width: 200,
  //   height: 200,
  //   rotation: 45  // optional
  // })
  // Rotation is relative to center of the viewport, in degrees
  function animateTo(viewIn: View, callOpts: ViewportAnimateOptions = {}) {
    const fadeInIsA =
      state.tweenValues.fadeAOpacity < state.tweenValues.fadeBOpacity;

    const view: Required<View> = {
      rotation: 0,
      fadeAOpacity: fadeInIsA ? 1 : 0,
      fadeBOpacity: fadeInIsA ? 0 : 1,
      ...viewIn,
    };

    const animateOptions = {
      ...opts,
      ...callOpts,
    };

    if (isFunction(get(state.tweenable, "stop"))) {
      state.tweenable.stop();
    }

    // This "A" and "B" naming is chosen because if user stops an animation
    // midway, the naming would not make sense. Opacity A might be fading in
    // when user reverts the animation, making opacity A to be fading out
    const fadeInOpacityKey = fadeInIsA ? "fadeAOpacity" : "fadeBOpacity";
    const fadeOutOpacityKey = fadeInIsA ? "fadeBOpacity" : "fadeAOpacity";

    state.tweenable = new Tweenable();
    state.tweenable.tween({
      from: { ...state.tweenValues },
      to: { ...view },
      duration: animateOptions.duration,
      easing: animateOptions.easing,
      step: (values: Required<View>) => {
        const newValues = {
          ...values,
          fadeInOpacity: values[fadeInOpacityKey],
          fadeOutOpacity: values[fadeOutOpacityKey],
        };

        setTo(newValues, animateOptions);

        // Save the values that are not used by setTo
        state.tweenValues.fadeAOpacity = values.fadeAOpacity;
        state.tweenValues.fadeBOpacity = values.fadeBOpacity;
      },
    });
  }

  return {
    setTo,
    animateTo,
    destroy: () => {
      if (isString(svgClassNameOnMousedown)) {
        removeListeners();
      }
    },
  };
}
