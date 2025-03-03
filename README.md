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
  - Automatic XML sitemap generation with ISR updates
  - SEO-friendly URLs with descriptive job slugs
  - Prioritized URLs (1.0 for homepage, 0.9 for featured jobs)
  - Dynamic sitemap updates every 5 minutes
  - Complete coverage of all job listings and category pages
- Modern UI with Geist font, Tailwind CSS, and Shadcn UI
- Incremental Static Regeneration (ISR) for real-time updates
- Rich text support for job descriptions
- Comprehensive job metadata with multi-select career levels
- Advanced salary structure with currency and time unit support
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
  - Languages
- Enhanced user experience
  - Keyboard navigation for search (Escape to clear)
  - Loading states with smooth transitions
  - Smart pagination with dynamic range
  - No page jumps during filtering
  - Accessible UI with ARIA labels
- Social Links
  - GitHub
  - LinkedIn
  - Twitter (X)
  - Bluesky
  - Reddit
  - Each social link can be individually enabled/disabled and configured with custom URLs

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
  salary_currency: Single select (USD, EUR, GBP)
  salary_unit: Single select (hour, day, week, month, year, project)
  description: Long text (with rich text enabled)
  apply_url: URL
  posted_date: Date
  status: Single select (active, inactive)
  workplace_type: Single select (On-site, Hybrid, Remote, Not specified)
  remote_region: Single select (Worldwide, Americas Only, Europe Only, Asia-Pacific Only, US Only, EU Only, UK/EU Only, US/Canada Only)
  timezone_requirements: Single line text
  workplace_city: Single line text
  workplace_country: Single select (from ISO 3166 country list)
  career_level: Multiple select (Internship, Entry Level, Associate, Junior, Mid Level, Senior, Staff, Principal, Lead, Manager, Senior Manager, Director, Senior Director, VP, SVP, EVP, C-Level, Founder, Not Specified)
  visa_sponsorship: Single select (Yes, No, Not specified)
  featured: Checkbox
  languages: Multiple select (English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Russian, Arabic, Hindi, Italian, Dutch, Polish, Turkish, Vietnamese, Thai, Indonesian)
  ```

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
    icon: "Briefcase", // Lucide icon name
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
  },
};
```

### Environment-Aware URLs

The site URL automatically adjusts based on the environment:

1. Uses `NEXT_PUBLIC_APP_URL` if provided
2. Falls back to `localhost:3000` in development
3. Uses production URL in production

### Navigation Customization

- **Icon & Logo**: Choose between:
  - Default mode: Uses [Lucide icons](https://lucide.dev/icons) with text
  - Custom logo: Enable custom logo mode and specify your logo image
- **Title**: Customize the text shown in the navigation bar (when not using custom logo)
- **Social Media**: Toggle visibility and set URLs for:
  - GitHub repository
  - LinkedIn company page
  - Twitter/X profile
  - Bluesky profile
- **Post Job Button**: Customize the job posting button:
  - Toggle visibility
  - Change button text
  - Set custom URL
- **Top Menu**: Define navigation menu items with labels and links
  - Each item has a label and link
  - Order items as needed
  - Add or remove menu items easily

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
- Multiple currencies (USD, EUR, GBP)
- Various time units (hour, day, week, month, year, project)
- Smart formatting (e.g., "$80k/year" or "$80k - $100k/year")
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
