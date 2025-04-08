import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import config from "@/config";
import { resolveColor } from "@/lib/utils/colors";
import { Briefcase } from "lucide-react";

export function PostJobBanner() {
  // Early return if banner is disabled
  if (!config.postJobBanner.enabled) {
    return null;
  }

  const {
    title,
    description,
    showTrustedBy,
    trustedByText,
    companyAvatars,
    cta,
    trustMessage,
  } = config.postJobBanner;

  return (
    <Card className="p-6 border shadow-none rounded-lg">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-sm mb-4 text-muted-foreground">{description}</p>

      {showTrustedBy && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-3">
            {companyAvatars.map((avatar, index) => (
              <Avatar key={index} className="h-7 w-7 border border-background">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{trustedByText}</span>
        </div>
      )}

      <a
        href={cta.link}
        target={cta.external ? "_blank" : undefined}
        rel={cta.external ? "noopener noreferrer" : undefined}
        className="block"
      >
        <Button
          size="xs"
          className="w-full gap-1.5 text-xs h-8 sm:h-7 px-3 sm:px-2.5 flex items-center justify-center"
          variant="primary"
          style={{ backgroundColor: resolveColor(config.ui.primaryColor) }}
        >
          <span className="flex items-center justify-center">
            {cta.text}
            <Briefcase className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
          </span>
        </Button>
      </a>

      <p className="text-xs text-center mt-4 text-muted-foreground">
        {trustMessage}
      </p>
    </Card>
  );
}
