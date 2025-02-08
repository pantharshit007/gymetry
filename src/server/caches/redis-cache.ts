import Redis from "ioredis";
import superjson from "superjson";
import { CacheMethod } from "@/types/cacheType";

export class RedisCache<T> implements CacheMethod<T> {
  private client: Redis;
  private static instance: RedisCache<any>;

  private constructor(redisUrl: string) {
    this.client = new Redis(redisUrl);
  }

  static getInstance<T>(redisUrl: string): RedisCache<T> {
    if (!this.instance) {
      this.instance = new RedisCache<T>(redisUrl);
    }
    return this.instance;
  }

  private generateKey(type: string, args: string[]): string {
    return `${type}:${args.join(":")}`;
  }

  async set<T = any>(
    type: string,
    args: string[],
    value: T,
    expirySeconds?: number,
  ): Promise<void> {
    try {
      const key = this.generateKey(type, args);
      const serializedValue = superjson.stringify(value);

      if (expirySeconds) {
        await this.client.set(key, serializedValue, "EX", expirySeconds);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      console.error("[ERROR-CACHE] setting cache: ", error);
      throw error;
    }
  }

  async get<T = any>(type: string, args: string[]): Promise<T | null> {
    try {
      const key = this.generateKey(type, args);
      const value = await this.client.get(key);
      return value ? superjson.parse<T>(value) : null;
    } catch (error) {
      console.error("[ERROR-CACHE] getting cache: ", error);
      throw error;
    }
  }

  async evict(type: string, args: string[]): Promise<void> {
    try {
      const key = this.generateKey(type, args);
      await this.client.del(key);
    } catch (error) {
      console.error("[ERROR-CACHE] evicting cache: ", error);
      throw error;
    }
  }
}
