import config from "@/config";
import Head from "next/head";

interface HreflangTagsProps {
  pagePath: string;
}

export function HreflangTags({ pagePath }: HreflangTagsProps) {
  // Make sure the pagePath starts with a slash
  const path = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;

  // Create full URLs
  const enUrl = `${config.url}${path}`;
  const defaultUrl = enUrl;

  return (
    <Head>
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={defaultUrl} />
    </Head>
  );
}
