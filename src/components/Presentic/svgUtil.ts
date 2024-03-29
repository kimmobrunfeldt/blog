import forEach from "lodash/forEach";
import * as mathUtil from "./mathUtil";

const SVG_NS = "http://www.w3.org/2000/svg";

export function cloneSvgAndAddRootGroup(svgElement: SVGSVGElement) {
  const g = document.createElementNS(SVG_NS, "g");
  const children = Array.from(svgElement.children);
  children.forEach((child) => {
    g.appendChild(child.cloneNode(true));
    svgElement.removeChild(child);
  });

  svgElement.appendChild(g);
  return g;
}

export function visitMatching(
  node: SVGElement,
  matcher: (node: SVGElement) => boolean,
  cb: (node: SVGElement) => void
): void {
  if (!node.hasChildNodes()) {
    return;
  }

  const children = Array.from(node.children) as SVGElement[];
  children.forEach((child) => {
    if (matcher(child)) {
      cb(child);
    }

    visitMatching(child, matcher, cb);
  });
}

export function findMatching(
  node: SVGElement,
  matcher: (node: SVGElement) => boolean
): SVGElement[] {
  const matches: SVGElement[] = [];
  visitMatching(node, matcher, (node) => {
    matches.push(node);
  });
  return matches;
}

export function getSlideElementFromContainer(
  svgDoc: HTMLDocument,
  container: SVGGraphicsElement
): SVGGraphicsElement {
  if (container.tagName === "rect") {
    return container;
  }

  const children = Array.from(container.children);
  const found = children.find(
    (child) => getElementTagName(svgDoc, child as SVGElement) === "rect"
  );
  if (found) {
    return found as SVGGraphicsElement;
  }

  console.warn("No slide element found for container: ", container);
  console.warn(
    "Using the container as the slide element. Presentation may behave unexpectedly."
  );
  return container;
}

export function getElementTagName(
  svgDoc: HTMLDocument,
  el: SVGElement
): string {
  if (el.tagName === "use") {
    const realElemId = el.getAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href"
    ) as string;
    const realElem = svgDoc.querySelector(realElemId);
    if (!realElem) {
      throw new Error(`Could not resolve use link: ${el}`);
    }
    return getElementTagName(svgDoc, realElem as SVGElement);
  }

  return el.tagName;
}

export function drawRect(
  svg: SVGSVGElement,
  x: number,
  y: number,
  width: number,
  height: number
): SVGRectElement {
  var rect = document.createElementNS(SVG_NS, "rect");
  rect.setAttributeNS(null, "x", String(x));
  rect.setAttributeNS(null, "y", String(y));
  rect.setAttributeNS(null, "width", String(width));
  rect.setAttributeNS(null, "height", String(height));
  rect.setAttributeNS(null, "stroke", "red");
  rect.setAttributeNS(null, "stroke-width", "5");
  rect.setAttributeNS(null, "fill-opacity", "0");
  svg.appendChild(rect);
  return rect;
}

export function getFinalBBox(svgElem: SVGGraphicsElement) {
  const box = svgElem.getBBox();
  const decomposeMatrices: mathUtil.DecomposedMatrix[] = [];
  let current: any = svgElem;
  while (current && current.tagName !== "svg") {
    forEach(current.transform.baseVal, (svgTransform) => {
      const decomposed = mathUtil.decomposeMatrix(svgTransform.matrix);
      decomposeMatrices.push(decomposed);
    });

    current = current.parentNode;
  }

  return decomposeMatrices.reduce(
    (memo, parts) => {
      return {
        x: memo.x + parts.translateX,
        y: memo.y + parts.translateY,
        width: memo.width,
        height: memo.height,
        rotation: memo.rotation + parts.rotation,
      };
    },
    {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      rotation: 0,
    }
  );
}

function getClass(el: SVGElement) {
  return el.getAttribute("class") || "";
}

export function hasClass(elem: SVGElement, name: string): boolean {
  return new RegExp("(\\s|^)" + name + "(\\s|$)").test(getClass(elem));
}

export function addClass(elem: SVGElement, name: string): void {
  if (hasClass(elem, name)) {
    return;
  }

  const existingClass = getClass(elem);
  elem.setAttribute(
    "class",
    existingClass === "" ? name : `${existingClass} ${name}`
  );
}

export function removeClass(elem: SVGElement, name: string): void {
  if (!hasClass(elem, name)) {
    return;
  }

  const newClass = getClass(elem).replace(
    new RegExp("(\\s|^)" + name + "(\\s|$)", "g"),
    "$2"
  );
  elem.setAttribute("class", newClass);
}

export function toggleClass(elem: SVGElement, name: string): void {
  const func = hasClass(elem, name) ? removeClass : addClass;
  func(elem, name);
}

export function hide(elem: SVGElement): void {
  elem.setAttribute("opacity", "0");
}
