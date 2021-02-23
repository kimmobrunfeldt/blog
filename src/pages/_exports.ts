import { getData as getIndexData, default as About } from "./About";
import { getData as getPostsData, default as Posts } from "./Posts";

export const pages = [
  {
    getData: getIndexData,
    Component: About,
    fileName: "About",
  },
  {
    getData: getPostsData,
    Component: Posts,
    fileName: "Posts",
  },
];
