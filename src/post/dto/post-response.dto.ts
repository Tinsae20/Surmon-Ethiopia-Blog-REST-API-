import { Post, PostTag, Tag, PostCategory } from 'generated/prisma/client';

type PostWithTags = Post & {
  tags: (PostTag & { tag: Tag })[];
};
export class PostResponseDto {
  id!: string;
  slug!: string;
  title!: string;
  excerpt!: string;
  coverImage!: string | null;
  category!: PostCategory;
  tags!: string[];
  featured!: boolean;
  readingTime!: number;
  viewCount!: number;
  publishedAt!: string; // ISO string
}

export function toPostResponseDto(post: PostWithTags): PostResponseDto {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    coverImage: post.coverImage ?? null,
    category: post.category,
    tags: post.tags.map((pt) => pt.tag.slug),
    featured: post.featured,
    readingTime: post.readingTime ?? 0,
    viewCount: post.viewCount,
    publishedAt: post.publishedAt.toISOString(),
  };
}
