import { getData as getIndexData, default as Index } from "./Index";
import { getData as getPostsData, default as Posts } from "./Posts";

export const pages = [
  {
    getData: getIndexData,
    Component: Index,
    fileName: "Index",
  },
  {
    getData: getPostsData,
    Component: Posts,
    fileName: "Posts",
  },
];
