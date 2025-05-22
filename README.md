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

Bordful uses Next.js's built-in Script component for optimal script loading and performance:

- Optimized script loading with multiple loading strategies
- Pre-configured analytics integration
- Support for all script attributes and properties
- Separate head and body script configuration
- Non-blocking script loading for optimal performance

Three loading strategies are available:
- **beforeInteractive**: For critical scripts that must load before page interaction
- **afterInteractive**: For analytics and non-critical tracking (default)
- **lazyOnload**: For low-priority scripts that load during browser idle time

For complete documentation on script management and analytics integration, see [Script Management & Analytics](/docs/advanced/script-management.md).

## Getting Started

### Quick Installation

Get your Bordful job board up and running in just a few steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/craftled/bordful
   cd bordful
   npm install
   ```

2. **Set up Airtable**: Either use our pre-configured template or set up your own Airtable base

3. **Configure environment variables**: Set up your API keys and database connections

4. **Start the development server**:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see your job board.

For detailed installation instructions, see our [Installation Guide](/docs/getting-started/installation.md).

## Configuration

Bordful uses a flexible configuration system that allows you to customize virtually every aspect of your job board without modifying the core code.

### Quick Configuration

1. Copy the example configuration:
   ```bash
   cp config/config.example.ts config/config.ts
   ```
2. Customize the settings to match your needs
3. The app will automatically use your custom configuration

The configuration system is:
- **Easy to use**: Simple file copying to get started
- **Flexible**: Customize everything from site title to component behavior
- **Maintainable**: Pull updates without losing your customizations

For comprehensive configuration documentation, see our [Configuration Guide](/docs/getting-started/configuration.md).

### Navigation & Footer Customization

Bordful provides a fully customizable navigation system and footer with features like dropdown menus, social media integration, and mobile responsiveness.

- For navigation customization, see [Navigation Customization](/docs/guides/navigation.md)
- For footer customization, see [Footer Customization](/docs/guides/footer.md)
- For an overview of both, see [Navigation & Footer Customization](/docs/guides/navigation-footer.md)

### Pricing Page Customization

Bordful includes a fully customizable pricing page that allows you to showcase your job board's plans and payment options with a professional layout. Features include:

- Complete control over pricing plans and features
- Customizable plan highlighting and badges
- Payment method icons and processing information
- Flexible configuration for enabling/disabling the pricing page

For detailed documentation on pricing page customization, see [Pricing Page Customization](/docs/guides/pricing.md).



### Contact Page Customization

Bordful includes a fully customizable contact page that allows you to provide multiple support channels and contact information to your users. Features include:

- Configurable support channels with customizable cards
- Detailed contact information section
- Schema.org structured data for better SEO
- Support for all Lucide icons
- Mobile-responsive design

For detailed documentation on contact page customization, see [Contact Page Customization](/docs/guides/contact.md).

## Environment Variables

⚠️ IMPORTANT: Never commit your API keys or sensitive credentials to the repository!

Required environment variables:

- AIRTABLE_ACCESS_TOKEN=your_token_here
- AIRTABLE_BASE_ID=your_base_id_here
- AIRTABLE_TABLE_NAME=your_table_name_here (defaults to "Jobs" if not specified)

Create a `.env` file in your project root and add these variables there.

## Data Revalidation

Bordful uses Next.js Incremental Static Regeneration (ISR) and server-side caching to keep data fresh while maintaining fast page loads.

- Pages automatically revalidate every 5 minutes
- New jobs appear without manual rebuilds
- Zero downtime updates
- Maintains fast static page delivery

For complete documentation on data revalidation, see [Data Revalidation](/docs/advanced/data-revalidation.md).

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

Bordful includes a sophisticated salary handling system with multiple currencies and formats:

- Support for 50+ global currencies and cryptocurrencies with proper symbols (₿, Ξ)
- Smart currency display with intelligent spacing based on currency type
- Consistent and readable salary ranges with compact formatting (e.g., "$50k - $75k")
- Multiple time units (hour, day, week, month, year, project)
- Optional currency code display for international clarity
- Intelligent salary sorting with normalization across currencies and time periods
- Customizable display options and formatting preferences

For detailed documentation on the salary structure, see [Salary Structure](/docs/reference/salary-structure.md).

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

Bordful automatically generates a comprehensive XML sitemap at `/sitemap.xml` that enhances your job board's visibility to search engines:

- SEO-friendly URLs with descriptive slugs for all job listings
- Dynamic updates through Incremental Static Regeneration (ISR)
- Intelligent priority levels (1.0 for homepage, 0.9 for featured jobs, etc.)
- Appropriate change frequencies for different content types
- Automatic inclusion of all job listings and category pages
- Zero-maintenance implementation with 5-minute revalidation

For detailed documentation on sitemap generation, see [Sitemap Generation](/docs/reference/sitemap-generation.md).

## RSS Feed System

Bordful includes a comprehensive RSS feed system that allows users to subscribe to job listings in multiple formats:

- Support for RSS 2.0, Atom, and JSON Feed formats
- Rich job content with customizable preview length
- Auto-discovery links for feed readers
- Navigation and footer integration
- Full configuration control via config file

For detailed documentation on the RSS Feed System, see [RSS Feed System](/docs/reference/rss-feed-system.md).

## Robots.txt Generation

Bordful automatically generates a comprehensive robots.txt file at `/robots.txt` that helps search engines understand which parts of your site to crawl:

- Dynamic generation using Next.js's Metadata API
- Customizable crawling rules for different user agents
- Protected routes to prevent crawling of admin and private areas
- Automatic sitemap integration for better indexing
- Canonical host definition to prevent duplicate content issues

For detailed documentation on robots.txt generation, see [Robots.txt Generation](/docs/reference/robots-generation.md).

## Email Provider Integration

Bordful includes a flexible email provider system for handling job alert subscriptions. This allows users to subscribe to receive notifications when new jobs are posted.

- Server-side API route for secure handling of subscription data
- Multiple configuration options (environment variables or config file)
- Enhanced data collection for better targeting
- Support for Encharge with more providers planned
- Rich segmentation data for targeted email campaigns

For comprehensive documentation on email provider integration, see [Email Provider Integration](/docs/guides/email-integration.md).

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

Bordful can be deployed to various platforms, with Vercel being the recommended option due to its excellent support for Next.js applications.

For comprehensive deployment instructions, including local build verification and platform-specific guides for Vercel, Netlify, and Docker, see our [Deployment Guide](/docs/getting-started/deployment.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own job board!

## Support

If you find this helpful, please ⭐️ this repository!

## Credits

Built by [Craftled](https://craftled.com)

### Hero Section Customization

Bordful's hero section is fully configurable, supporting three background styles:

- Solid background colors
- Gradient backgrounds (linear or radial)
- Background images with optional overlays

You can also customize text colors and badge styling to match your brand identity.

For comprehensive documentation on hero section customization, see [Hero Section Customization](/docs/guides/hero-section.md).
```