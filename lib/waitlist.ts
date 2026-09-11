import { after } from "next/server";
import { sendWaitlistConfirmation } from "./email";
import {
  isValidEmail,
  isValidPhone,
  MAX_NAME_LENGTH,
  normalizeEmail,
  normalizePhone,
  normalizeText,
  parseYesNo,
} from "./contact";
import { findCountry, type Country } from "./countries";
import { saveWaitlistSignup, type WaitlistSignup } from "./waitlist-store";

/** Where a signup came from — kept on the row so we can compare CTA performance. */
export type WaitlistSource = "hero" | "join" | "nav" | "api";

export type WaitlistResult =
  | { ok: true; email: string; alreadyOnList: boolean }
  | { ok: false; field: WaitlistField; error: string };

/** Roomy on purpose — this is feedback prose, and a cap that bites is a lost answer. */
const MAX_ANSWER_LENGTH = 2000;

/**
 * The seven post-seminar questions, all of them required.
 *
 * A `boolean | undefined` rather than a plain `boolean` on the yes/no fields
 * would be the shape of an *unvalidated* answer; by the time one of these
 * exists every question has been answered, so "no" and "didn't say" can never
 * be confused for one another downstream.
 */
export type WaitlistAnswers = {
  /** Q4 — did we solve any of your challenges? */
  solvedChallenges: boolean;
  /** Q5 — did you love the Rockstar leaders growth seminar? */
  lovedSeminar: boolean;
  /** Q6 — your No. 1 takeaway. */
  topTakeaway: string;
  /** Q7 — what you'd implement in your salon tomorrow. */
  implementTomorrow: string;
  /** Q8 — will this change how you communicate with your team? */
  changesTeamComms: boolean;
  /** Q9 — would the Rockstar way help you deliver the perfect guest experience? */
  helpsGuestExperience: boolean;
  /** Q10 — anything to add to our journey of education in India. */
  educationIdeas: string;
};

/** Answers as they arrive off a form — anything may still be missing. */
export type WaitlistAnswerDraft = Partial<WaitlistAnswers>;

/** Names of every field the form posts — also the keys an error is reported against. */
export type WaitlistField =
  "name" | "countryIso" | "phone" | "email" | keyof WaitlistAnswers;

export const YES_NO_FIELDS = [
  "solvedChallenges",
  "lovedSeminar",
  "changesTeamComms",
  "helpsGuestExperience",
] as const satisfies readonly (keyof WaitlistAnswers)[];

export const TEXT_ANSWER_FIELDS = [
  "topTakeaway",
  "implementTomorrow",
  "educationIdeas",
] as const satisfies readonly (keyof WaitlistAnswers)[];

/**
 * Validated in the order the form asks, so the error the person is sent to is
 * always the first thing they missed rather than the last.
 */
const ANSWER_ORDER = [
  "solvedChallenges",
  "lovedSeminar",
  "topTakeaway",
  "implementTomorrow",
  "changesTeamComms",
  "helpsGuestExperience",
  "educationIdeas",
] as const satisfies readonly (keyof WaitlistAnswers)[];

const MISSING_ANSWER: Record<keyof WaitlistAnswers, string> = {
  solvedChallenges: "Let us know whether we solved any of your challenges.",
  lovedSeminar: "Let us know how the seminar landed for you.",
  topTakeaway: "Tell us your No. 1 takeaway.",
  implementTomorrow: "Tell us what you would implement in your salon tomorrow.",
  changesTeamComms:
    "Let us know whether this changes how you talk to your team.",
  helpsGuestExperience: "Let us know whether the Rockstar way would help.",
  educationIdeas: "Tell us what we could add — a line is plenty.",
};

export function isWaitlistSource(v: unknown): v is WaitlistSource {
  return v === "hero" || v === "join" || v === "nav" || v === "api";
}

/** Trimmed answer, or `undefined` when it was left blank — never an empty string. */
function parseAnswer(raw: unknown): string | undefined {
  const text = normalizeText(raw);
  return text ? text.slice(0, MAX_ANSWER_LENGTH) : undefined;
}

/** Pulls the seven answers out of whatever shape they arrived in. */
export function readAnswers(
  get: (field: keyof WaitlistAnswers) => unknown,
): WaitlistAnswerDraft {
  const answers: WaitlistAnswerDraft = {};
  for (const field of YES_NO_FIELDS) answers[field] = parseYesNo(get(field));
  for (const field of TEXT_ANSWER_FIELDS)
    answers[field] = parseAnswer(get(field));
  return answers;
}

/**
 * The one entry point for a community signup — used by both the server action
 * behind the dialog form and the POST /api/waitlist route handler, so
 * validation and de-duplication behave identically whichever way someone
 * submits.
 *
 * Every one of the ten questions is required. The client marks them required
 * too, but that only saves a round trip: this is the check that counts, since
 * the API route takes the same submission without a browser in front of it.
 */
export async function joinWaitlist(input: {
  name?: unknown;
  /** ISO 3166-1 alpha-2 from the country picker — see `lib/countries.ts`. */
  countryIso?: unknown;
  phone?: unknown;
  email: unknown;
  answers?: WaitlistAnswerDraft;
  source?: WaitlistSource;
  /** Hidden field that only a bot fills in. Any value means we silently drop it. */
  honeypot?: unknown;
}): Promise<WaitlistResult> {
  if (typeof input.honeypot === "string" && input.honeypot.trim() !== "") {
    // Look successful to the bot; write nothing.
    return { ok: true, email: "", alreadyOnList: true };
  }

  const name = normalizeText(input.name);
  if (!name) return { ok: false, field: "name", error: "Enter your name." };
  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, field: "name", error: "That name is too long." };
  }

  // The picker's value is validated against the table rather than trusted:
  // it arrives as a bare string like any other form field, and this is the
  // only point where it becomes a country.
  const country: Country | undefined = findCountry(input.countryIso);
  if (!country) {
    return {
      ok: false,
      field: "countryIso",
      error: "Choose your country dialling code.",
    };
  }

  const phone = normalizePhone(input.phone);
  if (!phone)
    return { ok: false, field: "phone", error: "Enter your phone number." };
  if (!isValidPhone(phone)) {
    return {
      ok: false,
      field: "phone",
      error: "That doesn't look like a valid phone number.",
    };
  }

  const email = normalizeEmail(input.email);
  if (!email)
    return { ok: false, field: "email", error: "Enter your email address." };
  if (!isValidEmail(email)) {
    return {
      ok: false,
      field: "email",
      error: "That doesn't look like a valid email address.",
    };
  }

  const draft = input.answers ?? {};
  for (const field of ANSWER_ORDER) {
    if (draft[field] === undefined) {
      return { ok: false, field, error: MISSING_ANSWER[field] };
    }
  }
  // Every key in ANSWER_ORDER is present, which is exactly what the full type
  // asserts; the loop above is the check TypeScript can't do for itself.
  const answers = draft as WaitlistAnswers;

  const signup: WaitlistSignup = {
    name,
    // Joined here rather than kept apart: the two controls are a form
    // affordance, and the row wants one dialable number. Both halves are
    // already normalized, so this concatenation *is* E.164.
    phoneNumber: country.dial + phone,
    email,
    answers,
    source: input.source ?? "api",
    createdAt: new Date(),
  };

  try {
    const { alreadyOnList } = await saveWaitlistSignup(signup);
    if (!alreadyOnList) sendConfirmation(email);
    return { ok: true, email, alreadyOnList };
  } catch (err) {
    console.error("[waitlist] failed to save signup", err);
    return {
      ok: false,
      field: "email",
      error: "Something went wrong on our end. Try again in a moment.",
    };
  }
}

/**
 * Queue the confirmation email so it doesn't sit in front of the response —
 * a Resend round trip is the slowest thing in a signup, and the person has
 * already done their part by the time it runs.
 *
 * `after` only exists inside a request, which is the only place `joinWaitlist`
 * is called from today; the fallback keeps a script or a test from losing the
 * email (and, more importantly, from throwing back into a signup that was
 * already written to the database).
 */
function sendConfirmation(email: string): void {
  try {
    after(() => sendWaitlistConfirmation(email));
  } catch {
    void sendWaitlistConfirmation(email);
  }
}
