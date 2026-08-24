-- Supabase exposes every table in `public` through PostgREST, so without RLS
-- the project's anon key can read the whole waitlist. Enabling RLS with no
-- policies denies anon and authenticated outright; the app is unaffected
-- because Prisma connects as the table's owner over the direct connection.
--
-- Deliberately not FORCE ROW LEVEL SECURITY: that would subject the owner to
-- the (empty) policy set too, and would lock the app out of its own table for
-- any connection role that lacks BYPASSRLS.
ALTER TABLE "waitlist_signups" ENABLE ROW LEVEL SECURITY;

-- Belt and braces: revoke the grants Supabase hands those roles by default.
REVOKE ALL ON TABLE "waitlist_signups" FROM anon, authenticated;
