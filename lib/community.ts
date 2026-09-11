import { after } from "next/server";
import {
  isValidEmail,
  isValidPhone,
  MAX_NAME_LENGTH,
  normalizeEmail,
  normalizePhone,
  normalizeText,
} from "./contact";
import { findCountry, type Country } from "./countries";
import { CONSENT_TEXT, ROLES } from "./content";
import { sendCommunityWelcome } from "./email";
import { saveCommunityMember, type CommunityMember } from "./community-store";

/** Every field the join form posts — also the keys an error is reported against. */
export type CommunityField =
  | "name"
  | "countryIso"
  | "phone"
  | "waCountryIso"
  | "whatsapp"
  | "email"
  | "city"
  | "role"
  | "consent";

export type CommunityResult =
  | { ok: true; email: string; alreadyJoined: boolean }
  | { ok: false; field: CommunityField; error: string };

const MAX_CITY_LENGTH = 120;

function isRole(value: unknown): value is (typeof ROLES)[number] {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/**
 * The one entry point for a community signup — used by the Server Action
 * behind the join form and by `POST /api/community`, so validation and
 * de-duplication behave identically whichever way someone submits.
 */
export async function joinCommunity(input: {
  name?: unknown;
  countryIso?: unknown;
  phone?: unknown;
  /** Omitted when "same as my phone" is ticked; the phone is used instead. */
  waCountryIso?: unknown;
  whatsapp?: unknown;
  sameWhatsapp?: unknown;
  email?: unknown;
  city?: unknown;
  role?: unknown;
  consent?: unknown;
  source?: unknown;
  /** Hidden field that only a bot fills in. Any value means we silently drop it. */
  honeypot?: unknown;
}): Promise<CommunityResult> {
  if (typeof input.honeypot === "string" && input.honeypot.trim() !== "") {
    // Look successful to the bot; write nothing.
    return { ok: true, email: "", alreadyJoined: true };
  }

  const name = normalizeText(input.name);
  if (!name) return { ok: false, field: "name", error: "Enter your full name." };
  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, field: "name", error: "That name is too long." };
  }

  const country: Country | undefined = findCountry(input.countryIso);
  if (!country) {
    return {
      ok: false,
      field: "countryIso",
      error: "Choose your country dialling code.",
    };
  }

  const phone = normalizePhone(input.phone);
  if (!phone) {
    return { ok: false, field: "phone", error: "Enter your phone number." };
  }
  if (!isValidPhone(phone)) {
    return {
      ok: false,
      field: "phone",
      error: "That doesn't look like a valid phone number.",
    };
  }
  const phoneNumber = country.dial + phone;

  // "Same as my phone" is resolved here rather than stored as a flag: the row
  // wants a number anyone can message, and a flag stops being true the moment
  // one of the two is edited later.
  const same = input.sameWhatsapp === "on" || input.sameWhatsapp === true;
  let whatsappNumber = phoneNumber;
  if (!same) {
    const waCountry = findCountry(input.waCountryIso ?? input.countryIso);
    if (!waCountry) {
      return {
        ok: false,
        field: "waCountryIso",
        error: "Choose the country for your WhatsApp number.",
      };
    }
    const whatsapp = normalizePhone(input.whatsapp);
    if (!whatsapp) {
      return {
        ok: false,
        field: "whatsapp",
        error: "Enter your WhatsApp number, or tick that it matches your phone.",
      };
    }
    if (!isValidPhone(whatsapp)) {
      return {
        ok: false,
        field: "whatsapp",
        error: "That doesn't look like a valid WhatsApp number.",
      };
    }
    whatsappNumber = waCountry.dial + whatsapp;
  }

  const email = normalizeEmail(input.email);
  if (!email) {
    return { ok: false, field: "email", error: "Enter your email address." };
  }
  if (!isValidEmail(email)) {
    return {
      ok: false,
      field: "email",
      error: "That doesn't look like a valid email address.",
    };
  }

  const city = normalizeText(input.city);
  if (!city) return { ok: false, field: "city", error: "Enter your city." };
  if (city.length > MAX_CITY_LENGTH) {
    return { ok: false, field: "city", error: "That city name is too long." };
  }

  // Checked against the list rather than trusted: the picker's value arrives
  // as a bare string like any other form field.
  const role = normalizeText(input.role);
  if (!isRole(role)) {
    return { ok: false, field: "role", error: "Choose the role that fits you best." };
  }

  // The consent is the legal basis for every message we send afterwards, so a
  // submission without it is rejected outright rather than saved unticked.
  const consented = input.consent === "on" || input.consent === true;
  if (!consented) {
    return {
      ok: false,
      field: "consent",
      error: "We need your permission before we can get in touch.",
    };
  }

  const member: CommunityMember = {
    name,
    phoneNumber,
    whatsappNumber,
    email,
    city,
    role,
    consentText: CONSENT_TEXT,
    source: normalizeText(input.source) || "join",
    createdAt: new Date(),
  };

  try {
    const { alreadyJoined } = await saveCommunityMember(member);
    if (!alreadyJoined) sendWelcome(email, name);
    return { ok: true, email, alreadyJoined };
  } catch (err) {
    console.error("[community] failed to save member", err);
    return {
      ok: false,
      field: "email",
      error: "Something went wrong on our end. Try again in a moment.",
    };
  }
}

/**
 * Queue the welcome email so it doesn't sit in front of the response — a
 * Resend round trip is the slowest thing in a signup, and the person has
 * already done their part by the time it runs.
 *
 * `after` only exists inside a request; the fallback keeps a script or a test
 * from losing the email, and from throwing back into a signup that is already
 * written to the database.
 */
function sendWelcome(email: string, name: string): void {
  try {
    after(() => sendCommunityWelcome(email, name));
  } catch {
    void sendCommunityWelcome(email, name);
  }
}
