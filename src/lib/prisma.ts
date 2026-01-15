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

// Explicitly control adapter usage. Default to false (Standard TCP) for stability.
// Only enable this in production serverless environments.
const useNeonAdapter = process.env.USE_NEON_ADAPTER === "true";

console.log(`[DB Config] Adapter: ${useNeonAdapter ? 'Neon (Serverless/WS)' : 'Standard (TCP)'}`);

let adapter;

try {
  if (useNeonAdapter) {
    neonConfig.webSocketConstructor = ws;
    const pool = new NeonPool({ connectionString });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter = new PrismaNeon(pool as any);
  } else {
    // Standard Prisma Client (no adapter needed for TCP)
    // We leave adapter undefined to let PrismaClient use its built-in engine
  }
} catch (err) {
  console.error("Failed to initialize database adapter:", err);
  throw err;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;