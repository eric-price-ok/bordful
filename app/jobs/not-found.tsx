import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import config from "@/config";
import { resolveColor } from "@/lib/utils/colors";

export default function JobNotFound() {
  return (
    <main className="container py-16">
      <div className="max-w-[640px] mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-4">Job Not Found</h1>
        <p className="text-gray-600 mb-3">
          The job posting you&apos;re looking for doesn&apos;t exist, has been
          removed, or has expired.
        </p>
        <p className="text-gray-600 mb-8">
          Companies may remove job listings when positions are filled or no
          longer available.
        </p>
        <Link href="/jobs">
          <Button
            size="xs"
            className="gap-1.5 text-xs"
            variant="primary"
            style={{
              backgroundColor: resolveColor(config.ui.primaryColor),
            }}
          >
            Browse Jobs
            <Search className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
