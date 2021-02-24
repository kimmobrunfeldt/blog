import { Type, Static } from "@sinclair/typebox";

export const PostMetadataSchema = Type.Object({
  title: Type.String(),
  slug: Type.String(),
  path: Type.String(),
  createdAt: Type.String(),
  tags: Type.Array(Type.String()),
  description: Type.String(),
  charCount: Type.Number(),
});
export type PostMetadata = Static<typeof PostMetadataSchema> & {
  // Generated dynamically
  orderNumber: number;
};

export type PageMetadata = {
  title: string;
  path: string;
  tags: string[];
  description: string;
};

export type PostPage = {
  type: "post";
  data: PostMetadata;
};
export type RegularPage = {
  type: "page";
  data: PageMetadata;
};

export type AnyPage = RegularPage | PostPage;

export type SiteData = {
  pages: AnyPage[];
};

export function isPostPage(page: AnyPage): page is PostPage {
  return page.type === "post";
}
