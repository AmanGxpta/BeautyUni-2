import type { WaitlistField } from "./waitlist";

/**
 * `useActionState` shape for the RS Community form.
 *
 * Lives here rather than beside the Server Action: a `"use server"` module may
 * only export async functions, so the initial-state constant cannot sit there.
 */

/**
 * Everything the person typed, echoed back on a failed submit.
 *
 * React resets uncontrolled inputs once a form action runs, and this form is
 * ten questions long — losing the lot over a mistyped phone number would be
 * the end of that response. The dialog re-fills its defaults from here.
 */
export type WaitlistValues = Partial<Record<WaitlistField, string>>;

export type WaitlistState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | {
      status: "error";
      /** Which input to focus and hang the message under. */
      field: WaitlistField;
      message: string;
      values: WaitlistValues;
    };

export const initialWaitlistState: WaitlistState = { status: "idle" };
