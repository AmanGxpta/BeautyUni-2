"use server";

import { readSeminarAnswerDraft, recordSeminarFeedback } from "@/lib/seminar-feedback";
import {
  SEMINAR_SCALE_FIELDS,
  SEMINAR_TEXT_FIELDS,
  type SeminarField,
} from "@/lib/seminar-survey";
import type {
  SeminarFeedbackState,
  SeminarValues,
} from "@/lib/seminar-feedback-state";

/** Every field the survey posts, in the order it asks for them. */
const FIELDS = [
  "name",
  "countryIso",
  "phone",
  "email",
  ...SEMINAR_SCALE_FIELDS,
  ...SEMINAR_TEXT_FIELDS,
  "promoConsent",
] as const satisfies readonly SeminarField[];

/**
 * Server Action behind the Rockstar 2-Day Seminar Feedback Survey.
 *
 * Shaped for `useActionState`. The survey is a plain form post on its own
 * route — nothing here depends on the client having serialized the answers,
 * so it degrades to a normal submit if the client bundle never arrives.
 */
export async function submitSeminarFeedback(
  _prev: SeminarFeedbackState,
  formData: FormData,
): Promise<SeminarFeedbackState> {
  const result = await recordSeminarFeedback({
    name: formData.get("name"),
    countryIso: formData.get("countryIso"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    // The same reader POST /api/seminar-feedback uses, so the two paths agree
    // on what a response is made of.
    answers: readSeminarAnswerDraft((field) => formData.get(field)),
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

/** Hands the answers back untouched so the form can re-fill itself. */
function readValues(formData: FormData): SeminarValues {
  const values: SeminarValues = {};
  for (const field of FIELDS) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }
  return values;
}
