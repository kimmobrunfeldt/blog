import { Type, Static } from "@sinclair/typebox";

export const PostMetadataSchema = Type.Object({
  layout: Type.Optional(
    Type.Union([Type.Literal("regular"), Type.Literal("presentic")])
  ),
  presenticSource: Type.Optional(Type.String()),
  title: Type.String(),
  slug: Type.String(),
  path: Type.String(),
  createdAt: Type.String(),
  coverImage: Type.String(),
  tags: Type.Array(Type.String()),
  preview: Type.Optional(Type.Boolean()),
  description: Type.String(),
  charCount: Type.Number(),
  wordCount: Type.Number(),
  readTimeMin: Type.Number(),
});

type CommonPostMetadata = Omit<
  Static<typeof PostMetadataSchema>,
  "layout" | "presenticSource"
> & {
  // Auto-generated
  orderNumber: number;
  html: string;
};

export type PostMetadata =
  | ({
      layout: "regular";
    } & CommonPostMetadata)
  | ({
      layout: "presentic";
      presenticSource: string;
    } & CommonPostMetadata);

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
