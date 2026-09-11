"use server";

import { joinCommunity } from "@/lib/community";
import type { CommunityState, CommunityValues } from "@/lib/community-state";

/** Every field the form posts, in the order it asks for them. */
const FIELDS = [
  "name",
  "countryIso",
  "phone",
  "waCountryIso",
  "whatsapp",
  "email",
  "city",
  "role",
] as const;

/**
 * Server Action behind the BeautyUni join form.
 *
 * Shaped for `useActionState`. The form is a plain form post: nothing here
 * depends on the client having serialized anything, so it still submits if the
 * page's JavaScript never arrives.
 */
export async function submitCommunity(
  _prev: CommunityState,
  formData: FormData,
): Promise<CommunityState> {
  const result = await joinCommunity({
    name: formData.get("name"),
    countryIso: formData.get("countryIso"),
    phone: formData.get("phone"),
    waCountryIso: formData.get("waCountryIso"),
    whatsapp: formData.get("whatsapp"),
    sameWhatsapp: formData.get("sameWhatsapp"),
    email: formData.get("email"),
    city: formData.get("city"),
    role: formData.get("role"),
    consent: formData.get("consent"),
    source: formData.get("source"),
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
  return {
    status: "success",
    email: result.email,
    alreadyJoined: result.alreadyJoined,
  };
}

/** Hands the answers back untouched so the form can re-fill itself. */
function readValues(formData: FormData): CommunityValues {
  const values: CommunityValues = {};
  for (const field of FIELDS) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }
  return values;
}
