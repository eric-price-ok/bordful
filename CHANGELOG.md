# Changelog

All notable changes to this project will be documented in this file.

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
  - Enhanced hreflang implementation with explicit HTML link tags for improved crawler detection
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
- Removed `next.config.js` in favor of `next.config.ts`
- Consolidated PostCSS configuration into `postcss.config.mjs` with proper TypeScript types
- Removed redundant `postcss.config.js`
- Optimized font loading by removing unused font files from app/fonts directory
- Removed unused TestFeatures component
- Improved performance by removing unnecessary loading states and Suspense boundaries
- Optimized navigation icon loading for better UX

## [0.0.33] - 2025-01-21

### Changed

- Updated GitHub repo URL

## [0.0.32] - 2024-12-27

### Changed

- Reorganized footer structure for better content organization

## [0.0.31] - 2024-12-27

### Added

- Added social media icons (GitHub, LinkedIn, X, Bluesky) to navbar and footer
- Enhanced navigation with consistent icon spacing and hover states
- Improved accessibility with proper ARIA labels for social links

## [0.0.30] - 2024-12-27

### Changed

- Enhanced workplace type handling with improved default values
- Updated job location display to handle missing information gracefully
- Improved job post header layout by removing date for better readability
- Standardized "Not specified" badge styling across components
- Updated search functionality to use new workplace location fields
- Improved remote filter count display to show total remote jobs out of all jobs
- Enhanced clarity of job filtering by showing "X of Y" format for remote jobs

## [0.0.29] - 2024-12-26

### Changed

- Replaced location field with separate city and country fields
- Added ISO 3166 country list as a constant
- Updated job search to handle city and country fields
- Updated documentation to reflect new location structure

## [0.0.28] - 2024-12-24

### Changed

- Enhanced footer with expanded sections for resources and legal information
- Added brand description and post job CTA in footer
- Improved footer layout with responsive grid design
- Reorganized component structure by moving all components to root directory
- Consolidated UI components from app/components to components/ui
- Moved HomePage component to components/home
- Updated import paths to use @ alias consistently

## [0.0.27] - 2024-12-22

### Added

- Added SEO metadata optimization across key pages
- Added canonical URLs to prevent duplicate content
- Added OpenGraph and Twitter card metadata
- Added dynamic meta descriptions and titles

### Changed

- Enhanced home page metadata with config-based values
- Improved about page SEO with targeted keywords
- Updated changelog page with comprehensive meta tags
- Standardized metadata structure across pages

## [0.0.26] - 2024-12-21

### Added

- Added About page with responsive design and consistent styling
- Implemented card-based feature highlights with subtle iconography
- Created content sections for mission statement and key features

### Changed

- Enhanced typography with standardized zinc color palette
- Refined card components with minimal shadow and border styling
- Optimized spacing and layout for better readability

## [0.0.25] - 2024-12-20

### Fixed

- Fixed Markdown formatting issues in job descriptions
- Fixed bold text headers rendering in list items
- Fixed indentation issues with multi-line bold text
- Fixed spacing around final paragraphs and sections

## [0.0.24] - 2024-12-18

### Fixed

- Fixed job pages not loading by switching to dynamic data fetching
- Added user-friendly root-level 404 page with improved design
- Added detailed logging for job route debugging
- Improved error handling for job not found cases

### Changed

- Completed migration to SEO-friendly URLs using title-company slug format
- Removed legacy ID-based routing completely

## [0.0.23] - 2024-12-17

### Changed

- Enhanced job cards with hover-activated Apply Now button
- Standardized Apply button styling across all pages
- Updated Apply buttons with consistent size and icon
- Improved button positioning to avoid conflicts with featured badge

## [0.0.22] - 2024-12-17

### Changed

- Enhanced SEO with descriptive job post URLs
- Updated URL structure to include job title and company name
- Improved URL readability with proper slug formatting
- Maintained backward compatibility with ID-based routing

## [0.0.21] - 2024-12-17

### Changed

- Enhanced job cards with hover-activated Apply Now button
- Standardized Apply button styling across all pages
- Updated Apply buttons with consistent size and icon
- Improved button positioning to avoid conflicts with featured badge

## [0.0.20] - 2024-12-16

### Added

- Added centralized configuration system in `config.ts`
- Added environment-aware site URL configuration
- Added configurable navigation with customizable logo and GitHub button

### Changed

- Simplified site customization with single configuration file
- Updated navigation to use dynamic Lucide icons
- Made navigation more compact with smaller logo and GitHub button
- Reduced pagination component size for better aesthetics

## [0.0.19] - 2024-12-15

### Added

- Added loading states for filter changes with smooth transitions
- Implemented keyboard navigation for search (Escape to clear)
- Added clear button for search input
- Added ARIA labels for better accessibility

### Changed

- Optimized pagination with smarter range algorithm
- Improved filter state management to prevent unnecessary updates
- Enhanced URL handling to prevent page jumps when filtering
- Refined loading indicators with better visual feedback

## [0.0.18] - 2024-12-14

### Added

- Implemented URL-based filter persistence for sharing and bookmarking
- Added support for multiple filter parameters in URL
- Enhanced filter state management with URL synchronization

### Changed

- Improved career level filtering with consistent ordering
- Fixed React state updates to prevent render cycle issues
- Enhanced TypeScript type safety for filter values
- Updated filter initialization to support URL parameters

## [0.0.17] - 2024-12-14

### Changed

- Updated job card metadata styling with consistent text sizes
- Improved featured job styling with zinc color scheme
- Enhanced metadata display order across job cards and similar jobs
- Refined spacing in job cards for better aesthetics
- Standardized job metadata presentation across all views

## [0.0.16] - 2024-12-13

### Added

- Implemented comprehensive salary structure with currency and time unit support
- Added salary normalization for accurate sorting
- Added URL-based pagination with configurable items per page
- Added sorting options (newest, oldest, highest salary)
- Replaced dollar icon with wallet icon in job details
- Added loading state for job details page

### Changed

- Updated salary display format to use slashes (e.g., "/year" instead of "per year")
- Improved salary sorting logic with normalization to annual USD
- Enhanced job details sidebar with better icon choices
- Updated README with new salary and pagination features
- Improved type safety in pagination implementation

## [0.0.15] - 2024-12-13

### Added

- Added breadcrumb navigation to job post page using shadcn components
- Implemented compact breadcrumb design with hover interactions

### Changed

- Simplified "Apply for this position" button text to just "Apply"
- Enhanced breadcrumb styling with consistent gray color scheme and smaller text
- Optimized spacing between breadcrumbs and job title
- Replaced "Description" heading with subtle separator line for cleaner layout
- Improved job header layout with compact apply button aligned with metadata
- Maintained two apply buttons for better UX (top and bottom of description)
- Enhanced job description links with consistent color scheme and offset underlines
- Updated job source link in sidebar to match main content link styling

## [0.0.14] - 2024-12-13

### Added

- Added Similar Jobs component to job post page
- Implemented job similarity matching based on title keywords and location
- Limited to 5 similar job suggestions per post

## [0.0.13] - 2024-12-13

### Changed

- Added jobs added today counter with pulsating dot indicator
- Simplified job card date format by removing "Posted" prefix
- Enhanced homepage stats display with dynamic job counters

## [0.0.12] - 2024-12-13

### Changed

- Enhanced job details sidebar with icons and improved layout
- Added colored status badges for visa sponsorship
- Made sidebar layout more compact and readable
- Refined report button styling and alignment

### Fixed

- Added fallback for missing salary range values
- Made salary range field optional in job details
- Improved job card to hide salary when not specified
- Fixed report button color contrast for better accessibility

## [0.0.11] - 2024-12-13

### Added

- Created reusable PostJobBanner component for job posting promotion
- Created JobDetailsSidebar component for better code organization
- Implemented company avatars with fallback support
- Added dark button variant using shadcn components

### Changed

- Refined sidebar labels with smaller font sizes
- Improved component organization for better maintainability
- Enhanced banner styling with New York theme
- Moved job details sidebar logic into separate component

## [0.0.10] - 2024-12-12

### Changed

- Updated navigation with improved GitHub icon
- Enhanced hero section badge to highlight open-source nature
- Refined navigation layout and button styling

## [0.0.9] - 2024-12-12

### Added

- Detailed job sidebar with comprehensive job details
- Multi-select career levels with standardized options
- Improved job metadata display with tags
- Career level validation and formatting

### Technical

- Added type-safe career level handling
- Implemented deduplication for multiple selections
- Added fallback handling for empty fields
- Fixed React key warnings in career level tags

## [0.0.8] - 2024-12-12

### Changed

- Enhanced hero section with improved UX and aesthetics
- Added dynamic "Last Updated" timestamp based on job posts
- Refined stats section with trending companies
- Implemented left-aligned minimal design
- Integrated shadcn/ui components for consistent styling

## [0.0.7] - 2024-12-12

### Changed

- Updated Next.js to version 15.1.0
- Updated ESLint configuration
- Updated @types/node to latest version
- Improved job post page caching with static generation

### Technical

- Upgraded core dependencies for better stability
- Maintained React 19 experimental features
- Fixed peer dependency warnings
- Implemented generateStaticParams for job posts
- Added draft mode support for previews

## [0.0.6] - 2024-12-12

### Changed

- Optimized data fetching with server-side caching
- Improved loading states with content-specific skeletons
- Enhanced job post page performance with 5-minute cache
- Reduced unnecessary re-renders in job listings

### Technical

- Implemented Next.js unstable_cache for Airtable data
- Added custom loading skeleton for job posts
- Extended revalidation period to 300 seconds
- Optimized client-side search with useMemo

## [0.0.5] - 2024-12-11

### Added

- Dedicated changelog page with markdown rendering
- Implemented static page generation reading directly from `CHANGELOG.md`
- Minimal footer with quick navigation links

### Technical

- Added static page generation for changelog using `fs.readFileSync`
- Integrated `ReactMarkdown` for rendering markdown content
- Maintained consistent max-width (700px) with job posts

## [0.0.4] - 2024-12-11

### Changed

- Improved layout consistency with global container configuration
- Optimized content width for better readability
- Standardized max-width (1100px) across all pages
- Refined job post layout with 700px content width
- Enhanced maintainability with centralized container settings

## [0.0.3] - 2024-12-11

### Added

- Rich text support for job descriptions
- Tailwind Typography plugin integration
- Responsive typography styling
- Enhanced code block and blockquote formatting

### Changed

- Improved job description readability
- Updated markdown content styling
- Refined list spacing and indentation

## [0.0.2] - 2024-12-11

### Added

- Incremental Static Regeneration (ISR) support
- Automatic page revalidation every 60 seconds
- Real-time job updates without manual rebuilds

### Changed

- Updated home page and job detail pages to use ISR
- Improved data fetching strategy for better performance

## [0.0.1] - 2024-12-10

### Added

- Initial release
- Next.js 15 app router setup
- Airtable integration
- Job listing and detail pages
- Client-side search
- Responsive design with Tailwind CSS
- Geist font integration

### Changed

- N/A (initial release)

### Deprecated

- N/A (initial release)

### Removed

- N/A (initial release)

### Fixed

- N/A (initial release)