# Bordful: Job Board Starter

Bordful is a modern, minimal job board built with Next.js, Tailwind CSS, and Airtable. Features static generation, client-side search, and a clean UI with Geist font.

![Job Board Starter Screenshot](public/screenshot.png)

## Features

- Built with Next.js
- Styled with Tailwind CSS
- Airtable as the backend
- Client-side search with memoization
- Server-side caching with 5-minute revalidation
- Content-specific loading states
- Fully responsive
- Comprehensive SEO features:
  - Complete schema.org JobPosting structured data implementation with schema-dts typing
  - Google Jobs integration with rich search results
  - Comprehensive schema markup with 20+ job properties
  - Support for remote job schema requirements
  - Automatic XML sitemap generation with ISR updates
  - Programmatic robots.txt with fine-grained crawling control
  - SEO-friendly URLs with descriptive job slugs
  - Prioritized URLs (1.0 for homepage, 0.9 for featured jobs)
  - Dynamic sitemap updates every 5 minutes
  - Complete coverage of all job listings and category pages
  - Protection of private routes from indexing
- Modern UI with Geist font, Tailwind CSS, and Shadcn UI
- Incremental Static Regeneration (ISR) for real-time updates
- Rich text support for job descriptions
- Comprehensive job metadata with multi-select career levels
- Enhanced hero section with customization options:
  - Configurable background colors
  - Support for both linear and radial gradients
  - Background image support with overlay capabilities
  - Customizable gradient directions, colors, and stops
  - Consistent styling with application theme
  - Seamless fallbacks for solid background colors
- Job benefits and perks displaying in the sidebar
- Application requirements for clear candidate expectations
- Application deadline display with relative time indicators
- Job identifier display for better reference and tracking
- Google-compliant status handling:
  - Active/inactive status management for job listings
  - Automatic 404 responses for inactive job listings (Google best practice)
  - Enhanced 404 pages with explanatory messaging
  - Consistent status checking across all job-related routes
  - API routes with proper status-based responses
  - OpenGraph images following the same status rules
- Advanced salary structure with currency and time unit support
  - Supports 50+ global fiat currencies
  - Cryptocurrency support (Bitcoin, Ethereum, etc.)
  - Stablecoin support (USDT, USDC, etc.)
  - Intelligent symbol formatting
  - USD conversion for comparison
- Smart pagination with URL-based navigation
- Sorting options (newest, oldest, highest salary)
- Dynamic jobs per page selection
- Featured job posts with distinct styling
- Similar jobs suggestions based on title and location
- URL-based filter persistence for sharing and bookmarking
- Comprehensive filtering system with multiple parameters
  - Job type (Full-time, Part-time, Contract, Freelance)
  - Career level (18 standardized levels)
  - Remote work preference
  - Salary ranges
  - Visa sponsorship status
  - Languages (supports all 184 ISO 639-1 language codes)
- Enhanced user experience
  - Keyboard navigation for search (Escape to clear)
  - Loading states with smooth transitions
  - Smart pagination with dynamic range
  - No page jumps during filtering
  - Accessible UI with ARIA labels
- Comprehensive FAQ system
  - Client-side search with URL persistence
  - Anchor links for direct navigation to specific categories
  - Rich text support with markdown rendering
  - FAQ schema markup for improved SEO
  - Copy-to-clipboard feature for section links
  - Responsive design with consistent styling
- Configurable contact page
  - Support channels section with customizable cards
  - Detailed contact information section
  - Fully customizable via config file
  - Consistent styling with the rest of the application
- Social Links
  - GitHub
  - LinkedIn
  - Twitter (X)
  - Bluesky
  - Reddit
  - Each social link can be individually enabled/disabled and configured with custom URLs
- Post Job Banner
  - Configurable banner in job detail sidebar
  - Trust indicators with company avatars
  - Customizable CTA with pricing
  - Trust message support
  - Fully configurable via config file
  - Responsive design with consistent styling

### Enhanced Language System

Bordful features a comprehensive internationalization-ready language system that supports multilingual job listings:

- Full ISO 639-1 support with all 184 language codes
- User-friendly Airtable format: "Language Name (code)" (e.g., "English (en)")
- SEO-optimized language URLs using standard codes
- Automatic language-specific job pages

For complete documentation on the language system, see [Enhanced Language System](/docs/reference/language-system.md).

### Comprehensive FAQ System

Bordful includes a feature-rich FAQ page with advanced functionality:

- Client-side search with real-time filtering and URL persistence
- Rich text support with markdown rendering
- Anchor links for direct navigation to specific categories
- Schema.org FAQ markup for improved SEO and rich search results
- Copy-to-clipboard feature for sharing specific sections
- Fully configurable through the configuration file

For complete documentation on the FAQ system, see [Comprehensive FAQ System](/docs/reference/faq-system.md).

## Script Management & Analytics

Bordful uses Next.js's built-in Script component for optimal script loading and performance. Scripts can be configured in `config/config.ts`:

```typescript
scripts: {
  head: [
    // Scripts to load in the <head> section
    {
      src: "your-script-url",
      strategy: "afterInteractive", // or "beforeInteractive", "lazyOnload"
      attributes: {
        // Additional script attributes
        "data-custom": "value",
        defer: "", // Boolean attributes should use empty string
      },
    },
  ],
  body: [
    // Scripts to load at the end of <body>
  ],
}
```

### Script Loading Strategies

- **beforeInteractive**: Use for critical scripts that must load before page becomes interactive
- **afterInteractive**: Best for analytics and non-critical tracking (default)
- **lazyOnload**: For low-priority scripts that can load last

### Analytics Integration

The starter comes pre-configured for Umami Analytics:
1. Scripts are loaded using Next.js's optimized Script component
2. Analytics code runs after the page becomes interactive
3. Proper boolean attribute handling for script tags
4. Non-blocking script loading for optimal performance

To add your own analytics or third-party scripts:
1. Add your script configuration to `config/config.ts`
2. Scripts in `head` array load in `<head>`, scripts in `body` array load at end of `<body>`
3. Choose appropriate loading strategy based on script priority
4. Use empty string (`""`) for boolean attributes like `defer` or `async`

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/craftled/bordful
cd bordful
npm install
```

2. Set up Airtable:

**Option A** - Quick Setup with Template:

- Visit the demo base template: https://airtable.com/appLx3b8wF3cyfoMd/shrWo1VUVq7mJS6CB
- Click "Use this data" in the top right corner
- Make sure to note the name of your table (default is "Jobs") - you'll need this for the AIRTABLE_TABLE_NAME environment variable
- The base includes demo data and all required fields properly configured

**Option B** - Manual Setup:

- Create a new base in Airtable
- Create a table with your desired name (default is "Jobs") with these fields:
  ```
  title: Single line text
  company: Single line text
  type: Single select (Full-time, Part-time, Contract, Freelance)
  salary_min: Number
  salary_max: Number
  salary_currency: Single select (USD, EUR, GBP, USDT, USDC, BTC, ETH, etc.)
  salary_unit: Single select (hour, day, week, month, year, project)
  description: Long text (with rich text enabled)
  benefits: Long text (plain text, recommended format: "• Benefit 1\n• Benefit 2\n• Benefit 3", max 500 characters)
  application_requirements: Long text (plain text, comma-separated format, max 500 characters)
  apply_url: URL
  posted_date: Date
  valid_through: Date (application deadline date)
  job_identifier: Single line text (unique identifier/reference code for the job)
  job_source_name: Single line text (the name of the job source platform, e.g. "LinkedIn Jobs", "Workable", "Figma Careers")
  status: Single select (active, inactive)
  workplace_type: Single select (On-site, Hybrid, Remote, Not specified)
  remote_region: Single select (Worldwide, Americas Only, Europe Only, Asia-Pacific Only, US Only, EU Only, UK/EU Only, US/Canada Only)
  timezone_requirements: Single line text
  workplace_city: Single line text
  workplace_country: Single select (from ISO 3166 country list)
  career_level: Multiple select (Internship, Entry Level, Associate, Junior, Mid Level, Senior, Staff, Principal, Lead, Manager, Senior Manager, Director, Senior Director, VP, SVP, EVP, C-Level, Founder, Not Specified)
  visa_sponsorship: Single select (Yes, No, Not specified)
  featured: Checkbox
  languages: Multiple select (format: "Language Name (code)", e.g. "English (en)", "Spanish (es)", "French (fr)")
  # Schema.org enhanced fields (optional but recommended for better SEO)
  skills: Long text (skills required for the position)
  qualifications: Long text (specific qualifications needed)
  education_requirements: Long text (educational background needed)
  experience_requirements: Long text (experience needed for the position)
  responsibilities: Long text (key responsibilities of the role)
  industry: Single line text (industry associated with the job)
  occupational_category: Single line text (preferably using O*NET-SOC codes, e.g. "15-1252.00 Software Developers")
  ```

  **Note on Currency**: For `salary_currency`, it's recommended to use the format "CODE (Name)" such as "USD (United States Dollar)" or "BTC (Bitcoin)" for clarity. The system supports both traditional fiat currencies and cryptocurrencies.
  
  **Note on Schema.org Fields**: The additional schema.org fields are optional but highly recommended for improved SEO and Google Jobs integration. See [Schema.org Implementation](./docs/schema-implementation.md) for more details.

For both options:

- Create a Personal Access Token at https://airtable.com/create/tokens
- Add these scopes to your token:
  - data.records:read
  - schema.bases:read
- Add your base to the token's access list

3. Environment Setup:

   - Copy the `.env.example` file to `.env` (keep the example file for reference):

   ```bash
   cp .env.example .env  # or copy manually if you're on Windows
   ```

   - Fill in your Airtable credentials in the `.env` file:

   ```env
   AIRTABLE_ACCESS_TOKEN=your_token_here
   AIRTABLE_BASE_ID=your_base_id_here
   AIRTABLE_TABLE_NAME=your_table_name_here (defaults to "Jobs" if not specified)
   ```

   > Note: Keep the `.env.example` file intact. If you need to start fresh or share the project, you'll have a reference for the required environment variables.

4. Development:

```bash
npm run dev
```

Visit `http://localhost:3000` to see your job board.

## Configuration

### Quick Start

1. Copy the example configuration:
   ```bash
   cp config/config.example.ts config/config.ts
   ```
2. Customize `config.ts` with your settings
3. The app will now use your custom configuration

### How It Works

The configuration system is designed to be:
- Easy to set up (just copy and customize)
- Flexible (customize any aspect of your job board)
- Maintainable (pull updates without losing your customizations)

When the app starts:
1. It first tries to load your custom `config.ts`
2. If not found, falls back to `config.example.ts`
3. TypeScript ensures type safety in both cases

### Updating

When pulling updates from upstream:
1. Your `config.ts` stays as is with your customizations
2. You might get updates to `config.example.ts`
3. Check `config.example.ts` for new options
4. Add desired new options to your `config.ts`

### Configuration Options

The job board can be customized through the configuration file:

```typescript
export const config = {
  // Marketing & SEO
  badge: "The #1 Open Source Tech Job Board",
  title: "Find Your Next Tech Role",
  description: "Browse curated tech opportunities...",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Scripts Configuration (analytics, tracking, etc.)
  scripts: {
    head: [
      // Scripts to be loaded in <head>
      {
        src: "https://analytics.com/script.js",
        strategy: "afterInteractive",
        attributes: {
          "data-website-id": "xxx",
          defer: ""  // Boolean attributes should use empty string
        }
      }
    ],
    body: [
      // Scripts to be loaded at end of <body>
      {
        src: "https://widget.com/embed.js",
        strategy: "lazyOnload",
        attributes: {
          async: ""  // Boolean attributes should use empty string
        }
      }
    ]
  },

  // Navigation
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
    // Helper functions are also available:
    // import { createJobsMenu, createResourcesMenu } from "@/lib/menu-helpers";
  },
  
  // Pricing Configuration
  pricing: {
    // Enable or disable the pricing page
    enabled: true,
    
    // Show pricing link in navigation
    showInNavigation: true,
    
    // Show pricing link in footer resources
    showInFooter: true,
    
    // Navigation label
    navigationLabel: "Pricing",
    
    // Page title and description
    title: "Simple, Transparent Pricing",
    description: "Choose the plan that's right for your job board needs.",
    
    // Currency symbol
    currencySymbol: "$",
    
    // Payment processing information (displayed below pricing cards)
    paymentProcessingText: "Payments are processed & secured by Stripe. Price in USD. VAT may apply.",
    
    // Payment method icons to display
    paymentMethods: {
      enabled: true,
      icons: [
        { name: "visa", alt: "Visa" },
        { name: "mastercard", alt: "Mastercard" },
        { name: "amex", alt: "American Express" },
        { name: "applepay", alt: "Apple Pay" },
        { name: "googlepay", alt: "Google Pay" },
        { name: "paypal", alt: "PayPal" },
      ],
    },
    
    // Plans configuration
    plans: [
      {
        name: "Free",
        price: 0,
        billingTerm: "forever",
        description: "Perfect for getting started with basic hiring needs.",
        features: [
          "1 active job posting",
          "Basic job listing",
          "30-day visibility",
          "Standard support",
        ],
        cta: {
          label: "Get Started",
          link: "/post",
          variant: "outline", // Using button variants
        },
        badge: null, // No badge
        highlighted: false, // No highlighted border
      },
      {
        name: "Pro",
        price: 99,
        billingTerm: "job posting",
        description: "Great for occasional hiring needs with better visibility.",
        features: [
          "3 active job postings",
          "Standard job listings",
          "30-day visibility",
          "Email support",
        ],
        cta: {
          label: "Choose Pro",
          link: "https://stripe.com",
          variant: "outline",
        },
        badge: {
          text: "Popular",
          type: "featured", // Using badge types from JobBadge component
        },
        highlighted: true, // Highlighted with prominent border
      },
      {
        name: "Business",
        price: 999,
        billingTerm: "year",
        description: "Unlimited jobs postings for one year for serious recruiters.",
        features: [
          "5 active job postings",
          "Featured job listings",
          "30-day visibility",
          "Priority support",
        ],
        cta: {
          label: "Upgrade Now",
          link: "https://stripe.com",
          variant: "default",
        },
        badge: {
          text: "Best Value",
          type: "featured",
        },
        highlighted: false,
      },
    ],
  },

  // Contact Page Customization
  contact: {
    // Enable or disable the contact page
    enabled: true,

    // Show contact link in navigation
    showInNavigation: true,

    // Show contact link in footer
    showInFooter: true,

    // Navigation label
    navigationLabel: "Contact",

    // Page title and description
    title: "Get in Touch",
    description: "Have questions or feedback? We'd love to hear from you.",
    
    // Support channels section
    supportChannels: {
      title: "Support Channels",
      channels: [
        {
          type: "email",
          title: "Email Support",
          description: "Our support team is available to help you with any questions or issues you might have.",
          buttonText: "Contact via Email",
          buttonLink: "mailto:hello@bordful.com",
          icon: "Mail"
        },
        {
          type: "twitter",
          title: "Twitter/X Support",
          description: "Get quick responses and stay updated with our latest announcements on Twitter/X.",
          buttonText: "Follow on Twitter/X",
          buttonLink: "https://twitter.com/bordful",
          icon: "Twitter"
        },
        {
          type: "faq",
          title: "FAQ",
          description: "Browse our comprehensive FAQ section to find answers to the most common questions.",
          buttonText: "View FAQ",
          buttonLink: "/faq",
          icon: "HelpCircle"
        }
      ]
    },
    
    // Contact information section
    contactInfo: {
      title: "Contact Information",
      description: "Here's how you can reach us directly.",
      companyName: "Bordful Inc.",
      email: "hello@bordful.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, San Francisco, CA 94105"
    }
  },

  // Currency Configuration
  currency: {
    // Default currency code used when no currency is specified
    defaultCurrency: "USD" as CurrencyCode,

    // Allowed currencies for job listings
    // This list can include any valid CurrencyCode from lib/constants/currencies.ts
    // Set to null to allow all currencies, or specify a subset
    allowedCurrencies: ["USD", "EUR", "GBP", "BTC", "ETH", "USDT", "USDC"] as CurrencyCode[] | null, // null means all currencies are allowed
  },

  // UI Configuration
  ui: {
    // Hero section background color (CSS color value)
    // Can be hex, rgb, hsl, etc. Leave empty for default.
    heroBackgroundColor: "#005450", // Example: light gray background

    // Hero section gradient background
    // Takes precedence over heroBackgroundColor when enabled
    heroGradient: {
      enabled: false, // Set to true to enable gradient background
      type: "linear", // Type of gradient: "linear" or "radial"
      direction: "to right", // For linear gradients: "to right", "to bottom", "45deg", etc.
      // For radial gradients: "circle", "ellipse at center", etc.
      colors: [
        "#005450", // Start color
        "#007a73", // Optional middle color(s)
        "#00a59c", // End color
      ],
      // Optional stops for precise control (0-100%)
      // If not provided, colors will be evenly distributed
      stops: ["0%", "50%", "100%"],
    },

    // Hero section main title color (CSS color value)
    // Can be hex, rgb, hsl, etc. Leave empty for default.
    heroTitleColor: "#fff", // Example: "text-gray-900"

    // Hero section subtitle color (CSS color value)
    // Can be hex, rgb, hsl, etc. Leave empty for default.
    heroSubtitleColor: "#fff", // Example: "text-gray-600"

    // Hero section background image
    heroBackgroundImage: {
      enabled: false, // Make sure background image is disabled
    },
  },
};
```

### Environment-Aware URLs

The site URL automatically adjusts based on the environment:

1. Uses `NEXT_PUBLIC_APP_URL` if provided
2. Falls back to `localhost:3000` in development
3. Uses production URL in production

### Navigation Customization

The navigation bar is fully customizable to match your branding and navigation needs. Key features include:

- Brand display with icon+text or custom logo
- Dropdown menu support with hover effects
- Social media integration (GitHub, LinkedIn, Twitter/X, Bluesky, Reddit)
- Mobile-responsive design with hamburger menu
- Accessible navigation with ARIA attributes

For detailed documentation on navigation bar customization, see [Navigation Bar Customization](./docs/navbar-customization.md).

### Pricing Page Customization

The pricing page is fully configurable through the `pricing` section in the configuration file:

#### Basic Configuration

- **Enable/Disable**: Turn the entire pricing page on or off with `pricing.enabled`
- **Navigation**: Control whether the pricing link appears in navigation with `pricing.showInNavigation`
- **Footer**: Control whether the pricing link appears in footer with `pricing.showInFooter`
- **Navigation Label**: Customize the label in the navigation with `pricing.navigationLabel`
- **Page Title**: Set the page title with `pricing.title`
- **Page Description**: Set the page description with `pricing.description`
- **Currency Symbol**: Set the currency symbol with `pricing.currencySymbol`

#### Payment Information

- **Payment Processing Text**: Add a customizable message about payment processing with `pricing.paymentProcessingText`
- **Payment Method Icons**: Enable/disable and customize payment method icons with `pricing.paymentMethods.enabled` and `pricing.paymentMethods.icons`

#### Pricing Plans

Each plan in the `pricing.plans` array can be customized with:

1. **Basic Information**:
   - `name`: The name of the plan (e.g., "Free", "Pro", "Business")
   - `price`: The price of the plan (0 for free plans)
   - `billingTerm`: A string describing the billing term (e.g., "forever", "job posting", "year", "month")
   - `description`: A description of the plan

2. **Features**:
   - `features`: An array of strings describing the features included in the plan

3. **Call to Action**:
   - `cta.label`: The text for the CTA button
   - `cta.link`: The URL the button links to
   - `cta.variant`: The visual style of the button ("outline" or "default")

4. **Visual Styling**:
   - `badge`: Can be `null` (no badge) or an object with:
     - `text`: Custom text for the badge (e.g., "Popular", "Best Value")
     - `type`: The visual style of the badge (using predefined types from the JobBadge component)
   - `highlighted`: Boolean that controls whether the plan gets a prominent border and shadow

#### Example Customizations

```typescript
// Free plan with no badge or highlighting
{
  name: "Free",
  price: 0,
  billingTerm: "forever",
  // ... other properties
  badge: null,
  highlighted: false,
}

// Popular plan with badge and highlighting
{
  name: "Pro",
  price: 99,
  billingTerm: "job posting",
  // ... other properties
  badge: {
    text: "Popular",
    type: "featured",
  },
  highlighted: true,
}

// Best value plan with badge but no highlighting
{
  name: "Business",
  price: 999,
  billingTerm: "year",
  // ... other properties
  badge: {
    text: "Best Value",
    type: "featured",
  },
  highlighted: false,
}
```

#### Available Badge Types

The `badge.type` property accepts any of the following values from the JobBadge component:

- `"featured"`: Dark background with light text (good for "Popular" or "Best Value")
- `"new"`: Green background (good for "New" or "Limited Time")
- `"default"`: Simple border with dark text (subtle option)
- Other types: `"remote"`, `"onsite"`, `"hybrid"`, etc. (see JobBadge component for all options)

### Contact Page Customization

The contact page is fully configurable through the `contact` section in the configuration file:

#### Basic Configuration

- **Enable/Disable**: Turn the entire contact page on or off with `contact.enabled`
- **Navigation**: Control whether the contact link appears in navigation with `contact.showInNavigation`
- **Footer**: Control whether the contact link appears in footer with `contact.showInFooter`
- **Navigation Label**: Customize the label in the navigation with `contact.navigationLabel`
- **Page Title**: Set the page title with `contact.title`
- **Page Description**: Set the page description with `contact.description`

#### Support Channels

The `contact.supportChannels` section allows you to configure multiple support channels:

- **Section Title**: Set the title for the support channels section with `contact.supportChannels.title`
- **Channels**: Configure an array of support channels with `contact.supportChannels.channels`, each with:
  - `type`: The type of channel (e.g., "email", "twitter", "faq")
  - `title`: The title of the channel card
  - `description`: A description of the support channel
  - `buttonText`: The text for the channel's button
  - `buttonLink`: The URL the button links to (can be external links or internal pages)
  - `icon`: The Lucide icon name to display (e.g., "Mail", "Twitter", "HelpCircle")

#### Contact Information

The `contact.contactInfo` section allows you to display your company's contact details:

- **Section Title**: Set the title for the contact information section with `contact.contactInfo.title`
- **Section Description**: Set the description with `contact.contactInfo.description`
- **Company Name**: Set your company name with `contact.contactInfo.companyName`
- **Email**: Set your contact email with `contact.contactInfo.email`
- **Phone**: Set your contact phone number with `contact.contactInfo.phone`
- **Address**: Set your physical address with `contact.contactInfo.address`

#### Example Configuration

```typescript
// Contact Page Configuration
contact: {
  // Enable or disable the contact page
  enabled: true,

  // Show contact link in navigation
  showInNavigation: true,

  // Show contact link in footer
  showInFooter: true,

  // Navigation label
  navigationLabel: "Contact",

  // Page title and description
  title: "Get in Touch",
  description: "Have questions or feedback? We'd love to hear from you.",
  
  // Support channels section
  supportChannels: {
    title: "Support Channels",
    channels: [
      {
        type: "email",
        title: "Email Support",
        description: "Our support team is available to help you with any questions or issues you might have.",
        buttonText: "Contact via Email",
        buttonLink: "mailto:hello@bordful.com",
        icon: "Mail"
      },
      {
        type: "twitter",
        title: "Twitter/X Support",
        description: "Get quick responses and stay updated with our latest announcements on Twitter/X.",
        buttonText: "Follow on Twitter/X",
        buttonLink: "https://twitter.com/bordful",
        icon: "Twitter"
      },
      {
        type: "faq",
        title: "FAQ",
        description: "Browse our comprehensive FAQ section to find answers to the most common questions.",
        buttonText: "View FAQ",
        buttonLink: "/faq",
        icon: "HelpCircle"
      }
    ]
  },
  
  // Contact information section
  contactInfo: {
    title: "Contact Information",
    description: "Here's how you can reach us directly.",
    companyName: "Bordful Inc.",
    email: "hello@bordful.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, San Francisco, CA 94105"
  }
}
```

#### Supported Icons

The contact page supports all [Lucide icons](https://lucide.dev/icons), with the following pre-configured for convenience:
- `Mail` - For email support
- `Twitter` - For Twitter/X support
- `HelpCircle` - For FAQ or help center
- `Phone` - For phone support
- `MessageSquare` - For chat support
- `Github` - For GitHub support
- `Linkedin` - For LinkedIn support
- `Rss` - For RSS feeds

## Environment Variables

⚠️ IMPORTANT: Never commit your API keys or sensitive credentials to the repository!

Required environment variables:

- AIRTABLE_ACCESS_TOKEN=your_token_here
- AIRTABLE_BASE_ID=your_base_id_here
- AIRTABLE_TABLE_NAME=your_table_name_here (defaults to "Jobs" if not specified)

Create a `.env` file in your project root and add these variables there.

## Data Revalidation

The job board uses Next.js Incremental Static Regeneration (ISR) and server-side caching to keep data fresh:

- Pages automatically revalidate every 5 minutes
- Server-side caching with unstable_cache
- Content-specific loading states
- New jobs appear without manual rebuilds
- Maintains fast static page delivery
- Zero downtime updates

### Customizing Revalidation Periods

You can adjust the revalidation interval by modifying the `revalidate` constant in page files:

```typescript
// Set revalidation period in seconds (e.g., 300 = 5 minutes)
export const revalidate = 300;
```

Considerations when adjusting revalidation periods:
- **Shorter periods** (e.g., 60 seconds): More frequent updates but more API calls to Airtable
- **Longer periods** (e.g., 3600 seconds): Fewer API calls but less frequent content updates
- **Static content** (e.g., about, terms pages): Consider using `export const dynamic = "force-static"` instead

All page files consistently use a 5-minute (300 seconds) revalidation period by default. Files with revalidation settings:

- `app/page.tsx` (home page)
- `app/jobs/[slug]/page.tsx` (individual job pages)
- `app/jobs/page.tsx` (main jobs listing page)
- `app/jobs/levels/page.tsx` (career levels directory)
- `app/jobs/languages/page.tsx` (languages directory)
- `app/jobs/location/[location]/page.tsx` (location-specific jobs)
- `app/jobs/level/[level]/page.tsx` (career level-specific jobs)
- `app/jobs/language/[language]/page.tsx` (language-specific jobs)
- `app/jobs/locations/page.tsx` (locations directory)
- `app/jobs/types/page.tsx` (job types directory)
- `app/jobs/type/[type]/page.tsx` (job type-specific jobs)

For static content that rarely changes, the app uses `export const dynamic = "force-static"` in these files:
- `app/about/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `app/changelog/page.tsx`

## Project Structure

```
app/
  layout.tsx          # Root layout with Geist font
  page.tsx           # Home page with job listings
  jobs/
    [id]/
      page.tsx       # Individual job page
      loading.tsx    # Loading state for job page
lib/
  db/
    airtable.ts     # Airtable integration and salary formatting
  utils/
    formatDate.ts   # Date formatting utilities
components/
  ui/
    job-details-sidebar.tsx  # Job details sidebar
    post-job-banner.tsx     # Post job promotion banner
    similar-jobs.tsx        # Similar jobs suggestions
  jobs/
    JobCard.tsx     # Job listing card
```

## Salary Structure

The job board supports a comprehensive salary structure:

- Minimum and maximum salary ranges
- Support for 50+ global currencies with proper symbols and formatting
- Support for cryptocurrencies and stablecoins:
  - Major cryptocurrencies (BTC, ETH, XRP, etc.) with proper symbols (₿, Ξ)
  - USD-pegged stablecoins (USDT, USDC, USDS, PYUSD, TUSD)
  - Properly normalized exchange rates for sorting and filtering
- Smart currency display with intelligent spacing:
  - No spaces for common symbols ($, £, €, ¥, ₩, etc.)
  - Appropriate spacing for multi-character symbols (CHF, Rp, etc.)
  - Proper spacing for non-Latin script symbols (Arabic, etc.)
- Consistent scale formatting in salary ranges (both values shown in k or M)
- Compact number formatting with appropriate scale:
  - Values over 10,000 use "k" format (e.g., "$50k")
  - Values over 1,000,000 use "M" format (e.g., "₩50M")
- Various time units (hour, day, week, month, year, project)
- Optional display of currency codes (e.g., "$50k/year (USD)" or "₿0.5/year (BTC)")
- Salary-based sorting with normalization to annual USD

## Pagination and Sorting

- URL-based pagination for better UX and SEO
- Configurable items per page (10, 25, 50, 100)
- Sort by newest, oldest, or highest salary
- Maintains state in URL parameters
- Elegant pagination UI with ellipsis for large page counts

## URL Parameters

The job board supports comprehensive URL parameters for sharing and bookmarking:

- `page` - Current page number
- `per_page` - Items per page (10, 25, 50, 100)
- `sort` - Sort order (newest, oldest, salary)
- `types` - Comma-separated job types (Full-time, Part-time, Contract, Freelance)
- `roles` - Comma-separated career levels
- `remote` - Remote work filter (true)
- `salary` - Comma-separated salary ranges
- `visa` - Visa sponsorship filter (true)
- `languages` - Comma-separated language requirements

Example URLs:

```
/?types=Full-time,Contract&roles=Senior,Lead&remote=true
/?salary=50K-100K,100K-200K&visa=true&page=2
/?sort=salary&per_page=25
```

## Sitemap Generation

The job board automatically generates a comprehensive XML sitemap at `/sitemap.xml` that includes:

### Structure
- Homepage and static pages
- Individual job listings with descriptive URLs
- Job category pages (types, levels, locations)
- All with proper priorities and change frequencies

### Features
- **SEO-Friendly URLs**: Uses descriptive slugs (e.g., `senior-developer-at-company`)
- **Dynamic Updates**: Automatically includes new jobs through ISR
- **Priority Levels**:
  - Homepage: 1.0
  - Featured Jobs: 0.9
  - Regular Jobs: 0.7
  - Category Pages: 0.6
- **Change Frequencies**:
  - Job Listings: Daily
  - Static Pages: Weekly/Monthly
  - Category Pages: Daily

### Implementation
The sitemap is generated using Next.js's built-in Metadata API in `app/sitemap.ts`:

```typescript
// Example sitemap entry
{
  url: 'https://yourdomain.com/jobs/senior-developer-at-company',
  lastModified: new Date(),
  changeFrequency: 'daily',
  priority: 0.7
}
```

### Configuration
1. Set your production URL in `.env`:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

2. The sitemap will be available at:
```
https://yourdomain.com/sitemap.xml
```

3. Submit your sitemap to search engines:
- Google Search Console
- Bing Webmaster Tools
- Other search engines as needed

### Automatic Updates
- Sitemap updates automatically with new jobs
- Uses Incremental Static Regeneration (ISR)
- No manual rebuilds required
- 5-minute revalidation period

## RSS Feed System

The job board includes a comprehensive RSS feed system that allows users to subscribe to job listings:

### Available Feed Formats
- **RSS 2.0**: Available at `/feed.xml` (most widely supported format)
- **Atom**: Available at `/atom.xml` (more standardized format)
- **JSON Feed**: Available at `/feed.json` (modern JSON-based format)

### Feed Content
Each feed includes:
- Job titles with company names
- Job descriptions (configurable preview length)
- Job metadata (type, location, salary, posting date)
- Direct links to apply
- Author information (company with apply link)
- Categories based on job type, career level, and languages
- Featured job indicators

### Discovery and Access
- Auto-discovery links in HTML head for feed readers
- RSS icon in the navigation for quick access
- Feed links in the footer with format options
- Each feed uses the proper MIME type for optimal compatibility:
  - `application/rss+xml` for RSS
  - `application/atom+xml` for Atom
  - `application/feed+json` for JSON Feed

### Implementation
The feeds are implemented using Next.js route handlers with 5-minute revalidation and configuration-based settings:

```typescript
// app/feed.xml/route.ts (and similar for other formats)
export const revalidate = 300; // 5 minutes

export async function GET() {
  // Check if RSS feeds are enabled in the configuration
  if (!config.rssFeed?.enabled || !config.rssFeed?.formats?.rss) {
    return new Response("RSS feed not enabled", { status: 404 });
  }

  // Feed setup with configuration options
  const feed = new Feed({
    title: config.rssFeed?.title || `${config.title} | Job Feed`,
    // ... other feed settings
  });
  
  // Use the configured description length
  const descriptionLength = config.rssFeed?.descriptionLength || 500;
  
  // Add job items with the configured description length
  jobs.forEach(job => {
    // ... job processing
    const jobDescription = `
      // ... job description formatting
      ${job.description.substring(0, descriptionLength)}...
    `;
    
    // Add to feed
    // ...
  });
  
  // Return with proper content type
  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
```

### Configuration

The RSS feed system is fully configurable through the configuration file:

```typescript
rssFeed: {
  // Enable or disable RSS feeds
  enabled: true,

  // Show RSS feed links in navigation
  showInNavigation: true,
  
  // Show RSS feed links in footer
  showInFooter: true,

  // Navigation label (if showing in navigation)
  navigationLabel: "RSS Feed",
  
  // Footer label (if showing in footer)
  footerLabel: "Job Feeds",
  
  // Title for the RSS feed
  title: "Latest Jobs Feed",
  
  // Number of job description characters to include (preview length)
  descriptionLength: 500,

  // Available formats (enable/disable specific formats)
  formats: {
    rss: true,    // RSS 2.0 format
    atom: true,   // Atom format
    json: true,   // JSON Feed format
  },
},
```

### Configuration Features

- **Full Enable/Disable Control**: Turn on or off the entire feed system
- **Per-Format Control**: Enable or disable specific formats (RSS, Atom, JSON)
- **Custom Feed Title**: Set a custom title for all feed formats
- **Configurable Description Length**: Control how much of the job description is included
- **UI Integration Control**: Show/hide RSS icons in navigation and footer
- **Custom Labels**: Change the text displayed for RSS links
- **Graceful Degradation**: 404 responses for disabled feed formats

### Use Cases
- Subscribe to job listings in your preferred feed reader
- Integrate job listings with other applications
- Get notified of new jobs automatically
- Share feed URLs with interested candidates
- Disable unused formats to reduce server load

## Robots.txt Generation

The job board automatically generates a comprehensive robots.txt file at `/robots.txt` that helps search engines understand which parts of your site to crawl.

### Features
- **Dynamic Generation**: Programmatically created using Next.js's Metadata API
- **Customizable Rules**: Configure which user agents can access which parts of your site
- **Protected Routes**: Automatically blocks crawlers from accessing admin and private routes
- **Sitemap Integration**: Automatically links to your sitemap.xml for better indexing
- **Canonical Host**: Defines the canonical hostname to prevent duplicate content issues

### Implementation
The robots.txt file is generated using Next.js's built-in Metadata API in `app/robots.ts`:

```typescript
// Example robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/', '/api/*'],
    },
    sitemap: 'https://yourdomain.com/sitemap.xml',
    host: 'https://yourdomain.com',
  }
}
```

### Configuration
The robots.txt file automatically uses your site URL from the config file, ensuring consistency across your entire site.

### Benefits
- **SEO Improvement**: Helps search engines crawl your site more efficiently
- **Content Control**: Prevents indexing of private or admin sections
- **No Maintenance**: Automatically updated when you deploy changes
- **Type Safety**: Leverages TypeScript for error prevention

## Email Provider Integration

The job board includes a flexible email provider system for handling job alert subscriptions. This allows users to subscribe to receive notifications when new jobs are posted.

Sending emails is handled by the email provider.

Current integration is Encharge and only allows subscribing to job alerts.

### Features

- **Server-side API Route**: Secure handling of subscription data
- **Multiple Configuration Options**: Environment variables or config file
- **Enhanced Data Collection**: IP address, referrer, user agent, and more
- **Flexible Provider System**: Currently supports Encharge with more providers planned
- **Rich Segmentation Data**: Enables targeted email campaigns

### Setting Up Encharge Integration

#### Quick Setup

1. Set the following variables in the `.env` file:
   ```
   EMAIL_PROVIDER=encharge
   ENCHARGE_WRITE_KEY=your_encharge_write_key_here
   ```

2. Restart your development server

#### Advanced Configuration

For more control, create a custom configuration file:

1. Copy `config/config.example.ts` to `config/config.ts`
2. Customize the email provider settings:
   ```typescript
   email: {
     provider: "encharge",
     encharge: {
       writeKey: process.env.ENCHARGE_WRITE_KEY || "your_key_here",
       defaultTags: "job-alerts-subscriber, custom-tag",
       eventName: "Job Alert Subscription",
     }
   },
   ```

### Data Collected

The integration automatically collects and sends the following data:

- Email address and name (if provided)
- IP address (for geolocation)
- Referrer URL and origin
- User agent (browser/device information)
- Timestamp and formatted date
- Custom tags for segmentation

### Security

- API keys are never exposed to the client
- All API calls are made server-side
- User data is validated before being sent to Encharge
- IP addresses are collected securely from request headers

For detailed documentation, see [Email Provider Configuration](docs/email-providers.md) and [Encharge Integration](docs/encharge-integration.md).

## Customization

### Styling

The project uses Tailwind CSS for styling. Main configuration files:

- `tailwind.config.ts`: Theme configuration
- `app/globals.css`: Global styles
- `components/*`: Individual component styles

### Script Management

The job board provides a flexible system for adding analytics, tracking, or any third-party scripts using Next.js's built-in Script component. Scripts can be easily configured in `config/config.ts`:

```typescript
scripts: {
  head: [
    // Scripts to be loaded in <head>
    {
      src: "https://analytics.com/script.js",
      strategy: "afterInteractive",
      attributes: {
        "data-website-id": "xxx",
        defer: ""  // Boolean attributes should use empty string
      }
    }
  ],
  body: [
    // Scripts to be loaded at end of <body>
    {
      src: "https://widget.com/embed.js",
      strategy: "lazyOnload",
      attributes: {
        async: ""  // Boolean attributes should use empty string
      }
    }
  ]
}
```

#### Loading Strategies

Next.js provides three loading strategies for scripts:

- `beforeInteractive`: Loads and executes before the page becomes interactive
  - Use for critical scripts that must load first
  - Example: Polyfills, core functionality that's needed immediately
  - Note: This blocks page interactivity, so use sparingly

- `afterInteractive` (recommended for analytics): Loads after the page becomes interactive
  - Best for analytics and tracking scripts
  - Example: Google Analytics, Umami, Plausible
  - Doesn't block page loading but still loads early enough to track user behavior

- `lazyOnload`: Loads during idle time
  - Use for non-critical scripts
  - Example: Chat widgets, social media embeds
  - Loads last to prioritize page performance

#### Example: Adding Analytics

To add Umami Analytics:

```typescript
scripts: {
  head: [
    {
      src: "https://analytics.example.com/script.js",
      strategy: "afterInteractive",  // Best for analytics
      attributes: {
        "data-website-id": "your-website-id",
        defer: ""  // Boolean attributes should use empty string
      }
    }
  ]
}
```

#### Script Attributes

You can add any HTML script attributes using the `attributes` object:

```typescript
attributes: {
  defer: "",     // Boolean attributes use empty string
  async: "",     // Boolean attributes use empty string
  "data-id": "xxx",  // Regular attributes use values
  id: "my-script",
  crossorigin: "anonymous"
  // ... any valid script attribute
}
```

This implementation:
- Uses Next.js best practices for script loading
- Provides type safety with TypeScript
- Allows easy configuration in one place
- Supports any third-party script
- Optimizes performance with proper loading strategies

### Data Source

Current implementation uses Airtable. To use a different data source:

1. Modify `lib/db/airtable.ts`
2. Implement the same interface for job data

## Deployment

### Local Build Verification

Before deploying to production, it's recommended to verify your build locally:

```bash
# Build the project
npm run build

# Test the production build
npm start
```

This ensures that your changes work correctly in a production environment before deploying to Vercel.

### Deploying to Vercel

1. Push to GitHub
2. Deploy on Vercel:
   - Connect your GitHub repository
   - Add environment variables
   - Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own job board!

## Support

If you find this helpful, please ⭐️ this repository!

## Credits

Built by [Craftled](https://craftled.com)

### Hero Section Customization

The hero section is fully configurable through the `ui` section in the configuration file. You can customize the background, text colors, and badge styling:

#### Background Options

The hero section supports three background styles:

1. **Solid Background Color**:
   ```typescript
   ui: {
     heroBackgroundColor: "#005450", // Any valid CSS color value
     heroGradient: {
       enabled: false, // Make sure gradient is disabled
     },
     heroBackgroundImage: {
       enabled: false, // Make sure background image is disabled
     },
   }
   ```

2. **Gradient Background**:
   ```typescript
   ui: {
     heroGradient: {
       enabled: true, // Enable gradient background
       type: "linear", // "linear" or "radial"
       direction: "to right", // Direction for linear gradients
       colors: ["#3b82f6", "#8b5cf6", "#d946ef"], // Array of colors (2+ colors)
       stops: ["0%", "50%", "100%"], // Optional percentage stops
     },
     heroBackgroundImage: {
       enabled: false, // Make sure background image is disabled
     },
   }
   ```

3. **Background Image**:
   ```typescript
   ui: {
     heroBackgroundImage: {
       enabled: true, // Enable background image
       src: "/images/hero-background.jpg",
       position: "center",
       size: "cover",
       overlay: {
         enabled: true, // Enable overlay for better text readability
         color: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
       },
     },
   }
   ```

The system follows a precedence order: background image > gradient > solid color. If the highest-priority option is disabled or fails, it falls back to the next option.

#### Linear Gradient Examples

```typescript
// Horizontal gradient (left to right)
heroGradient: {
  enabled: true,
  type: "linear",
  direction: "to right",
  colors: ["#3b82f6", "#d946ef"],
}

// Diagonal gradient
heroGradient: {
  enabled: true,
  type: "linear",
  direction: "45deg", // You can use any degree value
  colors: ["#3b82f6", "#8b5cf6", "#d946ef"],
}

// Vertical gradient with explicit stops
heroGradient: {
  enabled: true,
  type: "linear",
  direction: "to bottom",
  colors: ["#3b82f6", "#8b5cf6", "#d946ef"],
  stops: ["0%", "60%", "100%"], // Control color distribution
}
```

#### Radial Gradient Examples

```typescript
// Simple radial gradient
heroGradient: {
  enabled: true,
  type: "radial",
  direction: "circle", // Creates a circular gradient
  colors: ["#3b82f6", "#d946ef"],
}

// Elliptical gradient with center position
heroGradient: {
  enabled: true,
  type: "radial",
  direction: "ellipse at center", // Creates an elliptical gradient
  colors: ["#3b82f6", "#8b5cf6", "#d946ef"],
}
```

#### Background Image Examples

```typescript
// Simple background image
heroBackgroundImage: {
  enabled: true,
  src: "/images/hero-background.jpg",
  position: "center",
  size: "cover",
}

// Background image with overlay
heroBackgroundImage: {
  enabled: true,
  src: "/images/team.jpg",
  position: "center",
  size: "cover",
  overlay: {
    enabled: true,
    color: "rgba(0, 0, 0, 0.5)", // Dark overlay for better text readability
  },
}
```

#### Text and Badge Styling

In addition to background customization, you can also customize text colors and badge styling:

```typescript
ui: {
  // Text colors
  heroTitleColor: "#ffffff",
  heroSubtitleColor: "#f3f4f6",
  
  // Badge styling
  heroBadgeVariant: "outline", // "default", "secondary", "outline", "destructive"
  heroBadgeBgColor: "#ffffff",
  heroBadgeTextColor: "#005450",
  heroBadgeBorderColor: "#ffffff",
}
```