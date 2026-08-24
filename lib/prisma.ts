import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

/**
 * The one Prisma Client for the app.
 *
 * Cached on `globalThis` because Next's dev server re-evaluates the module
 * graph on every edit — without this, each HMR pass would open a fresh pool
 * against Supabase and the connection limit is reached in a handful of saves.
 */
const globalForPrisma = globalThis as unknown as { __rockstarPrisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set — waitlist signups have nowhere to go. " +
        "Copy the Supabase direct connection string into .env.",
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = (globalForPrisma.__rockstarPrisma ??= createClient());
