import type { SeminarField } from "./seminar-survey";

/**
 * `useActionState` shape for the seminar feedback survey.
 *
 * Lives here rather than beside the Server Action: a `"use server"` module may
 * only export async functions, so the initial-state constant cannot sit there.
 */

/**
 * Everything the person typed, echoed back on a failed submit.
 *
 * React resets uncontrolled inputs once a form action runs, and this survey is
 * nine questions and three contact fields long — losing the lot over a
 * mistyped phone number would be the end of that response. The form re-fills
 * its defaults from here.
 */
export type SeminarValues = Partial<Record<SeminarField, string>>;

export type SeminarFeedbackState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | {
      status: "error";
      /** Which input to focus and hang the message under. */
      field: SeminarField;
      message: string;
      values: SeminarValues;
    };

export const initialSeminarFeedbackState: SeminarFeedbackState = { status: "idle" };
