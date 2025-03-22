import Script from "next/script";
import config from "@/config";
import type {
  WebSite,
  WithContext,
  Organization,
  SearchAction,
  EntryPoint,
} from "schema-dts";

export function WebsiteSchema() {
  // We won't have an explicit disable option, so always render unless
  // the config is clearly missing required properties

  // Get base values from existing config
  const baseUrl =
    config.url || process.env.NEXT_PUBLIC_APP_URL || "https://bordful.com";
  const siteName = config.nav.title;
  const siteDescription = config.description;

  // If there is no site name or URL, we can't create a valid schema
  if (!siteName || !baseUrl) {
    return null;
  }

  // Derive social links from navigation settings
  const socialLinks = [];
  if (config.nav.github?.show && config.nav.github?.url)
    socialLinks.push(config.nav.github.url);
  if (config.nav.linkedin?.show && config.nav.linkedin?.url)
    socialLinks.push(config.nav.linkedin.url);
  if (config.nav.twitter?.show && config.nav.twitter?.url)
    socialLinks.push(config.nav.twitter.url);
  if (config.nav.bluesky?.show && config.nav.bluesky?.url)
    socialLinks.push(config.nav.bluesky.url);
  if (config.nav.reddit?.show && config.nav.reddit?.url)
    socialLinks.push(config.nav.reddit.url);

  // Always include search - it's a standard feature
  const includeSearch = true;

  // Use standard search URL template
  const searchUrlTemplate = `${baseUrl}/jobs?q={search_term_string}`;

  // Create publisher entity based on site info
  const publisher: Organization = {
    "@type": "Organization",
    name: siteName,
  };

  // Add logo if available
  if (config.nav.logo?.enabled && config.nav.logo?.src) {
    const logoUrl = config.nav.logo.src.startsWith("http")
      ? config.nav.logo.src
      : `${baseUrl}${config.nav.logo.src}`;

    publisher.logo = logoUrl;
  }

  // Build the schema data object
  const schemaData: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,

    // Add description if available
    ...(siteDescription && {
      description: siteDescription,
    }),

    // Add publisher data
    publisher,

    // Add social links if available
    ...(socialLinks.length > 0 && {
      sameAs: socialLinks,
    }),
  };

  // Add search action
  if (includeSearch) {
    // Create a basic search action with standard fields
    const searchAction: SearchAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchUrlTemplate,
      } as EntryPoint,
    };

    // Create a combined object with both standard and non-standard properties
    const fullSearchAction = {
      ...searchAction,
      "query-input": "required name=search_term_string",
    };

    // Assign the full search action to the schema
    schemaData.potentialAction = fullSearchAction as SearchAction;
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
}
