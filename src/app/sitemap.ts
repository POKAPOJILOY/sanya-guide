import type { MetadataRoute } from "next";
import { getPlaces } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { placeSlug } from "@/lib/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const pages = ["", "/map", "/city/sanya"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));
  const sanyaPlaces = await getPlaces("sanya");
  const placePages = sanyaPlaces.map((p) => ({
    url: `${SITE_URL}/place/${placeSlug(p)}`,
    lastModified,
  }));
  return [...pages, ...placePages];
}
