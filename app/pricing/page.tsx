import { Metadata } from "next";
import { Check, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { JobBadge } from "@/components/ui/job-badge";
import config from "@/config";

// Format a billing term for display
const formatPricingBillingTerm = (billingTerm: string): string => {
  return `/${billingTerm}`;
};

// Add metadata for SEO
export const metadata: Metadata = {
  title: `${config.pricing?.title || "Pricing"} | ${config.title}`,
  description:
    config.pricing?.description ||
    "Choose the plan that's right for your job board needs.",
  keywords:
    "job board pricing, post job, job listing plans, recruitment pricing",
  openGraph: {
    title: `${config.pricing?.title || "Pricing"} | ${config.title}`,
    description:
      config.pricing?.description ||
      "Choose the plan that's right for your job board needs.",
    type: "website",
    url: `${config.url}/pricing`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.pricing?.title || "Pricing"} | ${config.title}`,
    description:
      config.pricing?.description ||
      "Choose the plan that's right for your job board needs.",
  },
  alternates: {
    canonical: "/pricing",
    languages: {
      en: `${config.url}/pricing`,
      "x-default": `${config.url}/pricing`,
    },
  },
};

// This page will be static
export const dynamic = "force-static";

export default function PricingPage() {
  // If pricing is not enabled, redirect to home page
  if (!config.pricing?.enabled) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Pricing Not Available</h1>
          <p className="mb-6">The pricing page is currently not available.</p>
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
        badge="Pricing"
        title={config.pricing.title}
        description={config.pricing.description}
      />

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {config.pricing.plans.map((plan, index) => (
            <div key={index} className="group relative">
              <div
                className={`block px-5 py-6 border rounded-lg transition-all h-full ${
                  plan.highlighted
                    ? "border-zinc-400 shadow-sm"
                    : "hover:border-gray-400"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-medium">{plan.name}</h2>
                    {plan.badge && (
                      <JobBadge
                        type={plan.badge.type || "featured"}
                        icon={<Sparkles className="w-3 h-3" />}
                      >
                        {plan.badge.text}
                      </JobBadge>
                    )}
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">
                      {plan.price === 0
                        ? "Free"
                        : `${config.pricing.currencySymbol}${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="ml-1 text-sm text-gray-500">
                        {formatPricingBillingTerm(plan.billingTerm)}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    {plan.description}
                  </div>

                  <div>
                    <Button
                      asChild
                      size="xs"
                      variant={
                        plan.cta.variant === "outline" ? "outline" : "default"
                      }
                      className={
                        plan.cta.variant !== "outline"
                          ? "bg-zinc-900 text-white hover:bg-zinc-800 gap-1.5 text-xs w-full"
                          : "gap-1.5 text-xs w-full"
                      }
                    >
                      <Link
                        href={plan.cta.link}
                        target={
                          plan.cta.link.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          plan.cta.link.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {plan.cta.label}
                        <ArrowUpRight
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </Button>
                  </div>

                  <div className="border-t pt-4"></div>

                  <ul className="space-y-2.5">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mr-2 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Processing Information */}
        {config.pricing.paymentProcessingText && (
          <div className="max-w-sm mx-auto mt-12 text-center">
            <p className="text-xs text-gray-500 text-balance">
              {config.pricing.paymentProcessingText}
            </p>

            {/* Payment Method Icons */}
            {config.pricing.paymentMethods?.enabled && (
              <div className="flex justify-center items-center gap-2 mt-4">
                {config.pricing.paymentMethods.icons.map((icon) => (
                  <div
                    key={icon.name}
                    className="relative w-10 h-8 hover:grayscale-0 hover:opacity-100 transition-all"
                  >
                    <Image
                      src={`/assets/${icon.name}.svg`}
                      alt={icon.alt}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
