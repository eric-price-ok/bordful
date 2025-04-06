import { Metadata } from "next";
import { MetadataBreadcrumb } from "@/components/ui/metadata-breadcrumb";
import config from "@/config";
import { HeroSection } from "@/components/ui/hero-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AboutSchema } from "@/components/ui/about-schema";
import { ArrowRight } from "lucide-react";
import { resolveColor } from "@/lib/utils/colors";

// Add metadata for SEO
export const metadata: Metadata = {
  title: `${config.about?.title || "About Us"} | ${config.title}`,
  description:
    config.about?.description ||
    "Learn more about our company, mission, and values.",
  keywords: "about us, company, mission, values, team, story",
  openGraph: {
    title: `${config.about?.title || "About Us"} | ${config.title}`,
    description:
      config.about?.description ||
      "Learn more about our company, mission, and values.",
    type: "website",
    url: `${config.url}/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.about?.title || "About Us"} | ${config.title}`,
    description:
      config.about?.description ||
      "Learn more about our company, mission, and values.",
  },
  alternates: {
    canonical: "/about",
    languages: {
      en: `${config.url}/about`,
      "x-default": `${config.url}/about`,
    },
  },
};

// This page will be static
export const dynamic = "force-static";

export default function AboutPage() {
  // If about page is not enabled, redirect to home page
  if (!config.about?.enabled) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">About Page Not Available</h1>
          <p className="mb-6">The about page is currently not available.</p>
          <Link href="/">
            <Button
              variant="primary"
              style={{ backgroundColor: resolveColor(config.ui.primaryColor) }}
            >
              Return Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Add AboutPage Schema from config */}
      <AboutSchema
        companyName={config.about.schema?.companyName || config.title}
        description={
          config.about.schema?.description || config.about.description
        }
        logo={
          config.about.schema?.logo ||
          (config.nav?.logo?.enabled
            ? `${config.url}${config.nav.logo.src}`
            : undefined)
        }
      />

      <HeroSection
        badge={config.about.badge || "About Us"}
        title={config.about.title}
        description={config.about.description}
        heroImage={config.about.heroImage}
      />

      {/* About Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <MetadataBreadcrumb metadata={metadata} pathname="/about" />
          </div>

          <div className="w-full">
            {/* Mission Section */}
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              {config.about.sections?.mission?.title || "Mission"}
            </h2>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              {config.about.sections?.mission?.content ||
                "We're on a mission to connect talented professionals with meaningful opportunities and help organizations find the perfect candidates to drive their success."}
            </p>

            {/* Story Section */}
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              {config.about.sections?.story?.title || "Story"}
            </h2>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              {config.about.sections?.story?.content ||
                "Founded with a passion for revolutionizing the job search experience, our platform was built to address the challenges faced by both job seekers and employers in today's competitive market."}
            </p>

            {/* Team Section */}
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              {config.about.sections?.team?.title || "Team"}
            </h2>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              {config.about.sections?.team?.content ||
                "Our diverse team brings together expertise from recruitment, technology, and design to create an innovative job board solution that puts user experience first."}
            </p>

            {/* Contact Us Section - Conditionally rendered based on config */}
            {config.about.contact?.show && (
              <>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                  {config.about.contact.title || "Get in Touch"}
                </h2>
                <p className="text-zinc-600 mb-6 leading-relaxed">
                  {config.about.contact.description ||
                    "Have questions or want to learn more about our services? We&apos;d love to hear from you."}
                </p>
                <div className="mt-6 mb-8">
                  <Link href={config.about.contact.url}>
                    <Button
                      size="xs"
                      variant="primary"
                      className="gap-1.5 text-xs"
                      style={{
                        backgroundColor: resolveColor(config.ui.primaryColor),
                      }}
                    >
                      {config.about.contact.label}
                      <ArrowRight
                        className="h-3.5 w-3.5 ml-1"
                        aria-hidden="true"
                      />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
