import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { PostRepository } from './post.repository';
import { PostsSyncService } from './posts.sync.service';
import { TagModule } from 'src/tag/tag.module';
import { DatasourceModule } from 'src/datasource/datasource.module';

@Module({
  imports: [
    DatasourceModule,
    TagModule,
    CacheModule.register({
      ttl: 300,
      max: 100,
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostsSyncService],
  exports: [PostService],
})
export class PostModule {}
