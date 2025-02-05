import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }

  generateKey(
    query: Record<string, any>,
  ): string {
    const sortedQuery = this.sortObject(query);
    const dataString = JSON.stringify(sortedQuery);

    // Hash the string to create a unique key
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  private sortObject(obj: Record<string, any>): Record<string, any> {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.sortObject);
    }

    return Object.keys(obj)
      .sort() // Sort properties alphabetically
      .reduce((sorted, key) => {
        sorted[key] = this.sortObject(obj[key]);
        return sorted;
      }, {});
  }
}
