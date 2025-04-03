"use client";

import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import dynamic from "next/dynamic";
import { PlusCircle, Menu, X, Rss, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

// Preload the icon for better performance
const DynamicIcon = dynamic(
  () =>
    import("lucide-react").then((mod) => mod[config.nav.icon] || mod.Briefcase),
  {
    ssr: true,
  }
);

// Job dropdown menu items
const jobDropdownItems = [
  { label: "All Jobs", link: "/jobs" },
  { label: "Job Types", link: "/jobs/types" },
  { label: "Job Locations", link: "/jobs/locations" },
  { label: "Job Levels", link: "/jobs/levels" },
  { label: "Job Languages", link: "/jobs/languages" },
];

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

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  const jobsDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Create a copy of the top menu items with a more flexible type
  const topMenuItems = [...config.nav.topMenu] as Array<{
    label: string;
    link: string;
  }>;

  // Add Job Alerts link if enabled
  if (config.jobAlerts?.enabled && config.jobAlerts?.showInNavigation) {
    topMenuItems.push({
      label: config.jobAlerts.navigationLabel || "Job Alerts",
      link: "/job-alerts",
    });
  }

  // Add RSS Feed link if enabled
  if (config.rssFeed?.enabled && config.rssFeed?.showInNavigation) {
    topMenuItems.push({
      label: config.rssFeed.navigationLabel || "RSS Feed",
      link: "/feed.xml",
    });
  }

  // Add Pricing link if enabled
  if (config.pricing?.enabled && config.pricing?.showInNavigation) {
    topMenuItems.push({
      label: config.pricing.navigationLabel || "Pricing",
      link: "/pricing",
    });
  }

  // Add FAQ link if enabled
  if (config.faq?.enabled && config.faq?.showInNavigation) {
    topMenuItems.push({
      label: config.faq.navigationLabel || "FAQ",
      link: "/faq",
    });
  }

  // Add Contact link if enabled
  if (config.contact?.enabled && config.contact?.showInNavigation) {
    topMenuItems.push({
      label: config.contact.navigationLabel || "Contact",
      link: "/contact",
    });
  }

  // Check if a path is active (exact match or starts with for /jobs)
  const isActivePath = (path: string): boolean => {
    if (path === "/jobs") {
      return pathname.startsWith(path);
    }
    return pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        jobsDropdownRef.current &&
        !jobsDropdownRef.current.contains(event.target as Node)
      ) {
        setJobsDropdownOpen(false);
      }
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

  // Functions to handle dropdown hover behavior
  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setJobsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    // Add delay before closing to prevent accidental closures
    dropdownTimeoutRef.current = setTimeout(() => {
      setJobsDropdownOpen(false);
    }, 300); // 300ms delay
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

        {config.nav.github.show && (
          <SocialLink href={config.nav.github.url} label="View on GitHub">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
          </SocialLink>
        )}

        {config.nav.linkedin.show && (
          <SocialLink
            href={config.nav.linkedin.url}
            label="Follow us on LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 1a4 4 0 0 0 -4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4 -4V5a4 4 0 0 0 -4 -4H5Zm1.205 6.91a1.705 1.705 0 1 0 0 -3.41 1.705 1.705 0 0 0 0 3.41ZM7.909 19.5V9.273H4.5V19.5h3.41Zm4.432 -10.227H9.273V19.5h3.068v-6.17c0.395 -0.642 1.077 -1.33 2.045 -1.33 1.364 0 1.705 1.364 1.705 2.046V19.5H19.5v-5.454c0 -1.828 -0.797 -4.773 -3.75 -4.773 -1.878 0 -2.92 0.685 -3.41 1.327V9.273Z"
                clipRule="evenodd"
              ></path>
            </svg>
          </SocialLink>
        )}

        {config.nav.twitter.show && (
          <SocialLink
            href={config.nav.twitter.url}
            label="Follow us on X (Twitter)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 1C2.79086 1 1 2.79086 1 5v14c0 2.2091 1.79086 4 4 4h14c2.2091 0 4 -1.7909 4 -4V5c0 -2.20914 -1.7909 -4 -4 -4H5Zm-0.33429 3.5c-0.17536 0.06527 -0.32332 0.19509 -0.40968 0.3683 -0.12689 0.2545 -0.09892 0.55889 0.07223 0.78601l5.61418 7.45029 -5.91591 6.344c-0.01551 0.0167 -0.03011 0.0338 -0.04382 0.0514h2.04691l4.82948 -5.179 3.7133 4.9278c0.0871 0.1155 0.2043 0.2018 0.3364 0.2512h4.4223c0.1748 -0.0654 0.3224 -0.195 0.4085 -0.3679 0.1269 -0.2545 0.099 -0.5589 -0.0722 -0.786l-5.6142 -7.4503L20.0173 4.5h-2.051l-4.8298 5.17932 -3.7133 -4.92774c-0.08729 -0.11583 -0.20496 -0.20227 -0.3375 -0.25158H4.66571ZM15.5454 18.0475 6.4315 5.95294h2.01878L17.5642 18.0475h-2.0188Z"
                clipRule="evenodd"
              />
            </svg>
          </SocialLink>
        )}

        {config.nav.bluesky.show && (
          <SocialLink
            href={config.nav.bluesky.url}
            label="Follow us on Bluesky"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"></path>
            </svg>
          </SocialLink>
        )}

        {config.nav.reddit.show && (
          <SocialLink href={config.nav.reddit.url} label="Follow us on Reddit">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 5C1 2.79086 2.79086 1 5 1H19C21.2091 1 23 2.79086 23 5V19C23 21.2091 21.2091 23 19 23H5C2.79086 23 1 21.2091 1 19V5ZM18.9782 10.1972C20.1014 10.0845 21 10.9859 21 12.1127C21 12.9014 20.5507 13.5775 19.8768 13.9155V14.4789C19.8768 17.5211 16.3947 20 12.014 20C7.63339 20 4.15133 17.5211 4.15133 14.4789V13.9155C3.92668 13.9155 3.70203 13.6901 3.5897 13.5775C2.80343 12.7887 2.80343 11.5493 3.5897 10.7606C4.37598 9.97183 5.61154 9.97183 6.39782 10.7606C7.97036 9.6338 9.76755 9.07042 11.6771 9.07042L12.8003 4.22535C12.8003 4.11268 12.8003 4 12.9126 4H13.1373L16.2824 4.78873C16.507 4.33803 16.9563 4 17.5179 4C18.3042 4 18.9782 4.56338 18.9782 5.35211C18.9782 6.14084 18.4165 6.8169 17.6303 6.8169C16.844 6.8169 16.17 6.25352 16.17 5.46479L13.2496 4.78873L12.351 9.07042C14.2605 9.07042 16.0577 9.74648 17.6303 10.7606C17.9672 10.4225 18.5289 10.1972 18.9782 10.1972ZM8.86895 12.2254C8.19501 12.2254 7.52106 12.7887 7.52106 13.5775C7.52106 14.3662 8.08268 14.9296 8.86895 14.9296C9.5429 14.9296 10.2168 14.2535 10.2168 13.5775C10.2168 12.9014 9.65523 12.2254 8.86895 12.2254ZM12.014 18.3099C13.2496 18.4225 14.3729 17.9718 15.3838 17.2958C15.4961 17.0704 15.4961 16.8451 15.2715 16.7324C15.0468 16.6197 14.8222 16.6197 14.7098 16.7324C13.9236 17.2958 12.9126 17.6338 11.9017 17.5211C10.8908 17.6338 9.87988 17.2958 9.0936 16.7324C8.98128 16.6197 8.75663 16.6197 8.64431 16.7324C8.53198 16.9577 8.53198 17.1831 8.64431 17.2958C9.65523 17.9718 10.7785 18.3099 12.014 18.3099ZM13.6989 13.5775C13.6989 14.2535 14.2605 14.9296 15.0468 14.9296C15.8331 14.9296 16.507 14.3662 16.3947 13.5775C16.3947 12.9014 15.8331 12.2254 15.0468 12.2254C14.3729 12.2254 13.6989 12.9014 13.6989 13.5775Z"
                fill="currentColor"
              />
            </svg>
          </SocialLink>
        )}
      </div>
    );
  };

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
                <DynamicIcon className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-medium">{config.nav.title}</span>
              </>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            {/* Primary Navigation */}
            <nav
              className="flex items-center space-x-2 mr-4"
              aria-label="Primary"
            >
              {topMenuItems.map(({ link, label }) => {
                // Special handling for Jobs menu item
                if (label === "Jobs") {
                  return (
                    <div
                      key={link}
                      className="relative"
                      ref={jobsDropdownRef}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <button
                        className={`text-sm px-2.5 py-1 rounded-lg flex items-center ${
                          pathname.startsWith("/jobs")
                            ? "text-zinc-900 bg-zinc-100"
                            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                        } transition-colors`}
                        aria-expanded={jobsDropdownOpen}
                        onClick={() => {
                          if (!jobsDropdownOpen) {
                            handleDropdownMouseEnter();
                          } else {
                            setJobsDropdownOpen(false);
                          }
                        }}
                      >
                        {label}
                        <ChevronDown
                          className="ml-1 h-3 w-3"
                          aria-hidden="true"
                        />
                      </button>

                      {jobsDropdownOpen && (
                        <div
                          className="absolute left-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleDropdownMouseLeave}
                        >
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            {jobDropdownItems.map((item) => (
                              <DropdownItem
                                key={item.link}
                                href={item.link}
                                isActive={pathname === item.link}
                                onClick={() => setJobsDropdownOpen(false)}
                              >
                                {item.label}
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
                    key={link}
                    href={link}
                    isActive={isActivePath(link)}
                    onClick={() => {}}
                  >
                    {label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-6" aria-label="Actions">
              {renderSocialLinks()}

              {config.nav.postJob.show && (
                <Button
                  asChild
                  size="xs"
                  className={`gap-1.5 text-xs`}
                  variant={config.nav.postJob.variant || "default"}
                  style={
                    config.nav.postJob.variant === "primary"
                      ? { backgroundColor: config.ui.primaryColor }
                      : undefined
                  }
                >
                  <Link
                    href={config.nav.postJob.link}
                    {...(config.nav.postJob.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {config.nav.postJob.label}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-zinc-200">
            <nav
              className="flex flex-col py-4 px-4"
              aria-label="Mobile navigation"
            >
              {/* Primary Navigation */}
              {topMenuItems.map(({ link, label }) => {
                // Special handling for Jobs menu item in mobile view
                if (label === "Jobs") {
                  return (
                    <div key={link} className="mb-1">
                      <NavLink
                        href={link}
                        isActive={pathname === link}
                        onClick={() => setIsOpen(false)}
                        className="mb-1 block"
                      >
                        {label}
                      </NavLink>
                      <div className="pl-4 mt-1 border-l border-zinc-200">
                        {jobDropdownItems.map((item) => (
                          <NavLink
                            key={item.link}
                            href={item.link}
                            isActive={pathname === item.link}
                            onClick={() => setIsOpen(false)}
                            className="mb-1 block"
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Regular menu items
                return (
                  <NavLink
                    key={link}
                    href={link}
                    isActive={isActivePath(link)}
                    onClick={() => setIsOpen(false)}
                    className="mb-1"
                  >
                    {label}
                  </NavLink>
                );
              })}

              {/* Social Links */}
              <div className="flex items-center space-x-3 px-4 py-4 border-t border-zinc-200 mt-2">
                {renderSocialLinks()}
              </div>

              {/* Post Job Action */}
              {config.nav.postJob.show && (
                <div className="px-4 pt-2">
                  <Button
                    asChild
                    size="sm"
                    className={`w-full gap-1.5`}
                    variant={config.nav.postJob.variant || "default"}
                    style={
                      config.nav.postJob.variant === "primary"
                        ? { backgroundColor: config.ui.primaryColor }
                        : undefined
                    }
                  >
                    <Link
                      href={config.nav.postJob.link}
                      {...(config.nav.postJob.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      onClick={() => setIsOpen(false)}
                    >
                      <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      {config.nav.postJob.label}
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
