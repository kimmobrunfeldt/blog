import reverse from "lodash/reverse";
import forEach from "lodash/forEach";
import once from "lodash/once";
import * as mathUtil from "./mathUtil";
import * as svgUtil from "./svgUtil";
import {
  viewport as svgViewport,
  ViewportAnimateOptions,
  ViewportOptions,
} from "./svgViewport";
import isUndefined from "lodash/isUndefined";

const DEBUG = false;
const SVG_DOCUMENT_CSS = `.presentation-slides-group > * {
  fill: rgba(0, 0, 0, 0);
  transition: all 0.3s ease;
}

.presentic-presentation-hidden {
  opacity: 0;
}
`;

type PresentationOptions = {
  initialAnimateToSlide?: number;
  initialAnimateDuration?: number;
  initialAnimationTriggerTop?: string;
  onSlideChange?: (index: number) => void;
  disableClickToNext?: boolean;
};

export function initialize(
  document: HTMLDocument,
  svgElement: SVGSVGElement,
  optsIn: Partial<ViewportOptions> & PresentationOptions = {}
) {
  const {
    initialAnimateToSlide,
    initialAnimateDuration,
    initialAnimationTriggerTop,
    disableClickToNext,
    onSlideChange,
    ...viewportOptsIn
  } = optsIn;

  const opts = {
    initialAnimationTriggerTop: initialAnimationTriggerTop || "30%",
    initialAnimateToSlide,
    initialAnimateDuration,
    onSlideChange: onSlideChange ?? (() => undefined),
    disableClickToNext: disableClickToNext ?? false,
  };

  const presentationRootGroup = svgUtil.cloneSvgAndAddRootGroup(svgElement);
  presentationRootGroup.setAttribute("class", "presentation-root-group");

  const viewportOpts: ViewportOptions = {
    injectCss: SVG_DOCUMENT_CSS,
    ...viewportOptsIn,
  };

  const slidesContainer = document.getElementById("slides");
  if (!slidesContainer) {
    throw new Error("Invalid presentation, no element with id 'slides' found!");
  }
  slidesContainer.setAttribute("class", "presentation-slides-group");
  // Convert children to regular array and reverse it
  const slideContainers = reverse(
    Array.from(slidesContainer.children)
  ) as SVGGraphicsElement[];

  const presentation = slideContainers.map((container) => {
    const elem = svgUtil.getSlideElementFromContainer(
      document,
      container as SVGGraphicsElement
    );
    return {
      viewportPosition: svgUtil.getFinalBBox(elem),
      container,
      element: elem,
      fadeInOut: svgUtil.findMatching(container, (node: SVGElement) =>
        node.id.startsWith("fade-in-out")
      ),
    };
  });

  presentation.forEach((slide, slideIndex) => {
    slide.fadeInOut.forEach((element) => {
      if (slideIndex !== 0) {
        element.setAttribute("opacity", "0");
      }
    });

    svgUtil.addClass(slide.element, "presentic-presentation-hidden");
  });

  const rotations = presentation.map((i) => i.viewportPosition.rotation);
  forEach(
    mathUtil.normalizeRotations(rotations),
    (rotation: number, i: number) => {
      // Normalize rotations to make the presentation flow better,
      // and also we need to reverse the rotation to make the viewport
      // rotate correctly
      presentation[i].viewportPosition.rotation = -rotation;
    }
  );

  function initialAnimation() {
    if (!isUndefined(opts.initialAnimateToSlide)) {
      animateToSlide(opts.initialAnimateToSlide, {
        duration: opts.initialAnimateDuration,
      });
    }
  }

  const initialAnimationOnce = once(initialAnimation);

  let observer: IntersectionObserver | undefined = undefined;
  if (!isUndefined(initialAnimateToSlide)) {
    const fromBottom = 100 - parseFloat(opts.initialAnimationTriggerTop);
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          initialAnimationOnce();
        }
      },
      {
        rootMargin: `0px 0px -${fromBottom}% 0px`,
        threshold: 0,
      }
    );
  }

  const state = {
    step: 0,
    viewport: svgViewport(
      document,
      svgElement,
      presentationRootGroup,
      viewportOpts
    ),
  };

  function animateToSlide(
    stepIndex: number,
    animationOptions?: ViewportAnimateOptions
  ) {
    const currentStep = presentation[state.step];
    const nextStepIndex = getStepIndex(stepIndex);
    const nextStep = presentation[nextStepIndex];

    const _opts = {
      fadeInElements: nextStep.fadeInOut,
      ...animationOptions,
    };

    if (state.step !== nextStepIndex) {
      // Initially when starting at 0, we don't want to fade in and out
      // the same slide
      _opts.fadeOutElements = currentStep.fadeInOut;
    }

    state.viewport.animateTo(nextStep.viewportPosition, _opts);

    if (DEBUG) {
      currentStep.element.setAttribute(
        "class",
        "presentic-presentation-hidden"
      );
      nextStep.element.setAttribute("class", "");
    }

    state.step = nextStepIndex;
    opts.onSlideChange(nextStepIndex);
  }

  function next() {
    animateToSlide(state.step + 1);
  }

  function previous() {
    animateToSlide(state.step - 1);
  }

  function index() {
    return state.step;
  }

  function length() {
    return presentation.length;
  }

  function getStepIndex(index: number) {
    if (index < 0) {
      return presentation.length - 1;
    }

    return index % presentation.length;
  }

  function addListeners() {
    if (!disableClickToNext) {
      svgElement.addEventListener("click", next);
    }

    if (!isUndefined(observer)) {
      observer.observe(svgElement);
    }
  }

  function destroy() {
    svgElement.removeEventListener("click", next);
    state.viewport.destroy();

    if (!isUndefined(observer)) {
      observer.disconnect();
    }
  }

  addListeners();
  const currentStep = presentation[state.step];
  const values = {
    ...currentStep.viewportPosition,
    fadeInOpacity: 1,
    fadeOutOpacity: 0,
  };
  state.viewport.setTo(values);

  return {
    next,
    previous,
    animateToSlide,
    destroy,
    index,
    length,
    onSlideChange,
  };
}
