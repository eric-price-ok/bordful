---
title: Feature Usage Examples
description: Real-world examples of how to implement and use key Bordful features.
lastUpdated: "2024-05-29"
---

# Feature Usage Examples

This guide provides real-world examples of how to implement and use key Bordful features in practical scenarios.

## Job Listings Display Examples

### Featured Jobs Section

Create a featured jobs section on your homepage to highlight premium job listings:

```typescript
// config/config.ts
hero: {
  // Other hero configuration...
  showFeaturedJobs: true,
  featuredJobsHeading: "Featured Opportunities",
  featuredJobsCount: 3,
  featuredJobsViewAllLink: true,
  featuredJobsViewAllText: "View All Featured Jobs",
},
```

**Result**: A carousel of featured jobs will appear below your hero section, showcasing jobs marked as "featured" in your Airtable base.

### Industry-Specific Job Board

Configure your job board to focus on a specific industry:

```typescript
// config/config.ts
jobListing: {
  // Other job listing configuration...
  title: "Tech Jobs",
  description: "Find the best opportunities in technology",
  defaultFilters: {
    types: ["Full-time"],
    industries: ["Technology", "Software", "IT"],
  }
},
```

**Result**: Your job board will automatically filter for technology jobs by default while still allowing users to view all jobs.

## Advanced Filtering Implementation

### Remote-First Job Board

Create a job board focused on remote opportunities:

```typescript
// config/config.ts
filtering: {
  // Other filtering configuration...
  defaultFilters: {
    remote: true,
  },
  filters: {
    // Emphasize remote region options
    remoteRegions: true,
    timezones: true,
  }
},
```

**Result**: Your job board will default to showing remote jobs and highlight remote-specific filters.

### Salary-Focused Filtering

Prioritize salary filtering for compensation-focused users:

```typescript
// config/config.ts
filtering: {
  // Other filtering configuration...
  filterOrder: ["salary", "jobTypes", "careerLevels", "remote"],
  salaryRanges: [
    { label: "Entry Level (<$60k)", min: 0, max: 60000 },
    { label: "Mid Level ($60k-$100k)", min: 60000, max: 100000 },
    { label: "Senior Level ($100k-$150k)", min: 100000, max: 150000 },
    { label: "Leadership ($150k+)", min: 150000, max: null },
  ]
}
```

**Result**: Salary filters will appear first in the filter sidebar with custom ranges matching career progression.

## Job Alerts Implementation

### Targeted Alert Categories

Create pre-categorized job alert options:

```typescript
// config/config.ts
jobAlerts: {
  // Other job alerts configuration...
  categories: {
    enabled: true,
    heading: "Choose Your Alert Categories",
    options: [
      { id: "engineering", label: "Engineering Roles", default: false },
      { id: "design", label: "Design Roles", default: false },
      { id: "marketing", label: "Marketing Roles", default: false },
      { id: "remote", label: "Remote-Only Roles", default: true },
    ]
  }
}
```

**Result**: The job alerts form will include checkboxes for different alert categories, allowing for targeted subscriptions.

### Personalized Alert Frequency

Allow subscribers to choose their alert frequency:

```typescript
// config/config.ts
jobAlerts: {
  // Other job alerts configuration...
  frequency: {
    enabled: true,
    heading: "Alert Frequency",
    options: [
      { id: "instant", label: "Instant Alerts", default: false },
      { id: "daily", label: "Daily Digest", default: true },
      { id: "weekly", label: "Weekly Roundup", default: false },
    ]
  }
}
```

**Result**: The job alerts form will include radio buttons for alert frequency preferences.

## Theming and Branding Examples

### High-Contrast Theme

Create a high-contrast theme for improved accessibility:

```typescript
// config/config.ts
ui: {
  primaryColor: "#0d6efd",
  titleColor: "#000000",
  textColor: "#000000",
  mutedTextColor: "#444444",
  backgroundColor: "#ffffff",
  cardBackgroundColor: "#f8f9fa",
  borderColor: "#000000",
  focusRingColor: "#0d6efd",
  
  // Increase contrast for interactive elements
  buttonTextColor: "#ffffff",
  buttonHoverColor: "#0b5ed7",
}
```

**Result**: Your job board will have enhanced contrast for better readability and accessibility.

### Startup-Focused Branding

Create a modern, startup-friendly look:

```typescript
// config/config.ts
ui: {
  primaryColor: "#7c3aed", // Vibrant purple
  heroGradient: {
    enabled: true,
    type: "linear",
    direction: "to right",
    colors: ["#7c3aed", "#c026d3", "#db2777"],
  },
  titleColor: "#18181b",
  titleFontWeight: "extrabold",
  buttonStyle: "rounded",
  cardStyle: "shadow",
}
```

**Result**: Your job board will have a modern, colorful look with rounded buttons and subtle shadows.

## Navigation and Footer Examples

### Resource-Rich Footer

Create a footer with comprehensive resources:

```typescript
// config/config.ts
footer: {
  // Other footer configuration...
  columns: [
    {
      title: "For Job Seekers",
      links: [
        { label: "Job Search Tips", href: "/blog/job-search-tips" },
        { label: "Resume Builder", href: "/tools/resume-builder" },
        { label: "Career Resources", href: "/resources" },
        { label: "Job Alerts", href: "/job-alerts" },
      ],
    },
    {
      title: "For Employers",
      links: [
        { label: "Post a Job", href: "/post" },
        { label: "Pricing", href: "/pricing" },
        { label: "Recruitment Tips", href: "/blog/recruitment-tips" },
        { label: "Bulk Posting", href: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookies", href: "/cookies" },
        { label: "Accessibility", href: "/accessibility" },
      ],
    },
  ],
}
```

**Result**: A comprehensive footer with categorized resources for different user types.

### Streamlined Navigation with Dropdown

Create a clean navigation with focused dropdowns:

```typescript
// config/config.ts
nav: {
  // Other navigation configuration...
  menu: [
    { label: "Home", link: "/" },
    { 
      label: "Jobs", 
      link: "/jobs",
      dropdown: true,
      items: [
        { label: "Browse All", link: "/jobs" },
        { label: "Remote Only", link: "/jobs?remote=true" },
        { label: "Tech Roles", link: "/jobs?types=tech" },
        { label: "Marketing Roles", link: "/jobs?types=marketing" },
        { label: "Design Roles", link: "/jobs?types=design" },
      ]
    },
    { label: "Salary Guide", link: "/salary-guide" },
    { 
      label: "Resources", 
      link: "#",
      dropdown: true,
      items: [
        { label: "Career Blog", link: "/blog" },
        { label: "Job Alerts", link: "/job-alerts" },
        { label: "Salary Calculator", link: "/tools/salary-calculator" },
      ]
    },
    { label: "Post a Job", link: "/post", highlight: true },
  ],
}
```

**Result**: A clean navigation bar with organized dropdowns for different job categories and resources.

## Multi-Currency Implementation

### Cryptocurrency-Focused Job Board

Configure your job board to prioritize cryptocurrency compensation:

```typescript
// config/config.ts
currency: {
  defaultCurrency: "BTC",
  allowedCurrencies: ["BTC", "ETH", "USDT", "USDC", "USD", "EUR"],
},
salary: {
  showCurrencyCode: true,
  format: {
    useCompact: true,
    cryptoDecimals: 5,
  }
}
```

**Result**: Your job board will display Bitcoin as the default currency with optimized cryptocurrency formatting.

### International Salary Display

Configure your job board for international salary comparison:

```typescript
// config/config.ts
salary: {
  // Show equivalent USD value for non-USD salaries
  showUSDEquivalent: true,
  // Show salary in both monthly and annual formats
  showAlternateTimeUnit: true,
  // Format options
  format: {
    useCompact: true,
    useGrouping: true,
  }
}
```

**Result**: Job listings will show equivalent USD values for all non-USD salaries and display both monthly and annual figures where applicable.

## SEO and Schema Implementation

### Google Jobs Optimization

Optimize your job board for Google Jobs indexing:

```typescript
// config/config.ts
seo: {
  googleJobs: {
    enabled: true,
    prioritizeStructuredData: true,
    enhancedJobPosting: true,
  },
  // Add industry-specific job categories
  jobCategories: [
    "Software Development",
    "Data Science",
    "UX/UI Design",
    "Digital Marketing",
  ]
}
```

**Result**: Your job board will have enhanced schema.org markup specifically optimized for Google Jobs with industry-specific categorization.

## Related Documentation

- [Core Features](/docs/guides/core-features.md)
- [Job Listings Configuration](/docs/guides/job-listings.md)
- [Filtering System](/docs/guides/filtering-system.md)
- [Navigation and Footer Customization](/docs/guides/navigation.md)
- [Theming and Customization](/docs/guides/theming-customization.md) 