# BeautyUni

The public site for **BeautyUni** — capability-first education for beauty,
wellness and medaesthetics. Next.js 16 (App Router, Turbopack), React 19,
TypeScript.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home — the four capabilities, who it is for, the podcast, the featured programme, the founders, the philosophy |
| `/about` | The belief, the model, the founders in full |
| `/podcast` | *From Passion to Profit*, every episode |
| `/programmes` | The Rock Star Success System masterclass, with the enquiry card |
| `/join` | The community form |
| `/privacy`, `/terms` | Draft legal pages, `noindex` |
| `/seminar-feedback` | The two-day seminar survey — **untouched by the redesign**, on its own plum theme |

`app/(site)/` is a route group: it keeps the five content pages together in the
tree without adding a `/site` segment to any URL. There is no `layout.tsx` in
it, because the header treatment varies per page — `/podcast` opens on ink and
needs the light-on-dark bar — and that is the page's own fact, not the group's.
`components/site/shell.tsx` is the frame each page wraps itself in instead.

## Content is data

Everything the site says about the company lives in `lib/content.ts` — the four
capabilities, the audience list, the episodes, the programme, the founders, the
philosophy ladder, the contact details and the consent wording. Pages read from
it rather than hard-coding copy, so correcting a date or a job title is one
edit that every page picks up, and no page can drift into a claim the source
copy never made.

## Layout

```
app/
  layout.tsx              fonts (next/font), metadata, viewport
  page.tsx                the home page
  site.css                the BeautyUni design system
  globals.css             the older Rockstar/seminar-feedback stylesheet
  (site)/                 about · podcast · programmes · join · privacy · terms
  seminar-feedback/       the two-day seminar survey, on its own route
  actions/                Server Actions behind the three forms
  api/community/          POST endpoint for programmatic joins
  api/waitlist/, api/seminar-feedback/
  opengraph-image.tsx     generated 1200x630 social card
  robots.ts, sitemap.ts
components/
  site/                   nav, footer, shell, home, episode, join form, icons
  seminar/                the seminar feedback survey form
  emails/                 the three transactional templates
  landing/, screens/, ui/ the archived Rockstar landing page
lib/
  content.ts              the site's ground truth (see above)
  contact.ts              name / email / phone rules, shared by every form
  community*.ts           validation, state and persistence for /join
  seminar-*.ts            the same three for /seminar-feedback
  waitlist*.ts            the same three for the archived Rockstar form
```

## Styling

`app/site.css` is the whole design system, hand-authored, every rule prefixed
`s-` and scoped under `.s-root`. It is a separate file from `globals.css` on
purpose: `/seminar-feedback` and the archived landing page still read their
tokens from that older sheet, and the two must not reach into each other.

**The reset uses `:where()`** — `.s-root :where(h1,h2,h3,h4,p){margin:0}`. Written
the obvious way as `.s-root p{margin:0}` it scores one class plus one element
and silently outranks every single-class rule in the file, which flattens the
page's vertical rhythm with no error anywhere. For the same reason, no rule in
`site.css` styles a part by its tag: a label inside a card gets a class
(`.s-perk__t`), never `.s-perk b`.

### Palette

Warm, editorial and tactile: terracotta on cream, ink for depth.

| Token | Value | Role |
| --- | --- | --- |
| `--s-terra` | `#C75C3C` | The single accent — CTAs, eyebrows, italic emphasis |
| `--s-cream` | `#FCF7F3` | Page |
| `--s-sand` | `#F4EAE1` | Alternating sections |
| `--s-white` | `#FFFFFF` | Cards |
| `--s-ink` | `#1E1713` | Text, and the dark sections' surface |

A fixed SVG-noise overlay at 7% sits over the whole page (`.s-root::before`,
`mix-blend-mode: multiply`) so the flat colour reads as stock rather than as a
screen.

### Type

Two faces, both self-hosted by `next/font`:

- **Fraunces** (display) — a variable old-style serif. The `SOFT` and `WONK`
  axes are what give the italic its hand-cut feel; `WONK` is set on the italic
  only, and it is the one thing a Georgia fallback cannot imitate.
- **DM Sans** (everything else) — body, interface, the tracked uppercase
  eyebrows.

Playfair and Raleway stay declared in the root layout because
`/seminar-feedback` and the archived landing page read them from `globals.css`;
removing them would leave those pages in a fallback face.

### Motion

One `IntersectionObserver` in `components/site/reveal.tsx` adds `.is-in` to
every `[data-reveal]` element as it arrives, and unobserves it. A wrapper
component per element would have pushed whole pages into the client bundle to
buy a CSS class. Under `prefers-reduced-motion: reduce` the observer marks
everything revealed immediately and the CSS drops every transition.

The header hides on the way down and returns on the way up, and the mobile menu
closes from the click that navigates rather than from a `pathname` effect — a
tap on the link for the page you are already on produces no route change, and
an effect keyed on the path would leave the panel covering the page.

## Join the community

`/join` posts to the `submitCommunity` Server Action, which works before
hydration. The same validation runs behind `POST /api/community`:

```bash
curl -X POST localhost:3000/api/community \
  -H 'content-type: application/json' -d '{
    "name":"Priya Sharma","countryIso":"IN","phone":"98765 43210",
    "sameWhatsapp":true,"email":"you@salon.com","city":"Mumbai",
    "role":"Salon owner","consent":true}'
# 201 {"ok":true,"alreadyJoined":false}  — new member
# 200 {"ok":true,"alreadyJoined":true}   — details revised in place
# 400 {"ok":false,"field":"...","error":"..."}  — rejected
```

`countryIso` is ISO 3166-1 alpha-2 and `phone` the national number; the two are
stored joined as one E.164 number. `sameWhatsapp` resolves to the phone number
at write time rather than being stored as a flag — a flag stops being true the
moment one of the two is edited later, and a message then goes to the wrong
number.

`consent` is required and a submission without it is a 400, never a row with
the box unticked: it is the legal basis for every message sent afterwards. The
wording someone agreed to is stored verbatim on the row (`consent_text`), so
rewriting the copy on the page cannot change what an existing member is
recorded as having consented to. `CONSENT_LEAD` and `CONSENT_WITHDRAW` in
`lib/content.ts` are the single source for both the page and the row.

A `?p=…` on the URL is recorded as the row's `source` (`join:rock-star`), so a
join from a campaign link or a QR code can be told apart from one off the nav.
A hidden `company` field is a honeypot: any value and the request is silently
dropped.

## Waitlist

The Rockstar waitlist landing page is archived at `app/_archive/page.tsx` and
no longer routed; its Server Action and API route are still live. Both of its
forms post to `submitWaitlist`, and the same validation runs behind
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

Every form writes to Supabase Postgres through Prisma — `community_members`,
`seminar_feedback` and `waitlist_signups`, one table each. Three tables rather
than one: the forms ask different questions of different people at different
moments, and folding them together would give every row a screenful of NULLs
belonging to somebody else's form. Every migration in
`prisma/migrations/` enables row-level security with no policies and revokes
the default `anon` / `authenticated` grants, because Supabase otherwise exposes
each table through PostgREST to anyone holding the project's anon key. Prisma
connects as the table owner over the direct connection, so the app is
unaffected. Set `DATABASE_URL` before running anything.

### Confirmation email

Each form sends its own message through `lib/email.ts` — `sendCommunityWelcome`
for `/join`, `sendSeminarFeedbackConfirmation` for the survey,
`sendWaitlistConfirmation` for the archived form — queued with `after()` so a
Resend round trip never sits in front of the response. Each passes its own
`X-Entity-Ref-ID` scope —
Resend treats a repeated ref as the same send, so without that, somebody who
filled in both forms would silently lose the second confirmation. A failed send
is logged and swallowed: the row is already committed, and Resend being down
must not turn a saved response into an error for the person who gave it.

## Notes

`next.config.ts` no longer redirects `/` to `/seminar-feedback`; the home page
serves the site. The survey keeps its own route, its own plum theme and its own
`noindex`.

`<html>` carries `data-scroll-behavior="smooth"`, which Next 16 requires for it
to keep managing scroll position while `scroll-behavior: smooth` is set
globally.

The privacy policy and the terms are launch placeholders and say so on the
page. They should be reviewed against the Digital Personal Data Protection Act,
2023 before BeautyUni relies on them.
