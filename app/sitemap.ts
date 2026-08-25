import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prakash-portfolio.vercel.app";

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Fetch published projects to generate dynamic URLs
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key && !url.includes("YOUR_PROJECT")) {
      const supabaseClient = createClient(url, key);
      const { data: projects } = await supabaseClient
        .from("projects")
        .select("slug, created_at")
        .eq("published", true);

      if (projects) {
        projects.forEach((proj) => {
          if (proj.slug) {
            sitemapEntries.push({
              url: `${baseUrl}/projects/${proj.slug}`,
              lastModified: new Date(proj.created_at || Date.now()),
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Sitemap generation projects query error:", error);
  }

  return sitemapEntries;
}
