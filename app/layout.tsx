import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";
import "./site.css";
import { siteUrl } from "@/lib/site";

/* BeautyUni's two faces, self-hosted by next/font.

   Fraunces is the display: a variable old-style serif with optical size,
   SOFT and WONK axes — the wonk is what gives the italic its hand-cut,
   editorial feel, and it is the one thing a default Georgia fallback cannot
   imitate. DM Sans carries every piece of interface text.

   Playfair and Raleway stay declared because /seminar-feedback and the
   archived Rockstar landing page read their tokens from `app/globals.css`;
   dropping them here would leave those pages in a fallback face. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

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

const title = "BeautyUni: learn the craft, then the business behind it";
const description =
  "Capability-first education for beauty, wellness and medaesthetics. Technical mastery, consultation, leadership and commercial thinking, taught together with real depth.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · BeautyUni",
  },
  description,
  applicationName: "BeautyUni",
  keywords: [
    "beauty education",
    "salon business training",
    "medaesthetics education",
    "hairdressing masterclass",
    "salon leadership",
    "From Passion to Profit podcast",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "BeautyUni",
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
  themeColor: "#FCF7F3",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The site relies on `scroll-behavior: smooth` for its anchor links.
      // Next 16 no longer neutralises that during route transitions unless
      // this attribute is present.
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${dmSans.variable} ${playfair.variable} ${raleway.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
