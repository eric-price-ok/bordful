import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { Toaster } from "@/components/ui/toaster";
import Script, { ScriptProps } from "next/script";
import config from "@/config";
import { WebsiteSchema } from "@/components/ui/website-schema";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type ReactNode } from "react";

interface CustomScript {
  src: string;
  strategy: ScriptProps["strategy"];
  attributes?: Record<string, string>;
}

const siteConfig = config;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.title} | ${siteConfig.nav.title}`,
  description: siteConfig.description,
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
      "application/atom+xml": `${siteConfig.url}/atom.xml`,
      "application/feed+json": `${siteConfig.url}/feed.json`,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.nav.title} - RSS Feed`}
          href={`${siteConfig.url}/feed.xml`}
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title={`${siteConfig.nav.title} - Atom Feed`}
          href={`${siteConfig.url}/atom.xml`}
        />
        <link
          rel="alternate"
          type="application/feed+json"
          title={`${siteConfig.nav.title} - JSON Feed`}
          href={`${siteConfig.url}/feed.json`}
        />

        {siteConfig.scripts.head.map((script: CustomScript, index: number) => (
          <Script
            key={`head-script-${index}`}
            src={script.src}
            strategy={script.strategy}
            {...script.attributes}
          />
        ))}
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            <NuqsAdapter>{children}</NuqsAdapter>
          </main>
          <Footer />
        </div>
        <Toaster />
        {siteConfig.scripts.body.map((script: CustomScript, index: number) => (
          <Script
            key={`body-script-${index}`}
            src={script.src}
            strategy={script.strategy}
            {...script.attributes}
          />
        ))}

        <WebsiteSchema />
      </body>
    </html>
  );
}
