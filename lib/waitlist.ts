import { after } from "next/server";
import { sendWaitlistConfirmation } from "./email";
import { saveWaitlistSignup, type WaitlistSignup } from "./waitlist-store";

/** Where a signup came from — kept on the row so we can compare CTA performance. */
export type WaitlistSource = "hero" | "join" | "api";

export type WaitlistResult =
  | { ok: true; email: string; alreadyOnList: boolean }
  | { ok: false; error: string };

const MAX_EMAIL_LENGTH = 254; // RFC 5321
const EMAIL_RE = /^[^\s@]+@[^\s@,]+\.[^\s@,.]{2,}$/;

export function normalizeEmail(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
}

export function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= MAX_EMAIL_LENGTH && EMAIL_RE.test(email);
}

export function isWaitlistSource(v: unknown): v is WaitlistSource {
  return v === "hero" || v === "join" || v === "api";
}

/**
 * The one entry point for a waitlist signup — used by both the server action
 * behind the form and the POST /api/waitlist route handler, so validation and
 * de-duplication behave identically whichever way someone signs up.
 */
export async function joinWaitlist(input: {
  email: unknown;
  source?: WaitlistSource;
  /** Hidden field that only a bot fills in. Any value means we silently drop it. */
  honeypot?: unknown;
}): Promise<WaitlistResult> {
  if (typeof input.honeypot === "string" && input.honeypot.trim() !== "") {
    // Look successful to the bot; write nothing.
    return { ok: true, email: "", alreadyOnList: true };
  }

  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "Enter your email address." };
  if (!isValidEmail(email)) return { ok: false, error: "That doesn't look like a valid email address." };

  const signup: WaitlistSignup = {
    email,
    source: input.source ?? "api",
    createdAt: new Date(),
  };

  try {
    const { alreadyOnList } = await saveWaitlistSignup(signup);
    if (!alreadyOnList) sendConfirmation(email);
    return { ok: true, email, alreadyOnList };
  } catch (err) {
    console.error("[waitlist] failed to save signup", err);
    return { ok: false, error: "Something went wrong on our end. Try again in a moment." };
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
