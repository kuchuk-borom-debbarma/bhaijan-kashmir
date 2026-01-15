import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Clean any potential quotes from the env var (common issue)
const connectionString = process.env.DATABASE_URL?.replace(/^["']|["']$/g, "");

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from environment variables.");
}

// Debug Log (First 20 chars only for safety)
console.log(`[DB Config] URL Start: ${connectionString.substring(0, 20)}...`);

// Determine if we are using Neon (cloud) or local Postgres
// STRICT CHECK: Only use Neon adapter if it's neon.tech AND NOT localhost
const isNeon = connectionString.includes('neon.tech') && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');

console.log(`[DB Config] Mode: ${isNeon ? 'Neon (Serverless)' : 'Local (Standard)'}`);

let adapter;

try {
  if (isNeon) {
    neonConfig.webSocketConstructor = ws;
    const pool = new NeonPool({ connectionString });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter = new PrismaNeon(pool as any);
    console.log('🔌 Connected to Neon DB');
  } else {
    // Explicitly pass connectionString to Pool
    const pool = new Pool({ connectionString });
    adapter = new PrismaPg(pool);
    console.log('💻 Connected to Local Postgres');
  }
} catch (err) {
  console.error("Failed to initialize database adapter:", err);
  throw err;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;