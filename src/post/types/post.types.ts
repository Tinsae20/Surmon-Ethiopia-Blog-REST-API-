import { Prisma } from 'generated/prisma/client';
import { PostCategory } from 'generated/prisma/enums';

export type UpsertPostData = Prisma.PostCreateInput & {
  sourceId: string;
};

export interface FindManyParams {
  category?: PostCategory;
  tags?: string[];
  page: number;
  limit: number;
}
