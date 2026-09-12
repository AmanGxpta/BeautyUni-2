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
  CommunityWelcome,
  communityWelcomeText,
} from "@/components/emails/community-welcome";
import {
  SeminarFeedbackConfirmation,
  seminarFeedbackConfirmationText,
} from "@/components/emails/seminar-feedback-confirmation";
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
 * The seminar survey is BeautyUni's, so its confirmation says so in the
 * inbox — the display name is the first piece of branding a recipient sees,
 * before the email is even opened. Same mailbox, because the verified sending
 * domain is what Resend will accept and that has not changed.
 */
const SEMINAR_FROM =
  process.env.RESEND_FROM_SEMINAR ??
  FROM.replace(/^[^<]*</, "BeautyUni <");

/**
 * The BeautyUni site's own sender. Same mailbox as everything else — the
 * verified sending domain is what Resend will accept — but the display name is
 * the first piece of branding a recipient sees, before the email is opened.
 */
const SITE_FROM = process.env.RESEND_FROM_SITE ?? SEMINAR_FROM;

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

/**
 * @param entityRef Resend's idempotency key for this send. Defaults to the
 *   waitlist's own scope; the seminar feedback form passes its own, because
 *   Resend treats a repeated `X-Entity-Ref-ID` as the same send and someone
 *   who fills in both forms should get a confirmation for each.
 */
export async function sendWaitlistConfirmation(
  email: string,
  entityRef: string = `waitlist:${email}`,
): Promise<void> {
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
        "X-Entity-Ref-ID": entityRef,
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

/**
 * Confirmation for a response to the two-day seminar feedback survey.
 *
 * Its own email rather than the waitlist's: the two go to different people at
 * different moments, and a waitlist welcome is the wrong receipt for someone
 * who just answered ten questions about a seminar they already attended.
 *
 * Best-effort like everything else here — the response is committed before we
 * are called, so a Resend outage must not turn a saved response into an error.
 *
 * @param entityRef Resend's idempotency key for this send, scoped to this form
 *   so someone who fills in both this and the RS Community form gets a
 *   confirmation for each: Resend treats a repeated `X-Entity-Ref-ID` as the
 *   same send.
 */
export async function sendSeminarFeedbackConfirmation(
  email: string,
  entityRef: string = `seminar-feedback:${email}`,
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipped the seminar feedback confirmation to " +
        email +
        ". The response itself was saved.",
    );
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: SEMINAR_FROM,
      to: [email],
      subject: "Thank you for your seminar feedback",
      react: SeminarFeedbackConfirmation({ siteUrl }),
      text: seminarFeedbackConfirmationText(),
      headers: {
        "X-Entity-Ref-ID": entityRef,
      },
    });

    if (error) {
      console.error(
        "[email] Resend rejected the seminar feedback confirmation",
        error,
      );
      return;
    }
    console.log(
      `[email] seminar feedback confirmation sent to ${email} (${data?.id})`,
    );
  } catch (err) {
    console.error(
      "[email] failed to send the seminar feedback confirmation",
      err,
    );
  }
}

/**
 * Welcome for someone who joined the BeautyUni community at `/join`.
 *
 * Best-effort like everything else here — the row is committed before we are
 * called, so a Resend outage must not turn a saved signup into an error.
 *
 * @param entityRef Resend's idempotency key, scoped to this form so someone
 *   who fills in more than one of the site's forms gets a message for each:
 *   Resend treats a repeated `X-Entity-Ref-ID` as the same send.
 */
export async function sendCommunityWelcome(
  email: string,
  name?: string,
  entityRef: string = `community:${email}`,
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipped the community welcome to " +
        email +
        ". The signup itself was saved.",
    );
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: SITE_FROM,
      to: [email],
      subject: "Welcome to BeautyUni",
      react: CommunityWelcome({ siteUrl, name }),
      text: communityWelcomeText(siteUrl, name),
      headers: { "X-Entity-Ref-ID": entityRef },
    });

    if (error) {
      console.error("[email] Resend rejected the community welcome", error);
      return;
    }
    console.log(`[email] community welcome sent to ${email} (${data?.id})`);
  } catch (err) {
    console.error("[email] failed to send the community welcome", err);
  }
}
