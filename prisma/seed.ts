import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

const connectionString = process.env.DATABASE_URL!;
const isNeon = connectionString.includes('neon.tech');

let adapter;

if (isNeon) {
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({ connectionString });
  adapter = new PrismaNeon(pool);
  console.log('🌱 Seeding Neon DB...');
} else {
  const pool = new Pool({ connectionString });
  adapter = new PrismaPg(pool);
  console.log('🌱 Seeding Local Postgres...');
}

const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Categories
  const spices = await prisma.category.upsert({
    where: { slug: 'spices' },
    update: {},
    create: {
      name: 'Spices',
      slug: 'spices',
      image: '/placeholder-saffron.jpg',
    },
  });

  const dryFruits = await prisma.category.upsert({
    where: { slug: 'dry-fruits' },
    update: {},
    create: {
      name: 'Dry Fruits',
      slug: 'dry-fruits',
      image: '/placeholder-walnut.jpg',
    },
  });

  const organic = await prisma.category.upsert({
    where: { slug: 'organic' },
    update: {},
    create: {
      name: 'Organic',
      slug: 'organic',
      image: '/placeholder-honey.jpg',
    },
  });

  const handicrafts = await prisma.category.upsert({
    where: { slug: 'handicrafts' },
    update: {},
    create: {
      name: 'Handicrafts',
      slug: 'handicrafts',
      image: '/placeholder-pashmina.jpg',
    },
  });
  
  const beverages = await prisma.category.upsert({
    where: { slug: 'beverages' },
    update: {},
    create: {
      name: 'Beverages',
      slug: 'beverages',
      image: '/placeholder-kahwa.jpg',
    },
  });

  // Products
  const products = [
    {
      name: "Premium Mongra Saffron",
      description: "The finest saffron from the fields of Pampore. Known for its potent color and aroma.",
      price: 550.00,
      image: "/placeholder-saffron.jpg",
      categoryId: spices.id,
      featured: true,
    },
    {
      name: "Kashmiri Walnuts (Akhrot)",
      description: "Organic, snow-white walnut kernels rich in Omega-3.",
      price: 850.00,
      image: "/placeholder-walnut.jpg",
      categoryId: dryFruits.id,
      featured: true,
    },
    {
      name: "Pure Acacia Honey",
      description: "Raw and unprocessed honey from the Kashmir valley.",
      price: 450.00,
      image: "/placeholder-honey.jpg",
      categoryId: organic.id,
      featured: true,
    },
    {
      name: "Handwoven Pashmina Shawl",
      description: "Authentic hand-spun and hand-woven Pashmina.",
      price: 12000.00,
      image: "/placeholder-pashmina.jpg",
      categoryId: handicrafts.id,
      featured: true,
    },
     {
      name: "Kashmiri Chilies (Whole)",
      description: "Vibrant red color with mild heat, essential for Rogan Josh.",
      price: 320.00,
      image: "/placeholder-chili.jpg",
      categoryId: spices.id,
      featured: false,
    },
    {
      name: "Almonds (Mamra)",
      description: "Premium Mamra almonds, rich in oil and nutrition.",
      price: 1200.00,
      image: "/placeholder-almonds.jpg",
      categoryId: dryFruits.id,
      featured: false,
    },
    {
      name: "Saffron Tea (Kahwa)",
      description: "Traditional Kashmiri green tea with spices and saffron.",
      price: 250.00,
      image: "/placeholder-kahwa.jpg",
      categoryId: beverages.id,
      featured: false,
    },
    {
      name: "Walnut Wood Carving Box",
      description: "Intricately carved jewelry box made from walnut wood.",
      price: 1500.00,
      image: "/placeholder-woodbox.jpg",
      categoryId: handicrafts.id,
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
