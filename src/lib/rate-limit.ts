import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds
});

export const checkRateLimit = async (key: string) => {
  try {
    await rateLimiter.consume(key);
    return true;
  } catch (rej) {
    return false;
  }
};
