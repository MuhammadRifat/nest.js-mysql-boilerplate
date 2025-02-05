import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CachingService } from './caching.service';

@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 20,
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
