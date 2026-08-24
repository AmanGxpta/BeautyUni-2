"use server";

import { isWaitlistSource, joinWaitlist } from "@/lib/waitlist";
import type { WaitlistState } from "@/lib/waitlist-state";

/**
 * Server Action behind both waitlist forms.
 *
 * Shaped for `useActionState`, and reachable without JavaScript: the form
 * posts to it directly, so a signup still works before hydration.
 */
export async function submitWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const rawSource = formData.get("source");
  const result = await joinWaitlist({
    email: formData.get("email"),
    source: isWaitlistSource(rawSource) ? rawSource : "api",
    honeypot: formData.get("company"),
  });

  if (!result.ok) {
    // Hand the address back so the field can be re-filled — React resets
    // uncontrolled inputs once a form action runs.
    const attempted = formData.get("email");
    return {
      status: "error",
      message: result.error,
      email: typeof attempted === "string" ? attempted : "",
    };
  }
  return { status: "success", email: result.email };
}
