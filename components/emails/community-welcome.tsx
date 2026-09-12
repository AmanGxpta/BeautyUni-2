/**
 * BeautyUni community welcome email.
 *
 * The receipt for the join form at `/join`. Written as email HTML, not app
 * HTML: a table skeleton with inline styles on every element, because Outlook
 * ignores <style> blocks and most clients strip flex and grid. The site's
 * tokens are hard-coded here for the same reason — CSS custom properties don't
 * resolve in mail clients, and every rgba() value is pre-flattened against the
 * surface it sits on.
 *
 * The wordmark is a hosted PNG. Gmail, Outlook and most webmail drop SVG
 * entirely, inline or as a data: URI. It is served off our own origin, so
 * NEXT_PUBLIC_SITE_URL has to point at the real domain in production — on
 * localhost the image resolves to nothing in a recipient's inbox.
 */

/* The site palette, flattened for mail. */
const PAPER = "#FCF7F3";
const CARD = "#FFFFFF";
const WELL = "#F4EAE1";
const INK = "#1E1713";
const INK_2 = "#4F443E";
const INK_3 = "#8A7D75";
const TERRA = "#C75C3C";
const LINE = "#E9E2DC"; // --s-line flattened over white
const SANS =
  "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const EYEBROW = "Welcome to BeautyUni";
const HEADLINE = "You're in.";

const BODY = [
  "Thanks for joining the BeautyUni community. You'll hear from us about programmes, live events and new episodes of From Passion to Profit, and nothing else.",
];

const NEXT_LEAD = "What to expect:";

const NEXT: Array<[string, string]> = [
  [
    "Programme dates first",
    "New workshops and masterclasses go to the community before they go anywhere else, and places are limited.",
  ],
  [
    "The podcast, as it lands",
    "Long-form conversations with the founders, educators and leaders shaping the industry.",
  ],
  [
    "Nothing you didn't ask for",
    "We use your details only to reach you about BeautyUni. Reply to this email and we'll take you off the list, no questions.",
  ],
];

const CTA = "Hear the podcast";

export function CommunityWelcome({
  siteUrl,
  name,
}: {
  siteUrl: string;
  name?: string;
}) {
  const greeting = name ? `${HEADLINE.slice(0, -1)}, ${name.split(" ")[0]}.` : HEADLINE;

  return (
    <html lang="en">
      {/* Email HTML, not a page — next/head has nothing to do with a document
          rendered to a string and handed to Resend. */}
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
        style={{ margin: 0, padding: 0, backgroundColor: PAPER, fontFamily: SANS }}
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
          Programme dates, live events and new podcast episodes &mdash; first.
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

                        <h1
                          style={{
                            margin: "0 0 18px",
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontSize: "34px",
                            lineHeight: 1.15,
                            fontWeight: 400,
                            letterSpacing: "-0.02em",
                            color: INK,
                          }}
                        >
                          {greeting}
                        </h1>

                        {BODY.map((para) => (
                          <p
                            key={para}
                            style={{
                              margin: "0 0 26px",
                              fontFamily: SANS,
                              fontSize: "16px",
                              lineHeight: 1.65,
                              color: INK_2,
                            }}
                          >
                            {para}
                          </p>
                        ))}

                        <table
                          role="presentation"
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          border={0}
                          style={{ backgroundColor: WELL, borderRadius: "10px" }}
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
                                <a
                                  href={`${siteUrl}/podcast`}
                                  style={{
                                    display: "inline-block",
                                    padding: "13px 26px",
                                    fontFamily: SANS,
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: "#FFFFFF",
                                    textDecoration: "none",
                                  }}
                                >
                                  {CTA}
                                </a>
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
                        &copy; 2026 BeautyUni &middot; Capability-first education
                        for beauty, wellness and medaesthetics.
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
export function communityWelcomeText(siteUrl: string, name?: string): string {
  const greeting = name ? `${HEADLINE.slice(0, -1)}, ${name.split(" ")[0]}.` : HEADLINE;
  return [
    `${EYEBROW}.`,
    "",
    greeting,
    "",
    ...BODY.flatMap((para) => [para, ""]),
    NEXT_LEAD,
    "",
    ...NEXT.map(([title, body]) => `* ${title}: ${body}`),
    "",
    `${CTA}: ${siteUrl}/podcast`,
    "",
    "© 2026 BeautyUni",
  ].join("\n");
}
