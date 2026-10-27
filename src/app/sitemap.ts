import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://vortexfitnessclub.xyz",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://vortexfitnessclub.xyz/join",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

