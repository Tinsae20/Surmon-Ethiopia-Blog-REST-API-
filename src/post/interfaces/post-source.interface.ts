export interface PostSourceAdapter {
  fetchAll(options: FetchOptions): Promise<RawPost[]>;
  fetchOne(sourceId: string): Promise<RawPost | null>;
  fetchFeatured(): Promise<RawPost[]>;
}

export interface FetchOptions {
  page?: number;
  limit?: number;
  tag?: string;
}

export interface RawPost {
  sourceId: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  tags: string[];
  featured: boolean;
  publishedAt: Date;
}
