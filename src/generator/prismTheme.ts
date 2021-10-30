import twConfig from "tailwind.config.js";

const twTheme = twConfig.theme;

export const theme = {
  baseColor: twTheme.colors.gray[8],
  blockBackground: twTheme.colors.gray[1],
  commentColor: twTheme.colors.gray[4],
  diffAddAccent: twTheme.colors.success[4],
  diffAddBackground: twTheme.colors.success[1],
  diffDeleteAccent: twTheme.colors.danger[4],
  diffDeleteBackground: twTheme.colors.danger[1],
  functionColor: twTheme.colors.amber[5],
  highlightAccent: twTheme.colors.warning[4],
  highlightBackground: twTheme.colors.warning[1],
  inlineCodeBackground: twTheme.colors.gray[1],
  inlineCodeColor: twTheme.colors.gray[8],
  keywordColor: twTheme.colors.amber[6],
  operatorBackground: twTheme.colors.transparent,
  operatorColor: twTheme.colors.rust[5],
  propertyColor: twTheme.colors.amber[6],
  punctuationColor: twTheme.colors.gray[5],
  selectedColor: twTheme.colors.rust[5],
  selectorColor: twTheme.colors.rust[5],
  variableColor: twTheme.colors.info[4],
};

export const darkTheme = {
  baseColor: twTheme.colors.gray[2],
  blockBackground: twTheme.colors.gray[7],
  inlineCodeBackground: twTheme.colors.gray[7],
  inlineCodeColor: twTheme.colors.gray[3],
  punctuationColor: twTheme.colors.gray[3],
};
