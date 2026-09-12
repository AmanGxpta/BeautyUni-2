import { readSeminarAnswerDraft, recordSeminarFeedback } from "@/lib/seminar-feedback";

/**
 * POST /api/seminar-feedback — programmatic submission of the BeautyUni 2-Day
 * Seminar Feedback Survey.
 *
 * Accepts JSON or a form-encoded body, and shares every rule with the page at
 * `/seminar-feedback` through `recordSeminarFeedback`: the same validation,
 * the same de-duplication, and the same confirmation email. Neither path can
 * accept a response the other would reject.
 *
 * Body:
 *   name        required
 *   countryIso  required — ISO 3166-1 alpha-2, e.g. "IN"
 *   phone       required — the national number; the dialling code comes from
 *               countryIso and the two are stored joined as E.164
 *   email       required — the de-duplication key
 *
 *   overallRating, contentRelevance, applyConfidence, speakerRating,
 *   eventRating   required — one of that question's own scale values, listed
 *                 in `lib/seminar-survey.ts`. Checked per question, so a
 *                 confidence value cannot be filed as an overall rating.
 *   educatorFeedback  required — an object keyed by educator slug:
 *                 `{"reginald-laws": {"rating": 5, "comment": "…"}}`. The
 *                 roster is `SEMINAR_EDUCATORS` in `lib/seminar-survey.ts`
 *                 and every educator on it must be rated 1-5; `comment` is
 *                 optional and may be omitted or null. A bare number is
 *                 accepted in place of the object when there is nothing to
 *                 say: `{"reginald-laws": 5}`. A form-encoded body can send
 *                 them flat instead — `educator_<slug>` and
 *                 `educator_<slug>_notes` — which is what the page posts.
 *   greatestImpact, thirtyDayAction   required — free text
 *   improvementIdeas, testimonial     optional — free text
 *   promoConsent                      optional — `true`/`false`, or the
 *                 strings "yes"/"no" that a form-encoded body can carry.
 *                 Omitted means "didn't say", which is stored as NULL and is
 *                 deliberately not the same as `false`.
 *
 * A missing or unrecognised answer comes back as a 400 naming the field.
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

  const result = await recordSeminarFeedback({
    name: read("name"),
    countryIso: read("countryIso"),
    phone: read("phone"),
    email: read("email"),
    answers: readSeminarAnswerDraft(read),
    honeypot: read("company"),
  });

  if (!result.ok) {
    return Response.json({ ok: false, field: result.field, error: result.error }, { status: 400 });
  }

  // 200 rather than 201 on a repeat: the response was revised in place, so
  // nothing new was created. `alreadyResponded` says which happened, and it is
  // also the flag that decides whether a confirmation email went out.
  return Response.json(
    { ok: true, alreadyResponded: result.alreadyResponded },
    { status: result.alreadyResponded ? 200 : 201 },
  );
}
