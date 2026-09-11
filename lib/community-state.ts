import type { CommunityField } from "./community";

/**
 * `useActionState` shape for the join form.
 *
 * Lives here rather than beside the Server Action: a `"use server"` module may
 * only export async functions, so the initial-state constant cannot sit there.
 */

/**
 * Everything the person typed, echoed back on a failed submit.
 *
 * React resets uncontrolled inputs once a form action runs, and losing seven
 * fields over a mistyped email is how a signup gets abandoned. The form
 * re-fills its defaults from here.
 */
export type CommunityValues = Partial<Record<CommunityField, string>>;

export type CommunityState =
  | { status: "idle" }
  | { status: "success"; email: string; alreadyJoined: boolean }
  | {
      status: "error";
      /** Which input to focus and hang the message under. */
      field: CommunityField;
      message: string;
      values: CommunityValues;
    };

export const initialCommunityState: CommunityState = { status: "idle" };
