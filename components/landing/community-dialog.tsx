"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Icon } from "@/components/ui/icon";
import { submitWaitlist } from "@/app/actions/waitlist";
import { initialWaitlistState } from "@/lib/waitlist-state";
import { COUNTRIES, DEFAULT_COUNTRY_ISO } from "@/lib/countries";
import type { WaitlistField, WaitlistSource } from "@/lib/waitlist";

/* ── The ten questions ─────────────────────────────────────────────── */

type Question =
  | {
      kind: "field";
      name: WaitlistField;
      label: string;
      type: string;
      inputMode?: "text" | "email" | "tel" | "numeric";
      autoComplete: string;
      placeholder: string;
    }
  | { kind: "phone"; name: "phone"; label: string }
  | { kind: "choice"; name: WaitlistField; label: string }
  | { kind: "text"; name: WaitlistField; label: string; placeholder: string };

/**
 * Asked in this order, and numbered in the UI, because the seminar's feedback
 * sheet is numbered the same way — a person comparing the two should not have
 * to hunt. All ten are required.
 */
const QUESTIONS: Question[] = [
  {
    kind: "field",
    name: "name",
    label: "Your name",
    type: "text",
    autoComplete: "name",
    placeholder: "Priya Sharma",
  },
  { kind: "phone", name: "phone", label: "Your phone" },
  {
    kind: "field",
    name: "email",
    label: "Your email",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    placeholder: "you@salon.com",
  },
  {
    kind: "choice",
    name: "solvedChallenges",
    label: "Did we solve any of your challenges?",
  },
  {
    kind: "choice",
    name: "lovedSeminar",
    label: "Did you love the Rockstar Leaders Growth Seminar?",
  },
  {
    kind: "text",
    name: "topTakeaway",
    label: "What was your No. 1 takeaway?",
    placeholder: "The one thing you'll still be thinking about next week",
  },
  {
    kind: "text",
    name: "implementTomorrow",
    label: "What would you implement in your salon tomorrow?",
    placeholder: "The first change you'd make when you walk back in",
  },
  {
    kind: "choice",
    name: "changesTeamComms",
    label: "Will this change how you communicate with your team?",
  },
  {
    kind: "choice",
    name: "helpsGuestExperience",
    label:
      "Do you feel the “Rockstar way” of communication would help you achieve the perfect guest experience?",
  },
  {
    kind: "text",
    name: "educationIdeas",
    label:
      "Is there anything we could add to our journey of education in India?",
    placeholder: "Skills, formats, cities — tell us what's missing",
  },
];

/* ── Opening the dialog from anywhere on the page ──────────────────── */

type OpenCommunityDialog = (source: WaitlistSource) => void;

const CommunityDialogContext = createContext<OpenCommunityDialog | null>(null);

export function useCommunityDialog(): OpenCommunityDialog {
  const open = useContext(CommunityDialogContext);
  if (!open) {
    throw new Error(
      "useCommunityDialog must be used inside <CommunityDialogProvider>.",
    );
  }
  return open;
}

/** One open session — a fresh `key` remounts the form, which is how it resets. */
type Session = { key: number; source: WaitlistSource };

/**
 * Holds the single dialog for the whole page.
 *
 * `children` is passed straight through, so the Server Components underneath
 * stay Server Components — only this wrapper and the CTAs are client code.
 */
export function CommunityDialogProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback<OpenCommunityDialog>((source) => {
    // Bumping the key on every open clears a previous session's answers and
    // its success panel — `useActionState` has no reset of its own.
    setSession((previous) => ({ key: (previous?.key ?? 0) + 1, source }));
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !session) return;

    if (!dialog.open) dialog.showModal();

    // `showModal` makes the page inert but does not stop it scrolling behind
    // the dialog, which on a long landing page reads as the modal drifting.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [session]);

  return (
    <CommunityDialogContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        // `rs` as well as `cd`: a <dialog> renders in the top layer, outside
        // the `.rs` wrapper it sits next to, so it has to opt into the theme's
        // fonts and colours itself.
        className="rs cd"
        aria-labelledby="cd-title"
        // Fires for Esc and for the close button alike, so this is the one
        // place the session has to be torn down.
        //
        // The guard is not paranoia: `close()` dispatches its event in a
        // queued task, so closing and immediately re-opening (clicking Close,
        // then a CTA) lets the *first* close's event arrive after the second
        // `showModal()` — and clearing the session there would leave an open
        // dialog with an empty panel. If it is open, this event is stale.
        onClose={() => {
          if (!dialogRef.current?.open) setSession(null);
        }}
        // A click that lands on the <dialog> itself landed outside the panel.
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {session && (
          <CommunityForm
            key={session.key}
            source={session.source}
            onClose={close}
          />
        )}
      </dialog>
    </CommunityDialogContext.Provider>
  );
}

/* ── The form ──────────────────────────────────────────────────────── */

function CommunityForm({
  source,
  onClose,
}: {
  source: WaitlistSource;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(
    submitWaitlist,
    initialWaitlistState,
  );
  const panelRef = useRef<HTMLDivElement>(null);

  // Send the person to the answer that needs fixing rather than leaving them
  // to find it in a ten-question form.
  useEffect(() => {
    if (state.status !== "error") return;
    const field = panelRef.current?.querySelector<HTMLElement>(
      `[name="${state.field}"]`,
    );
    field?.focus();
    field?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state]);

  const defaultValue = (name: WaitlistField): string =>
    state.status === "error" ? (state.values[name] ?? "") : "";

  if (state.status === "success") {
    return (
      <div className="cd-panel cd-panel-done" ref={panelRef}>
        <span className="cd-done-tick">
          <Icon name="check" size={24} c="#F0EDE8" />
        </span>
        <h2 className="rs-display cd-done-h" id="cd-title">
          You&rsquo;re in.
        </h2>
        <p className="cd-done-b">
          Thank you &mdash; your answers are with the team, and we&rsquo;ve sent
          a confirmation to your inbox.
        </p>
        <button type="button" className="cd-submit" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="cd-panel" ref={panelRef}>
      <header className="cd-head">
        <div>
          <div className="rs-eyebrow">Join the RS Community</div>
          <h2 className="rs-display cd-h" id="cd-title">
            Tell us how the seminar landed
          </h2>
          <p className="cd-lede">
            Ten questions, and your answers shape what we build next and what we
            teach next.
          </p>
        </div>
        <button
          type="button"
          className="cd-x"
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="x" size={18} c="var(--ink-2)" />
        </button>
      </header>

      <form className="cd-form" action={action}>
        {QUESTIONS.map((question, index) => {
          const number = String(index + 1).padStart(2, "0");
          // The country picker sits inside the phone question, so an error on
          // either half marks that one block.
          const invalid =
            state.status === "error" &&
            (state.field === question.name ||
              (question.kind === "phone" && state.field === "countryIso"));
          const describedBy = invalid ? `cd-err-${question.name}` : undefined;

          return (
            <div
              className={"cd-q" + (invalid ? " cd-q-bad" : "")}
              key={question.name}
            >
              {question.kind === "choice" ? (
                // A radio group's label has to be a <legend>, not a <label> —
                // there is no single input for a <label> to point at.
                <fieldset className="cd-fieldset">
                  <legend className="cd-label">
                    <span className="cd-num">{number}</span>
                    {question.label}
                  </legend>
                  <div className="cd-yesno">
                    {(["yes", "no"] as const).map((choice) => (
                      <label className="cd-opt" key={choice}>
                        <input
                          type="radio"
                          name={question.name}
                          value={choice}
                          // `required` on one radio makes the whole group
                          // required — the browser treats them as one control.
                          required={choice === "yes"}
                          defaultChecked={
                            defaultValue(question.name) === choice
                          }
                        />
                        <span>{choice === "yes" ? "Yes" : "No"}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <>
                  <label className="cd-label" htmlFor={`cd-${question.name}`}>
                    <span className="cd-num">{number}</span>
                    {question.label}
                  </label>

                  {question.kind === "phone" ? (
                    <div className="cd-phone">
                      {/* A native <select>: inside a modal it keeps the
                          platform's own picker, its keyboard type-ahead and
                          its mobile wheel, none of which a div-built dropdown
                          gets for free. */}
                      <select
                        className="cd-dial"
                        name="countryIso"
                        aria-label="Country dialling code"
                        autoComplete="tel-country-code"
                        required
                        defaultValue={
                          defaultValue("countryIso") || DEFAULT_COUNTRY_ISO
                        }
                      >
                        {COUNTRIES.map((country) => (
                          // Flag and dial code only — a <select> shows the
                          // selected option's own text when closed, and those
                          // two are what a filled-in phone field needs to say.
                          // The name rides along as a tooltip, and screen
                          // readers announce the flag emoji by country anyway.
                          <option
                            key={country.iso}
                            value={country.iso}
                            title={country.name}
                          >
                            {country.flag} {country.dial}
                          </option>
                        ))}
                      </select>
                      <input
                        id="cd-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="98765 43210"
                        required
                        aria-invalid={invalid || undefined}
                        aria-describedby={describedBy}
                        defaultValue={defaultValue("phone")}
                      />
                    </div>
                  ) : question.kind === "field" ? (
                    <input
                      id={`cd-${question.name}`}
                      name={question.name}
                      type={question.type}
                      inputMode={question.inputMode}
                      autoComplete={question.autoComplete}
                      placeholder={question.placeholder}
                      required
                      aria-invalid={invalid || undefined}
                      aria-describedby={describedBy}
                      defaultValue={defaultValue(question.name)}
                    />
                  ) : (
                    <textarea
                      id={`cd-${question.name}`}
                      name={question.name}
                      rows={3}
                      placeholder={question.placeholder}
                      required
                      aria-invalid={invalid || undefined}
                      aria-describedby={describedBy}
                      defaultValue={defaultValue(question.name)}
                    />
                  )}
                </>
              )}

              {invalid && (
                <p className="cd-err" id={describedBy} role="alert">
                  {state.message}
                </p>
              )}
            </div>
          );
        })}

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

        <div className="cd-foot">
          <div className="cd-foot-actions">
            {/* A second way out at the foot of a long form — the ✕ is ten
                questions back up the scroll by the time you reach here. */}
            <button type="button" className="cd-back" onClick={onClose}>
              <Icon name="arrowL" size={17} /> Back
            </button>
            <button type="submit" className="cd-submit" disabled={pending}>
              {pending ? (
                "Sending…"
              ) : (
                <>
                  Submit <Icon name="chevR" size={17} />
                </>
              )}
            </button>
          </div>
          <p className="cd-fine">
            <Icon name="lock" size={14} c="var(--clay-deep)" />
            We&rsquo;ll only use your details to reach you about Rockstar.
          </p>
        </div>
      </form>
    </div>
  );
}

/* ── Triggers ──────────────────────────────────────────────────────── */

/** Any button on the page that should open the dialog. */
export function CommunityCta({
  children,
  className,
  source,
}: {
  children: ReactNode;
  className?: string;
  source: WaitlistSource;
}) {
  const open = useCommunityDialog();
  return (
    <button type="button" className={className} onClick={() => open(source)}>
      {children}
    </button>
  );
}
