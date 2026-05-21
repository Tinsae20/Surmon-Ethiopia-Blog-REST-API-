export class TagResponseDto {
  id!: string;
  slug!: string;
  label!: string;
  postCount!: number;
}

export function toTagResponseDto(tag: {
  id: string;
  slug: string;
  label: string;
  _count: { posts: number };
}): TagResponseDto {
  return {
    id: tag.id,
    slug: tag.slug,
    label: tag.label,
    postCount: tag._count.posts,
  };
}
