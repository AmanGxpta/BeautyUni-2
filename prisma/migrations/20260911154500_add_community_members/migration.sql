-- The BeautyUni community join form at /join gets its own table rather than
-- more columns on `waitlist_signups`. That model is the Rockstar seminar's
-- ten-question form: every one of its answer columns would be NULL for a
-- community member, and every row there would carry NULL for the city, role
-- and WhatsApp number this form requires.
--
-- Because this table starts empty, every column it needs can be NOT NULL and
-- mean it.
--
-- `consent_text` stores the wording someone actually agreed to, verbatim. The
-- copy on the page will be rewritten; what an existing member consented to
-- must not change when it is. It is the column anyone would be pointed at if
-- a member ever disputed being contacted.

-- CreateTable
CREATE TABLE "community_members" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "consent_text" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'join',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "community_members_email_key" ON "community_members"("email");

-- CreateIndex
CREATE INDEX "community_members_created_at_idx" ON "community_members"("created_at");

-- Supabase exposes every table in `public` through PostgREST, so without RLS
-- the project's anon key can read every member — names, phone numbers and
-- WhatsApp numbers included. Enabling RLS with no policies denies anon and
-- authenticated outright; the app is unaffected because Prisma connects as the
-- table's owner over the direct connection.
--
-- Deliberately not FORCE ROW LEVEL SECURITY, for the same reason as the other
-- two tables: that would subject the owner to the (empty) policy set too and
-- lock the app out of its own table on any role without BYPASSRLS.
ALTER TABLE "community_members" ENABLE ROW LEVEL SECURITY;

-- Belt and braces: revoke the grants Supabase hands those roles by default.
REVOKE ALL ON TABLE "community_members" FROM anon, authenticated;
