# Navigation Bar Customization

The top navigation bar in Bordful is a highly customizable component that provides a modern, responsive interface for users to navigate your job board. This document outlines the various customization options and provides examples for configuring the navigation bar to match your branding and navigation needs.

## Overview

The navigation bar (`Nav` component) offers the following key features:

- Customizable brand display (text or logo)
- Dropdown menu support with hover effects
- Social media links with custom SVG icons
- Mobile-responsive design with hamburger menu
- Accessible navigation with ARIA attributes
- Smart dropdown management with custom hooks

## Component Architecture

The navigation bar is built using several subcomponents:

- `Nav`: The main component that orchestrates the layout and behavior
- `NavLink`: Reusable component for navigation links
- `SocialLink`: Component for social media links
- `SocialIcon`: Component for social media icons with hover effects
- `DropdownItem`: Component for dropdown menu items
- `useDropdownMenu`: Custom hook for dropdown state management

## Configuration Options

### Brand Display

The navigation bar allows two options for displaying your brand:

1. **Icon & Text**: Use the default mode with Lucide icons and custom title
2. **Custom Logo**: Enable logo mode and specify your image, width, height, and alt text

```typescript
// Icon & Text mode
logo: {
  enabled: false,
}

// Custom Logo mode
logo: {
  enabled: true,
  src: "/your-logo.svg",
  width: 120,
  height: 32,
  alt: "Your Company Logo",
}
```

### Navigation Menu

The `menu` array allows you to define navigation items with optional dropdowns:

```typescript
menu: [
  { label: "Home", link: "/" },
  { 
    label: "Jobs", 
    link: "/jobs",
    dropdown: true,
    items: [
      { label: "All Jobs", link: "/jobs" },
      { label: "Job Types", link: "/jobs/types" },
      { label: "Job Locations", link: "/jobs/locations" },
    ]
  },
  { label: "About", link: "/about" },
]
```

Each menu item supports:
- `label`: Display text
- `link`: Target URL
- `dropdown`: Boolean to enable dropdown functionality
- `items`: Array of submenu items (when dropdown is true)

### Social Media Links

The navigation bar supports multiple social media platforms, each with individual toggle controls:

```typescript
github: {
  show: true,
  url: "https://github.com/yourusername/yourrepo",
},
linkedin: {
  show: true,
  url: "https://linkedin.com/company/yourcompany",
},
twitter: {
  show: true,
  url: "https://x.com/yourhandle",
},
bluesky: {
  show: true,
  url: "https://bsky.app/profile/yourdomain.com",
},
reddit: {
  show: true,
  url: "https://reddit.com/r/yoursubreddit",
},
```

Each social platform:
- Has a custom SVG icon in `/assets/social/`
- Includes hover effects (color transitions)
- Uses proper accessibility labels
- Opens in a new tab with security attributes

### Post Job Button

The navigation bar can optionally display a call-to-action button for posting jobs:

```typescript
postJob: {
  show: true,
  label: "Post a Job",
  link: "/post",
  external: false, // Set to true for external links
  variant: "default", // Button variant (default, outline, etc.)
},
```

The button supports:
- Custom label text
- Internal or external linking
- Different visual variants
- Optional primary color theming

## Mobile Responsiveness

The navigation bar implements a clean binary responsive approach:

1. **Desktop View (≥1024px)**: 
   - Full horizontal menu with all elements at their proper size
   - Dropdowns on hover with 300ms close delay
   - All social icons and navigation items visible without scaling
   - No text wrapping or layout breaking
   
2. **Mobile View (<1024px)**:
   - "Post a Job" button remains visible next to the hamburger menu for easy access
   - Hamburger icon toggle for menu access
   - Vertical accordion-style menu when expanded
   - Nested items with proper indentation
   - Social links in a separate section

This approach avoids problematic "in-between" states where content might scale down inappropriately or wrap to multiple lines, breaking the layout. By using the `lg` breakpoint (1024px) instead of the standard `md` breakpoint (768px), the navbar has enough space to display all elements at their full size before switching to the mobile view.

## Accessibility Features

The navigation component implements several accessibility features:

- Proper `aria-label` attributes on all interactive elements
- `aria-expanded` state for dropdowns
- Focus management for keyboard navigation
- Color contrast that meets WCAG guidelines
- Screen reader friendly icon labels

## Complete Configuration Example

```typescript
nav: {
  title: "JobBoard", // Navigation bar text
  logo: {
    enabled: false, // Set to true to use a custom logo instead of icon + text
    src: "/your-logo.svg", // Path to your logo image
    width: 120, // Width in pixels
    height: 32, // Height in pixels
    alt: "Your Company Logo", // Alt text
  },
  // Social media links with individual toggle
  github: {
    show: true,
    url: "https://github.com/yourusername/yourrepo",
  },
  linkedin: {
    show: true,
    url: "https://linkedin.com/company/yourcompany",
  },
  twitter: {
    show: true,
    url: "https://x.com/yourhandle",
  },
  bluesky: {
    show: true,
    url: "https://bsky.app/profile/yourdomain.com",
  },
  reddit: {
    show: true,
    url: "https://reddit.com/r/yoursubreddit",
  },
  // Post job button configuration
  postJob: {
    show: true,
    label: "Post a Job",
    link: "/post",
    external: false, // Set to true for external links
    variant: "default", // Button variant (default, outline, etc.)
  },
  // Navigation menu with dropdown support
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
},
```

## Custom Hooks

The navigation component uses a custom `useDropdownMenu` hook to manage dropdown state and behavior:

1. **State Management**: Tracks which dropdowns are open
2. **Click Outside Detection**: Closes dropdowns when clicking elsewhere
3. **Hover Management**: Handles mouse enter/leave with delay for better UX
4. **Multiple Dropdown Support**: Manages state for multiple independent dropdowns

This approach separates logic from UI rendering, making the component more maintainable and easier to extend.

## Adding Custom Social Platforms

To add a new social platform:

1. Add an SVG icon to `/public/assets/social/`
2. Update the `SOCIAL_PLATFORMS` array in `components/ui/nav.tsx`
3. Add the new platform to your configuration

## Implementation Details

The navigation bar uses:

- React state for managing mobile menu and dropdown visibility
- Next.js Link component for optimized navigation
- CSS transitions for smooth animations
- Tailwind CSS for responsive styling
- React useRef for managing dropdown references 