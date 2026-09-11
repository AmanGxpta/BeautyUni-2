import { joinCommunity } from "@/lib/community";

/**
 * POST /api/community — programmatic community signup.
 *
 * Accepts JSON (`{ "name": "...", "countryIso": "IN", "phone": "...",
 * "email": "...", "city": "...", "role": "...", "consent": true }`) or a
 * form-encoded body, and shares all validation and de-duplication with the
 * page form via `joinCommunity`. `countryIso` is an ISO 3166-1 alpha-2 code
 * and `phone` the national number.
 *
 * `consent` is required: it is the legal basis for every message sent
 * afterwards, so a submission without it is a 400 rather than a row with the
 * box unticked. Pass `sameWhatsapp: true` to reuse the phone number, or send
 * `whatsapp` and `waCountryIso` for a different one.
 */
export async function POST(request: Request) {
  let read: (field: string) => unknown;

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body: unknown = await request.json();
      const record = (body ?? {}) as Record<string, unknown>;
      read = (field) => record[field];
    } else {
      const form = await request.formData();
      read = (field) => form.get(field);
    }
  } catch {
    return Response.json(
      { ok: false, error: "Malformed request body." },
      { status: 400 },
    );
  }

  const result = await joinCommunity({
    name: read("name"),
    countryIso: read("countryIso"),
    phone: read("phone"),
    waCountryIso: read("waCountryIso"),
    whatsapp: read("whatsapp"),
    sameWhatsapp: read("sameWhatsapp"),
    email: read("email"),
    city: read("city"),
    role: read("role"),
    consent: read("consent"),
    source: read("source") ?? "api",
    honeypot: read("company"),
  });

  if (!result.ok) {
    return Response.json(
      { ok: false, field: result.field, error: result.error },
      { status: 400 },
    );
  }

  return Response.json(
    { ok: true, alreadyJoined: result.alreadyJoined },
    { status: result.alreadyJoined ? 200 : 201 },
  );
}
