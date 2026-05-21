import { PostCategory } from 'generated/prisma/enums';

export function inferCategory(tags: string[]): PostCategory {
  const map: Record<string, PostCategory> = {
    project: PostCategory.projects,
    projects: PostCategory.projects,
    insight: PostCategory.insights,
    insights: PostCategory.insights,
    photo: PostCategory.photos,
    photos: PostCategory.photos,
    snippet: PostCategory.snippets,
    snippets: PostCategory.snippets,
    discussion: PostCategory.discussions,
    discussions: PostCategory.discussions,
  };

  for (const tag of tags) {
    const match = map[tag.toLowerCase()];
    if (match) return match;
  }

  return PostCategory.home;
}

export function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}
