---
title: Navigation Customization
description: Configure and customize the navigation bar and menu structure for your Bordful job board.
lastUpdated: "2025-05-22"
---

Bordful provides a fully customizable navigation system that allows you to tailor the navigation bar to match your branding and navigation needs.

## Key Features

- Brand display with icon+text or custom logo options
- Dropdown menu support with hover effects
- Social media integration (GitHub, LinkedIn, Twitter/X, Bluesky, Reddit)
- Mobile-responsive design with hamburger menu
- Accessible navigation with ARIA attributes
- Configurable via a single configuration file

## Navigation Configuration

The navigation bar is configured in the `nav` section of your `config/config.ts` file:

```typescript
nav: {
  title: "JobBoard", // Navigation bar text
  logo: {
    enabled: false, // Set to true to use a custom logo instead of icon + text
    src: "/your-logo.svg", // Path to your logo image (place it in the public directory)
    width: 120, // Width of the logo in pixels
    height: 32, // Height of the logo in pixels
    alt: "Your Company Logo", // Alt text for the logo
  },
  github: {
    show: true, // Show/hide GitHub button
    url: "https://github.com/yourusername/yourrepo",
  },
  linkedin: {
    show: true, // Show/hide LinkedIn button
    url: "https://linkedin.com/company/yourcompany",
  },
  twitter: {
    show: true, // Show/hide Twitter/X button
    url: "https://x.com/yourhandle",
  },
  bluesky: {
    show: true, // Show/hide Bluesky button
    url: "https://bsky.app/profile/yourdomain.com",
  },
  reddit: {
    show: true, // Show/hide Reddit button
    url: "https://reddit.com/r/yoursubreddit",
  },
  postJob: {
    show: true, // Show/hide Post Job button
    label: "Post a Job", // Button text
    link: "/post", // Button URL
  },
  topMenu: [
    // Navigation menu items
    { label: "Home", link: "/" },
    { label: "Jobs", link: "/jobs" },
    { label: "About", link: "/about" },
    { label: "Changelog", link: "/changelog" },
  ],
}
```

## Brand Display Options

You can choose between two display modes for your brand in the navigation bar:

### 1. Icon + Text (Default)

The default display mode shows the Bordful icon followed by your site title:

```typescript
nav: {
  title: "Your Job Board", // This text appears next to the icon
  logo: {
    enabled: false, // Keep this false for icon + text mode
  },
}
```

### 2. Custom Logo

For a more branded experience, enable the custom logo option:

```typescript
nav: {
  logo: {
    enabled: true, // Enable custom logo
    src: "/your-logo.svg", // Path to your logo (in public directory)
    width: 120, // Width in pixels
    height: 32, // Height in pixels
    alt: "Your Company Logo", // Alt text for accessibility
  },
}
```

**Note**: For best results, use an SVG logo with transparent background. For optimal mobile display, keep the height between 28-36px.

## Social Media Integration

Bordful supports multiple social media platforms that can be individually enabled or disabled:

```typescript
nav: {
  github: {
    show: true, // Show/hide GitHub button
    url: "https://github.com/yourusername/yourrepo",
  },
  linkedin: {
    show: true, // Show/hide LinkedIn button
    url: "https://linkedin.com/company/yourcompany",
  },
  twitter: {
    show: true, // Show/hide Twitter/X button
    url: "https://x.com/yourhandle",
  },
  bluesky: {
    show: true, // Show/hide Bluesky button
    url: "https://bsky.app/profile/yourdomain.com",
  },
  reddit: {
    show: true, // Show/hide Reddit button
    url: "https://reddit.com/r/yoursubreddit",
  },
}
```

You can enable or disable each platform individually by setting its `show` property to `true` or `false`.

## Post Job Button

The prominent "Post a Job" button can be customized or hidden:

```typescript
nav: {
  postJob: {
    show: true, // Show/hide Post Job button
    label: "Post a Job", // Button text
    link: "/post", // Button URL
  },
}
```

## Navigation Menu Options

Bordful provides two menu configuration options:

### 1. Simple Top Menu

For a basic horizontal menu without dropdowns:

```typescript
nav: {
  topMenu: [
    { label: "Home", link: "/" },
    { label: "Jobs", link: "/jobs" },
    { label: "About", link: "/about" },
    { label: "Changelog", link: "/changelog" },
  ],
}
```

### 2. Advanced Menu with Dropdowns

For a more complex navigation structure with dropdown menus:

```typescript
nav: {
  menu: [
    { label: "Home", link: "/" },
    // Example dropdown menu
    { 
      label: "Jobs", 
      link: "/jobs",
      dropdown: true,
      items: [
        { label: "All Jobs", link: "/jobs" },
        { label: "Job Types", link: "/jobs/types" },
        { label: "Job Locations", link: "/jobs/locations" },
        { label: "Job Levels", link: "/jobs/levels" },
        { label: "Job Languages", link: "/jobs/languages" }
      ]
    },
    { label: "About", link: "/about" },
    { label: "Resources", link: "#", dropdown: true, items: [
      { label: "FAQ", link: "/faq" },
      { label: "Job Alerts", link: "/job-alerts" },
      { label: "RSS Feed", link: "/feed.xml" }
    ]},
  ],
}
```

**Note**: If both `topMenu` and `menu` are configured, the `menu` configuration takes precedence.

## Helper Functions

For convenience, Bordful provides helper functions to create common menu structures:

```typescript
import { createJobsMenu, createResourcesMenu } from "@/lib/menu-helpers";

// In your config.ts
nav: {
  menu: [
    { label: "Home", link: "/" },
    createJobsMenu(), // Creates a standard Jobs dropdown
    { label: "About", link: "/about" },
    createResourcesMenu(), // Creates a standard Resources dropdown
  ],
}
```

## Mobile Responsiveness

The navigation system automatically adapts to mobile devices:

- On desktop: Full horizontal menu with dropdowns on hover
- On mobile: Hamburger menu icon that opens a full-screen menu
- Dropdowns in mobile view: Tap to expand/collapse

No additional configuration is required for mobile support.

## Accessibility Features

The navigation system includes several accessibility features:

- ARIA attributes for menu items and dropdowns
- Keyboard navigation support
- Focus indicators for keyboard users
- Screen reader-friendly markup
- Sufficient color contrast for text elements

## Best Practices

1. **Keep Navigation Simple**: Limit top-level menu items to 5-7 items for better usability
2. **Logical Grouping**: Group related pages in dropdown menus
3. **Consistent URLs**: Use consistent URL patterns for menu items
4. **Clear Labels**: Use clear, concise labels for menu items
5. **Testing**: Test navigation on both desktop and mobile devices

## Implementation Details

The navigation system is implemented in:

- `components/ui/nav.tsx`: Main navigation component
- `components/ui/mobile-nav.tsx`: Mobile navigation component
- `lib/menu-helpers.ts`: Helper functions for creating common menu structures

## Related Documentation

- [Footer Customization](/docs/guides/footer.md)
- [Theming and Color Customization](/docs/guides/theming-customization.md)
- [Configuration Options](/docs/reference/configuration-options.md)
- [Logo Customization](/docs/guides/logo-customization.md) 