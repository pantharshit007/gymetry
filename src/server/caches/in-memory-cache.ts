import superjson from "superjson";
import { CacheInMemory, CacheMethod } from "@/types/cacheType";

export class InMemoryCache<T> implements CacheMethod<T> {
  private inMemoryCache: Map<string, CacheInMemory>;
  private static instance: InMemoryCache<any>;

  private constructor() {
    this.inMemoryCache = new Map();
  }

  static getInstance<T>(): InMemoryCache<T> {
    if (!this.instance) {
      this.instance = new InMemoryCache<T>();
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
    const key = this.generateKey(type, args);
    const serializedValue = superjson.stringify(value);
    const expiryTime = expirySeconds ? Date.now() + expirySeconds * 1000 : null;
    this.inMemoryCache.set(key, { value: serializedValue, expiry: expiryTime });
  }

  async get<T = any>(type: string, args: string[]): Promise<T | null> {
    const key = this.generateKey(type, args);
    const cachedValue = this.inMemoryCache.get(key);
    if (!cachedValue) return null;

    if (cachedValue.expiry && cachedValue.expiry < Date.now()) {
      this.inMemoryCache.delete(key);
      return null;
    }
    return superjson.parse<T>(cachedValue.value);
  }

  evict(type: string, args: string[]): Promise<null | void> {
    const key = this.generateKey(type, args);
    this.inMemoryCache.delete(key);
    return Promise.resolve(null);
  }
}
