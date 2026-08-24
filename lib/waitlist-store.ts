/**
 * Persistence for waitlist signups — Postgres (Supabase) via Prisma.
 *
 * Backed by the `waitlist_signups` table; see `prisma/schema.prisma`. The
 * in-memory Map that stood in for this module while the database was being
 * set up is gone, so signups now survive a restart.
 */
import { prisma } from "./prisma";
import type { WaitlistSource } from "./waitlist";

export type WaitlistSignup = {
  email: string;
  source: WaitlistSource;
  createdAt: Date;
};

export async function saveWaitlistSignup(
  signup: WaitlistSignup,
): Promise<{ alreadyOnList: boolean }> {
  // `createMany` + `skipDuplicates` compiles to INSERT ... ON CONFLICT DO
  // NOTHING, so the unique index on `email` settles the duplicate in the same
  // statement as the insert. A `findUnique` first would race — two people
  // submitting the same address at once would both pass the check, and one
  // would get a 500 instead of "already on the list" — and a create/catch-P2002
  // would win the race but make Prisma log a scary error on every repeat
  // signup, which is a normal outcome here rather than a fault.
  const { count } = await prisma.waitlistSignup.createMany({
    data: [{ email: signup.email, source: signup.source, createdAt: signup.createdAt }],
    skipDuplicates: true,
  });

  return { alreadyOnList: count === 0 };
}

/** Dev/debug helper — how many signups are on the list. */
export async function waitlistCount(): Promise<number> {
  return prisma.waitlistSignup.count();
}
