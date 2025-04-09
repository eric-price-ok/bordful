import { Metadata } from "next";
import { MetadataBreadcrumb } from "@/components/ui/metadata-breadcrumb";
import config from "@/config";
import { HeroSection } from "@/components/ui/hero-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SupportChannelCard } from "@/components/contact/SupportChannelCard";
import { ContactInfoSection } from "@/components/contact/ContactInfoSection";
import { ContactSchema } from "@/components/ui/contact-schema";
import { resolveColor } from "@/lib/utils/colors";

// Add metadata for SEO
export const metadata: Metadata = {
  title: `${config.contact?.title || "Contact"} | ${config.title}`,
  description:
    config.contact?.description ||
    "Have questions or feedback? We'd love to hear from you.",
  keywords:
    config.contact?.keywords ||
    "contact us, support, help, questions, feedback, get in touch",
  openGraph: {
    title: `${config.contact?.title || "Contact"} | ${config.title}`,
    description:
      config.contact?.description ||
      "Have questions or feedback? We'd love to hear from you.",
    type: "website",
    url: `${config.url}/contact`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.contact?.title || "Contact"} | ${config.title}`,
    description:
      config.contact?.description ||
      "Have questions or feedback? We'd love to hear from you.",
  },
  alternates: {
    canonical: "/contact",
    languages: {
      en: `${config.url}/contact`,
      "x-default": `${config.url}/contact`,
    },
  },
};

// This page will be static
export const dynamic = "force-static";

export default function ContactPage() {
  // If contact page is not enabled, redirect to home page
  if (!config.contact?.enabled) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Contact Page Not Available
          </h1>
          <p className="mb-6">The contact page is currently not available.</p>
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
      {/* Add ContactPage Schema */}
      <ContactSchema
        companyName={config.contact.contactInfo.companyName}
        email={config.contact.contactInfo.email}
        phone={config.contact.contactInfo.phone}
        address={config.contact.contactInfo.address}
        description={config.contact.schema?.description}
      />

      <HeroSection
        badge={config.contact.badge || "Contact Us"}
        title={config.contact.title}
        description={config.contact.description}
        heroImage={config.contact.heroImage}
      />

      {/* Contact and Support Channels */}
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <MetadataBreadcrumb metadata={metadata} pathname="/contact" />
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 text-center mb-8">
          {config.contact.supportChannels.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Contact Information Card (First Card) */}
          <div className="h-full">
            <ContactInfoSection
              title={config.contact.contactInfo.title}
              description={config.contact.contactInfo.description}
              companyName={config.contact.contactInfo.companyName}
              email={config.contact.contactInfo.email}
              phone={config.contact.contactInfo.phone}
              address={config.contact.contactInfo.address}
            />
          </div>

          {/* Support Channel Cards */}
          {config.contact.supportChannels.channels.map((channel, index) => (
            <SupportChannelCard
              key={index}
              title={channel.title}
              description={channel.description}
              buttonText={channel.buttonText}
              buttonLink={channel.buttonLink}
              icon={channel.icon}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
