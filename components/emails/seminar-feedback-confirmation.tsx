/**
 * Seminar feedback confirmation email — BeautyUni.
 *
 * The receipt for a response to the two-day seminar survey. It replaces the
 * waitlist confirmation on that path: the two are sent to different people at
 * different moments, and "You're on the Rockstar waitlist" is the wrong thing
 * to land in the inbox of someone who just answered ten questions about a
 * seminar they already attended.
 *
 * Written as email HTML, not app HTML: a table skeleton with inline styles on
 * every element, because Outlook ignores <style> blocks and most clients strip
 * flex/grid. The page's tokens are hard-coded here for the same reason — CSS
 * custom properties don't resolve in mail clients, and every rgba() line is
 * pre-flattened against the surface it sits on.
 *
 * The wordmark is a hosted PNG (cropped to the artwork's ink and flattened
 * onto the canvas colour, since transparency is handled inconsistently and a
 * white box around the mark would read as a second, empty card). Gmail,
 * Outlook and most webmail drop SVG entirely, inline or as a data: URI. It is served off our own origin, so NEXT_PUBLIC_SITE_URL has to
 * point at the real domain in production — on localhost the image resolves to
 * nothing in a recipient's inbox.
 */

/* The site palette, flattened for mail — matches components/emails/community-welcome.tsx. */
const PAPER = "#FCF7F3"; // --s-cream — the canvas the card sits on
const CARD = "#FFFFFF";
const WELL = "#F4EAE1"; // --s-sand
const INK = "#1E1713";
const INK_2 = "#4F443E";
const INK_3 = "#8A7D75";
const TERRA = "#C75C3C"; // --s-terra
const LINE = "#E9E2DC"; // --s-line flattened: rgba(30,23,19,.10) over white
const SANS =
  "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const EYEBROW = "Feedback received";
const HEADLINE = "Thank you for your feedback.";

const BODY = [
  "Your answers from the two-days seminar are with the team. They go to the people who ran the room \u2014 the sessions, the speakers and the format of the next one all get revisited against what came back from this one.",
];

const NEXT_LEAD = "What happens to it:";

const NEXT: Array<[string, string]> = [
  [
    "It gets read",
    "Every response is read in full by the team that ran the two days, not just counted.",
  ],
  [
    "It shapes the next one",
    "What you\u2019d change goes into the agenda, the speakers and the format of the seminar after this.",
  ],
  [
    "It stays yours",
    "We only use your details to reach you about BeautyUni, and nothing you wrote is quoted anywhere without the permission you gave on the form.",
  ],
];

const SIGN_OFF = "Thank you for the two days!";

export function SeminarFeedbackConfirmation({ siteUrl }: { siteUrl: string }) {
  return (
    <html lang="en">
      {/* Email HTML, not a page — next/head has nothing to do with a document
          that is rendered to a string and handed to Resend. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Resend declares UTF-8 on the MIME part, but a client that saves or
            forwards the HTML on its own has only this to go on, and the copy
            is full of curly quotes and em dashes. */}
        <meta charSet="utf-8" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: PAPER,
          fontFamily: SANS,
        }}
      >
        {/* Shown in the inbox list preview, never in the open email. */}
        <div
          style={{
            display: "none",
            overflow: "hidden",
            lineHeight: "1px",
            opacity: 0,
            maxHeight: 0,
            maxWidth: 0,
          }}
        >
          Your seminar feedback is with the team &mdash; every response is read.
        </div>

        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          border={0}
          style={{ backgroundColor: PAPER, margin: 0, padding: "40px 0" }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "0 16px" }}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  border={0}
                  style={{ maxWidth: "560px", margin: "0 auto" }}
                >
                  <tbody>
                    {/* Wordmark */}
                    <tr>
                      <td style={{ paddingBottom: "26px" }}>
                        <img
                          src={`${siteUrl}/email/beautyuni-logo.png`}
                          alt="BeautyUni"
                          width={216}
                          height={46}
                          style={{
                            display: "block",
                            width: "216px",
                            height: "46px",
                            border: 0,
                          }}
                        />
                      </td>
                    </tr>

                    {/* Card */}
                    <tr>
                      <td
                        style={{
                          backgroundColor: CARD,
                          border: `1px solid ${LINE}`,
                          borderRadius: "16px",
                          padding: "38px 34px 34px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 14px",
                            fontFamily: SANS,
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: TERRA,
                          }}
                        >
                          {EYEBROW}
                        </p>

                        {/* The page swapped Playfair for the UI sans under the
                            BeautyUni palette; the email follows it. */}
                        <h1
                          style={{
                            margin: "0 0 18px",
                            fontFamily: SANS,
                            fontSize: "30px",
                            lineHeight: 1.2,
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            color: INK,
                          }}
                        >
                          {HEADLINE}
                        </h1>

                        {BODY.map((para, i) => (
                          <p
                            key={para}
                            style={{
                              margin:
                                i === BODY.length - 1 ? "0 0 26px" : "0 0 16px",
                              fontFamily: SANS,
                              fontSize: "16px",
                              lineHeight: 1.65,
                              color: INK_2,
                            }}
                          >
                            {para}
                          </p>
                        ))}

                        {/* The three points sit in the tertiary well rather
                            than on the card, so the receipt reads as two
                            blocks — what you did, and what we do with it. */}
                        <table
                          role="presentation"
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          border={0}
                          style={{
                            backgroundColor: WELL,
                            borderRadius: "10px",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td style={{ padding: "24px 22px 26px" }}>
                                <p
                                  style={{
                                    margin: "0 0 4px",
                                    fontFamily: SANS,
                                    fontSize: "15.5px",
                                    fontWeight: 600,
                                    lineHeight: 1.5,
                                    color: INK,
                                  }}
                                >
                                  {NEXT_LEAD}
                                </p>

                                {NEXT.map(([title, body]) => (
                                  <table
                                    role="presentation"
                                    width="100%"
                                    cellPadding={0}
                                    cellSpacing={0}
                                    border={0}
                                    key={title}
                                  >
                                    <tbody>
                                      <tr>
                                        <td style={{ paddingTop: "18px" }}>
                                          <p
                                            style={{
                                              margin: "0 0 5px",
                                              fontFamily: SANS,
                                              fontSize: "15px",
                                              fontWeight: 600,
                                              color: TERRA,
                                            }}
                                          >
                                            {title}
                                          </p>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontFamily: SANS,
                                              fontSize: "14.5px",
                                              lineHeight: 1.6,
                                              color: INK_2,
                                            }}
                                          >
                                            {body}
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                ))}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Deliberately not a link: this is a sign-off, not a
                            call to action — there is nothing to click. A
                            <span> so no client turns it into one, and so it
                            reads as text to a screen reader. */}
                        <table
                          role="presentation"
                          cellPadding={0}
                          cellSpacing={0}
                          border={0}
                          style={{ marginTop: "30px" }}
                        >
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  backgroundColor: TERRA,
                                  borderRadius: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "13px 26px",
                                    fontFamily: SANS,
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: "#FFFFFF",
                                  }}
                                >
                                  {SIGN_OFF}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td
                        style={{
                          padding: "22px 4px 0",
                          fontFamily: SANS,
                          fontSize: "12.5px",
                          lineHeight: 1.6,
                          color: INK_3,
                        }}
                      >
                        &copy; 2026 BeautyUni
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

/** Plain-text alternative — sent alongside the HTML part. */
export function seminarFeedbackConfirmationText(): string {
  return [
    `${EYEBROW}.`,
    "",
    HEADLINE,
    "",
    ...BODY.flatMap((para) => [para, ""]),
    NEXT_LEAD,
    "",
    ...NEXT.map(([title, body]) => `* ${title} \u2014 ${body}`),
    "",
    `${SIGN_OFF}.`,
    "",
    "\u00a9 2026 BeautyUni",
  ].join("\n");
}
