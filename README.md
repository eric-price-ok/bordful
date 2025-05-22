# Bordful: Job Board Starter

Bordful is a modern, minimal job board built with Next.js, Tailwind CSS, and Airtable. Features static generation, client-side search, and a clean UI with Geist font.

![Job Board Starter Screenshot](public/screenshot.png)

## Why Bordful?

- **Modern Tech Stack:** Built with Next.js, Tailwind CSS, and Airtable for a fast, flexible, and easy-to-manage job board.
- **Comprehensive SEO:** Rich schema.org JobPosting data, automatic XML sitemaps, Google Jobs integration, and more to maximize visibility.
- **Highly Customizable:** Easily tailor the theme, layout, navigation, hero section, and every other aspect to match your brand.
- **Real-time Updates:** Leverages Next.js Incremental Static Regeneration (ISR) to keep job listings fresh without manual rebuilds.
- **User-Friendly:** Clean UI with Geist font, client-side search, rich text support for job descriptions, and smart pagination.
- **Full-Featured:** Packed with features like job alerts, multi-currency salary support, advanced filtering, RSS feeds, and robust email integration.

Explore all features in detail in our [Core Features Guide](/docs/guides/core-features.md).

## Getting Started

### Quick Installation

Get your Bordful job board up and running in just a few steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/craftled/bordful
   cd bordful
   npm install
   ```

2. **Set up Airtable**: Either use our [pre-configured template](https://airtable.com/appLx3b8wF3cyfoMd/shrWo1VUVq7mJS6CB) or set up your own Airtable base. See the [Airtable Setup Guide](/docs/getting-started/airtable-setup.md).

3. **Configure environment variables**: Set up your API keys and database connections. See [Environment Variables](#environment-variables) below.

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
2. Customize the settings in `config/config.ts` to match your needs.
3. The app will automatically use your custom configuration.

The configuration system is:
- **Easy to use**: Simple file copying to get started.
- **Flexible**: Customize everything from site title to component behavior.
- **Maintainable**: Pull updates without losing your customizations.

For comprehensive configuration documentation, see our [Configuration Guide](/docs/getting-started/configuration.md).

## Environment Variables

⚠️ IMPORTANT: Never commit your API keys or sensitive credentials to the repository!

Required environment variables:

- `AIRTABLE_ACCESS_TOKEN=your_token_here`
- `AIRTABLE_BASE_ID=your_base_id_here`
- `AIRTABLE_TABLE_NAME=your_table_name_here` (defaults to "Jobs" if not specified)

Create a `.env` file in your project root and add these variables there. For more details, see the [Environment Variables Guide](/docs/reference/environment-variables.md).

## Dive Deeper: Features & Documentation

Bordful is packed with features. Explore the documentation to learn more:

- **Core Functionality & Guides:** Understand Bordful's capabilities. ([Core Features](/docs/guides/core-features.md), [All Guides](/docs/guides/index.md))
- **Customization:** Tailor the look, feel, and functionality. ([Customization Guide](/docs/guides/customization.md), [Theming](/docs/guides/theming-customization.md), [Hero Section](/docs/guides/hero-section.md), [Navigation](/docs/guides/navigation.md), [Footer](/docs/guides/footer.md))
- **SEO & Content:** Maximize visibility with built-in SEO tools. ([Schema Implementation](/docs/advanced/schema-implementation.md), [Sitemaps](/docs/reference/sitemap-generation.md), [Robots.txt](/docs/reference/robots-generation.md), [RSS Feeds](/docs/reference/rss-feed-system.md), [FAQ System](/docs/reference/faq-system.md))
- **Data & Backend:** Learn about Airtable integration and data handling. ([Airtable Setup](/docs/getting-started/airtable-setup.md), [Data Revalidation (ISR)](/docs/advanced/data-revalidation.md))
- **Advanced Topics:** For developers looking to extend Bordful. ([Script Management](/docs/advanced/script-management.md), [Email Integration](/docs/guides/email-integration.md), [Salary Structure](/docs/reference/salary-structure.md), [Language Support](/docs/reference/language-system.md))

For a full overview of all documentation, visit the [Documentation Hub](/docs/README.md).

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

## Pagination, Sorting, and URL Parameters

Bordful includes a comprehensive pagination and sorting system with powerful URL parameter support:

- URL-based pagination for better UX and SEO
- Configurable items per page (10, 25, 50, 100)
- Multiple sorting options (newest, oldest, salary)
- Comprehensive URL parameter system for all filters and settings
- Elegant pagination UI with intelligent page number display
- Complete state persistence through URL parameters

For detailed documentation on pagination, sorting, and URL parameters, see [Pagination, Sorting, and URL Parameters](/docs/reference/pagination-sorting.md).

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

Bordful is designed to be highly customizable, allowing you to tailor your job board to match your brand identity and specific requirements.

Key customization options include:

- **Styling**: Configure Tailwind CSS theme, global styles, and component-specific styling.
- **Script Management**: Add analytics, tracking, or any third-party scripts with optimized loading strategies.
- **Data Source**: Modify or replace the Airtable implementation with your preferred database.
- **Theme Customization**: Set colors, typography, and other design elements through configuration.
- **Component Customization**: Modify specific components to match your requirements.

For comprehensive customization documentation, including detailed examples and best practices, see our [Customization Guide](/docs/guides/customization.md).

## Deployment

Bordful can be deployed to various platforms, with Vercel being the recommended option due to its excellent support for Next.js applications.

For comprehensive deployment instructions, including local build verification and platform-specific guides for Vercel, Netlify, and Docker, see our [Deployment Guide](/docs/getting-started/deployment.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own job board! 100% free for personal and commercial use.

## Support

If you find this helpful, please ⭐️ this repository!

## Credits

Built by [Craftled](https://craftled.com)