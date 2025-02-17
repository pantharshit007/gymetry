import { env } from "@/env";
import { Duration, Ratelimit } from "@upstash/ratelimit";
import { Redis as UpstashRedis } from "@upstash/redis";
import Redis from "ioredis";

const REDIS_URL = env.REDIS_URL;
const REDIS_REST_URL = env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = env.UPSTASH_REDIS_REST_TOKEN;

const LIMIT = 10;
const DURATION = 60;

class RateLimiter {
  private static instance: RateLimiter;
  private ratelimit: Ratelimit | null = null;
  private redis: UpstashRedis | Redis;
  private useUpstash: boolean;

  private constructor() {
    // Check if Upstash Redis credentials are available
    if (REDIS_REST_URL && REDIS_TOKEN) {
      this.useUpstash = true;
      this.redis = new UpstashRedis({
        url: REDIS_REST_URL,
        token: REDIS_TOKEN,
      });

      this.ratelimit = new Ratelimit({
        redis: this.redis,
        limiter: Ratelimit.slidingWindow(LIMIT, "60 s"),
        analytics: true,
        prefix: "@gymetry_ratelimit",
      });

      // Fallback to ioredis
    } else {
      this.useUpstash = false;
      this.redis = new Redis(REDIS_URL);
    }
  }

  public static getInstance(): RateLimiter {
    if (!this.instance) {
      this.instance = new RateLimiter();
    }
    return this.instance;
  }

  /**
   * Check if the request is allowed based on the identifier
   * @param identifier - The key to track requests (e.g., IP/userId)
   * @returns Rate limit result with success status and limit information
   */
  async isAllowed(identifier: string) {
    // Use Upstash Ratelimit
    if (this.useUpstash && this.ratelimit) {
      const result = await this.ratelimit.limit(identifier);
      return result;

      // Use ioredis fallback
    } else if (this.redis instanceof Redis) {
      const key = `rate-limit:${identifier}`;

      const current = await this.redis.incr(key);
      if (current === 1) {
        await this.redis.expire(key, DURATION);
      }

      return {
        success: current <= LIMIT,
        limit: LIMIT,
        remaining: Math.max(0, LIMIT - current),
        reset: Date.now() + DURATION * 1000,
      };
    } else {
      throw new Error("No rate-limiting mechanism available.");
    }
  }
}

export const rateLimiter = RateLimiter.getInstance();
