-- The join form asks for the dialling code and the national number as two
-- separate inputs, so the row keeps them apart too. Nullable like the rest of
-- the contact fields: the signups that predate the form have no phone at all.

-- AlterTable
ALTER TABLE "waitlist_signups" ADD COLUMN     "phone_country_code" TEXT;
