import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  HelpCircle,
  Phone,
  MessageSquare,
  Github,
  Linkedin,
  Rss,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import config from "@/config";
import { resolveColor } from "@/lib/utils/colors";

interface SupportChannelCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon: string;
}

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
  Mail,
  HelpCircle,
  Phone,
  MessageSquare,
  Github,
  Linkedin,
  Rss,
};

export function SupportChannelCard({
  title,
  description,
  buttonText,
  buttonLink,
  icon,
}: SupportChannelCardProps) {
  // Check if it's Twitter icon
  const isTwitterIcon = icon === "Twitter";

  // Get the icon component or use HelpCircle as fallback
  const IconComponent = !isTwitterIcon ? iconMap[icon] || HelpCircle : null;

  const isExternalLink =
    buttonLink.startsWith("http") || buttonLink.startsWith("mailto");

  return (
    <div className="h-full flex flex-col p-5 border rounded-lg hover:border-gray-400 transition-all">
      <div className="pb-2 space-y-3">
        <div>
          {isTwitterIcon ? (
            <div className="h-5 w-5 relative">
              <Image
                src="/assets/social/twitter.svg"
                alt="Twitter/X"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
          ) : (
            <IconComponent className="h-5 w-5 text-zinc-700" />
          )}
        </div>
        <h3 className="text-base font-medium text-zinc-900">{title}</h3>
      </div>
      <div className="pb-6 flex-grow">
        <p className="text-sm text-zinc-600 leading-relaxed">{description}</p>
      </div>
      <div className="pt-0 mt-auto">
        <Button
          asChild
          size="xs"
          variant="primary"
          className="gap-1.5 text-xs w-full"
          style={{ backgroundColor: resolveColor(config.ui.primaryColor) }}
        >
          <Link
            href={buttonLink}
            target={isExternalLink ? "_blank" : undefined}
            rel={isExternalLink ? "noopener noreferrer" : undefined}
          >
            {buttonText}
            {isExternalLink && (
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {!isExternalLink && (
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}
