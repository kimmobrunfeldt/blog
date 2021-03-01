import path from "path";
import { default as lodashTemplate } from "lodash/template";

export function getProjectPath(relativePath: string): string {
  return path.join(__dirname, "../..", relativePath);
}

// Three brackets because e.g. react style attributes already have two
export function renderTemplate(
  template: string,
  varsObj: Record<string, any>
): string {
  const compiled = lodashTemplate(template, {
    interpolate: /{{{([\s\S]+?)}}}/g,
  });
  return compiled(varsObj);
}
