import { Metadata } from "next";
import { MetadataBreadcrumb } from "@/components/ui/metadata-breadcrumb";
import config from "@/config";
import { HeroSection } from "@/components/ui/hero-section";
import { FAQContent } from "@/components/ui/faq-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Add metadata for SEO
export const metadata: Metadata = {
  title: `${config.faq?.title || "FAQ"} | ${config.title}`,
  description:
    config.faq?.description ||
    "Find answers to common questions about our job board and services.",
  keywords:
    "job board FAQ, frequently asked questions, job search help, employer questions",
  openGraph: {
    title: `${config.faq?.title || "FAQ"} | ${config.title}`,
    description:
      config.faq?.description ||
      "Find answers to common questions about our job board and services.",
    type: "website",
    url: `${config.url}/faq`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.faq?.title || "FAQ"} | ${config.title}`,
    description:
      config.faq?.description ||
      "Find answers to common questions about our job board and services.",
  },
  alternates: {
    canonical: "/faq",
    languages: {
      en: `${config.url}/faq`,
      "x-default": `${config.url}/faq`,
    },
  },
};

// This page will be static
export const dynamic = "force-static";

export default function FAQPage() {
  // If FAQ is not enabled, redirect to home page
  if (!config.faq?.enabled) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">FAQ Not Available</h1>
          <p className="mb-6">The FAQ page is currently not available.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        badge="FAQ"
        title={config.faq.title}
        description={config.faq.description}
      />

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <MetadataBreadcrumb metadata={metadata} pathname="/faq" />
          </div>

          <FAQContent categories={config.faq.categories} />
        </div>
      </div>
    </main>
  );
}
