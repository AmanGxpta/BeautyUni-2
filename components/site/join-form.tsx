"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { Ic } from "./icons";
import { submitCommunity } from "@/app/actions/community";
import { initialCommunityState } from "@/lib/community-state";
import type { CommunityField } from "@/lib/community";
import { COUNTRIES, DEFAULT_COUNTRY_ISO } from "@/lib/countries";
import {
  CONSENT_LEAD,
  CONSENT_WITHDRAW,
  CONTACT,
  ROLES,
} from "@/lib/content";

/**
 * The BeautyUni community join form.
 *
 * A plain form post through a Server Action, so it still works if the page's
 * JavaScript never arrives. The client half buys three things: the error that
 * appears under the field that caused it, the focus jump to that field, and
 * the WhatsApp field collapsing when it matches the phone.
 *
 * @param source recorded on the row, so a link or QR code from a specific
 *   campaign can be told apart from the site's own Join page.
 */
export function JoinForm({ source = "join" }: { source?: string }) {
  const [state, action, pending] = useActionState(
    submitCommunity,
    initialCommunityState,
  );
  const rootRef = useRef<HTMLDivElement>(null);

  // Ticked by default: for most people the two numbers are the same, and the
  // shorter form is the one that gets finished.
  //
  // A failed submit does not reset this. The Server Action re-renders the
  // component rather than remounting it, so what someone chose survives the
  // round trip on its own — which is why there is no effect syncing it back
  // from the echoed values.
  const [sameWa, setSameWa] = useState(true);

  // Send the person to the field that needs fixing rather than leaving them to
  // find it.
  useEffect(() => {
    if (state.status !== "error") return;
    const el = rootRef.current?.querySelector<HTMLElement>(
      `[name="${state.field}"]`,
    );
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state]);

  // A success panel where the form was would leave the reader staring at
  // whatever happened to be above it.
  useEffect(() => {
    if (state.status !== "success") return;
    rootRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state]);

  const val = (name: CommunityField): string =>
    state.status === "error" ? (state.values[name] ?? "") : "";

  const bad = (...names: CommunityField[]) =>
    state.status === "error" && names.includes(state.field);

  const err = (...names: CommunityField[]) =>
    bad(...names) && state.status === "error" ? (
      <p className="s-err" role="alert">
        <Ic n="x" size={14} stroke={2} />
        {state.message}
      </p>
    ) : null;

  if (state.status === "success") {
    return (
      <div className="s-form s-done" ref={rootRef}>
        <span className="s-done__tick" aria-hidden="true">
          <Ic n="check" size={30} stroke={2} />
        </span>
        <h2 className="s-serif s-h3">
          {state.alreadyJoined ? "You’re already with us." : "You’re in."}
        </h2>
        <p className="s-body">
          {state.alreadyJoined
            ? "We had your details already, and we’ve updated them with what you just sent. The team will be in touch about programmes, events and new podcast episodes."
            : "Thanks for joining the BeautyUni community. Check your inbox for a welcome note — the team will be in touch about programmes, events and new episodes of From Passion to Profit."}
        </p>
        <div className="s-done__actions">
          <Link className="s-btn" href="/podcast">
            Hear the podcast
            <span className="s-btn__arr">
              <Ic n="arrowR" size={16} />
            </span>
          </Link>
          <Link className="s-btn s-btn--ghost" href="/programmes">
            See programmes
            <span className="s-btn__arr">
              <Ic n="arrowR" size={16} />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef}>
      <form className="s-form" action={action}>
        <input type="hidden" name="source" value={source} />
        {/* Honeypot: off-screen, unlabelled, and never announced. A bot fills
            it; a person never sees it. */}
        <div className="s-hp" aria-hidden="true">
          <label htmlFor="s-company">Company</label>
          <input
            id="s-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="s-form__grid">
          <div className={`s-field s-field--full${bad("name") ? " is-bad" : ""}`}>
            <label htmlFor="s-name">Full name</label>
            <input
              className="s-input"
              id="s-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Priya Sharma"
              required
              aria-invalid={bad("name") || undefined}
              defaultValue={val("name")}
            />
            {err("name")}
          </div>

          <div
            className={`s-field s-field--full${bad("phone", "countryIso") ? " is-bad" : ""}`}
          >
            <label htmlFor="s-phone">Phone</label>
            <div className="s-phone">
              {/* A native <select> keeps the platform's own picker, which is
                  the right control for a 200-entry list on a phone. */}
              <select
                className="s-input"
                name="countryIso"
                aria-label="Country dialling code"
                defaultValue={val("countryIso") || DEFAULT_COUNTRY_ISO}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso} value={c.iso}>
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
              <input
                className="s-input"
                id="s-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="98765 43210"
                required
                aria-invalid={bad("phone") || undefined}
                defaultValue={val("phone")}
              />
            </div>
            {err("phone", "countryIso")}
          </div>

          <div className="s-field s-field--full">
            <label className="s-check">
              <input
                type="checkbox"
                name="sameWhatsapp"
                checked={sameWa}
                onChange={(e) => setSameWa(e.target.checked)}
              />
              <span>My WhatsApp number is the same as my phone</span>
            </label>
          </div>

          {!sameWa && (
            <div
              className={`s-field s-field--full${bad("whatsapp", "waCountryIso") ? " is-bad" : ""}`}
            >
              <label htmlFor="s-wa">WhatsApp number</label>
              <div className="s-phone">
                <select
                  className="s-input"
                  name="waCountryIso"
                  aria-label="WhatsApp country dialling code"
                  defaultValue={val("waCountryIso") || DEFAULT_COUNTRY_ISO}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.iso} value={c.iso}>
                      {c.flag} {c.dial}
                    </option>
                  ))}
                </select>
                <input
                  className="s-input"
                  id="s-wa"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="98765 43210"
                  required
                  aria-invalid={bad("whatsapp") || undefined}
                  defaultValue={val("whatsapp")}
                />
              </div>
              {err("whatsapp", "waCountryIso")}
            </div>
          )}

          <div className={`s-field${bad("email") ? " is-bad" : ""}`}>
            <label htmlFor="s-email">Email</label>
            <input
              className="s-input"
              id="s-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@salon.com"
              required
              aria-invalid={bad("email") || undefined}
              defaultValue={val("email")}
            />
            {err("email")}
          </div>

          <div className={`s-field${bad("city") ? " is-bad" : ""}`}>
            <label htmlFor="s-city">City</label>
            <input
              className="s-input"
              id="s-city"
              name="city"
              type="text"
              autoComplete="address-level2"
              placeholder="Mumbai"
              required
              aria-invalid={bad("city") || undefined}
              defaultValue={val("city")}
            />
            {err("city")}
          </div>

          <div className={`s-field s-field--full${bad("role") ? " is-bad" : ""}`}>
            <label htmlFor="s-role">Your role</label>
            <select
              className="s-input"
              id="s-role"
              name="role"
              required
              aria-invalid={bad("role") || undefined}
              defaultValue={val("role")}
            >
              <option value="" disabled>
                Select one&hellip;
              </option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {err("role")}
          </div>

          <div className={`s-field s-field--full${bad("consent") ? " is-bad" : ""}`}>
            <label className="s-check s-check--consent">
              <input
                type="checkbox"
                name="consent"
                required
                aria-invalid={bad("consent") || undefined}
              />
              {/* The wording is assembled from the same constants that make up
                  `CONSENT_TEXT`, the string stored on the row, so what someone
                  agreed to and what we recorded cannot drift apart. Only the
                  address and the policy link are rendered as links. */}
              <span>
                {CONSENT_LEAD} {CONSENT_WITHDRAW}{" "}
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. See our{" "}
                <Link href="/privacy">privacy policy</Link>.
              </span>
            </label>
            {err("consent")}
          </div>
        </div>

        <div className="s-form__foot">
          <button className="s-btn s-btn--lg" type="submit" disabled={pending}>
            {pending ? "Joining…" : "Join the community"}
            <span className="s-btn__arr">
              <Ic n="arrowR" size={17} />
            </span>
          </button>
          <p className="s-form__fine">
            We store only what you enter here, to contact you about BeautyUni.
            Read the <Link href="/privacy">privacy policy</Link>.
          </p>
        </div>
      </form>
    </div>
  );
}
