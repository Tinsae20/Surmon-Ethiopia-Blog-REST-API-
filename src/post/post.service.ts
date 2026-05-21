import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';
import { FindPostDto } from './dto/find-post.dto';
import { toPostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly repo: PostRepository,
    @Inject(CACHE_MANAGER) private cache: cacheManager.Cache,
  ) {}

  async findAll(query: FindPostDto) {
    const cacheKey = `posts:${JSON.stringify(query)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const posts = await this.repo.findMany(query);
    const result = posts.map(toPostResponseDto);

    await this.cache.set(cacheKey, result, 300);
    return result;
  }

  async findOne(slug: string) {
    const cacheKey = `post:${slug}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const post = await this.repo.findBySlug(slug);
    if (!post) throw new NotFoundException(`Post ${slug} not found.`);

    const result = toPostResponseDto(post);
    await this.cache.set(cacheKey, result, 600);

    this.repo.incrementViewCount(post.id).catch(() => {});

    return result;
  }

  async getFeatured() {
    const cached = await this.cache.get('posts:featured');
    if (cached) return cached;

    const posts = await this.repo.findFeatured();
    const result = posts.map(toPostResponseDto);
    await this.cache.set('posts:featured', result, 600);
    return result;
  }
}
