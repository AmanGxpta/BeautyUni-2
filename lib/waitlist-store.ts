/**
 * Persistence for RS Community signups — Postgres (Supabase) via Prisma.
 *
 * Backed by the `waitlist_signups` table; see `prisma/schema.prisma`. The
 * in-memory Map that stood in for this module while the database was being
 * set up is gone, so signups now survive a restart.
 */
import { prisma } from "./prisma";
import type { WaitlistAnswers, WaitlistSource } from "./waitlist";

export type WaitlistSignup = {
  name: string;
  /** The whole number in E.164, e.g. `+919876543210`. */
  phoneNumber: string;
  email: string;
  answers: WaitlistAnswers;
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
    data: [
      {
        name: signup.name,
        phoneNumber: signup.phoneNumber,
        email: signup.email,
        source: signup.source,
        createdAt: signup.createdAt,
        ...signup.answers,
      },
    ],
    skipDuplicates: true,
  });

  if (count > 0) return { alreadyOnList: false };

  // Someone filling the form in a second time is revising their answers, not
  // making a mistake — the row is their feedback now, so the later pass wins
  // outright. It can afford to: every question is required, so a second
  // submission is a complete set of answers and can't blank anything out.
  // `createdAt` deliberately stays put; `updatedAt` moves on its own.
  await prisma.waitlistSignup.update({
    where: { email: signup.email },
    data: {
      name: signup.name,
      phoneNumber: signup.phoneNumber,
      ...signup.answers,
    },
  });

  return { alreadyOnList: true };
}

/** Dev/debug helper — how many signups are on the list. */
export async function waitlistCount(): Promise<number> {
  return prisma.waitlistSignup.count();
}
