import { env } from "@/env";
import { CacheMethod } from "@/types/cacheType";
import { RedisCache } from "./redis-cache";
import { InMemoryCache } from "./in-memory-cache";

const redisUrl = env.REDIS_URL;

class Cache<T = any> implements CacheMethod<T> {
  private delegate: CacheMethod<T>;
  private static instance: Cache<any>;

  private constructor() {
    if (redisUrl) {
      this.delegate = RedisCache.getInstance<T>(redisUrl);
    } else {
      this.delegate = InMemoryCache.getInstance<T>();
    }
  }

  static getInstance<T>(): Cache<T> {
    if (!this.instance) {
      this.instance = new Cache<T>();
    }
    return this.instance;
  }

  async set<T = any>(
    type: string,
    args: string[],
    value: T,
    expirySeconds: number,
  ): Promise<void> {
    await this.delegate.set<T>(type, args, value, expirySeconds);
  }

  async get<T>(type: string, args: string[]): Promise<T | null> {
    return this.delegate.get<T>(type, args);
  }

  /**
   * return ttl in seconds
   * @param type
   * @param args
   * @returns -2: key doesn't exist, -1: key exists but has no associated expire, >0: ttl in seconds
   */
  async getTtl(type: string, args: string[]): Promise<number | null> {
    return this.delegate.getTtl(type, args);
  }

  async evict(type: string, args: string[]): Promise<void | null> {
    return this.delegate.evict(type, args);
  }
}

export const cache = Cache.getInstance();
