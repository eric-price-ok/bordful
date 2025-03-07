import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { Toaster } from "@/components/ui/toaster";
import Script, { ScriptProps } from "next/script";
import config from "@/config";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
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
          <main className="flex-1">{children}</main>
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
      </body>
    </html>
  );
}
