/**
 * Waitlist confirmation email.
 *
 * Written as email HTML, not app HTML: a table skeleton with inline styles on
 * every element, because Outlook ignores <style> blocks and most clients strip
 * flex/grid. The landing page's tokens are hard-coded here for the same reason
 * — CSS custom properties don't resolve in mail clients.
 *
 * The wordmark is a hosted PNG rather than the SVG the rest of the site uses
 * (components/ui/logo.tsx, same artwork). Gmail, Outlook and most webmail drop
 * SVG entirely, inline or as a data: URI, so the mark would simply be missing
 * for the majority of recipients. It is served off our own origin, which means
 * NEXT_PUBLIC_SITE_URL has to point at the real domain in production — on
 * localhost the image resolves to nothing in a recipient's inbox.
 */
const PAPER = "#111111";
const SURFACE = "#1C1C1C";
const INK = "#F0EDE8";
const INK_2 = "#B8B4AE";
const CLAY = "#8C1A1A";
const LINE = "#2E2C2A"; // --line flattened: rgba(240,237,232,.10) over --paper
const SANS =
  "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";

const HEADLINE = "Thanks for being interested in Rockstar.";

const BODY = [
  "You\u2019ve joined the list for early access. We\u2019ll email you as we get closer to launch and let you know when there\u2019s an opportunity to try it.",
];

const STEPS_LEAD = "In the meantime, we\u2019re building around three things:";

const STEPS: Array<[string, string]> = [
  [
    "Learn",
    "Short, practical lessons designed for working beauty professionals.",
  ],
  [
    "Practice",
    "Interactive learning that helps turn new knowledge into real skills.",
  ],
  [
    "Progress",
    "Expert feedback and certifications that help you keep developing.",
  ],
];

const SIGN_OFF = "We\u2019ll keep you posted";

export function WaitlistConfirmation({ siteUrl }: { siteUrl: string }) {
  return (
    <html lang="en">
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
          You&rsquo;re on the list for early access — we&rsquo;ll email you as
          we get closer to launch.
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
                      <td style={{ paddingBottom: "28px" }}>
                        <img
                          src={`${siteUrl}/email/rockstar-logo.png`}
                          alt="Rockstar"
                          width={150}
                          height={55}
                          style={{
                            display: "block",
                            width: "150px",
                            height: "55px",
                            border: 0,
                          }}
                        />
                      </td>
                    </tr>

                    {/* Card */}
                    <tr>
                      <td
                        style={{
                          backgroundColor: SURFACE,
                          border: `1px solid ${LINE}`,
                          borderRadius: "18px",
                          padding: "38px 34px 34px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 14px",
                            fontFamily: SANS,
                            fontSize: "11px",
                            fontWeight: 500,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "#E06060",
                          }}
                        >
                          You&rsquo;re on the list
                        </p>

                        <h1
                          style={{
                            margin: "0 0 18px",
                            fontFamily: SERIF,
                            fontSize: "30px",
                            lineHeight: 1.2,
                            fontWeight: 400,
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

                        <table
                          role="presentation"
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          border={0}
                          style={{
                            borderTop: `1px solid ${LINE}`,
                            paddingTop: "6px",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td style={{ paddingTop: "24px" }}>
                                <p
                                  style={{
                                    margin: 0,
                                    fontFamily: SANS,
                                    fontSize: "15.5px",
                                    fontWeight: 600,
                                    lineHeight: 1.5,
                                    color: INK,
                                  }}
                                >
                                  {STEPS_LEAD}
                                </p>
                              </td>
                            </tr>
                            {STEPS.map(([title, body]) => (
                              <tr key={title}>
                                <td style={{ paddingTop: "22px" }}>
                                  <p
                                    style={{
                                      margin: "0 0 5px",
                                      fontFamily: SANS,
                                      fontSize: "15px",
                                      fontWeight: 600,
                                      color: INK,
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
                            ))}
                          </tbody>
                        </table>

                        {/* Deliberately not a link: this is a status pill, not
                            a call to action — there is nothing to click yet.
                            Rendered as a <span> so no client turns it into
                            one, and so it reads as text to a screen reader. */}
                        <table
                          role="presentation"
                          cellPadding={0}
                          cellSpacing={0}
                          border={0}
                          style={{ marginTop: "32px" }}
                        >
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  backgroundColor: CLAY,
                                  borderRadius: "999px",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "13px 26px",
                                    fontFamily: SANS,
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: INK,
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
export function waitlistConfirmationText(): string {
  return [
    "You're on the list.",
    "",
    HEADLINE,
    "",
    ...BODY.flatMap((para) => [para, ""]),
    STEPS_LEAD,
    "",
    ...STEPS.map(([title, body]) => `* ${title} — ${body}`),
    "",
    `${SIGN_OFF}.`,
  ].join("\n");
}
