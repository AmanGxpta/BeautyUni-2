-- The dialling code and the national number were two columns because the form
-- asks for them as two controls. That split earned nothing past the form: what
-- anyone reading or exporting this table wants is a number they can dial, and
-- getting one meant concatenating two fields by hand every time.
--
-- Prisma's generated version of this migration dropped both columns before
-- adding the new one, which loses every number. The backfill below runs first
-- instead, so this is correct on a database that has rows and not only on the
-- one it was written against (where all seven signups predate the form and
-- carry no phone at all).
--
-- The result is E.164 with no separators — `+91` || `9876543210`. Both halves
-- are already normalized on the way in: the code carries its `+`, the national
-- number is digits only with the trunk zero stripped, so a plain concatenation
-- is the canonical form rather than an approximation of it.

-- AlterTable
ALTER TABLE "waitlist_signups" ADD COLUMN "phone_number" TEXT;

-- Backfill before anything is dropped. A row missing either half has no
-- dialable number to build, so it stays NULL rather than becoming a fragment.
UPDATE "waitlist_signups"
SET "phone_number" = "phone_country_code" || "phone"
WHERE "phone_country_code" IS NOT NULL
  AND "phone" IS NOT NULL;

ALTER TABLE "waitlist_signups"
  DROP COLUMN "phone_country_code",
  DROP COLUMN "phone";
