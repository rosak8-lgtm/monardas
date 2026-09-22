import type { Metadata } from "next";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://monardas.com";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: siteUrl ? { canonical: path } : undefined,
    openGraph: {
      title: `${title} | MONARDAS`,
      description,
      type: "website",
      siteName: "MONARDAS",
      ...(siteUrl ? { url: path } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MONARDAS`,
      description,
    },
  };
}
