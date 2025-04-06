import { Badge } from "@/components/ui/badge";
import config from "@/config";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeroImageConfig {
  enabled?: boolean;
  src?: string;
  alt?: string;
}

interface HeroSectionProps {
  badge: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  heroImage?: HeroImageConfig; // Add per-page hero image configuration
}

export function HeroSection({
  badge,
  title,
  description,
  children,
  heroImage,
}: HeroSectionProps) {
  // Get the hero background color from config if available
  const heroBackgroundColor = config?.ui?.heroBackgroundColor || "";
  const heroTitleColor = config?.ui?.heroTitleColor || "";
  const heroSubtitleColor = config?.ui?.heroSubtitleColor || "";
  const heroBadgeVariant = config?.ui?.heroBadgeVariant || "outline";
  const heroBadgeBgColor = config?.ui?.heroBadgeBgColor || "";
  const heroBadgeTextColor = config?.ui?.heroBadgeTextColor || "";
  const heroBadgeBorderColor = config?.ui?.heroBadgeBorderColor || "";

  // Use page-specific hero image config if provided, otherwise fall back to global config
  const heroImageConfig = heroImage || config?.ui?.heroImage;

  // Apply the background color inline if it's set in config
  const heroStyle = heroBackgroundColor
    ? { backgroundColor: heroBackgroundColor }
    : {};

  return (
    <div className="border-b overflow-hidden" style={heroStyle}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 space-y-6">
            <div className="space-y-4 max-w-lg">
              <Badge
                variant={heroBadgeVariant}
                className="mb-2"
                style={{
                  backgroundColor: heroBadgeBgColor || undefined,
                  color: heroBadgeTextColor || undefined,
                  borderColor: heroBadgeBorderColor || undefined,
                }}
              >
                {badge}
              </Badge>
              <h1
                className={cn("text-3xl md:text-4xl font-bold tracking-tight")}
                style={{ color: heroTitleColor || undefined }}
              >
                {title}
              </h1>
              <p
                className={cn(
                  "text-sm text-muted-foreground md:text-base max-w-[540px]"
                )}
                style={{ color: heroSubtitleColor || undefined }}
              >
                {description}
              </p>
            </div>
            {children}
          </div>

          {heroImageConfig?.enabled && heroImageConfig.src && (
            <div className="flex-1 md:block mt-8 md:mt-0">
              <Image
                src={heroImageConfig.src}
                alt={heroImageConfig.alt || "Hero image"}
                width={500}
                height={350}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
