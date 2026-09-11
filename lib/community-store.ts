/**
 * Persistence for BeautyUni community members — Postgres via Prisma.
 *
 * Backed by the `community_members` table; see `prisma/schema.prisma`.
 */
import { prisma } from "./prisma";

export type CommunityMember = {
  name: string;
  /** The whole number in E.164, e.g. `+919876543210`. */
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  city: string;
  role: string;
  consentText: string;
  source: string;
  createdAt: Date;
};

export async function saveCommunityMember(
  member: CommunityMember,
): Promise<{ alreadyJoined: boolean }> {
  // `createMany` + `skipDuplicates` compiles to INSERT ... ON CONFLICT DO
  // NOTHING, so the unique index on `email` settles the duplicate in the same
  // statement as the insert. A `findUnique` first would race: two submissions
  // of the same address at once would both pass the check and one would get a
  // 500 instead of "you're already in".
  const { count } = await prisma.communityMember.createMany({
    data: [member],
    skipDuplicates: true,
  });

  if (count > 0) return { alreadyJoined: false };

  // A second submission is someone correcting their details, so the later pass
  // wins. Every field is required, so it can't blank anything out. `createdAt`
  // stays put; `updatedAt` moves on its own.
  await prisma.communityMember.update({
    where: { email: member.email },
    data: {
      name: member.name,
      phoneNumber: member.phoneNumber,
      whatsappNumber: member.whatsappNumber,
      city: member.city,
      role: member.role,
      consentText: member.consentText,
    },
  });

  return { alreadyJoined: true };
}

/** Dev/debug helper — how many people are in the community. */
export async function communityCount(): Promise<number> {
  return prisma.communityMember.count();
}
