import { Controller, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.tagService.findBySlug(slug);
  }
}
