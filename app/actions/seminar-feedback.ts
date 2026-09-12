"use server";

import { readSeminarAnswerDraft, recordSeminarFeedback } from "@/lib/seminar-feedback";
import {
  educatorField,
  educatorNotesField,
  SEMINAR_EDUCATORS,
  SEMINAR_SCALE_FIELDS,
  SEMINAR_TEXT_FIELDS,
  type SeminarField,
} from "@/lib/seminar-survey";
import type {
  SeminarFeedbackState,
  SeminarValues,
} from "@/lib/seminar-feedback-state";

/**
 * Every field the survey posts, in the order it asks for them.
 *
 * Built from the survey itself, the educator roster included, so a question
 * added there is echoed back on a failed submit without anyone remembering to
 * add it here — the failure mode being a person who fixes their phone number
 * and finds five educator ratings, and what they wrote about each of them,
 * blanked.
 */
const FIELDS: readonly SeminarField[] = [
  "name",
  "countryIso",
  "phone",
  "email",
  ...SEMINAR_SCALE_FIELDS,
  ...SEMINAR_TEXT_FIELDS,
  ...SEMINAR_EDUCATORS.flatMap((educator) => [
    educatorField(educator.slug),
    educatorNotesField(educator.slug),
  ]),
  "promoConsent",
];

/**
 * Server Action behind the BeautyUni 2-Day Seminar Feedback Survey.
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
