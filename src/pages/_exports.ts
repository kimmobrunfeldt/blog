import { getData as getIndexData, default as Index } from "./Index";

export const pages = [
  {
    getData: getIndexData,
    Component: Index,
  },
];
