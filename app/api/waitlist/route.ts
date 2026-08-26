import { isWaitlistSource, joinWaitlist, readAnswers } from "@/lib/waitlist";
import type { WaitlistAnswers } from "@/lib/waitlist";

/**
 * POST /api/waitlist — programmatic signup.
 *
 * Accepts JSON (`{ "name": "...", "countryIso": "IN", "phone": "...",
 * "email": "..." }`) or a form-encoded body, and shares all validation and
 * de-duplication with the on-page dialog via `joinWaitlist`. `countryIso` is
 * an ISO 3166-1 alpha-2 code and `phone` the national number.
 *
 * All ten questions are required, the seven feedback answers included: yes/no
 * questions take `true`/`false` or the strings `"yes"`/`"no"`, which is what a
 * form-encoded body can carry. A missing answer comes back as a 400 naming the
 * field.
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
    return Response.json({ ok: false, error: "Malformed request body." }, { status: 400 });
  }

  const source = read("source");
  const result = await joinWaitlist({
    name: read("name"),
    countryIso: read("countryIso"),
    phone: read("phone"),
    email: read("email"),
    answers: readAnswers((field: keyof WaitlistAnswers) => read(field)),
    source: isWaitlistSource(source) ? source : "api",
    honeypot: read("company"),
  });

  if (!result.ok) {
    return Response.json({ ok: false, field: result.field, error: result.error }, { status: 400 });
  }

  return Response.json(
    { ok: true, alreadyOnList: result.alreadyOnList },
    { status: result.alreadyOnList ? 200 : 201 },
  );
}
