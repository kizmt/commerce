import { baseUrl } from "lib/utils";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/api/", "/account/"],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
    // Geo-specific directives to prioritize NZ as primary market
    // This helps search engines understand the site targets NZ/AU
  };
}
