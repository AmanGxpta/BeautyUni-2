/**
 * `useActionState` shape for the waitlist form.
 *
 * Lives here rather than beside the Server Action: a `"use server"` module may
 * only export async functions, so the initial-state constant cannot sit there.
 */
export type WaitlistState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | { status: "error"; message: string; email: string };

export const initialWaitlistState: WaitlistState = { status: "idle" };
