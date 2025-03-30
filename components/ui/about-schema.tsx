"use client";

import { FC } from "react";
import type { AboutPage, WithContext } from "schema-dts";
import config from "@/config";

interface AboutSchemaProps {
  companyName?: string;
  description?: string;
  url?: string;
  logo?: string;
}

export const AboutSchema: FC<AboutSchemaProps> = ({
  companyName = config.title,
  description = "Learn about our mission to connect talented professionals with exciting career opportunities.",
  url = `${config.url}/about` || "https://example.com/about",
  logo = config.nav?.logo?.enabled
    ? `${config.url}${config.nav.logo.src}`
    : undefined,
}) => {
  // Create type-safe schema using schema-dts
  const aboutSchema: WithContext<AboutPage> = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${companyName}`,
    description: description,
    mainEntity: {
      "@type": "Organization",
      name: companyName,
      description: description,
      url: config.url,
      ...(logo && { logo }),
    },
    url: url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
    />
  );
};
