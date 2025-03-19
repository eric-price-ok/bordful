import { Metadata } from "next";
import { Building2, Users2, Globe2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeroSection } from "@/components/ui/hero-section";
import config from "@/config";
import { MetadataBreadcrumb } from "@/components/ui/metadata-breadcrumb";

// Add metadata for SEO
export const metadata: Metadata = {
  title: "About Us | Connect with Career Opportunities",
  description:
    "Learn about our mission to connect talented professionals with exciting career opportunities. We provide a platform for job seekers and employers to find their perfect match.",
  keywords:
    "job board, career opportunities, recruitment platform, job search, hiring platform",
  openGraph: {
    title: "About Us | Connect with Career Opportunities",
    description:
      "Learn about our mission to connect talented professionals with exciting career opportunities. We provide a platform for job seekers and employers to find their perfect match.",
    type: "website",
    url: `${config.url}/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Connect with Career Opportunities",
    description:
      "Learn about our mission to connect talented professionals with exciting career opportunities. We provide a platform for job seekers and employers to find their perfect match.",
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
  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        badge="About Us"
        title="Connecting Talent with Opportunity"
        description="Learn more about our mission to connect talented professionals with exciting career opportunities across various industries."
      />

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <MetadataBreadcrumb metadata={metadata} pathname="/about" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border shadow-none rounded-lg">
            <CardHeader className="p-0 space-y-2">
              <Building2 className="h-5 w-5 mb-2 text-zinc-500" />
              <CardTitle className="text-base font-semibold text-zinc-900">
                Mission
              </CardTitle>
              <CardDescription className="text-sm text-zinc-600">
                We&apos;re dedicated to making job hunting simpler and more
                efficient for both job seekers and employers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="p-6 border shadow-none rounded-lg">
            <CardHeader className="p-0 space-y-2">
              <Users2 className="h-5 w-5 mb-2 text-zinc-500" />
              <CardTitle className="text-base font-semibold text-zinc-900">
                Community First
              </CardTitle>
              <CardDescription className="text-sm text-zinc-600">
                Built with a deep understanding of what matters in modern
                recruitment and career development.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="p-6 border shadow-none rounded-lg">
            <CardHeader className="p-0 space-y-2">
              <Globe2 className="h-5 w-5 mb-2 text-zinc-500" />
              <CardTitle className="text-base font-semibold text-zinc-900">
                Global Reach
              </CardTitle>
              <CardDescription className="text-sm text-zinc-600">
                Connect with opportunities worldwide, with support for remote
                work and relocation assistance.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="max-w-[720px] space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-zinc-900">
              What We Do
            </h2>
            <div className="text-sm text-zinc-600">
              <p>
                We&apos;re more than just a job board. We&apos;re a platform
                that understands the evolving needs of the modern workplace. Our
                platform helps companies find exceptional talent and enables
                professionals to discover opportunities that align with their
                skills and career goals.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-zinc-900">
              Features
            </h2>
            <ul className="space-y-4 text-sm text-zinc-600">
              <li className="flex items-start">
                <span className="font-medium text-zinc-900 mr-2">•</span>
                <span>
                  Detailed job listings with comprehensive information about
                  roles, requirements, and benefits
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-zinc-900 mr-2">•</span>
                <span>
                  Clear compensation details to help make informed career
                  decisions
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-zinc-900 mr-2">•</span>
                <span>
                  Flexible work arrangements and relocation support information
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-zinc-900 mr-2">•</span>
                <span>
                  User-friendly interface for both candidates and employers
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-zinc-900">
              Get Started
            </h2>
            <div className="text-sm text-zinc-600">
              <p>
                Whether you&apos;re exploring your next career move or searching
                for top talent, we&apos;re here to help. Browse latest
                opportunities or post a position to reach our community of
                qualified professionals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
