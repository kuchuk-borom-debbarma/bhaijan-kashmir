import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log("Testing Prisma Client Initialization (PrismaPg Adapter)...");
  
  const connectionString = process.env.DATABASE_URL?.replace(/^["']|["']$/g, "");
  if (!connectionString) throw new Error("No DATABASE_URL");

  try {
    // Use PrismaPg adapter for local connection
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    const prisma = new PrismaClient({ adapter });

    console.log("Client initialized. Connecting...");
    await prisma.$connect();
    console.log("Connected! Fetching user count...");
    const count = await prisma.user.count();
    console.log(`User count: ${count}`);
    await prisma.$disconnect();
    console.log("✅ Success with PrismaPg adapter");
  } catch (error) {
    console.error("❌ Failed with PrismaPg adapter:", error);
    process.exit(1);
  }
}

main();