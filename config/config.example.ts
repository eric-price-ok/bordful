/**
 * Job Board Configuration Example
 * ----------------------------
 * This is a template for your job board configuration.
 *
 * Quick Start for Users Who Fork This Repository:
 * 1. Copy this file: cp config/config.example.ts config/config.ts
 * 2. Make sure it's called config.ts
 * 3. Customize config.ts with your settings
 * 4. Commit config.ts to your repository
 *
 * IMPORTANT: The main repository does not include config.ts
 * This allows you to maintain your own configuration while
 * still being able to pull updates from the main repository.
 *
 * When updating from upstream (original bordful repo):
 * - Pull the latest changes
 * - Your config.ts will remain unchanged
 * - Check this file for new options
 * - Add desired new options to your config.ts
 */

import type { ScriptProps } from "next/script";

interface CustomScript {
  src: string;
  strategy: ScriptProps["strategy"];
  attributes?: Record<string, string>;
}

export const config = {
  // Marketing & SEO
  badge: "Open Source Next.js Job Board Starter Kit",
  title: "Discover and Apply to Your Dream Jobs Today",
  description:
    "Browse curated opportunities from leading companies. Updated daily with the latest positions.",
  url:
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://demo.bordful.com"),

  // Job Alerts Configuration
  jobAlerts: {
    // Enable or disable the job alerts feature
    enabled: true,

    // Show job alerts link in navigation
    showInNavigation: true,

    // Show job alerts link in footer resources
    showInFooter: true,

    // Navigation label
    navigationLabel: "Job Alerts",

    // The email provider to use (must match a provider in the email section)
    provider: "encharge",
  },

  // Email Provider Configuration
  email: {
    // The email provider to use for subscriptions
    provider: process.env.EMAIL_PROVIDER || "encharge",

    // Encharge configuration
    encharge: {
      // Your Encharge write key (from Encharge dashboard)
      writeKey: process.env.ENCHARGE_WRITE_KEY,

      // Default tags to apply to subscribers
      defaultTags: "job-alerts-subscriber",

      // Event name for subscriptions
      eventName: "Job Alert Subscription",
    },

    // You can add other providers here in the future:
    // mailchimp: { ... },
    // convertkit: { ... },
    // sendgrid: { ... },
  },

  // Scripts Configuration (analytics, tracking, etc.)
  scripts: {
    head: [
      // Example: Umami Analytics (loads early but non-blocking)
      {
        src: "https://umami.craftled.com/script.js",
        strategy: "afterInteractive",
        attributes: {
          "data-website-id": "b93ebd4d-b4fd-49f3-9507-c32245ac447f",
          defer: "",
        },
      },
    ] as CustomScript[],
    body: [] as CustomScript[], // Scripts to load at the end of body
  },

  // Navigation
  nav: {
    title: "Bordful", // The text shown in the navigation bar
    icon: "BriefcaseBusiness", // Lucide icon name (see https://lucide.dev/icons)
    logo: {
      enabled: false, // Set to true to use a custom logo instead of icon + text
      src: "/bordful.svg", // Path to your logo image (place it in the public directory)
      width: 67, // Width of the logo in pixels
      height: 20, // Height of the logo in pixels
      alt: "Bordful", // Alt text for the logo
    },
    github: {
      show: true, // Whether to show the GitHub button
      url: "https://github.com/craftled/bordful", // Your GitHub repository URL
    },
    linkedin: {
      show: true,
      url: "https://www.linkedin.com/company/bordful/",
    },
    twitter: {
      show: true,
      url: "https://x.com/bordful",
    },
    bluesky: {
      show: true,
      url: "https://bsky.app/profile/bordful.com",
    },
    reddit: {
      show: true,
      url: "https://reddit.com/r/bordful",
    },
    postJob: {
      show: true, // Whether to show the Post Job button
      label: "Post a Job", // Button text
      link: "https://stripe.com", // Button link
      external: true, // Indicates the link is external (opens in a new tab)
    },
    topMenu: [
      { label: "Home", link: "/" },
      { label: "Jobs", link: "/jobs" },
      { label: "About", link: "/about" },
      { label: "Changelog", link: "/changelog" },
    ],
  },

  // Footer
  footer: {
    // Brand section (reuses nav social links)
    brand: {
      show: true,
      description:
        "Browse curated opportunities from leading companies. Updated daily with the latest positions.",
    },

    // Resources section
    resources: {
      show: true,
      title: "Resources",
      links: [
        { label: "Home", link: "/" },
        { label: "Jobs", link: "/jobs" },
        { label: "About", link: "/about" },
        { label: "Changelog", link: "/changelog" },
      ],
    },

    // Legal section
    legal: {
      show: true,
      title: "Legal",
      links: [
        {
          label: "Privacy & Cookies",
          link: "/privacy",
          external: false,
        },
        {
          label: "Terms of Service",
          link: "/terms",
          external: false,
        },
        {
          label: "License",
          link: "https://github.com/craftled/bordful/blob/main/LICENSE",
          external: true,
        },
      ],
    },

    // Post Job section
    postJob: {
      show: true,
      title: "Post a Job",
      description:
        "Reach our community of talented professionals. Get quality applications fast.",
      button: {
        label: "Post a Job",
        link: "https://stripe.com",
        external: true, // Indicates the footer link should open externally
      },
    },

    // Copyright section
    copyright: {
      show: true,
      startYear: 2024,
      text: "Bordful - An open-source Next.js job board template. Standing on the shoulders of giants.",
    },

    // Built with section
    builtWith: {
      show: true,
      text: "Built with",
      name: "Bordful",
      link: "https://bordful.com/",
      showLogo: true,
    },
  },
} as const;

export type Config = typeof config;
export default config;
