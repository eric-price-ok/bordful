import { Metadata } from "next";
import { MetadataBreadcrumb } from "@/components/ui/metadata-breadcrumb";
import config from "@/config";
import { HeroSection } from "@/components/ui/hero-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SupportChannelCard } from "@/components/contact/SupportChannelCard";
import { ContactInfoSection } from "@/components/contact/ContactInfoSection";
import { ContactSchema } from "@/components/ui/contact-schema";

// Add metadata for SEO
export const metadata: Metadata = {
  title: `${config.contact?.title || "Contact"} | ${config.title}`,
  description:
    config.contact?.description ||
    "Have questions or feedback? We'd love to hear from you.",
  keywords: "contact us, support, help, questions, feedback, get in touch",
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
            <Button>Return Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Add ContactPage Schema */}
      <ContactSchema />

      <HeroSection
        badge="Contact Us"
        title={config.contact.title}
        description={config.contact.description}
      />

      {/* Support Channels */}
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <MetadataBreadcrumb metadata={metadata} pathname="/contact" />
            </div>

            <h2 className="text-2xl font-semibold text-zinc-900 text-center mb-8">
              {config.contact.supportChannels.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      </section>

      {/* Contact Information */}
      <div className="container px-4 mx-auto mb-16">
        <div className="max-w-2xl mx-auto">
          <ContactInfoSection
            title={config.contact.contactInfo.title}
            description={config.contact.contactInfo.description}
            companyName={config.contact.contactInfo.companyName}
            email={config.contact.contactInfo.email}
            phone={config.contact.contactInfo.phone}
            address={config.contact.contactInfo.address}
          />
        </div>
      </div>
    </main>
  );
}
