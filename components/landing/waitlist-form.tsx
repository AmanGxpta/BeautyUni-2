"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/ui/icon";
import { submitWaitlist } from "@/app/actions/waitlist";
import { initialWaitlistState } from "@/lib/waitlist-state";
import type { WaitlistSource } from "@/lib/waitlist";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? (
        "Joining…"
      ) : (
        <>
          Join the waitlist <Icon name="chevR" size={17} />
        </>
      )}
    </button>
  );
}

export function WaitlistForm({
  big,
  note,
  source,
}: {
  big?: boolean;
  note?: string;
  source: WaitlistSource;
}) {
  const [state, action] = useActionState(submitWaitlist, initialWaitlistState);

  if (state.status === "success") {
    return (
      <div className={"wl-done" + (big ? " big" : "")}>
        <span className="wl-tick">
          <Icon name="check" size={17} c="#F0EDE8" />
        </span>
        <div>
          <div className="wl-done-t">You&rsquo;re on the list.</div>
          <div className="wl-done-b">
            We&rsquo;ll email you when your early access is ready.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className={"wl" + (big ? " big" : "")} action={action}>
      <div className="wl-row">
        <input
          type="email"
          name="email"
          required
          placeholder="you@salon.com"
          aria-label="Email address"
          autoComplete="email"
          defaultValue={state.status === "error" ? state.email : ""}
        />
        <SubmitButton />
      </div>

      <input type="hidden" name="source" value={source} />

      {/* Honeypot — off-screen and out of the tab order; only bots fill it in. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
          left: "-9999px",
        }}
      />

      {state.status === "error" && (
        <p className="wl-err" role="alert">
          {state.message}
        </p>
      )}
      {note && <p className="wl-note">{note}</p>}
    </form>
  );
}
