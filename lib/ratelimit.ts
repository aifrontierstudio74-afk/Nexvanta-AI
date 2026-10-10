import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env, isUpstashConfigured } from '@/lib/env';

// In-memory fallback sliding window limiter
interface MemoryTokenBucket {
  tokens: number;
  lastRefill: number;
}

const memoryStore = new Map<string, MemoryTokenBucket>();

function checkMemoryRateLimit(
  key: string,
  maxTokens: number = 20,
  windowMs: number = 60000
) {
  const now = Date.now();
  const bucket = memoryStore.get(key) || { tokens: maxTokens, lastRefill: now };

  const timePassed = now - bucket.lastRefill;
  const refillAmount = Math.floor(timePassed / (windowMs / maxTokens));

  if (refillAmount > 0) {
    bucket.tokens = Math.min(maxTokens, bucket.tokens + refillAmount);
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    memoryStore.set(key, bucket);
    return {
      success: true,
      limit: maxTokens,
      remaining: bucket.tokens,
      reset: now + windowMs,
    };
  }

  memoryStore.set(key, bucket);
  return {
    success: false,
    limit: maxTokens,
    remaining: 0,
    reset: now + (windowMs / maxTokens),
  };
}

let upstashRatelimit: Ratelimit | null = null;
if (isUpstashConfigured) {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
  });
  upstashRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: 'nexvanta:ratelimit',
  });
}

export async function rateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60000
) {
  if (upstashRatelimit) {
    try {
      const res = await upstashRatelimit.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
      };
    } catch (err) {
      console.warn('Upstash ratelimit failed, falling back to memory limiter:', err);
    }
  }

  return checkMemoryRateLimit(identifier, limit, windowMs);
}
