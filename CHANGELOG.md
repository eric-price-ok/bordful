# Changelog

All notable changes to this project will be documented in this file.

## [0.0.97] - 2025-03-25

### Added
- Added configurable post job banner:
  - New `postJobBanner` section in config file
  - Trust indicators with company avatars
  - Customizable CTA with pricing
  - Trust message support
  - Fully responsive design
  - Added comprehensive documentation in `/docs/post-job-banner.md`

## [0.0.96] - 2025-03-24

### Changed
- Enhanced job-specific meta descriptions for better SEO and UX:
  - Improved format to "[Company] is hiring [job type] [job title]"
  - Intelligently formatted workplace information by type:
    - Remote: "Remote position in [Region]" or "Remote position (Worldwide)"
    - Hybrid: "Hybrid position in [City, Country]"
    - On-site: "in [City, Country]"
  - Added salary information and application deadlines when available
  - Removed redundant information to create concise, impactful descriptions
  - Enhanced text parsing to clean job titles and improve readability
  - Implemented dynamic description building with proper sentence structure
  - Fixed grammar and punctuation issues for cleaner, more natural descriptions
  - Optimized character length for better visibility in search results

## [0.0.95] - 2025-03-24

### Added
- Added ItemList schema to jobs directory page:
  - Improves structured data representation of job categories
  - Implements proper ListItem elements with positions and URLs
  - Uses schema-dts for type safety
  - Enhances SEO for job category pages
- Added AboutPage schema with rich structured data:
  - Implements Organization information with proper context
  - Uses schema-dts for type safety and validation
  - Enhances SEO for the About page
  - Integrates with configuration system
- Added ContactPage schema with comprehensive contact information:
  - Includes contact details in structured format
  - Uses schema-dts types for validation
  - Enhances discoverability of company contact information
  - Improves SEO for Contact page

### Changed
- Enhanced SearchAction schema with multiple search targets:
  - Added dedicated job search action for improved job discovery
  - Implemented both general site search and job-specific search actions
  - Added clear descriptions for each search type
  - Improved Google search integration with proper query-input formatting
  - Maintained schema-dts type safety with careful casting
- Refactored BreadcrumbList schema to use schema-dts types:
  - Enhanced type safety for breadcrumb implementation
  - Maintains backward compatibility with existing usage
  - Aligned with the project's schema-dts implementation pattern
  - Improved code maintainability
- Updated job directory page metadata and structure:
  - Improved description
  - Added OpenGraph type
  - Simplified container layout 
- Improved About and Contact pages:
  - Enhanced integration with configuration system
  - Added proper metadata for SEO
  - Implemented consistent layout and styling
  - Added fallback content when configuration is missing

## [0.0.94] - 2025-03-23

### Changed
- Simplified WebSite schema implementation for easier configuration:
  - Removed dedicated schema configuration section from config file
  - Now derives schema data from existing configuration values
  - Uses navigation title for WebSite name
  - Automatically includes search action functionality
  - Derives social links from navigation social media settings
  - Uses logo configuration for publisher logo
  - Improves maintainability by reducing configuration duplication
  - Enhanced type safety with schema-dts
- Refactored FAQPage schema implementation to use schema-dts:
  - Added proper TypeScript typing for structured data
  - Improved type safety with Question and Answer types
  - Maintains the same functionality with better code quality
  - Consistent with the WebSite schema implementation approach

## [0.0.93] - 2025-03-22

### Added
- Implemented configurable WebSite schema using schema-dts type definitions:
  - Added global structured data for improved search engine visibility
  - Implemented SearchAction schema for potential Google Sitelinks Searchbox integration
  - Created flexible publisher configuration with Organization and Person support
  - Added social profile linking with sameAs property
  - Integrated with config system for easy site-wide schema customization
  - Added comprehensive documentation in schema-implementation.md
  - Enhanced SEO optimization across the entire website
  - Used schema-dts for type safety and validation

## [0.0.92] - 2025-03-22

### Fixed
- Enhanced education credential formatting for schema.org compliance:
  - Added intelligent mapping from free-text education fields to standard schema.org credential categories
  - Implemented credential category detection for Bachelor, Master, Doctoral, and other degree types
  - Fixed "Invalid enum value" warning in Google's Rich Results Test
  - Added comprehensive documentation for educational credential formatting

### Changed
- Improved maintainability of schema.org credential mapping:
  - Refactored education credential parsing to use a configurable mapping system
  - Replaced hardcoded conditionals with a flexible keyword-based mapping approach
  - Added extensible configuration map for education credential types
  - Improved code maintainability and readability with the new approach

## [0.0.91] - 2025-03-22

### Fixed
- Fixed schema.org validation issues for Rich Results Test:
  - Updated educationRequirements to use EducationalOccupationalCredential type
  - Enhanced experienceRequirements with OccupationalExperienceRequirements type
  - Added intelligent experience duration parser to extract months from text descriptions
  - Improved schema.org compliance for Google Jobs integration

## [0.0.90] - 2025-03-22

### Added
- Integrated schema-dts package for enhanced schema.org typing:
  - Added TypeScript type definitions for Schema.org JSON-LD structured data
  - Implemented proper type safety for all JobPosting structured data
  - Added discriminated type unions for schema.org entities
  - Enhanced developer experience with auto-completion for schema properties
  - Improved error detection during development with compile-time type checking
  - Refactored job-schema.tsx component with proper schema-dts types
  - Updated documentation to reflect schema-dts usage and benefits
  - Added conditional property rendering for proper schema validation

### Changed
- Enhanced schema.org implementation with better type safety:
  - Improved handling of optional properties with conditional rendering
  - Updated salary formatting function with proper QuantitativeValue typing
  - Enhanced location and country formatting with schema-dts types
  - Removed type assertions where proper typing could be implemented
  - Improved maintainability with standardized schema.org type patterns

## [0.0.89] - 2025-03-21

### Added
- Enhanced schema.org JobPosting markup with additional structured data fields:
  - Added support for `skills`, `qualifications`, `educationRequirements`, and `experienceRequirements` fields
  - Added `industry` and `occupationalCategory` fields for better job classification
  - Added `jobBenefits` field to leverage existing benefits data
  - Added `responsibilities` field for more comprehensive job descriptions
  - Added `eligibilityToWorkRequirement` field to properly represent visa sponsorship status
  - Implemented schema.org-compliant field mapping for all new properties
  - Added proper type handling for empty or undefined fields
  - Extended Job interface with new optional structured data fields

### Fixed
- Enhanced schema.org JobPosting markup for better SEO and rich result validation:
  - Removed misleading `sameAs` property from hiringOrganization object
  - Fixed URL property placement to proper root level for correct structured data
  - Improved handling of `applicantLocationRequirements` for remote jobs to pass Google's Rich Results Test
  - Added worldwide location support for remote jobs without region specification
  - Ensured `directApply` property is correctly formatted as a boolean value
  - Fixed critical validation errors reported by Google's structured data testing tool

## [0.0.88] - 2025-03-20

### Added
- Enhanced job details page with additional application information:
  - Added application deadline display in sidebar with relative time indicator (e.g., "in 6 days")
  - Added job identifier display in sidebar for better reference
  - Added "Apply before" reminder text next to the Apply Now button
  - Added amber notice for past deadlines indicating jobs might still accept applications
- Improved job schema markup implementation:
  - Updated JobSchema component to set directApply property to false
  - Enhanced SEO for external application links to properly indicate third-party application process
  - Made schema.org job posting markup more accurately reflect application flow

### Fixed
- Fixed visa sponsorship badge display issues:
  - Added `normalizeVisaSponsorship` function for consistent badge display
  - Implemented case-insensitive matching for "Yes" and "No" values
  - Added fallback to "Not specified" for invalid or missing values
  - Ensured consistent badge styling across all job displays
- Fixed "On-site" workplace type badge styling:
  - Added specific mapping from "On-site" to "onsite" badge type
  - Resolved issue with hyphenated workplace type not matching badge style definitions
  - Ensured consistent styling for all workplace type badges

## [0.0.87] - 2025-03-19

### Fixed
- Fixed build issues with unused imports and params handling:
  - Removed unused imports in JobsLayout.tsx (JobFilters, Badge, useDebounce, Button, Input, Search icons)
  - Fixed dynamic route parameter handling in job detail pages by properly awaiting params object
  - Resolved ESLint errors related to no-unused-vars TypeScript rule
  - Enhanced stability of breadcrumb implementation with proper async patterns

## [0.0.86] - 2025-03-19

### Changed
- Optimized breadcrumb implementation with server components:
  - Migrated client-side breadcrumbs to Next.js server components
  - Reduced client-side JavaScript bundle size
  - Eliminated hydration costs and content layout shifts
  - Fixed inconsistent breadcrumb hierarchy in category pages
  - Maintained color styling distinction between active/inactive items
  - Enhanced performance by moving breadcrumb generation to the server
  - Improved accessibility and SEO with proper semantic markup

## [0.0.85] - 2025-03-18

### Changed
- Improved breadcrumb implementation with loading optimization:
  - Enhanced layout stability by adding skeleton placeholders matching breadcrumb dimensions
  - Implemented fade-in transitions for smooth visual updates
  - Added proper hydration safety with client-side mount detection
  - Prevented layout shifts with path-aware placeholder structure
  - Optimized loading states with delayed transitions to prevent flashing
  - Improved error handling for dynamic route data fetching
  - Enhanced responsiveness across all device sizes

### Fixed
- Fixed schema.org breadcrumb markup to use proper format for Google's Rich Results Test:
  - Updated breadcrumb schema generation to exactly match Google's recommended JSON-LD structure
  - Used simple URL strings for non-final items and omitted the item property for final breadcrumb
  - Fixed "Invalid URL" warnings by using proper absolute URLs
  - Added proper TypeScript definitions for ListItem schema objects
  - Ensured full compliance with Google's structured data guidelines

## [0.0.84] - 2025-03-18

### Added
- Enhanced breadcrumb navigation system for improved user experience and SEO:
  - Implemented schema.org breadcrumb markup for search engine optimization
  - Created reusable breadcrumb components with proper semantic structure
  - Added client-side automatic breadcrumb generation based on current routes
  - Implemented server-side caching for breadcrumb data
  - Added performance optimizations with React.memo and useMemo
  - Implemented comprehensive error handling for all breadcrumb generation steps
  - Added consistent styling with the rest of the application
  - Ensured mobile responsiveness with appropriate text sizing
  - Provided graceful fallbacks for loading and error states
  - Maintained consistent data flow with efficient prop passing
  - Added proper accessibility with ARIA attributes

## [0.0.83] - 2025-03-18

### Added
- Added application requirements feature:
  - New `application_requirements` field in Airtable for listing job prerequisites
  - Compact, focused placement before Apply button to ensure visibility
  - Lightweight UI with subtle amber highlighting for attention without distraction
  - Character limits (1,000 max) for consistent display
  - Recommended comma-separated format for standardization

## [0.0.82] - 2025-03-16

### Added
- Added job benefits and perks feature:
  - New benefits field in Airtable for capturing perks and benefits
  - Benefits display in job detail sidebar with dedicated section
  - Collapsible text interface for longer benefit lists
  - Character limits (1,000 max) for consistent display
  - Icon-based visual indicator for benefits section
  - UI consistency with existing show more/less patterns

## [0.0.81] - 2025-03-16

### Added
- Added cryptocurrency and stablecoin support:
  - Added support for major cryptocurrencies (BTC, ETH, XRP, etc.)
  - Added USD-pegged stablecoins (USDT, USDC, USDS, PYUSD, TUSD)
  - Implemented proper cryptocurrency symbol display (₿ for Bitcoin, Ξ for Ethereum)
  - Set exchange rates for cryptocurrency price normalization
  - Updated documentation with comprehensive cryptocurrency information

## [0.0.80] - 2025-03-14

### Added
- Enhanced salary display features:
  - Added consistent scale formatting for salary ranges (k/M)
  - Implemented intelligent spacing for currency symbols
  - Added USD approximation display for non-USD salaries
  - Improved readability of salary displays across all currencies
  - Enhanced salary formatting for high-value currencies
  - Added proper spacing rules for currency symbols based on script type

## [0.0.79] - 2025-03-14

### Added
- Enhanced currency support with 50 common global currencies:
  - Created centralized currency constants system with complete ISO currency data
  - Added support for all major global currencies with proper symbols and formatting
  - Implemented currency conversion system for salary normalization and comparison
  - Enhanced salary display with proper currency symbols for all supported currencies
  - Added configuration options for default currency and allowed currencies
  - Updated pricing page to use the expanded currency system
  - Created comprehensive documentation for currency management
  - Added utility functions for currency lookup and conversion

## [0.0.78] - 2025-03-13

### Added
- Added configurable contact page with comprehensive features:
  - Support channels section with customizable cards for different contact methods
  - Detailed contact information section with company details
  - Fully customizable via config file with enable/disable options
  - Consistent styling with the rest of the application
  - SEO optimization with proper metadata
  - Responsive design for all screen sizes

## [0.0.77] - 2025-03-12

### Added
- Enhanced FAQ page with comprehensive features:
  - Implemented client-side search functionality with URL persistence
  - Added anchor links for direct navigation to specific FAQ categories
  - Integrated rich text support with markdown rendering
  - Added FAQ schema markup for improved SEO
  - Implemented stable accordion item IDs for reliable expand/collapse functionality
  - Added copy-to-clipboard feature for section links
  - Enhanced styling with consistent design language

### Changed
- Improved FAQ component organization and styling:
  - Optimized search field width to match answer boxes
  - Enhanced Contact Us section with consistent button styling
  - Added table support in markdown content with responsive design
  - Improved accessibility with proper ARIA labels and keyboard navigation
  - Enhanced mobile responsiveness with optimized layout

## [0.0.76] - 2025-03-11

### Added
- Enhanced pricing page configuration with more flexibility:
  - Simplified billing term structure with customizable text (e.g., "month", "year", "job posting")
  - Added customizable badge system with support for different badge types
  - Decoupled border highlighting from badges with new `highlighted` property
  - Improved type safety by importing badge types from components
  - Added comprehensive documentation for pricing page customization

### Changed
- Improved pricing page component:
  - Enhanced code organization with better separation of concerns
  - Optimized formatting logic with dedicated helper functions
  - Improved responsive design for better mobile experience
  - Reduced code duplication for better maintainability

## [0.0.75] - 2025-03-11

### Added
- Enhanced pricing page with improved UI and payment information:
  - Added "Best Value" badge to Pro plan for better plan differentiation
  - Added payment processing information text with configurable content
  - Implemented payment method icons (Visa, Mastercard, Amex, Apple Pay, Google Pay, PayPal)
  - Added hover effects on payment icons for better interactivity
  - Made all payment-related elements configurable through config file

### Changed
- Improved pricing page layout and consistency:
  - Standardized button sizes to match navigation buttons
  - Made buttons full width within pricing cards for better visual balance
  - Aligned badge positioning to match job cards for consistent design language
  - Removed FAQ section for cleaner, more focused layout
  - Enhanced spacing and alignment throughout pricing cards
  - Optimized visual hierarchy with consistent styling patterns

## [0.0.74] - 2025-03-11

### Added
- Added configurable pricing page:
  - Created new `/pricing` route with responsive design
  - Implemented pricing plans configuration in config file
  - Added Free and Pro plan options with feature lists
  - Integrated with existing UI components
  - Added FAQ section with common pricing questions
  - Enhanced navigation with conditional pricing links
  - Added SEO metadata for pricing page
  - Implemented popular plan highlighting

## [0.0.73] - 2025-03-11

### Added
- Added dropdown menu for Jobs navigation item:
  - Implemented hover-activated dropdown in desktop view
  - Created nested navigation in mobile view with indented sub-items
  - Added links to job-related pages (types, locations, levels, languages)
  - Enhanced navigation UX with visual hierarchy for job categories
  - Optimized dropdown width for better visual balance
  - Improved accessibility with proper ARIA attributes
  - Added keyboard and mouse interaction support
  - Implemented click-outside behavior to dismiss dropdown
- Added Jobs section to footer:
  - Created dedicated column for job-related links
  - Added links to all jobs, job types, locations, levels, and languages
  - Enhanced site navigation with consistent job category access
  - Improved discoverability of job-related pages

### Changed
- Optimized footer layout for better space utilization:
  - Reduced vertical and horizontal spacing between elements
  - Adjusted grid to accommodate 5 columns instead of 4
  - Decreased spacing between list items for more compact appearance
  - Standardized spacing values throughout the footer component
  - Improved mobile and desktop layout consistency

### Fixed
- Resolved React hydration error in footer component:
  - Fixed server/client rendering mismatch with copyright years
  - Improved conditional rendering consistency
  - Refactored job links into a reusable array
  - Enhanced client-side initialization of dynamic content
  - Eliminated "text content did not match" warnings

## [0.0.72] - 2025-03-10

### Added
- Made language badges in job details sidebar clickable, linking to language-specific job listings
  - Improved internal linking and user navigation with interactive language tags
  - Enhanced discoverability of language-specific job pages through contextual linking
- Made career level badges in job details sidebar clickable, linking to level-specific job listings
  - Implemented smart linking that excludes "Not Specified" career levels
  - Added visual hover effects only to interactive elements
  - Improved UX by providing clear visual affordances for clickable elements
- Fixed route parameter handling for Next.js 15.2.1
  - Updated dynamic route pages to properly await params
  - Enhanced error handling for invalid routes
  - Ensured consistent behavior across language, level, and type pages

## [0.0.71] - 2025-03-09

### Added
- Enhanced language system with comprehensive ISO 639-1 support:
  - Added support for all 184 ISO 639-1 language codes
  - Implemented "Language Name (code)" format in Airtable for human readability
  - Created bidirectional mapping between codes and full language names
  - Added utility functions for language code extraction and normalization
  - Enhanced language filtering with alphabetical sorting
  - Improved SEO with standard language codes in URLs
  - Added robust internationalization foundation
  - Implemented flexible language matching algorithm
  - Enhanced developer experience with comprehensive language type definitions
  - Optimized language data storage with two-letter codes

## [0.0.70] - 2025-03-08

### Changed
- Enhanced RSS feed implementation to better utilize configuration options:
  - Added checks to disable feeds based on configuration settings
  - Made feed title fully configurable via the config file
  - Implemented configurable description length for job previews
  - Applied proper MIME type for JSON Feed format (application/feed+json)
  - Added conditional rendering for disabled feed formats
  - Improved error handling when feeds are disabled
  - Enhanced type safety with proper optional chaining

## [0.0.69] - 2025-03-07

### Added
- Added comprehensive RSS feed system:
  - Created route handlers for RSS 2.0, Atom, and JSON Feed formats
  - Implemented client-side null checks for robust error handling
  - Added RSS feed link tags in HTML head for better discoverability
  - Added RSS icon in navigation and footer for easy access
  - Included detailed job metadata in feeds (title, company, location, salary)
  - Added support for featured job highlights in feed
  - Added job categories including type, career level, and languages
  - Implemented 5-minute feed revalidation to match site content
  - Added configuration options for enabling/disabling feed features
  - Enhanced feeds with content summaries and formatted descriptions
  - Implemented proper MIME types for each feed format

## [0.0.68] - 2025-03-07

### Changed
- Improved canonical URLs implementation for better SEO:
  - Added `metadataBase` URL in root layout for proper URL resolution
  - Standardized canonical URL format using relative paths
  - Updated dynamic page metadata to include proper canonical references
  - Added missing canonical URLs to `/jobs/types`, `/jobs/locations`, `/jobs/levels`, `/jobs/languages`, `/privacy`, and `/terms` pages
  - Improved SEO by preventing duplicate content issues
  - Implemented robots meta tag with comprehensive crawler directives
  - Added X-Robots-Tag HTTP headers for enhanced crawler control
  - Configured specific rules for different file types (images, PDFs)
  - Added hreflang tags with fully-qualified URLs for proper language targeting
  - Implemented simplified language links with generic English ('en') and fallback ('x-default')
  - Enhanced hreflang implementation with proper page-specific tags
  - Fixed duplicate hreflang tags to ensure clean HTML output
  - Followed Google's best practices for international SEO

### Fixed
- Fixed TypeScript type errors in locations page:
  - Added proper type handling for country and city data
  - Resolved type safety issues with dynamic location names
  - Improved object update pattern for better type safety
  - Eliminated ESLint warnings by removing explicit 'any' types
  - Used consistent approach for both country and city data handling

## [0.0.67] - 2025-03-07

### Added
- Added robots.txt implementation:
  - Created dynamic robots.ts following Next.js metadata conventions
  - Added programmatic control over crawler rules
  - Configured comprehensive crawler directives for search engines
  - Linked sitemap.xml for improved search engine indexing
  - Established canonical host definition
  - Protected private routes from indexing

## [0.0.66] - 2025-03-07

### Fixed
- Enhanced dynamic route parameter handling in job detail pages:
  - Improved async parameter handling in `generateMetadata` function
  - Optimized job data fetching with parallel Promise.all
  - Updated `JobPage` component to use consistent async patterns
  - Enhanced error handling for job not found cases
  - Maintained proper TypeScript types for params object

## [0.0.65] - 2025-03-06

### Added
- Added thousands separators to all job count displays:
  - Implemented `toLocaleString()` for consistent number formatting
  - Applied formatting to main hero section job counts
  - Added formatting to "added today" counts
  - Updated all job listings and pagination counts
  - Enhanced filter sidebar count displays
  - Improved category card job count displays
  - Updated aria-labels with formatted numbers for accessibility

### Fixed
- Cleaned up console logs throughout the codebase:
  - Removed excessive debugging logs while preserving important error messages
  - Maintained API key and configuration error reporting for better troubleshooting
  - Removed verbose data normalization logs from job detail pages
  - Improved code cleanliness and reduced console noise
  - Enhanced production readiness while keeping meaningful error context

## [0.0.64] - 2025-03-03

### Fixed
- Fixed deployment configuration issue:
  - Modified `config/index.ts` to properly handle missing `config.ts` file
  - Added environment-specific configuration loading
  - Ensured production builds always use `config.example.ts`
  - Prevented build errors when `config.ts` doesn't exist
  - Improved configuration loading logic for development environments

## [0.0.63] - 2025-03-03

### Added
- Compact job card system:
  - New `CompactJobCard` and `CompactJobCardList` components
  - Space-efficient row layout with badges
  - Latest jobs preview on alerts page

### Changed
- Improved job alerts form and layout:
  - Added name field validation
  - Enhanced server-side validation
  - Added client-side validation
  - Improved form styling and layout

## [0.0.62] - 2025-03-03

### Added
- Made job alerts feature optional:
  - Added configuration options to enable/disable job alerts
  - Added conditional rendering in navigation and footer
  - Added redirect to home page when job alerts are disabled
  - Added API endpoint protection when feature is disabled

## [0.0.61] - 2025-03-03

### Added
- Added API rate limiting to prevent abuse:
  - Implemented in-memory rate limiting for subscription endpoint
  - Limited to 5 requests per hour per IP address
  - Added client-side handling of rate limit responses
  - Created comprehensive documentation in `/docs/rate-limiting.md`

### Changed
- Enhanced documentation structure:
  - Added documentation index in `/docs/README.md`
  - Improved navigation between documentation files
  - Added getting started instructions in documentation

## [0.0.60] - 2025-03-03

### Added
- Added Encharge email provider integration:
  - Implemented subscription handling via Encharge API
  - Added detailed documentation in `/docs/encharge-integration.md`

### Changed
- Improved form validation for job alerts subscription:
  - Enhanced server-side validation with comprehensive email regex
  - Added required name field validation on server
  - Implemented client-side validation with error messages
  - Added visual indicators for required fields

## [0.0.59] - 2025-02-28

### Fixed
- Fixed job filters count indicators to consistently show 0 for empty categories:
  - Added fallback zero values for Job Type filters
  - Standardized count display across all filter sections
  - Improved visual consistency with Career Level options

## [0.0.58] - 2025-02-27

### Fixed
- Fixed configuration loading in production by removing development-only check:
  - Custom `config.ts` now loads in all environments
  - Ensures consistent configuration between development and production
  - Resolves issue with example config being used in production

## [0.0.57] - 2025-02-27

### Changed
- Updated Next.js to version 15.2.0

## [0.0.56] - 2025-02-27

### Changed
- Optimized Airtable API usage with consistent revalidation strategy:
  - Standardized 5-minute (300 seconds) revalidation across all dynamic pages
  - Replaced `force-dynamic` with revalidation on job detail pages
  - Added `force-static` to static content pages (about, privacy, terms)
  - Enhanced documentation with revalidation customization guide

## [0.0.55] - 2025-02-27

### Added
- Added reusable `JobBadge` component for consistent badge styling across the application:
  - Centralized badge styling for workplace types, visa status, career levels, and languages
  - Improved code maintainability through DRY principle
  - Added "New" badge for jobs posted within the last 48 hours
  - Consistent visual language for all badge types
  - TypeScript type safety for badge variants

## [0.0.54] - 2025-02-20

### Added
- Added `config.example.ts` as the template for job board configuration:
  - Complete example with detailed comments
  - TypeScript type safety
  - All customizable options documented
  - Works out of the box without requiring custom config
  - Supports deep merging with custom config.ts when present

### Changed
- Enhanced configuration system:
  - Uses example config by default for immediate usability
  - Supports optional config.ts for customization
  - Deep merges custom config with example defaults
  - Improved configuration documentation
  - Better setup instructions for forked repositories
  - Replaced "Built by Craftled" with "Built with Bordful" in the footer
  - Simplified configuration imports across all files for better maintainability
  - Removed redundant type imports in favor of TypeScript's automatic type inference

## [0.0.53] - 2025-02-19

### Changed
- Improved caching consistency across pages:
  - Removed double-caching on homepage to match subpage behavior
  - Standardized 5-minute revalidation across all job pages
  - Fixed issue with stale data persisting on homepage

## [0.0.52] - 2025-02-19

### Added
- Added language-based job filtering:
  - New /jobs/languages directory page
  - Individual language-specific job listing pages
  - Language filter in sidebar with show/hide functionality
  - Support for multiple language selection

### Changed
- Enhanced job filters with improved state management:
  - Added custom hooks for array and boolean filters
  - Optimized filter performance and reduced re-renders
  - Fixed "Clear all" functionality for language filters
  - Added missing "Freelance" job type option
  - Improved filter synchronization with URL parameters

## [0.0.51] - 2025-02-11

### Added
- Reddit social icon in navigation and footer
- Support for Reddit social link in configuration

## [0.0.50] - 2025-02-11

### Added
- Added automatic XML sitemap generation:
  - SEO-friendly URLs with descriptive job slugs
  - Dynamic updates through ISR (5-minute revalidation)
  - Prioritized URLs (1.0 for homepage, 0.9 for featured jobs)
  - Comprehensive coverage of all job listings and category pages

## [0.0.49] - 2025-02-09

### Added
- Added flexible script management system:
  - Support for head and body script injection
  - Next.js Script component integration with loading strategies
  - TypeScript-safe configuration
  - Documentation for script management in README

## [0.0.48] - 2025-02-09

### Added
- Added custom logo support in navigation:
  - Option to replace default icon+text with custom logo image
  - Configurable logo dimensions and alt text
  - SVG support for crisp display

## [0.0.47] - 2025-02-08

### Changed
- Added configurable Airtable table name via `AIRTABLE_TABLE_NAME` environment variable

## [0.0.46] - 2025-02-08

### Added
- Added "Freelance" as a new job type option:
  - Updated Job interface to include Freelance type
  - Added Freelance to job type constants with descriptions
  - Updated Airtable setup documentation
  - Enhanced job filtering to support Freelance positions

## [0.0.45] - 2025-02-07

### Changed
- Added external link handling for "Post a Job" buttons

## [0.0.44] - 2025-02-07

### Changed

- Enhanced job directory pages:
  - Added consistent "View All" buttons for job types, locations, and career levels
  - Improved type safety for location handling
  - Standardized layout and navigation across directory pages
  - Fixed unused imports and variables

## [0.0.43] - 2025-02-07

### Changed

- Standardized job listing pages:
  - Unified sorting and pagination across all job pages
  - Consistent URL parameters (per_page, sort)
  - Enhanced responsive layout and styling
  - Improved loading states and empty results handling

### Added

- Added location-based job browsing:
  - New /jobs/locations page with comprehensive location directory
  - Individual location pages with filtered job listings
  - Support for remote and country-specific job searches
  - Consistent layout and functionality with other job pages

## [0.0.42] - 2025-02-06

### Added

- Added `/jobs` page with category browsing:
  - Job types, locations, and career levels
  - Dynamic data aggregation
  - Centralized constants for career levels and locations
  - Accessible UI components

## [0.0.41] - 2025-02-06

### Added

- Added `/jobs` page:
  - Added ARIA labels and landmarks for accessibility
  - Improved semantic HTML structure
  - Optimized category cards
  - Added dynamic data revalidation (5 min)
  - Enhanced mobile responsiveness

## [0.0.40] - 2025-02-06

### Added

- Added Airtable template for quick setup
- Added `.env.example` file for easier environment configuration

### Changed

- Updated README with Airtable template link
- Improved environment setup documentation
- Enhanced setup instructions with template-first approach
- Added note about preserving `.env.example` for reference

## [0.0.39] - 2025-02-04

### Changed

- Enhanced homepage and job post page responsive layouts:
  - Optimized layout breakpoints for better space utilization
  - Adjusted sidebar to start at medium screens (768px) instead of large screens
  - Refined sidebar widths (240px to 260px) for better content balance
  - Improved main content and sidebar proportions
  - Enhanced layout flexibility on medium-sized screens
  - Unified layout structure between homepage and job post pages
  - Standardized content width and spacing across both pages
  - Improved mobile UX by prioritizing job content and reordering sidebar sections
  - Optimized content flow on mobile with job details followed by similar jobs

## [0.0.38] - 2025-02-03

### Changed

- Improved navigation responsiveness and styling:
  - Adjusted mobile menu breakpoint for better usability
  - Enhanced active link styling with subtle background
  - Updated X (Twitter) icon to match footer design
  - Optimized spacing between navigation items
  - Consistent hover effects across desktop and mobile
  - Reduced icon sizes in collapsed menu

## [0.0.37] - 2025-02-03

### Changed

- Updated Privacy & Terms pages layout and styling:
  - Centered content layout for better readability
  - Consistent styling with job post pages
  - Improved typography and spacing
  - Enhanced markdown content formatting
  - Combined Cookie Policy into Privacy Policy page
  - Updated footer links to reflect merged pages

## [0.0.36] - 2025-02-03

### Changed

- Enhanced footer configuration with centralized controls
- Added configuration options for all footer sections (brand, resources, legal, post job)
- Added customizable copyright section with dynamic year range
- Added configurable "Built By" section with optional logo
- Improved code maintainability with configuration-driven footer
- Added show/hide toggles for all footer sections
- Added external link support for legal links

## [0.0.35] - 2025-02-03

### Changed

- Enhanced navigation configuration with centralized social media controls
- Added configuration options for LinkedIn, Twitter, and Bluesky social links
- Added customizable "Post Job" button with show/hide, label, and link options
- Moved all navigation menu items to config file for single source of truth
- Updated navigation component to use dynamic configuration values
- Improved code maintainability with configuration-driven navigation

## [0.0.34] - 2025-01-26

### Changed

- Migrated Next.js configuration from JavaScript to TypeScript for better type safety and consistency
