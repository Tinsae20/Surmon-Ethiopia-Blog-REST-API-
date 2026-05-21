import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { DatasourceModule } from './datasource/datasource.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DEVTO_API_KEY: Joi.string().required(),
        DEVTO_USERNAME: Joi.string().required(),
        DEVTO_BASE_URL: Joi.string().uri().default('https://dev.to/api'),
      }),
    }),
    PrismaModule,
    DatasourceModule,
    PostsModule,
    ScheduleModule.forRoot(),
    PostModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
