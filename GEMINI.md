# Bhaijan-Kashmir

## Project Overview

**Bhaijan-Kashmir** is a full-stack e-commerce web application designed to sell authentic Kashmiri products like Saffron, Dry Fruits, and Handicrafts. The project emphasizes a "Kashmir Nature" aesthetic and robust backend architecture capable of running locally or in a serverless cloud environment.

### Core Technologies
-   **Framework:** Next.js 16 (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (with `@tailwindcss/postcss`), Lucide React Icons
-   **Database:** PostgreSQL
-   **ORM:** Prisma ORM (v7.2.0)
-   **Database Drivers:**
    -   `pg` & `@prisma/adapter-pg` for local development.
    -   `@neondatabase/serverless` & `@prisma/adapter-neon` for Neon Cloud deployment.

### Architecture
-   **Frontend:** Server Components for data fetching, Client Components for interactivity.
-   **Backend:** Next.js Server Actions / API Routes (implicit via App Router data fetching).
-   **Database Layer:** A unified `prisma` client (`src/lib/prisma.ts`) that automatically selects the appropriate driver based on the `DATABASE_URL` (Neon detection logic).

## Building and Running

### Prerequisites
-   Node.js (v20+ recommended)
-   Docker (for local PostgreSQL)

### Development Commands

1.  **Start Local Database:**
    ```bash
    docker-compose up -d
    ```
    *Runs PostgreSQL 15 on port 5433.*

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Database Migration & Seeding:**
    ```bash
    # Apply schema changes
    npx prisma migrate dev --name init

    # Seed the database (Local or Neon)
    npx prisma db seed
    ```

4.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    *Application available at `http://localhost:3000`.*

### Deployment (Neon DB)

To switch to Neon DB without code changes:
1.  Update `.env` with your Neon connection string (`DATABASE_URL`).
2.  Run migration/push: `npx prisma db push`.
3.  Run seed: `npx prisma db seed`.
    *The app detects the `neon.tech` domain and switches to the serverless driver automatically.*

### Build for Production
```bash
npm run build
npm start
```

## Key Files & Directories

-   **`src/app/`**: Next.js App Router pages (`page.tsx`, `layout.tsx`).
    -   `page.tsx`: Landing page with Hero and Featured Products.
    -   `shop/page.tsx`: Product listing with category filtering.
    -   `contact/page.tsx`: Contact form and details.
-   **`src/components/`**: Reusable UI components (`Navbar`, `Footer`, `ProductCard`).
-   **`src/lib/prisma.ts`**: **Crucial.** Singleton Prisma client configuration that handles the logic for switching between Local Postgres (pooling) and Neon Serverless (WebSocket/HTTP).
-   **`prisma/schema.prisma`**: Database schema defining `Product` and `Category`.
-   **`prisma/seed.ts`**: Database seeding script (idempotent upserts).
-   **`docker-compose.yml`**: Local PostgreSQL container configuration.

## Development Conventions

-   **Styling:** Utility-first with Tailwind CSS. Theme colors defined in `src/app/globals.css` (e.g., `--color-kashmir-red`, `--color-walnut`).
-   **Database Access:** Always import `prisma` from `@/lib/prisma` instead of instantiating `new PrismaClient()`.
-   **Type Safety:** Use Prisma generated types for DB entities.
-   **Seeding:** The seed script uses a custom `tsconfig.seed.json` to handle CommonJS/ESM compatibility with `ts-node`.
