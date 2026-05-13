import { RawPost } from 'src/modules/posts/interfaces/post-source.interface';
import { DevtoArticle } from './devto.types';

export function mapDevtoArticle(article: DevtoArticle): RawPost {
  return {
    sourceId: String(article.id),
    slug: article.slug,
    title: article.title,
    excerpt: article.description ?? '',
    body: article.body_html ?? article.body_markdown,
    coverImage: article.cover_image ?? article.social_image ?? undefined,
    tags: article.tag_list,
    featured: article.tag_list.includes('featured'),
    publishedAt: new Date(article.published_at),
  };
}
