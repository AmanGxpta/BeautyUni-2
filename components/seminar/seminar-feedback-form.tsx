"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { submitSeminarFeedback } from "@/app/actions/seminar-feedback";
import { initialSeminarFeedbackState } from "@/lib/seminar-feedback-state";
import { COUNTRIES, DEFAULT_COUNTRY_ISO } from "@/lib/countries";
import {
  educatorField,
  educatorNotesField,
  EDUCATOR_RATING_POINTS,
  SEMINAR_QUESTIONS,
  type SeminarField,
} from "@/lib/seminar-survey";

/**
 * The BeautyUni 2-Day Seminar Feedback Survey.
 *
 * A page rather than a dialog — the RS Community form is opened from a CTA
 * that is already on screen, while this one is reached by its own link or a
 * QR code at the venue, where a modal has nothing behind it to be modal over.
 *
 * The field chrome is the `.cd-*` control layer the community dialog
 * introduced (see `app/globals.css`): same inputs, same error treatment, same
 * country picker. Only the page frame and the five-point scales are new.
 */

/** The contact block above the numbered questions. Not part of the survey's numbering. */
const CONTACT = [
  {
    name: "name",
    label: "Your name",
    type: "text",
    autoComplete: "name",
    placeholder: "Priya Sharma",
  },
  {
    name: "email",
    label: "Your email",
    type: "email",
    inputMode: "email" as const,
    autoComplete: "email",
    placeholder: "you@salon.com",
  },
] as const;

export function SeminarFeedbackForm() {
  const [state, action, pending] = useActionState(
    submitSeminarFeedback,
    initialSeminarFeedbackState,
  );
  const rootRef = useRef<HTMLDivElement>(null);

  // Send the person to the answer that needs fixing rather than leaving them
  // to find it in a twelve-field form.
  useEffect(() => {
    if (state.status !== "error") return;
    const field = rootRef.current?.querySelector<HTMLElement>(
      `[name="${state.field}"]`,
    );
    field?.focus();
    field?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state]);

  // A success panel that replaced the form further down the page would leave
  // the reader staring at whatever was above it.
  useEffect(() => {
    if (state.status !== "success") return;
    rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [state]);

  const defaultValue = (name: SeminarField): string =>
    state.status === "error" ? (state.values[name] ?? "") : "";

  if (state.status === "success") {
    return (
      <div className="sf-card sf-done" ref={rootRef}>
        <span className="cd-done-tick">
          <Icon name="check" size={24} c="#FFFFFF" />
        </span>
        <h2 className="rs-display cd-done-h">Thank you.</h2>
        <p className="cd-done-b">
          Your feedback is with the team, and we&rsquo;ve sent a confirmation to
          your inbox. It shapes what we teach at the next seminar.
        </p>
        <Link className="cd-submit" href="https://beautyuni.in/">
          Back to BeautyUni <Icon name="chevR" size={17} />
        </Link>
      </div>
    );
  }

  return (
    <div ref={rootRef}>
      <form className="sf-card sf-form" action={action} noValidate={false}>
        {/* ── About you ────────────────────────────────────────────── */}
        <div className="sf-group">
          <div className="sf-group-t">About you</div>

          {CONTACT.map((field) => {
            const invalid = state.status === "error" && state.field === field.name;
            const describedBy = invalid ? `sf-err-${field.name}` : undefined;
            return (
              <div
                className={"cd-q" + (invalid ? " cd-q-bad" : "")}
                key={field.name}
              >
                <label className="cd-label" htmlFor={`sf-${field.name}`}>
                  {field.label}
                </label>
                <input
                  id={`sf-${field.name}`}
                  name={field.name}
                  type={field.type}
                  inputMode={"inputMode" in field ? field.inputMode : undefined}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  required
                  aria-invalid={invalid || undefined}
                  aria-describedby={describedBy}
                  defaultValue={defaultValue(field.name)}
                />
                {invalid && (
                  <p className="cd-err" id={describedBy} role="alert">
                    {state.message}
                  </p>
                )}
              </div>
            );
          })}

          {/* The country picker sits inside the phone question, so an error on
              either half marks that one block. */}
          {(() => {
            const invalid =
              state.status === "error" &&
              (state.field === "phone" || state.field === "countryIso");
            const describedBy = invalid ? "sf-err-phone" : undefined;
            return (
              <div className={"cd-q" + (invalid ? " cd-q-bad" : "")}>
                <label className="cd-label" htmlFor="sf-phone">
                  Your phone
                </label>
                <div className="cd-phone">
                  {/* A native <select> keeps the platform's own picker, its
                      keyboard type-ahead and its mobile wheel, none of which a
                      div-built dropdown gets for free. */}
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
                      // Flag and dial code only — a <select> shows the selected
                      // option's own text when closed, and those two are what a
                      // filled-in phone field needs to say.
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
                    id="sf-phone"
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
                {invalid && (
                  <p className="cd-err" id={describedBy} role="alert">
                    {state.message}
                  </p>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── The nine questions ───────────────────────────────────── */}
        <div className="sf-group">
          <div className="sf-group-t">The two days</div>

          {SEMINAR_QUESTIONS.map((question, index) => {
            const number = String(index + 1).padStart(2, "0");
            const invalid = state.status === "error" && state.field === question.name;
            const describedBy = invalid ? `sf-err-${question.name}` : undefined;
            const optional = question.kind === "text" && question.optional === true;

            return (
              <div
                className={"cd-q" + (invalid ? " cd-q-bad" : "")}
                key={question.name}
              >
                {question.kind === "educators" ? (
                  <>
                    {/* The question's own label is a plain heading: the
                        <legend>s belong to the per-educator radio groups
                        below, which are the actual controls. */}
                    <div className="cd-label">
                      <span className="cd-num">{number}</span>
                      <span className="sf-label-text">{question.label}</span>
                    </div>
                    <p className="sf-hint">{question.hint}</p>

                    <div className="sf-eds">
                      {question.educators.map((educator) => {
                        const field = educatorField(educator.slug);
                        const notes = educatorNotesField(educator.slug);
                        // Marked on the row that is missing a rating, not on
                        // the block: five identical rows all going red says
                        // nothing about which one was skipped. The class goes
                        // on the scale rather than the whole row, so the
                        // optional comment box beside it is not marked for an
                        // answer it never asked for.
                        const bad =
                          state.status === "error" && state.field === field;
                        return (
                          <fieldset className="cd-fieldset sf-ed" key={educator.slug}>
                            <legend className="sf-ed-name">
                              {educator.name}
                              {educator.role && (
                                <span className="sf-ed-role">{educator.role}</span>
                              )}
                            </legend>
                            <div className={bad ? "cd-q-bad" : undefined}>
                              <div className="sf-scale sf-scale-num">
                                {EDUCATOR_RATING_POINTS.map((point, position) => (
                                  <label className="sf-opt" key={point}>
                                    <input
                                      type="radio"
                                      name={field}
                                      value={String(point)}
                                      aria-label={`${educator.name}: ${point} out of 5`}
                                      required={position === 0}
                                      defaultChecked={
                                        defaultValue(field) === String(point)
                                      }
                                    />
                                    <span>{point}</span>
                                  </label>
                                ))}
                              </div>
                              {bad && (
                                <p className="cd-err" id={`sf-err-${field}`} role="alert">
                                  {state.message}
                                </p>
                              )}
                            </div>
                            <label className="sf-ed-notes-l" htmlFor={`sf-${notes}`}>
                              {question.notesLabel}
                            </label>
                            <textarea
                              className="sf-ed-notes"
                              id={`sf-${notes}`}
                              name={notes}
                              rows={2}
                              placeholder={question.notesPlaceholder}
                              defaultValue={defaultValue(notes)}
                            />
                          </fieldset>
                        );
                      })}
                    </div>
                  </>
                ) : question.kind === "scale" ? (
                  // A radio group's label has to be a <legend>, not a <label>
                  // — there is no single input for a <label> to point at.
                  <fieldset className="cd-fieldset">
                    <legend className="cd-label">
                      <span className="cd-num">{number}</span>
                      {question.label}
                    </legend>
                    <div className="sf-scale">
                      {question.options.map((option, position) => (
                        <label className="sf-opt" key={option.value}>
                          <input
                            type="radio"
                            name={question.name}
                            value={option.value}
                            // `required` on one radio makes the whole group
                            // required — the browser treats them as one control.
                            required={position === 0}
                            defaultChecked={
                              defaultValue(question.name) === option.value
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ) : (
                  <>
                    <label className="cd-label" htmlFor={`sf-${question.name}`}>
                      <span className="cd-num">{number}</span>
                      <span className="sf-label-text">{question.label}</span>
                      {optional && <span className="cd-optional">Optional</span>}
                    </label>
                    {question.hint && <p className="sf-hint">{question.hint}</p>}
                    <textarea
                      id={`sf-${question.name}`}
                      name={question.name}
                      rows={3}
                      placeholder={question.placeholder}
                      required={!optional}
                      aria-invalid={invalid || undefined}
                      aria-describedby={describedBy}
                      defaultValue={defaultValue(question.name)}
                    />
                    {question.consent && (
                      // Asked as a real yes/no rather than left to the prose
                      // above it: this is a permission someone may later be
                      // asked to point at, and "they wrote yes somewhere in
                      // paragraph two" is not an answer to that. Left blank it
                      // stays unanswered, which is not the same as a refusal.
                      <fieldset className="cd-fieldset sf-consent">
                        <legend className="sf-consent-t">
                          {question.consent.label}
                        </legend>
                        <div className="cd-yesno">
                          {(["yes", "no"] as const).map((choice) => (
                            <label className="cd-opt" key={choice}>
                              <input
                                type="radio"
                                name={question.consent!.name}
                                value={choice}
                                defaultChecked={
                                  defaultValue(question.consent!.name) === choice
                                }
                              />
                              <span>{choice === "yes" ? "Yes" : "No"}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
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
        </div>

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

        <div className="cd-foot sf-foot">
          <div className="cd-foot-actions">
            <Link className="cd-back" href="/">
              <Icon name="arrowL" size={17} /> Back
            </Link>
            <button type="submit" className="cd-submit" disabled={pending}>
              {pending ? (
                "Sending…"
              ) : (
                <>
                  Submit feedback <Icon name="chevR" size={17} />
                </>
              )}
            </button>
          </div>
          <p className="cd-fine">
            <Icon name="lock" size={14} c="var(--clay-deep)" />
            We&rsquo;ll only use your details to reach you about BeautyUni.
          </p>
        </div>
      </form>
    </div>
  );
}
