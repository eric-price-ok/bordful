import { Metadata } from "next";
import config from "@/config";

type OpenGraphType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";

interface MetadataParams {
  title: string;
  description: string;
  path: string;
  openGraph?: {
    title?: string;
    description?: string;
    type?: OpenGraphType;
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates consistent metadata with proper hreflang tags for any page
 * @param params Metadata parameters including title, description, and path
 * @returns Next.js Metadata object with proper hreflang tags
 */
export function generateMetadata({
  title,
  description,
  path,
  openGraph,
}: MetadataParams): Metadata {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Create full URLs for hreflang tags
  const pageUrl = `${config.url}${normalizedPath}`;

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPath,
      languages: {
        en: pageUrl,
        "x-default": pageUrl,
      },
    },
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      type: openGraph?.type || "website",
      url: pageUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Generates schema.org breadcrumb markup for SEO
 * @param items Array of breadcrumb items with name and URL
 * @returns JSON string of schema.org breadcrumb markup
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
  interface ListItem {
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const isLastItem = index === items.length - 1;
      const listItem: ListItem = {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
      };

      // For the last item, omit the item property entirely
      // For other items, use a simple URL string with the full URL
      if (!isLastItem) {
        listItem.item = `${config.url}${item.url}`;
      }

      return listItem;
    }),
  };

  return JSON.stringify(breadcrumbSchema);
}
