/**
 * The BeautyUni 2-Day Seminar Feedback Survey — its ten questions, verbatim,
 * and the scales they are answered on.
 *
 * One module, imported by both the page that renders the form and the action
 * that validates what it posts. The alternative — labels in the component,
 * accepted values in the validator — lets the two drift, and the way that
 * surfaces is an option a person can click and the server then rejects.
 *
 * Nothing here imports from `next/*`, because the client component imports it
 * for its values; a `next/server` import anywhere in this chain would pull the
 * server runtime into the browser bundle.
 */

export type ScaleOption = {
  /** What gets stored. Stable — the label can be reworded, this cannot. */
  value: string;
  label: string;
};

/**
 * Stored as short slugs rather than the labels themselves.
 *
 * "Very good" is a piece of copy and will eventually be reworded; `very_good`
 * is the answer. Keeping them apart means a copy change doesn't split one
 * rating across two spellings in the data, and it keeps the scale sortable by
 * a fixed order rather than alphabetically.
 */
export const RATING_SCALE: readonly ScaleOption[] = [
  { value: "excellent", label: "Excellent" },
  { value: "very_good", label: "Very good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export const RELEVANCE_SCALE: readonly ScaleOption[] = [
  { value: "extremely_relevant", label: "Extremely relevant" },
  { value: "very_relevant", label: "Very relevant" },
  { value: "somewhat_relevant", label: "Somewhat relevant" },
  { value: "slightly_relevant", label: "Slightly relevant" },
  { value: "not_relevant", label: "Not relevant" },
];

export const CONFIDENCE_SCALE: readonly ScaleOption[] = [
  { value: "extremely_confident", label: "Extremely confident" },
  { value: "very_confident", label: "Very confident" },
  { value: "moderately_confident", label: "Moderately confident" },
  { value: "slightly_confident", label: "Slightly confident" },
  { value: "not_confident_yet", label: "Not confident yet" },
];

/**
 * The educators who taught the two days, each rated individually.
 *
 * A roster rather than a fixed list of questions: the survey asks the same
 * thing of every person on it, so adding or removing an educator is a line
 * here and reaches the form, the validator and the stored answer at once.
 * Nothing downstream names an educator, and nothing needs a migration when
 * this list changes — each educator's rating and comment are stored together
 * in one map keyed by `slug`.
 *
 * `slug` is the answer and `name` is copy, the same split the worded scales
 * make: respelling a name must not split one educator's answers across two
 * keys, so the slug is fixed once and never rewritten.
 *
 * First names only, and deliberately: these are the five as the client gave
 * them, and the people filling this in spent two days in a room with them.
 * Surnames and roles can be added as `name`/`role` copy whenever they are
 * known — the slugs stay put, so nothing already collected moves.
 *
 * Changing this list is a line each and nothing else: a new educator appears
 * on the form, becomes a required rating with their own comment box, and
 * starts collecting. No migration, no other file.
 */
export type SeminarEducator = {
  /** Stored as the key in `educatorFeedback`. Stable — the name can be respelled, this cannot. */
  slug: string;
  name: string;
  /** A few words placing them, shown under the name. Omitted until known. */
  role?: string;
};

export const SEMINAR_EDUCATORS: readonly SeminarEducator[] = [
  // Reginald Laws leads the seminar (see `SEMINAR` in `lib/content.ts`), which
  // is why his slug carries the surname the others don't have yet. Slugs are
  // never rewritten, so this asymmetry stays and costs nothing: it is data,
  // and `name` is what anyone actually reads.
  { slug: "reginald-laws", name: "Reginald" },
  { slug: "mauricio", name: "Mauricio" },
  { slug: "katie", name: "Katie" },
  { slug: "kevin", name: "Kevin" },
  { slug: "marlene", name: "Marlene" },
];

/**
 * The points on the educator scale, best first.
 *
 * Numbers, because that is what the question asks for, but ordered 5→1 rather
 * than 1→5: every other scale on this page runs best-to-worst left to right,
 * and a single row that runs the other way is how someone scanning down the
 * page gives their favourite educator a 1.
 */
export const EDUCATOR_RATING_POINTS = [5, 4, 3, 2, 1] as const;

/** The form field one educator's rating is posted under. */
export function educatorField(slug: string): SeminarEducatorField {
  return `educator_${slug}`;
}

/** The form field one educator's written comment is posted under. */
export function educatorNotesField(slug: string): SeminarEducatorField {
  return `educator_${slug}_notes`;
}

/**
 * A whole number on the 1-5 scale, or `undefined` for anything else.
 *
 * Takes the number a JSON body sends and the string a form posts, and refuses
 * everything either side of the scale — an unchecked `Number()` would file a
 * 7, or a 4.5, as a rating nobody could have picked on the page.
 */
export function parseEducatorRating(raw: unknown): number | undefined {
  const value =
    typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw.trim()) : NaN;
  if (!Number.isInteger(value)) return undefined;
  return (EDUCATOR_RATING_POINTS as readonly number[]).includes(value) ? value : undefined;
}

/** The five questions answered by picking a point on a scale. */
export type SeminarScaleField =
  | "overallRating"
  | "contentRelevance"
  | "applyConfidence"
  | "speakerRating"
  | "eventRating";

/** The four questions answered in the respondent's own words. */
export type SeminarTextField =
  "greatestImpact" | "thirtyDayAction" | "improvementIdeas" | "testimonial";

/**
 * One educator's rating (`educator_reginald-laws`) or their written comment
 * (`educator_reginald-laws_notes`), as they are posted and as an error is
 * reported against them.
 *
 * A field per educator rather than one field holding everyone's answers, so a
 * missing rating can focus the row that is missing it rather than the block of
 * five it sits in.
 */
export type SeminarEducatorField = `educator_${string}`;

/** Everything the form posts — also the keys an error is reported against. */
export type SeminarField =
  | "name"
  | "countryIso"
  | "phone"
  | "email"
  | SeminarScaleField
  | SeminarTextField
  | SeminarEducatorField
  | "promoConsent";

export type SeminarQuestion =
  | {
      /**
       * A roster question: everyone on `SEMINAR_EDUCATORS`, each rated on the
       * same 1-5 scale. One question in the numbering and one block on the
       * page; one answer per educator in the data.
       */
      kind: "educators";
      name: "educatorFeedback";
      label: string;
      hint: string;
      /** Asked of every educator, under their own scale. */
      notesLabel: string;
      notesPlaceholder: string;
      educators: readonly SeminarEducator[];
    }
  | {
      kind: "scale";
      name: SeminarScaleField;
      label: string;
      options: readonly ScaleOption[];
    }
  | {
      kind: "text";
      name: SeminarTextField;
      label: string;
      placeholder: string;
      /** Extra guidance under the label, where the sheet has a parenthetical. */
      hint?: string;
      /**
       * The two questions nobody should be forced to answer.
       *
       * Q8 invites improvements and Q9 asks whether someone would be
       * *comfortable* giving a testimonial — a required field turns both into
       * a toll gate, and what comes back through a toll gate is "na" and "-".
       * The seven that carry the survey stay required.
       */
      optional?: true;
      /**
       * Q9's follow-on permission, rendered inside the same block because the
       * sheet asks for it in the same breath.
       */
      consent?: { name: "promoConsent"; label: string };
    };

/**
 * Asked and numbered in this order, which is the printed feedback sheet's
 * order up to Q6. The per-educator ratings are Q7 — asked on the page but not
 * on the sheet, which was printed before they were added — and everything
 * after them sits one number later here than it does on paper. The page is
 * the survey now; the sheet is the version that ran without this question.
 *
 * The contact fields above this list are deliberately outside it and outside
 * the numbering.
 */
export const SEMINAR_QUESTIONS: readonly SeminarQuestion[] = [
  {
    kind: "scale",
    name: "overallRating",
    label:
      "Overall, how would you rate your experience at the two-days seminar?",
    options: RATING_SCALE,
  },
  {
    kind: "scale",
    name: "contentRelevance",
    label:
      "How relevant was the seminar content to your current professional role, salon, or business goals?",
    options: RELEVANCE_SCALE,
  },
  {
    kind: "text",
    name: "greatestImpact",
    label:
      "Which session, speaker, topic, or activity created the greatest impact for you — and why?",
    placeholder: "The moment that stayed with you, and what made it land",
  },
  {
    kind: "scale",
    name: "applyConfidence",
    label:
      "After attending the seminar, how confident do you feel about applying the ideas or techniques you learned?",
    options: CONFIDENCE_SCALE,
  },
  {
    kind: "text",
    name: "thirtyDayAction",
    label:
      "What is one specific action, change, or strategy you plan to implement within the next 30 days?",
    placeholder: "One thing, as specific as you can make it",
  },
  {
    kind: "scale",
    name: "speakerRating",
    label:
      "How would you rate the speakers and facilitators in terms of knowledge, clarity, engagement, and practical value?",
    options: RATING_SCALE,
  },
  {
    kind: "educators",
    name: "educatorFeedback",
    label: "How would you rate each of the educators individually?",
    hint: "5 is excellent, 1 is poor. The comment is optional.",
    notesLabel: "What did you like about the speaker, and what could be improved?",
    notesPlaceholder: "What worked, and what you would change",
    educators: SEMINAR_EDUCATORS,
  },
  {
    kind: "scale",
    name: "eventRating",
    label:
      "How would you rate the overall event experience, including venue, timing, registration, hospitality, networking, and organisation?",
    options: RATING_SCALE,
  },
  {
    kind: "text",
    name: "improvementIdeas",
    label: "What would make the next seminar even more valuable for you?",
    hint: "Topics, speakers, formats, improvements: anything you would like to see.",
    placeholder: "What you would change, add, or do differently",
    optional: true,
  },
  {
    kind: "text",
    name: "testimonial",
    label:
      "Would you be comfortable sharing a short testimonial about your seminar experience?",
    placeholder: "A line or two, in your own words",
    optional: true,
    consent: {
      name: "promoConsent",
      label:
        "May we use your feedback on social media or promotional materials?",
    },
  },
];

/** The scale questions, in the order they are asked. */
export const SEMINAR_SCALE_FIELDS = SEMINAR_QUESTIONS.filter(
  (question) => question.kind === "scale",
).map((question) => question.name);

/** The written questions, in the order they are asked. */
export const SEMINAR_TEXT_FIELDS = SEMINAR_QUESTIONS.filter(
  (question) => question.kind === "text",
).map((question) => question.name);

const SCALE_BY_FIELD = new Map<SeminarScaleField, readonly ScaleOption[]>(
  SEMINAR_QUESTIONS.flatMap((question) =>
    question.kind === "scale"
      ? [[question.name, question.options] as const]
      : [],
  ),
);

/**
 * The scale value a person picked, or `undefined` for anything else.
 *
 * Checked against that question's own options rather than against a union of
 * every scale on the page: without this, a hand-rolled POST could file
 * "not_confident_yet" as an overall rating and nothing downstream would know
 * it wasn't on the scale it was recorded against.
 */
export function parseScale(
  field: SeminarScaleField,
  raw: unknown,
): string | undefined {
  if (typeof raw !== "string") return undefined;
  return SCALE_BY_FIELD.get(field)?.some((option) => option.value === raw)
    ? raw
    : undefined;
}

/** Which questions must be answered before the survey will accept a response. */
export function isOptional(field: SeminarTextField): boolean {
  return SEMINAR_QUESTIONS.some(
    (question) =>
      question.kind === "text" &&
      question.name === field &&
      question.optional === true,
  );
}
