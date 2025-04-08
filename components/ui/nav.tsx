"use client";

import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import {
  Menu,
  X,
  Rss,
  ChevronDown,
  Briefcase,
  BriefcaseBusiness,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, ReactNode, useCallback } from "react";
import { usePathname } from "next/navigation";
import { resolveColor } from "@/lib/utils/colors";

// Brand icon component that uses the configured icon name or falls back to BriefcaseBusiness
function BrandIcon() {
  // We're intentionally using a simple approach for the brand icon
  // Most users will use a custom logo, so this is just a fallback
  return <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />;
}

// Reusable component interfaces
interface NavLinkProps {
  href: string;
  isActive: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

interface SocialLinkProps {
  href: string;
  label: string;
  children: ReactNode;
}

interface SocialIconProps {
  src: string;
  alt: string;
}

interface DropdownItemProps {
  href: string;
  isActive: boolean;
  onClick?: () => void;
  children: ReactNode;
}

// Reusable navigation link component
function NavLink({
  href,
  isActive,
  onClick,
  children,
  className = "",
}: NavLinkProps) {
  const baseClasses = "text-sm px-2.5 py-1 rounded-lg transition-colors";
  const activeClasses = "text-zinc-900 bg-zinc-100";
  const inactiveClasses = "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50";

  const linkClasses = `${baseClasses} ${
    isActive ? activeClasses : inactiveClasses
  } ${className}`;

  return (
    <Link href={href} className={linkClasses} onClick={onClick}>
      {children}
    </Link>
  );
}

// Reusable social icon link component
function SocialLink({ href, label, children }: SocialLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-600 hover:text-zinc-900 transition-colors"
      aria-label={label}
    >
      {children}
    </Link>
  );
}

// Reusable social icon component with hover effect
function SocialIcon({ src, alt }: SocialIconProps) {
  return (
    <div className="relative group">
      {/* Default state (zinc-600) */}
      <Image
        src={src}
        alt={alt}
        width={16}
        height={16}
        className="h-4 w-4 group-hover:opacity-0 transition-opacity"
        style={{
          filter:
            "invert(41%) sepia(9%) saturate(380%) hue-rotate(202deg) brightness(94%) contrast(91%)", // zinc-600
        }}
      />

      {/* Hover state (zinc-900) - positioned absolutely on top */}
      <Image
        src={src}
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          filter:
            "invert(14%) sepia(8%) saturate(427%) hue-rotate(202deg) brightness(93%) contrast(90%)", // zinc-900
        }}
        aria-hidden="true"
      />
    </div>
  );
}

// Dropdown menu item component
function DropdownItem({
  href,
  isActive,
  onClick,
  children,
}: DropdownItemProps) {
  const baseClasses = "block px-4 py-2 text-sm";
  const activeClasses = "bg-zinc-100 text-zinc-900";
  const inactiveClasses = "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900";

  const itemClasses = `${baseClasses} ${
    isActive ? activeClasses : inactiveClasses
  }`;

  return (
    <Link href={href} className={itemClasses} onClick={onClick} role="menuitem">
      {children}
    </Link>
  );
}

// Use a consistent type for social platform configuration
type SocialPlatformConfig = {
  id: string;
  configProp: keyof typeof config.nav;
  src: string;
  alt: string;
  labelPrefix: string;
};

// Define social platforms with their properties outside of component for reuse
const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    id: "github",
    configProp: "github",
    src: "/assets/social/github.svg",
    alt: "GitHub",
    labelPrefix: "View on",
  },
  {
    id: "linkedin",
    configProp: "linkedin",
    src: "/assets/social/linkedin.svg",
    alt: "LinkedIn",
    labelPrefix: "Follow us on",
  },
  {
    id: "twitter",
    configProp: "twitter",
    src: "/assets/social/twitter.svg",
    alt: "Twitter",
    labelPrefix: "Follow us on X (",
  },
  {
    id: "bluesky",
    configProp: "bluesky",
    src: "/assets/social/bluesky.svg",
    alt: "Bluesky",
    labelPrefix: "Follow us on",
  },
  {
    id: "reddit",
    configProp: "reddit",
    src: "/assets/social/reddit.svg",
    alt: "Reddit",
    labelPrefix: "Follow us on",
  },
];

// Custom hook for dropdown management
function useDropdownMenu() {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Register dropdown refs for click outside detection
  const registerDropdownRef = useCallback(
    (label: string, ref: HTMLDivElement | null) => {
      dropdownRefs.current[label] = ref;
    },
    []
  );

  // Toggle dropdown open/closed
  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }, []);

  // Handle mouse enter on dropdown
  const handleDropdownMouseEnter = useCallback((label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }

    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: true,
    }));
  }, []);

  // Handle mouse leave on dropdown
  const handleDropdownMouseLeave = useCallback((label: string) => {
    // Add delay before closing to prevent accidental closures
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdowns((prev) => ({
        ...prev,
        [label]: false,
      }));
    }, 300); // 300ms delay
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.entries(dropdownRefs.current).forEach(([label, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdowns((prev) => ({
            ...prev,
            [label]: false,
          }));
        }
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any pending timeout when unmounting
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return {
    openDropdowns,
    registerDropdownRef,
    toggleDropdown,
    handleDropdownMouseEnter,
    handleDropdownMouseLeave,
  };
}

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Use our custom hook for dropdown functionality
  const {
    openDropdowns,
    registerDropdownRef,
    toggleDropdown,
    handleDropdownMouseEnter,
    handleDropdownMouseLeave,
  } = useDropdownMenu();

  // Use menu items directly from config
  const menuItems = config.nav.menu || [];

  // Check if a path is active (exact match or starts with for /jobs)
  const isActivePath = (path: string): boolean => {
    if (path === "/jobs") {
      return pathname.startsWith(path);
    }
    return pathname === path;
  };

  // Render social media links
  const renderSocialLinks = () => {
    return (
      <div className="flex items-center space-x-3">
        {/* RSS Feed Icon */}
        {config.rssFeed?.enabled && (
          <SocialLink href="/feed.xml" label="Subscribe to RSS Feed">
            <Rss className="h-4 w-4" aria-hidden="true" />
          </SocialLink>
        )}

        {/* Social Media Links */}
        {SOCIAL_PLATFORMS.map((platform) => {
          // Type assertion to access the social platform config
          const platformConfig = config.nav[platform.configProp] as {
            show: boolean;
            url: string;
          };
          if (!platformConfig?.show) return null;

          const label =
            platform.labelPrefix +
            (platform.id === "twitter" ? "Twitter)" : ` ${platform.alt}`);

          return (
            <SocialLink
              key={platform.id}
              href={platformConfig.url}
              label={label}
            >
              <SocialIcon src={platform.src} alt={platform.alt} />
            </SocialLink>
          );
        })}
      </div>
    );
  };

  // Unified function to render navigation items for both mobile and desktop
  const renderNavItems = (isMobile: boolean) => {
    return menuItems.map((item) => {
      // Handle dropdown menu items
      if (item.dropdown && item.items) {
        const isDropdownOpen = openDropdowns[item.label];

        if (isMobile) {
          return (
            <div key={item.link} className="mb-1">
              <NavLink
                href={item.link}
                isActive={pathname === item.link}
                onClick={() => setIsOpen(false)}
                className="mb-1 block"
              >
                {item.label}
              </NavLink>
              <div className="pl-4 mt-1 border-l border-zinc-200">
                {item.items.map((subItem) => (
                  <NavLink
                    key={subItem.link}
                    href={subItem.link}
                    isActive={pathname === subItem.link}
                    onClick={() => setIsOpen(false)}
                    className="mb-1 block"
                  >
                    {subItem.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        }

        // Desktop dropdown
        return (
          <div
            key={item.link}
            className="relative"
            ref={(ref) => registerDropdownRef(item.label, ref)}
            onMouseEnter={() => handleDropdownMouseEnter(item.label)}
            onMouseLeave={() => handleDropdownMouseLeave(item.label)}
          >
            <button
              className={`text-sm px-2.5 py-1 rounded-lg flex items-center ${
                pathname.startsWith(item.link)
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              } transition-colors`}
              aria-expanded={isDropdownOpen}
              onClick={() => toggleDropdown(item.label)}
            >
              {item.label}
              <ChevronDown className="ml-1 h-3 w-3" aria-hidden="true" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                onMouseEnter={() => handleDropdownMouseEnter(item.label)}
                onMouseLeave={() => handleDropdownMouseLeave(item.label)}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {item.items.map((subItem) => (
                    <DropdownItem
                      key={subItem.link}
                      href={subItem.link}
                      isActive={pathname === subItem.link}
                      onClick={() => toggleDropdown(item.label)}
                    >
                      {subItem.label}
                    </DropdownItem>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      // Regular menu items
      return (
        <NavLink
          key={item.link}
          href={item.link}
          isActive={isActivePath(item.link)}
          onClick={() => isMobile && setIsOpen(false)}
          className={isMobile ? "mb-1" : ""}
        >
          {item.label}
        </NavLink>
      );
    });
  };

  // Create specialized renderers for desktop and mobile
  const renderDesktopNavItems = () => renderNavItems(false);
  const renderMobileNavItems = () => renderNavItems(true);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="container mx-auto px-4">
        <nav
          className="flex h-14 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-zinc-900 hover:text-zinc-800 transition-colors"
            aria-label="Home"
          >
            {config.nav.logo.enabled ? (
              <Image
                src={config.nav.logo.src}
                alt={config.nav.logo.alt}
                width={config.nav.logo.width}
                height={config.nav.logo.height}
                className="object-contain"
                priority
              />
            ) : (
              <>
                <BrandIcon />
                <span className="text-sm font-medium">{config.nav.title}</span>
              </>
            )}
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Post Job Button - Smaller version */}
            {config.nav.postJob.show && (
              <Button
                asChild
                size="xs"
                className="gap-1 text-xs px-2 py-1"
                variant={config.nav.postJob.variant || "default"}
                style={
                  config.nav.postJob.variant === "primary"
                    ? {
                        backgroundColor: resolveColor(config.ui.primaryColor),
                      }
                    : undefined
                }
              >
                <Link
                  href={config.nav.postJob.link}
                  {...(config.nav.postJob.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {config.nav.postJob.label}
                  <Briefcase className="h-3 w-3 ml-1" aria-hidden="true" />
                </Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            {/* Primary Navigation */}
            <nav
              className="flex items-center space-x-2 mr-4"
              aria-label="Primary"
            >
              {renderDesktopNavItems()}
            </nav>

            {/* Social links and post job */}
            <div className="flex items-center">
              {renderSocialLinks()}

              {config.nav.postJob.show && (
                <Button
                  asChild
                  size="xs"
                  className="ml-3 gap-1.5 text-xs"
                  variant={config.nav.postJob.variant || "default"}
                  style={
                    config.nav.postJob.variant === "primary"
                      ? {
                          backgroundColor: resolveColor(config.ui.primaryColor),
                        }
                      : undefined
                  }
                >
                  <Link
                    href={config.nav.postJob.link}
                    {...(config.nav.postJob.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {config.nav.postJob.label}
                    <Briefcase
                      className="h-3.5 w-3.5 ml-1"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </nav>

        {isOpen && (
          <div className="md:hidden border-t border-zinc-200">
            <nav
              className="flex flex-col py-4 px-4"
              aria-label="Mobile navigation"
            >
              {/* Primary Navigation */}
              {renderMobileNavItems()}

              {/* Social Links */}
              <div className="flex items-center space-x-3 px-4 py-4 border-t border-zinc-200 mt-2">
                {renderSocialLinks()}
              </div>

              {/* Post Job Action */}
              {config.nav.postJob.show && (
                <div className="px-4 pt-2 md:hidden">
                  <Button
                    asChild
                    size="xs"
                    className={`w-full gap-1.5 text-xs`}
                    variant={config.nav.postJob.variant || "default"}
                    style={
                      config.nav.postJob.variant === "primary"
                        ? {
                            backgroundColor: resolveColor(
                              config.ui.primaryColor
                            ),
                          }
                        : undefined
                    }
                  >
                    <Link
                      href={config.nav.postJob.link}
                      {...(config.nav.postJob.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center"
                    >
                      {config.nav.postJob.label}
                      <Briefcase
                        className="h-3.5 w-3.5 ml-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
