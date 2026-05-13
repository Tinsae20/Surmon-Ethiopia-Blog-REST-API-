import { Injectable } from '@nestjs/common';
import { DevtoClient } from './devto.client';
import {
  FetchOptions,
  PostSourceAdapter,
  RawPost,
} from 'src/modules/posts/interfaces/post-source.interface';
import { mapDevtoArticle } from './devto.mapper';

@Injectable()
export class DevtoAdapter implements PostSourceAdapter {
  constructor(private readonly client: DevtoClient) {}

  async fetchAll(options: FetchOptions): Promise<RawPost[]> {
    const { page = 1, limit = 30, tag } = options;
    if (tag) {
      const all = await this.client.getAllArticles();
      return all.filter((a) => a.tag_list.includes(tag)).map(mapDevtoArticle);
    }

    const articles = await this.client.getArticles(page, limit);
    return articles.map(mapDevtoArticle);
  }

  async fetchOne(sourceId: string): Promise<RawPost | null> {
    const article = await this.client.getArticalBySlug(sourceId);
    if (!article) return null;
    return mapDevtoArticle(article);
  }

  async fetchFeatured(): Promise<RawPost[]> {
    const all = await this.client.getAllArticles();
    return all
      .filter((a) => a.tag_list.includes('featured'))
      .map(mapDevtoArticle);
  }
}
