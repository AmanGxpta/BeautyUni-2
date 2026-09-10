# Rockstar — waitlist landing

The public sign-up site for Rockstar, the LMS for stylists. Next.js 16 (App
Router, Turbopack), React 19, TypeScript.

The design is a port of the `Rockstar Landing.html` artboard from the Claude
Design project `d1209eb3-b0a0-45ae-96d4-cebdd02c82c3` ("STRIPPED" theme —
charcoal surfaces, editorial red, cream text).

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Layout

```
app/
  layout.tsx              fonts (next/font), metadata, viewport
  page.tsx                renders <Landing/>
  globals.css             the whole design system + landing styles
  icon.svg                favicon
  opengraph-image.tsx     generated 1200x630 social card
  robots.ts, sitemap.ts
  actions/                Server Actions behind the two forms
  api/waitlist/           POST endpoint for programmatic signups
  api/seminar-feedback/   POST endpoint for programmatic survey responses
  seminar-feedback/       the seminar feedback survey, on its own route
components/
  landing/                page sections + the RS Community dialog
  seminar/                the seminar feedback survey form
  screens/                the four in-app phone screens the page shows off
  ui/                     icon set, logo, and the shared design primitives
lib/
  contact.ts              name / email / phone rules, shared by both forms
  waitlist.ts             validation + the single joinWaitlist() entry point
  waitlist-state.ts       useActionState shape
  waitlist-store.ts       Prisma persistence for waitlist_signups
  seminar-survey.ts       the nine questions and their scales
  seminar-feedback.ts     validation + recordSeminarFeedback()
  seminar-feedback-state.ts    useActionState shape
  seminar-feedback-store.ts    Prisma persistence for seminar_feedback
```

## Styling

All styling is the hand-authored CSS from the design bundle, in
`app/globals.css`, with the palette and type roles reconciled against
`Rockstar-Style-Guide.html` v1.0. Tailwind is imported **without preflight**
(`tailwindcss/theme.css` + `tailwindcss/utilities.css`, no
`tailwindcss/preflight.css`) so utilities are available for future work without
a second reset competing with the design's own.

The three brand faces — Playfair Display (headlines), DM Sans (body/UI),
Raleway (wordmark/eyebrows) — are self-hosted by `next/font` and exposed as the
`--display` / `--ui` / `--word` tokens. Roles do not swap, per the guide:

| Role | Spec |
| --- | --- |
| Eyebrow / section label / section number | Raleway 200 · 10–11px · 0.22em · uppercase · `--clay` |
| Navigation | Raleway 200 · 11px · 0.18em · uppercase |
| Button copy | Raleway 200 · 11px · 0.16em · uppercase |
| Metadata / sub-label / input label | Raleway 200 · 10px · 0.14–0.16em · uppercase |
| Status badge | Raleway 300 · 10px · 0.14em · uppercase · pill |
| Headlines | Playfair Display 700 |
| Body / interface | DM Sans 400 (500 emphasis, 300 captions) |

The `:root` block in `app/globals.css` mirrors the guide's custom properties
one-for-one — surfaces `#111111`/`#1C1C1C`/`#252525`/`#333333`, Rockstar Red
`#8C1A1A` with hover/muted/faint, cream `#F0EDE8`, and borders at
0.10 / 0.18 / 0.28 alpha.

The wordmark is the supplied `Asset 29@2x-100.svg` artwork rendered inline by
`components/ui/logo.tsx` — a solid `#AA1F25` field, cream `#F9F2F2` lettering,
`#E9C6C7` hairline. Those are the asset's own colours and it does not re-tint
per surface, so `RSLogo` takes only a `size`.

Section reveals, the sticky nav, the hero parallax and the pinned phone
showcase are all CSS scroll-driven animations (`view()` / `scroll(root)`
timelines) behind `@supports`, with a `prefers-reduced-motion` fallback. There
is no scroll JavaScript.

The showcase rail is three phones: the animating one in front, plus two static
flankers (`.show-side-l` / `.show-side-r`, hidden under 1080px) carrying screens
that are deliberately *not* in the rotation. The four rotating frames are
addressed by `.show-frame-1..4`, not `:nth-child`, so adding siblings to
`.show-device` cannot silently reindex the animation. `.show-steps`,
`.show-ticks` and `.how-grid` do still use `:nth-child` — don't insert wrappers
inside those.

Each step is `min-height: 100vh`, so a step's `cover` range opens the moment the
previous one is centred. The swap keyframes therefore hold flat over 0–16% and
84–100%; without that dead zone the next screen ghosts through the current one
at rest.

`<html>` carries `data-scroll-behavior="smooth"`, which Next 16 requires for it
to keep managing scroll position with `scroll-behavior: smooth` set globally.

## Waitlist

Both forms (hero and the closing CTA) post to the `submitWaitlist` Server
Action, which works before hydration. The same validation runs behind
`POST /api/waitlist`:

```bash
curl -X POST localhost:3000/api/waitlist \
  -H 'content-type: application/json' -d '{
    "name":"Priya Sharma","countryIso":"IN","phone":"98765 43210",
    "email":"you@salon.com",
    "solvedChallenges":true,"lovedSeminar":true,
    "topTakeaway":"...","implementTomorrow":"...",
    "changesTeamComms":true,"helpsGuestExperience":true,
    "educationIdeas":"..."}'
# 201 {"ok":true,"alreadyOnList":false}   — new
# 200 {"ok":true,"alreadyOnList":true}    — already signed up, answers revised
# 400 {"ok":false,"field":"...","error":"..."}  — rejected
```

All ten questions are required. `countryIso` is ISO 3166-1 alpha-2 and `phone`
the national number; the two are stored joined as one E.164 number.

Emails are lower-cased and trimmed before de-duplication. Each row records
which CTA it came from (`hero` / `join` / `api`). A hidden `company` field is a
honeypot: any value and the request is silently dropped.

## Seminar feedback survey

The Rockstar 2-Day Seminar Feedback Survey lives on its own route,
`/seminar-feedback` — a page rather than a dialog, because it is reached by its
own link or a QR code at the venue. It is `noindex`, and nothing on the landing
page links to it.

Nine questions, worded and numbered as the printed sheet asks them, defined
once in `lib/seminar-survey.ts` and read from there by both the form and the
validator. Five are answered on a five-point scale; four are open text. Q1–Q7
are required. Q8 (what would make the next one better) and Q9 (a testimonial,
plus permission to quote it) are optional — Q9 asks whether someone would be
*comfortable* giving one, and a required field there collects "na" rather than
testimonials.

The page posts to the `submitSeminarFeedback` Server Action. The same rules run
behind `POST /api/seminar-feedback`, which takes JSON or a form-encoded body:

```bash
curl -X POST localhost:3000/api/seminar-feedback \
  -H 'content-type: application/json' -d '{
    "name":"Priya Sharma","countryIso":"IN","phone":"98765 43210",
    "email":"you@salon.com",
    "overallRating":"excellent","contentRelevance":"very_relevant",
    "greatestImpact":"...","applyConfidence":"very_confident",
    "thirtyDayAction":"...","speakerRating":"excellent",
    "eventRating":"very_good",
    "improvementIdeas":"...","testimonial":"...","promoConsent":true}'
# 201 {"ok":true,"alreadyResponded":false}  — new response
# 200 {"ok":true,"alreadyResponded":true}   — the same person revised theirs
# 400 {"ok":false,"field":"...","error":"..."}  — rejected
```

Scale answers are the stable slugs listed in `lib/seminar-survey.ts`
(`very_good`, `not_confident_yet`, …), not the labels shown on the page, and
each is checked against **its own** question's scale — a confidence value
cannot be filed as an overall rating. `promoConsent` takes `true`/`false` or
the strings `"yes"`/`"no"`; omitting it stores NULL, which means *didn't say*
and is deliberately not the same as `false`.

`email` de-duplicates. A second submission revises the response in place and
sends no second confirmation — and it wins outright, including on the optional
questions, so someone can withdraw a testimonial they would rather we did not
quote.

### Persistence

Both forms write to Supabase Postgres through Prisma —
`waitlist_signups` and `seminar_feedback`, one table each. Every migration in
`prisma/migrations/` enables row-level security with no policies and revokes
the default `anon` / `authenticated` grants, because Supabase otherwise exposes
each table through PostgREST to anyone holding the project's anon key. Prisma
connects as the table owner over the direct connection, so the app is
unaffected. Set `DATABASE_URL` before running anything.

### Confirmation email

Both forms send the same confirmation through `sendWaitlistConfirmation`
(`lib/email.ts`), queued with `after()` so a Resend round trip never sits in
front of the response. Each form passes its own `X-Entity-Ref-ID` scope —
Resend treats a repeated ref as the same send, so without that, somebody who
filled in both forms would silently lose the second confirmation. A failed send
is logged and swallowed: the row is already committed, and Resend being down
must not turn a saved response into an error for the person who gave it.

## Open question — style guide vs. the landing artboard

The palette and type system now follow `Rockstar-Style-Guide.html`. Its
*Usage Rules* section goes further than colour and type, and the landing
artboard contradicts several of those rules by design:

- **No gradients, drop shadows, or blur.** The hero glow, the join-section
  wash, the phone bezel shadow and the frosted nav are all built on them.
- **Card corners max 10px, "not pill-shaped".** The CTAs, the email input and
  the badges are 999px pills.
- **Motion: no entrance animations.** The whole scroll-driven reveal and the
  pinned showcase are entrance animations.
- **Palette is red-only plus status green.** The certificate section is built
  on gold (`--gold` `#C99A5C`), and the phone screens use rose and berry.

None of that was changed — reconciling it is a redesign of approved sections,
not a theming pass. Flagging it as a decision to make.
