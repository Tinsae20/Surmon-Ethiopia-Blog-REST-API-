import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsSyncService } from './posts.sync.service';
import { PostsRepositoryService } from './posts.repository.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsSyncService, PostsRepositoryService],
})
export class PostsModule {}
