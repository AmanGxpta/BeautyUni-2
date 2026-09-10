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
import {
  parseScale,
  SEMINAR_QUESTIONS,
  SEMINAR_SCALE_FIELDS,
  SEMINAR_TEXT_FIELDS,
  type SeminarField,
  type SeminarScaleField,
  type SeminarTextField,
} from "./seminar-survey";
import { saveSeminarFeedback, type SeminarFeedbackRow } from "./seminar-feedback-store";

export type SeminarFeedbackResult =
  | { ok: true; email: string; alreadyResponded: boolean }
  | { ok: false; field: SeminarField; error: string };

/** Roomy on purpose — this is feedback prose, and a cap that bites is a lost answer. */
const MAX_ANSWER_LENGTH = 2000;

/**
 * A complete, validated response.
 *
 * The seven required answers are plain values: by the time one of these
 * exists they have all been given, so nothing downstream has to re-ask
 * whether an answer is really there. The three optional ones are `| null`
 * rather than `| undefined` — `null` is what the nullable column holds, and
 * saying it here means "left blank" survives all the way to the row instead of
 * being quietly dropped by a `JSON.stringify` or an object spread.
 */
export type SeminarAnswers = {
  /** Q1 — overall experience across the two days. */
  overallRating: string;
  /** Q2 — relevance to their role, salon, or business goals. */
  contentRelevance: string;
  /** Q3 — the session, speaker, topic, or activity with the greatest impact. */
  greatestImpact: string;
  /** Q4 — confidence about applying what they learned. */
  applyConfidence: string;
  /** Q5 — one action they'll implement within 30 days. */
  thirtyDayAction: string;
  /** Q6 — the speakers and facilitators. */
  speakerRating: string;
  /** Q7 — the event itself: venue, timing, hospitality, organisation. */
  eventRating: string;
  /** Q8 — what would make the next seminar more valuable. Optional. */
  improvementIdeas: string | null;
  /** Q9 — a short testimonial. Optional. */
  testimonial: string | null;
  /**
   * Q9's follow-on — may we quote this in social or promotional material?
   *
   * `null` means they didn't say, which is not the same as "no" and must never
   * collapse into it: this is the field someone would be asked to point at if
   * they ever objected to being quoted.
   */
  promoConsent: boolean | null;
};

/** Answers as they arrive off a form — anything may still be missing. */
export type SeminarAnswerDraft = Partial<Record<keyof SeminarAnswers, unknown>>;

/**
 * Pulls the nine answers and the consent out of whatever shape they arrived
 * in — a `FormData`, a parsed JSON body, a `URLSearchParams`.
 *
 * Shared by the Server Action and the POST route so the two can't disagree
 * about which fields make up a response: adding a question to
 * `SEMINAR_QUESTIONS` reaches both, and adding it to only one of two
 * hand-written lists would mean an answer the browser collects and the API
 * silently discards. Nothing is validated here — that is `readSeminarAnswers`,
 * which both paths reach through `recordSeminarFeedback`.
 */
export function readSeminarAnswerDraft(
  get: (field: keyof SeminarAnswers) => unknown,
): SeminarAnswerDraft {
  const draft: SeminarAnswerDraft = {};
  for (const field of SEMINAR_SCALE_FIELDS) draft[field] = get(field);
  for (const field of SEMINAR_TEXT_FIELDS) draft[field] = get(field);
  draft.promoConsent = get("promoConsent");
  return draft;
}

const MISSING_ANSWER: Record<SeminarScaleField | SeminarTextField, string> = {
  overallRating: "Pick a rating for your overall experience.",
  contentRelevance: "Let us know how relevant the content was.",
  greatestImpact: "Tell us which session or speaker made the greatest impact.",
  applyConfidence: "Let us know how confident you feel about applying it.",
  thirtyDayAction: "Tell us the one thing you'll put into practice.",
  speakerRating: "Pick a rating for the speakers and facilitators.",
  eventRating: "Pick a rating for the event experience.",
  improvementIdeas: "",
  testimonial: "",
};

/** Trimmed answer, or `null` when it was left blank — never an empty string. */
function parseAnswer(raw: unknown): string | null {
  const text = normalizeText(raw);
  return text ? text.slice(0, MAX_ANSWER_LENGTH) : null;
}

/**
 * Reads and validates every survey answer, walking the questions in the order
 * the form asks them — so the error a person is sent to is the first thing
 * they missed rather than the last.
 *
 * Returns the field that failed rather than throwing, because the caller
 * turns it into either a focused input or a 400 naming the field.
 */
export function readSeminarAnswers(
  get: (field: keyof SeminarAnswers) => unknown,
): { ok: true; answers: SeminarAnswers } | { ok: false; field: SeminarField; error: string } {
  const answers: Partial<SeminarAnswers> = {};

  for (const question of SEMINAR_QUESTIONS) {
    if (question.kind === "scale") {
      const value = parseScale(question.name, get(question.name));
      if (value === undefined) {
        return { ok: false, field: question.name, error: MISSING_ANSWER[question.name] };
      }
      answers[question.name] = value;
      continue;
    }

    const text = parseAnswer(get(question.name));
    if (text === null && !question.optional) {
      return { ok: false, field: question.name, error: MISSING_ANSWER[question.name] };
    }
    answers[question.name] = text ?? undefined;

    if (question.consent) {
      // Unanswered stays `null`. `parseYesNo` already refuses to read a
      // missing radio group as a "no", and this is the one field where that
      // distinction is the whole point.
      answers.promoConsent = parseYesNo(get("promoConsent")) ?? null;
    }
  }

  // The loop above filled every required key and defaulted the optional ones;
  // the `??` pins the blanks to `null` so the shape matches the columns.
  return {
    ok: true,
    answers: {
      ...(answers as SeminarAnswers),
      improvementIdeas: answers.improvementIdeas ?? null,
      testimonial: answers.testimonial ?? null,
      promoConsent: answers.promoConsent ?? null,
    },
  };
}

/**
 * The one entry point for a seminar feedback submission.
 *
 * Same shape as `joinWaitlist` and same guarantees: contact details first, in
 * the order the form asks for them, then the nine questions. The client marks
 * the required ones `required` too, but that only saves a round trip — this is
 * the check that counts.
 */
export async function recordSeminarFeedback(input: {
  name?: unknown;
  /** ISO 3166-1 alpha-2 from the country picker — see `lib/countries.ts`. */
  countryIso?: unknown;
  phone?: unknown;
  email: unknown;
  answers: SeminarAnswerDraft;
  /** Hidden field that only a bot fills in. Any value means we silently drop it. */
  honeypot?: unknown;
}): Promise<SeminarFeedbackResult> {
  if (typeof input.honeypot === "string" && input.honeypot.trim() !== "") {
    // Look successful to the bot; write nothing.
    return { ok: true, email: "", alreadyResponded: true };
  }

  const name = normalizeText(input.name);
  if (!name) return { ok: false, field: "name", error: "Enter your name." };
  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, field: "name", error: "That name is too long." };
  }

  // The picker's value is validated against the table rather than trusted: it
  // arrives as a bare string like any other form field, and this is the only
  // point where it becomes a country.
  const country: Country | undefined = findCountry(input.countryIso);
  if (!country) {
    return { ok: false, field: "countryIso", error: "Choose your country dialling code." };
  }

  const phone = normalizePhone(input.phone);
  if (!phone) return { ok: false, field: "phone", error: "Enter your phone number." };
  if (!isValidPhone(phone)) {
    return { ok: false, field: "phone", error: "That doesn't look like a valid phone number." };
  }

  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, field: "email", error: "Enter your email address." };
  if (!isValidEmail(email)) {
    return { ok: false, field: "email", error: "That doesn't look like a valid email address." };
  }

  const read = readSeminarAnswers(
    (field) => (input.answers as Record<string, unknown>)[field],
  );
  if (!read.ok) return read;

  const row: SeminarFeedbackRow = {
    name,
    // Both halves are already normalized — the code carries its `+`, the
    // national number is digits only with the trunk zero stripped — so this
    // concatenation *is* E.164 rather than an approximation of it.
    phoneNumber: country.dial + phone,
    email,
    answers: read.answers,
    createdAt: new Date(),
  };

  try {
    const { alreadyResponded } = await saveSeminarFeedback(row);
    if (!alreadyResponded) sendConfirmation(email);
    return { ok: true, email, alreadyResponded };
  } catch (err) {
    console.error("[seminar-feedback] failed to save response", err);
    return {
      ok: false,
      field: "email",
      error: "Something went wrong on our end. Try again in a moment.",
    };
  }
}

/**
 * Queue the confirmation email so it doesn't sit in front of the response —
 * a Resend round trip is the slowest thing in a submission, and the person has
 * already done their part by the time it runs.
 *
 * The same email the RS Community form sends, by the same path. The reference
 * id is scoped to this form so that someone who fills in both gets both
 * confirmations: Resend treats a repeated `X-Entity-Ref-ID` as the same send,
 * and without the scope the second form's email would be silently dropped.
 *
 * `after` only exists inside a request, which is the only place this is called
 * from today; the fallback keeps a script or a test from losing the email
 * (and, more importantly, from throwing back into a response that was already
 * written to the database).
 */
function sendConfirmation(email: string): void {
  const ref = `seminar-feedback:${email}`;
  try {
    after(() => sendWaitlistConfirmation(email, ref));
  } catch {
    void sendWaitlistConfirmation(email, ref);
  }
}
