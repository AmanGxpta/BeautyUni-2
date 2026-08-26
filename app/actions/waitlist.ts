"use server";

import {
  isWaitlistSource,
  joinWaitlist,
  readAnswers,
  TEXT_ANSWER_FIELDS,
  YES_NO_FIELDS,
} from "@/lib/waitlist";
import type { WaitlistState, WaitlistValues } from "@/lib/waitlist-state";

/** Every field the dialog posts, in the order it asks for them. */
const FIELDS = [
  "name",
  "countryIso",
  "phone",
  "email",
  ...YES_NO_FIELDS,
  ...TEXT_ANSWER_FIELDS,
] as const;

/**
 * Server Action behind the RS Community form.
 *
 * Shaped for `useActionState`. The form lives in a dialog and so needs
 * JavaScript to be opened at all, but the action itself stays a plain form
 * post: nothing here depends on the client having serialized the answers.
 */
export async function submitWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const rawSource = formData.get("source");
  const result = await joinWaitlist({
    name: formData.get("name"),
    countryIso: formData.get("countryIso"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    answers: readAnswers((field) => formData.get(field)),
    source: isWaitlistSource(rawSource) ? rawSource : "api",
    honeypot: formData.get("company"),
  });

  if (!result.ok) {
    return {
      status: "error",
      field: result.field,
      message: result.error,
      values: readValues(formData),
    };
  }
  return { status: "success", email: result.email };
}

/** Hands the answers back untouched so the dialog can re-fill itself. */
function readValues(formData: FormData): WaitlistValues {
  const values: WaitlistValues = {};
  for (const field of FIELDS) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }
  return values;
}
