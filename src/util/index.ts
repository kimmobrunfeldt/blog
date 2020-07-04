import path from "path";
import _ from "lodash";

export function getProjectPath(relativePath: string): string {
  return path.join(__dirname, "../..", relativePath);
}

// Three brackets because e.g. react style attributes already have two
export function renderTemplate(
  template: string,
  varsObj: Record<string, any>
): string {
  const compiled = _.template(template, {
    interpolate: /{{{([\s\S]+?)}}}/g,
  });
  return compiled(varsObj);
}
