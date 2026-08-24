/**
 * Waitlist confirmation email.
 *
 * Written as email HTML, not app HTML: a table skeleton with inline styles on
 * every element, because Outlook ignores <style> blocks and most clients strip
 * flex/grid. The landing page's tokens are hard-coded here for the same reason
 * — CSS custom properties don't resolve in mail clients.
 */
const PAPER = "#111111";
const SURFACE = "#1C1C1C";
const INK = "#F0EDE8";
const INK_2 = "#B8B4AE";
const INK_3 = "#777370";
const CLAY = "#8C1A1A";
const LINE = "#2E2C2A"; // --line flattened: rgba(240,237,232,.10) over --paper
const SANS = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";

const STEPS: Array<[string, string]> = [
  ["Early access", "You're in the first group we open the app to, ahead of the public launch."],
  ["Short lessons", "Practical technique broken into clips you can actually finish between clients."],
  ["Real feedback", "Submit your work and get evaluated by professionals, not a quiz score."],
];

export function WaitlistConfirmation({ siteUrl }: { siteUrl: string }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: PAPER, fontFamily: SANS }}>
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
          You&rsquo;re on the Rockstar waitlist — we&rsquo;ll email you the moment your early
          access is ready.
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
                        <span
                          style={{
                            fontFamily: SANS,
                            fontSize: "15px",
                            fontWeight: 600,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: INK,
                          }}
                        >
                          Rockstar
                        </span>
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
                          Thanks for joining the Rockstar waitlist.
                        </h1>

                        <p
                          style={{
                            margin: "0 0 26px",
                            fontFamily: SANS,
                            fontSize: "16px",
                            lineHeight: 1.65,
                            color: INK_2,
                          }}
                        >
                          We&rsquo;re opening the app to a small group of beauty professionals
                          first, so we can build the learning experience around real feedback.
                          You&rsquo;ll hear from us at this address the moment your early access
                          is ready — there&rsquo;s nothing else you need to do.
                        </p>

                        <table
                          role="presentation"
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          border={0}
                          style={{ borderTop: `1px solid ${LINE}`, paddingTop: "6px" }}
                        >
                          <tbody>
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
                                <a
                                  href={siteUrl}
                                  style={{
                                    display: "inline-block",
                                    padding: "13px 26px",
                                    fontFamily: SANS,
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: INK,
                                    textDecoration: "none",
                                  }}
                                >
                                  See what we&rsquo;re building
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ padding: "26px 6px 0" }}>
                        <p
                          style={{
                            margin: "0 0 6px",
                            fontFamily: SANS,
                            fontSize: "13px",
                            lineHeight: 1.6,
                            color: INK_3,
                          }}
                        >
                          You&rsquo;re getting this because you joined the waitlist at{" "}
                          <a href={siteUrl} style={{ color: INK_3 }}>
                            {siteUrl.replace(/^https?:\/\//, "")}
                          </a>
                          . We only email about Rockstar.
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: SANS,
                            fontSize: "13px",
                            lineHeight: 1.6,
                            color: INK_3,
                          }}
                        >
                          Questions? Just reply to this email.
                        </p>
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
export function waitlistConfirmationText(siteUrl: string): string {
  return [
    "You're on the list.",
    "",
    "Thanks for joining the Rockstar waitlist.",
    "",
    "We're opening the app to a small group of beauty professionals first, so we",
    "can build the learning experience around real feedback. You'll hear from us",
    "at this address the moment your early access is ready — there's nothing else",
    "you need to do.",
    "",
    ...STEPS.flatMap(([title, body]) => [`* ${title} — ${body}`]),
    "",
    `See what we're building: ${siteUrl}`,
    "",
    "—",
    `You're getting this because you joined the waitlist at ${siteUrl}.`,
    "Questions? Just reply to this email.",
  ].join("\n");
}
