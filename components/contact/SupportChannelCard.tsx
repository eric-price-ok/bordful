import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  Twitter,
  HelpCircle,
  Phone,
  MessageSquare,
  Github,
  Linkedin,
  Rss,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

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
  Twitter,
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
  // Get the icon component or use HelpCircle as fallback
  const IconComponent = iconMap[icon] || HelpCircle;

  const isExternalLink =
    buttonLink.startsWith("http") || buttonLink.startsWith("mailto");

  return (
    <Card className="h-full flex flex-col border-zinc-200 hover:border-zinc-300 transition-colors">
      <CardHeader className="pb-2 space-y-3">
        <div>
          <IconComponent className="h-5 w-5 text-zinc-700" />
        </div>
        <h3 className="text-base font-medium text-zinc-900">{title}</h3>
      </CardHeader>
      <CardContent className="pb-6 flex-grow">
        <p className="text-sm text-zinc-600 leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          asChild
          size="xs"
          className="bg-zinc-900 text-white hover:bg-zinc-800 gap-1.5 text-xs w-full"
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
      </CardFooter>
    </Card>
  );
}
