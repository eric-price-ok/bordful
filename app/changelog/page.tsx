import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";
import config from "@/config";

// Add metadata for SEO
export const metadata: Metadata = {
  title: "Changelog | Latest Updates and Improvements",
  description:
    "Stay up to date with the latest features, improvements, and bug fixes in our job board platform. Track our progress and see what's new.",
  keywords:
    "changelog, updates, features, improvements, job board updates, release notes",
  openGraph: {
    title: "Changelog | Latest Updates and Improvements",
    description:
      "Stay up to date with the latest features, improvements, and bug fixes in our job board platform. Track our progress and see what's new.",
    type: "website",
    url: `${config.url}/changelog`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog | Latest Updates and Improvements",
    description:
      "Stay up to date with the latest features, improvements, and bug fixes in our job board platform. Track our progress and see what's new.",
  },
  alternates: {
    canonical: "/changelog",
    languages: {
      en: `${config.url}/changelog`,
      "x-default": `${config.url}/changelog`,
    },
  },
};

// This page will be static
export const dynamic = "force-static";

async function getChangelogContent() {
  const filePath = path.join(process.cwd(), "CHANGELOG.md");
  const content = fs.readFileSync(filePath, "utf8");
  return content;
}

export default async function ChangelogPage() {
  const content = await getChangelogContent();

  return (
    <main className="container py-8">
      <div className="max-w-[700px]">
        <div className="prose prose-sm prose-gray max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
