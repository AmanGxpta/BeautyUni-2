/**
 * The site's public origin, normalized.
 *
 * Every consumer builds paths as `${siteUrl}/thing`, so a trailing slash in
 * the environment variable produces `https://host//thing`. That isn't
 * cosmetic: Vercel answers a doubled slash with a 308 redirect rather than
 * the file, and mail clients' image proxies don't follow redirects — it is
 * what made the logo render as a broken image in the confirmation email.
 *
 * `.env.example` asks for no trailing slash, but an origin pasted from a
 * browser's address bar has one, so it is stripped here rather than trusted.
 */
const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteUrl = raw.replace(/\/+$/, "");
