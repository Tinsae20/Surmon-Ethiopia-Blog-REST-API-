import { Module } from '@nestjs/common';
import { DevtoClient } from './devto/devto.client';
import { DevtoAdapter } from './devto/devto.adapter';

@Module({
  providers: [
    DevtoClient,
    DevtoAdapter,
    {
      provide: 'POST_SOURCE_ADAPTER',
      useClass: DevtoAdapter,
    },
  ],
  exports: ['POST_SOURCE_ADAPTER'],
})
export class DatasourceModule {}
