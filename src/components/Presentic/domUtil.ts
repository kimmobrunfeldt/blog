export function removeClass(element: HTMLElement, className: string): void {
  const classes = element.className.split(" ");

  const newClasses: string[] = [];
  for (let i = 0; i < classes.length; ++i) {
    if (classes[i] !== className) {
      newClasses.push(classes[i]);
    }
  }

  element.className = newClasses.join(" ");
}

export function addClass(element: HTMLElement, className: string): void {
  if (!hasClass(element, className)) {
    element.className += " " + className;
  }
}

export function hasClass(element: HTMLElement, className: string): boolean {
  const classes = element.className.split(" ");
  for (let i = 0; i < classes.length; ++i) {
    if (classes[i].trim() === className) {
      return true;
    }
  }

  return false;
}
