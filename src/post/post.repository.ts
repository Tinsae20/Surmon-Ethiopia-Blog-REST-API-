import { Injectable } from '@nestjs/common';
import { Post, Prisma } from 'generated/prisma/client';
import { PostCategory } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpsertPostData } from './types';

type PostWithTags = Prisma.PostGetPayload<{
  include: { tags: { include: { tag: true } } };
}>;

type PostWithTagsAndThreads = Prisma.PostGetPayload<{
  include: {
    tags: { include: { tag: true } };
    threads: true;
  };
}>;

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    category?: PostCategory;
    tags?: string[];
    page: number;
    limit: number;
  }): Promise<PostWithTags[]> {
    const { category, tags, page, limit } = params;

    const where: Prisma.PostWhereInput = {
      ...(category && { category }),
      ...(tags?.length
        ? { tags: { some: { tag: { slug: { in: tags } } } } }
        : {}),
    };

    const result = (await this.prisma.post.findMany({
      where,
      include: {
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })) as unknown as PostWithTags[];
    return result;
  }

  async findBySlug(slug: string): Promise<PostWithTagsAndThreads | null> {
    const result = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        tags: { include: { tag: true } },
        threads: {
          where: { parentId: null },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return result;
  }

  async findFeatured(): Promise<PostWithTags[]> {
    const result = (await this.prisma.post.findMany({
      where: { featured: true },
      include: { tags: { include: { tag: true } } },
      orderBy: { publishedAt: 'desc' },
      take: 10,
    })) as unknown as PostWithTags[];
    return result;
  }

  async incrementViewCount(id: string): Promise<Post> {
    const result = await this.prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return result;
  }

  async upsertFromSource(data: UpsertPostData): Promise<Post> {
    const result = await this.prisma.post.upsert({
      where: { sourceId: data.sourceId },
      create: data,
      update: data,
    });
    return result;
  }
}
