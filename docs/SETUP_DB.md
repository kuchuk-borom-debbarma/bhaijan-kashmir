# Database Setup & Migration Guide

This guide explains how to manage the PostgreSQL database for **Bhaijan Kashmir**, including how to reset it, apply changes, and seed data.

## Prerequisites

*   **Node.js** (v20+)
*   **Docker** (Running locally)
*   **Environment Variables**: Ensure your `.env` contains:
    ```env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5433/bhaijan_kashmir_db?schema=public"
    ```

## 1. Starting the Database

Run the local Postgres container:
```bash
docker-compose up -d
```

## 2. Standard Migration Workflow

When you modify `prisma/schema.prisma` (e.g., adding a new model), follow these steps:

1.  **Generate Migration**: Creates SQL files based on your schema changes.
    ```bash
    npx prisma migrate dev --name describe_your_change
    ```
    *Example:* `npx prisma migrate dev --name add_inventory_field`

2.  **Generate Client**: Updates the `node_modules` so your code knows about the new types.
    ```bash
    npx prisma generate
    ```

## 3. Seeding Data

To populate the database with initial products and categories (defined in `prisma/seed.ts`):

```bash
npx prisma db seed
```

## 4. Resetting the Database (Fresh Start)

**WARNING:** This deletes **ALL** data (Users, Orders, Products). Use only in development.

```bash
npx prisma migrate reset
```
*   This command drops the schema, re-applies all migrations, and automatically runs the seed script.

## 5. Deployment (Production / Neon DB)

When deploying to a cloud provider like Vercel + Neon:

1.  **Update Env**: Set `DATABASE_URL` to your Neon connection string in the Vercel dashboard.
2.  **Push Schema**: Apply changes directly to the production DB (without creating migration files there).
    ```bash
    npx prisma db push
    ```
3.  **Seed (Optional)**:
    ```bash
    npx prisma db seed
    ```

## Troubleshooting

*   **"Database is locked"**: Stop the server (`Ctrl+C`) and run the command again.
*   **Type Errors**: Run `npx prisma generate` to refresh TypeScript definitions.
*   **Schema Drift**: If your DB is out of sync with migration files, use `npx prisma migrate reset`.
