import { Badge } from "@/components/ui/badge";
import config from "@/config";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  badge: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function HeroSection({
  badge,
  title,
  description,
  children,
}: HeroSectionProps) {
  // Get the hero background color from config if available
  const heroBackgroundColor = config?.ui?.heroBackgroundColor || "";
  const heroTitleColor = config?.ui?.heroTitleColor || "";
  const heroSubtitleColor = config?.ui?.heroSubtitleColor || "";
  const heroBadgeVariant = config?.ui?.heroBadgeVariant || "outline";
  const heroBadgeBgColor = config?.ui?.heroBadgeBgColor || "";
  const heroBadgeTextColor = config?.ui?.heroBadgeTextColor || "";
  const heroBadgeBorderColor = config?.ui?.heroBadgeBorderColor || "";

  // Apply the background color inline if it's set in config
  const heroStyle = heroBackgroundColor
    ? { backgroundColor: heroBackgroundColor }
    : {};

  return (
    <div className="border-b" style={heroStyle}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-[640px] space-y-6">
          <div className="space-y-4">
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
      </div>
    </div>
  );
}
