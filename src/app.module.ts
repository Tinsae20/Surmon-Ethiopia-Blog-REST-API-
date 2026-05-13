import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { DatasourceModule } from './datasource/datasource.module';
import { ScheduleModule } from '@nestjs/schedule';

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
    DatasourceModule,
    PostsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
