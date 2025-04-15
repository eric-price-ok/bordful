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
  const heroGradient = config?.ui?.heroGradient;

  // Use page-specific hero image config if provided, otherwise fall back to global config
  const heroImageConfig = heroImage || config?.ui?.heroImage;

  // Create background style based on gradient or solid color
  let heroStyle = {};

  if (heroGradient?.enabled && heroGradient.colors?.length) {
    const { type, direction, colors, stops } = heroGradient;
    const colorStops = colors
      .map((color, index) => {
        const stop = stops && stops[index] ? ` ${stops[index]}` : "";
        return `${color}${stop}`;
      })
      .join(", ");

    if (type === "linear") {
      heroStyle = {
        background: `linear-gradient(${
          direction || "to right"
        }, ${colorStops})`,
      };
    } else if (type === "radial") {
      heroStyle = {
        background: `radial-gradient(${direction || "circle"}, ${colorStops})`,
      };
    }
  } else if (heroBackgroundColor) {
    // Apply solid background color if gradient is not enabled
    heroStyle = { backgroundColor: heroBackgroundColor };
  }

  return (
    <div className="border-b overflow-hidden" style={heroStyle}>
      <div className="container mx-auto px-0 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-12">
          <div className="w-full md:w-1/2 px-4 sm:px-0 space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3">
              <Badge
                variant={heroBadgeVariant}
                className="mb-1"
                style={{
                  backgroundColor: heroBadgeBgColor || undefined,
                  color: heroBadgeTextColor || undefined,
                  borderColor: heroBadgeBorderColor || undefined,
                }}
              >
                {badge}
              </Badge>
              <h1
                className={cn(
                  "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
                )}
                style={{ color: heroTitleColor || undefined }}
              >
                {title}
              </h1>
              <p
                className={cn("text-sm text-muted-foreground md:text-base")}
                style={{ color: heroSubtitleColor || undefined }}
              >
                {description}
              </p>
            </div>
            {children}
          </div>

          {heroImageConfig?.enabled && heroImageConfig.src && (
            <div className="w-full md:w-1/2 px-4 sm:px-0 md:block">
              <Image
                src={heroImageConfig.src}
                alt={heroImageConfig.alt || "Hero image"}
                width={500}
                height={350}
                className="rounded-lg object-cover w-full md:w-auto"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
