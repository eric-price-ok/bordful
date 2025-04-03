import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import config from "@/config";
import { resolveColor } from "@/lib/utils/colors";

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
              <Avatar key={index} className="h-8 w-8 border border-background">
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
      >
        <Button
          className="w-full text-white"
          variant="primary"
          style={{ backgroundColor: resolveColor(config.ui.primaryColor) }}
        >
          {cta.text}
        </Button>
      </a>

      <p className="text-xs text-center mt-4 text-muted-foreground">
        {trustMessage}
      </p>
    </Card>
  );
}
