import { Inject, Injectable, Logger } from '@nestjs/common';
import type { PostSourceAdapter } from './interfaces/post-source.interface';
import { PostRepository } from './post.repository';
import { TagService } from 'src/tag/tag.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { estimateReadingTime, inferCategory } from './post.helper';

@Injectable()
export class PostsSyncService {
  private readonly logger = new Logger(PostsSyncService.name);
  constructor(
    @Inject('POST_SOURCE_ADAPTER')
    private readonly source: PostSourceAdapter,
    private readonly repo: PostRepository,
    private readonly tagsServices: TagService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sync() {
    this.logger.log('Starting post sync...');

    try {
      const rawPosts = await this.source.fetchAll({ limit: 100 });

      for (const raw of rawPosts) {
        const category = inferCategory(raw.tags);
        const tagIds = await this.tagsServices.upsertMany(raw.tags);
        const readingTime = estimateReadingTime(raw.body);

        await this.repo.upsertFromSource({
          sourceId: raw.sourceId,
          slug: raw.slug,
          title: raw.title,
          excerpt: raw.excerpt ?? '',
          body: raw.body,
          coverImage: raw.coverImage ?? '',
          category,
          readingTime,
          publishedAt: raw.publishedAt,
          tags: {
            create: tagIds.map((id) => ({ tagId: id })),
          },
        });
      }

      this.logger.log(`Synced ${rawPosts.length} posts`);
    } catch (err) {
      this.logger.error('Sync Failed', err);
    }
  }
}
