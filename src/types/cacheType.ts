import { env } from "@/env";

export interface CacheMethod<T = any> {
  set<T = any>(
    type: string,
    args: string[],
    value: T,
    expirySeconds?: number,
  ): Promise<void>;
  get<T = any>(type: string, args: string[]): Promise<T | null>;
  evict(type: string, args: string[]): Promise<void | null>;
}

export interface CacheInMemory {
  value: any;
  expiry: number | null;
}

export const CACHE_TTL = env.CACHE_TTL ? Number(env.CACHE_TTL) : 86400;

export const CACHE_TYPES = {
  ANALYZE_LOG: "analyzeLog",
  STREAK: "streak",
};
