/**
 * Persistence for seminar feedback — Postgres (Supabase) via Prisma.
 *
 * Its own table, `seminar_feedback`, rather than more columns on
 * `waitlist_signups`: the two forms ask different questions of different
 * people at different moments, and folding them together would mean a
 * respondent's row carries seven NULL waitlist answers and a waitlist row
 * carries nine NULL survey answers. Separate tables also let this one hold its
 * required answers as NOT NULL, which the waitlist table cannot — it has
 * history that predates its own questions.
 */
import { prisma } from "./prisma";
import type { SeminarAnswers } from "./seminar-feedback";

export type SeminarFeedbackRow = {
  name: string;
  /** The whole number in E.164, e.g. `+919876543210`. */
  phoneNumber: string;
  email: string;
  answers: SeminarAnswers;
  createdAt: Date;
};

export async function saveSeminarFeedback(
  row: SeminarFeedbackRow,
): Promise<{ alreadyResponded: boolean }> {
  // INSERT ... ON CONFLICT DO NOTHING, so the unique index on `email` settles
  // a duplicate in the same statement as the insert. A `findUnique` first
  // would race — two submissions from the same address at once would both pass
  // the check and one would get a 500 instead of a clean "already responded".
  const { count } = await prisma.seminarFeedback.createMany({
    data: [
      {
        name: row.name,
        phoneNumber: row.phoneNumber,
        email: row.email,
        createdAt: row.createdAt,
        ...row.answers,
      },
    ],
    skipDuplicates: true,
  });

  if (count > 0) return { alreadyResponded: false };

  // A second pass is someone revising their feedback, so it wins outright —
  // including on the two optional questions, where "revised" can legitimately
  // mean "cleared". Merging instead (keep the old value when the new one is
  // blank) would look kinder and would make it impossible to withdraw a
  // testimonial you'd rather we didn't quote. `createdAt` stays put;
  // `updatedAt` moves on its own.
  await prisma.seminarFeedback.update({
    where: { email: row.email },
    data: {
      name: row.name,
      phoneNumber: row.phoneNumber,
      ...row.answers,
    },
  });

  return { alreadyResponded: true };
}

/** Dev/debug helper — how many responses are in. */
export async function seminarFeedbackCount(): Promise<number> {
  return prisma.seminarFeedback.count();
}
