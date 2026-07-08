import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://hektapi.com.tr", changeFrequency: "weekly", priority: 1 },
    { url: "https://hektapi.com.tr/urunler", changeFrequency: "weekly", priority: 0.9 },
    { url: "https://hektapi.com.tr/hizmetlerimiz", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://hektapi.com.tr/cozumlerimiz", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://hektapi.com.tr/sertifikalar", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://hektapi.com.tr/iletisim", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://hektapi.com.tr/kurumsal/hakkimizda", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://hektapi.com.tr/kurumsal/vizyon-misyon", changeFrequency: "monthly", priority: 0.6 },
  ];
}