/**
 * Contact-field rules shared by every form on the site.
 *
 * These lived in `lib/waitlist.ts` while the RS Community form was the only
 * one. The seminar feedback survey asks for the same three things under the
 * same rules, and two copies of an email regex drift — one of them gets a fix
 * and the other doesn't, and the difference only shows up as an address that
 * one form accepts and the other rejects.
 *
 * Deliberately free of any `next/*` import: the survey's client component
 * needs the question data that sits next to these rules, and a `next/server`
 * import anywhere in that chain drags the server runtime into the browser
 * bundle.
 */

export const MAX_NAME_LENGTH = 120;

const MAX_EMAIL_LENGTH = 254; // RFC 5321
const EMAIL_RE = /^[^\s@]+@[^\s@,]+\.[^\s@,.]{2,}$/;

const MIN_PHONE_DIGITS = 6;
/** 15 is E.164's total; the country code has already taken some of it. */
const MAX_PHONE_DIGITS = 14;

export function normalizeText(raw: unknown): string {
  return typeof raw === "string" ? raw.trim() : "";
}

export function normalizeEmail(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
}

export function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= MAX_EMAIL_LENGTH && EMAIL_RE.test(email);
}

/**
 * The national number, reduced to digits.
 *
 * The country is a separate field, so this half no longer has to guess at a
 * country prefix — it only has to survive the ways people type a number they
 * consider local: `98765 43210`, `098765-43210`, `(98765) 43210`. Everything
 * that isn't a digit is punctuation, and a single leading zero is the trunk
 * prefix that E.164 drops.
 */
export function normalizePhone(raw: unknown): string {
  const digits = normalizeText(raw).replace(/\D/g, "");
  return digits.startsWith("0") ? digits.replace(/^0+/, "") : digits;
}

export function isValidPhone(nationalNumber: string): boolean {
  return (
    nationalNumber.length >= MIN_PHONE_DIGITS && nationalNumber.length <= MAX_PHONE_DIGITS
  );
}

/**
 * A yes/no answer, as it comes off a radio group.
 *
 * Anything that isn't "yes" or "no" — an unanswered question above all — is
 * `undefined` rather than `false`, so an unanswered question can be rejected
 * (or stored as "not said") rather than silently recorded as a "no".
 */
export function parseYesNo(raw: unknown): boolean | undefined {
  if (raw === "yes" || raw === true) return true;
  if (raw === "no" || raw === false) return false;
  return undefined;
}
