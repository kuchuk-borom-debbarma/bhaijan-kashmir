import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL!;

// Determine if we are using Neon (cloud) or local Postgres
const isNeon = connectionString.includes('neon.tech');

let adapter;

if (isNeon) {
  // Configure Neon for serverless environments
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({ connectionString });
  adapter = new PrismaNeon(pool);
  console.log('🔌 Connected to Neon DB');
} else {
  // Use standard Postgres driver for local development
  const pool = new Pool({ connectionString });
  adapter = new PrismaPg(pool);
  console.log('💻 Connected to Local Postgres');
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;