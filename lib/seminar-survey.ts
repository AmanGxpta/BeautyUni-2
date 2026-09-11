/**
 * The BeautyUni 2-Day Seminar Feedback Survey — its nine questions, verbatim,
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

/** Everything the form posts — also the keys an error is reported against. */
export type SeminarField =
  | "name"
  | "countryIso"
  | "phone"
  | "email"
  | SeminarScaleField
  | SeminarTextField
  | "promoConsent";

export type SeminarQuestion =
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
 * Asked and numbered exactly as the printed feedback sheet asks them, so a
 * person holding the sheet and a person on this page are answering the same
 * numbered question. The contact fields above them are deliberately outside
 * this list and outside the numbering.
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
    hint: "Topics, speakers, formats, improvements — anything you would like to see.",
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
