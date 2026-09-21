import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/site";
import { Header } from "@/components/header";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/seo";
const sans = localFont({
  src: "./fonts/geist-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-geist",
  display: "swap",
});
const serif = localFont({
  src: [
    {
      path: "./fonts/instrument-serif-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/instrument-serif-italic-latin.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  adjustFontFallback: "Times New Roman",
  variable: "--font-editorial",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || "http://127.0.0.1:3000"),
  title: {
    default: "MONARDAS | Intelligence. Systems. Ownership.",
    template: "%s | MONARDAS",
  },
  description:
    "We build, automate and scale businesses designed to become durable assets.",
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MONARDAS",
    description:
      "We build, automate and scale businesses designed to become durable assets.",
    founder: { "@type": "Person", name: "Yurii Shalygin" },
    ...(siteUrl ? { url: siteUrl } : {}),
  };
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
