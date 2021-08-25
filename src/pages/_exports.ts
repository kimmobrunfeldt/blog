import { getData as getIndexData, default as Index } from "./Index";
import { getData as getPostsData, default as Posts } from "./Posts";
import { getData as get404Data, default as NotFound404 } from "./NotFound404";

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
  {
    getData: get404Data,
    Component: NotFound404,
    fileName: "NotFound404",
  },
];
