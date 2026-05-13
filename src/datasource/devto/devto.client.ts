import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DevtoArticle } from './devto.types';
import { URL } from 'url';

@Injectable()
export class DevtoClient {
  private readonly apiKey: string;
  private readonly username: string;
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('DEVTO_API_KEY', '');
    this.username = this.config.get<string>('DEVTO_USERNAME', '');
    this.baseUrl = this.config.get<string>(
      'DEVTO_BASE_URL',
      'https://dev.to/api',
    );
  }

  private get headers() {
    return {
      'api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async getArticles(page = 1, perPage = 30): Promise<DevtoArticle[]> {
    const url = new URL(`${this.baseUrl}/articles`);
    url.searchParams.set('username', this.username);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('state', 'published');

    const res = await fetch(url.toString(), { headers: this.headers });
    if (!res.ok) throw new Error(`Failed to fetch articles: ${res.status}`);
    return res.json() as Promise<DevtoArticle[]>;
  }

  async getArticalBySlug(slug: string): Promise<DevtoArticle | null> {
    const res = await fetch(
      `${this.baseUrl}/articles/${this.username}/${slug}`,
      {
        headers: this.headers,
      },
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch article: ${res.status}`);
    return res.json() as Promise<DevtoArticle>;
  }

  async getAllArticles(): Promise<DevtoArticle[]> {
    const articles: DevtoArticle[] = [];
    let page = 1;

    while (true) {
      const batch = await this.getArticles(page, 30);
      if (batch.length === 0) break;
      articles.push(...batch);
      page++;
    }

    return articles;
  }
}
