import { RateLimiterPostgres } from 'rate-limiter-flexible';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const rateLimiter = new RateLimiterPostgres({
  storeClient: pool,
  keyPrefix: 'rate_limit',
  points: 5, // 5 requests
  duration: 60, // per 60 seconds
  tableName: 'RateLimit', // Use the table we created (Note: the lib might try to create its own if names don't match, let's stick to default behavior or ensure it maps)
});

// Since the library expects specific table columns that might differ slightly from Prisma's default BigInt handling or naming, 
// strictly speaking, rate-limiter-flexible handles table creation if it doesn't exist.
// But we defined it in Prisma to be safe and trackable.
// The library uses 'key', 'points', 'expire'. We matched that in schema.prisma.

export const checkRateLimit = async (key: string) => {
  try {
    await rateLimiter.consume(key);
    return true;
  } catch (rej) {
    return false;
  }
};
