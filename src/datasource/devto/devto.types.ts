export interface DevtoArticle {
  id: number;
  slug: string;
  title: string;
  description: string; // excerpt
  body_markdown: string;
  body_html: string;
  cover_image: string | null;
  social_image: string | null;
  tag_list: string[];
  tags: string; // comma-separated string (also available)
  canonical_url: string;
  url: string;
  published: boolean;
  published_at: string; // ISO datetime
  reading_time_minutes: number;
  page_views_count: number;
  positive_reactions_count: number;
  comments_count: number;
  user: {
    username: string;
    name: string;
    profile_image: string;
  };
}
