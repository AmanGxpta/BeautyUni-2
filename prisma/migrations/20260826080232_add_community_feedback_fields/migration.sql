-- The waitlist form grew from one email field into the RS Community join +
-- post-seminar feedback form, so the row grew with it.
--
-- Every added column is nullable: the signups collected before this migration
-- answered none of these questions, and a response that skips the open-ended
-- ones is still a response. `updated_at` is the one exception — it is NOT NULL
-- with a default so existing rows backfill to now() and a re-submission can be
-- told apart from the original signup.

-- AlterTable
ALTER TABLE "waitlist_signups" ADD COLUMN     "changes_team_comms" BOOLEAN,
ADD COLUMN     "education_ideas" TEXT,
ADD COLUMN     "helps_guest_experience" BOOLEAN,
ADD COLUMN     "implement_tomorrow" TEXT,
ADD COLUMN     "loved_seminar" BOOLEAN,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "solved_challenges" BOOLEAN,
ADD COLUMN     "top_takeaway" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
