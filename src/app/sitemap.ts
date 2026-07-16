import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("slug")
    .order("order");

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/urunler`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/hizmetlerimiz`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/cozumlerimiz`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/sertifikalar`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/iletisim`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/kurumsal/hakkimizda`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/kurumsal/vizyon-misyon`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${siteUrl}/urunler/${cat.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages];
}
