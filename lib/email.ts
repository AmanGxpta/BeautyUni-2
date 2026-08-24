/**
 * Transactional email — Resend.
 *
 * Every function here is best-effort by design: the waitlist row is already
 * committed by the time we get called, so a Resend outage must never turn a
 * successful signup into an error for the person who made it. Failures are
 * logged and swallowed; nothing in here throws.
 */
import { Resend } from "resend";
import {
  WaitlistConfirmation,
  waitlistConfirmationText,
} from "@/components/emails/waitlist-confirmation";
import { siteUrl } from "./site";

/**
 * Overridable so a dev without access to the verified domain can point at
 * `onboarding@resend.dev`; the default is the address we actually send from.
 */
const FROM =
  process.env.RESEND_FROM ?? "Rockstar LMS <support@naviteklabs.com>";

/**
 * Built lazily rather than at module scope: importing this file must not throw
 * when RESEND_API_KEY is absent, or a missing key takes the whole route down
 * instead of just costing us the email.
 */
let client: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return (client ??= new Resend(apiKey));
}

export async function sendWaitlistConfirmation(email: string): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipped the waitlist confirmation to " +
        email +
        ". The signup itself was saved.",
    );
    return;
  }

  try {
    // The SDK reports failures in `error` rather than throwing, so the result
    // has to be inspected — a bare await would swallow a 4xx silently.
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: "You're on the Rockstar waitlist",
      react: WaitlistConfirmation({ siteUrl }),
      text: waitlistConfirmationText(),
      headers: {
        // Repeat submits are de-duplicated before we reach this point, but a
        // retried request upstream shouldn't produce a second copy either.
        "X-Entity-Ref-ID": `waitlist:${email}`,
      },
    });

    if (error) {
      console.error("[email] Resend rejected the waitlist confirmation", error);
      return;
    }
    console.log(`[email] waitlist confirmation sent to ${email} (${data?.id})`);
  } catch (err) {
    console.error("[email] failed to send the waitlist confirmation", err);
  }
}
