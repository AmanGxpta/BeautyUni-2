import { isWaitlistSource, joinWaitlist } from "@/lib/waitlist";

/**
 * POST /api/waitlist — programmatic signup.
 *
 * Accepts JSON (`{ "email": "..." }`) or a form-encoded body, and shares all
 * validation and de-duplication with the on-page form via `joinWaitlist`.
 */
export async function POST(request: Request) {
  let email: unknown;
  let source: unknown;
  let honeypot: unknown;

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = body?.email;
      source = body?.source;
      honeypot = body?.company;
    } else {
      const form = await request.formData();
      email = form.get("email");
      source = form.get("source");
      honeypot = form.get("company");
    }
  } catch {
    return Response.json({ ok: false, error: "Malformed request body." }, { status: 400 });
  }

  const result = await joinWaitlist({
    email,
    source: isWaitlistSource(source) ? source : "api",
    honeypot,
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 400 });
  }

  return Response.json(
    { ok: true, alreadyOnList: result.alreadyOnList },
    { status: result.alreadyOnList ? 200 : 201 },
  );
}
