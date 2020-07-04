export type Post = {
  title: string;
  slug: string;
  path: string;
  createdAt: string;
};

export type Page = {
  title: string;
  path: string;
};

export type SiteData = {
  posts: Post[];
  pages: Page[];
};
