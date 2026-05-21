import { Injectable, NotFoundException } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { TagResponseDto, toTagResponseDto } from './dto/tag-response.dto';

@Injectable()
export class TagService {
  constructor(private readonly repo: TagRepository) {}

  async findAll(): Promise<TagResponseDto[]> {
    const tags = await this.repo.findAll();
    return tags.map(toTagResponseDto);
  }

  async findBySlug(slug: string): Promise<TagResponseDto> {
    const tag = await this.repo.findBySlug(slug);
    if (!tag) throw new NotFoundException(`Tag ${slug} not found.`);
    return toTagResponseDto(tag);
  }

  async upsertMany(slugs: string[]): Promise<string[]> {
    return this.repo.upsertMany(slugs);
  }
}
