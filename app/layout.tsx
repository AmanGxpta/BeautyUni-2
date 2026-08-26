import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";

/* The STRIPPED theme's three faces, self-hosted by next/font and wired into
   the --display / --ui / --word tokens in globals.css. */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const title = "Rockstar — Learn the craft in thirty seconds";
const description =
  "A pocket-sized apprenticeship for stylists. Watch a clip, answer one quick check, send up your own work and get notes back from a real educator. Join the RS Community.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Rockstar",
  },
  description,
  applicationName: "Rockstar",
  keywords: [
    "hair education",
    "stylist training",
    "balayage course",
    "salon micro-learning",
    "cosmetology certification",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Rockstar",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The landing page relies on `scroll-behavior: smooth` for its anchor
      // links. Next 16 no longer neutralises that during route transitions
      // unless this attribute is present.
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${playfair.variable} ${raleway.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
