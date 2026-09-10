-- The Rockstar 2-Day Seminar Feedback Survey at /seminar-feedback gets its own
-- table rather than more columns on `waitlist_signups`. The two forms ask
-- different questions of different people at different moments; sharing a
-- table would give every waitlist row nine NULL survey answers and every
-- response seven NULL waitlist answers.
--
-- Because this table starts empty, the seven required answers can be NOT NULL
-- and mean it. `waitlist_signups` had to make its equivalents nullable — it
-- had rows that predated its own questions, and a NOT NULL there would either
-- reject that history or need an invented answer backfilled into it.
--
-- The three optional columns are nullable on purpose, `promo_consent` most of
-- all: NULL there means "didn't say", which is not the same as "no" and must
-- not collapse into it. It is the column anyone would be pointed at if a
-- respondent objected to being quoted.

-- CreateTable
CREATE TABLE "seminar_feedback" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "overall_rating" TEXT NOT NULL,
    "content_relevance" TEXT NOT NULL,
    "greatest_impact" TEXT NOT NULL,
    "apply_confidence" TEXT NOT NULL,
    "thirty_day_action" TEXT NOT NULL,
    "speaker_rating" TEXT NOT NULL,
    "event_rating" TEXT NOT NULL,
    "improvement_ideas" TEXT,
    "testimonial" TEXT,
    "promo_consent" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seminar_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seminar_feedback_email_key" ON "seminar_feedback"("email");

-- CreateIndex
CREATE INDEX "seminar_feedback_created_at_idx" ON "seminar_feedback"("created_at");

-- Supabase exposes every table in `public` through PostgREST, so without RLS
-- the project's anon key can read every response — names, phone numbers and
-- open-text feedback included. Enabling RLS with no policies denies anon and
-- authenticated outright; the app is unaffected because Prisma connects as
-- the table's owner over the direct connection.
--
-- Deliberately not FORCE ROW LEVEL SECURITY, for the same reason as
-- `waitlist_signups`: that would subject the owner to the (empty) policy set
-- too and lock the app out of its own table on any role without BYPASSRLS.
ALTER TABLE "seminar_feedback" ENABLE ROW LEVEL SECURITY;

-- Belt and braces: revoke the grants Supabase hands those roles by default.
REVOKE ALL ON TABLE "seminar_feedback" FROM anon, authenticated;
