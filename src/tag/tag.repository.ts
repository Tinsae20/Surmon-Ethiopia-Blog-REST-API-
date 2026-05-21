import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { slug: 'asc' },
      include: {
        _count: { select: { posts: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: { select: { posts: true } },
      },
    });
  }

  async upsertMany(slugs: string[]): Promise<string[]> {
    const ids: string[] = [];

    for (const slug of slugs) {
      const tag = await this.prisma.tag.upsert({
        where: { slug },
        create: { slug, label: toLabel(slug) },
        update: {},
      });
      ids.push(tag.id);
    }

    return ids;
  }
}

function toLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
