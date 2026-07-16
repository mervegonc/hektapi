import type { Metadata } from "next";

export const siteUrl = "https://hektapi.com.tr";

export const siteConfig = {
  name: "Hektapi",
  title: "Hektapi | Endüstriyel Test Cihazları",
  description:
    "Hektapi, endüstriyel test cihazları alanında mühendislik, danışmanlık ve Ar-Ge destekli güvenilir çözümler sunar.",
  locale: "tr_TR",
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/favicon.png"],
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/favicon.png", width: 512, height: 512, alt: "Hektapi" }],
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/favicon.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
    },
  };
}
