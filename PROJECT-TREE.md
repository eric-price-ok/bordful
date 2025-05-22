```
bordful
├─ .cursor
│  └─ rules
├─ .eslintrc.json
├─ CHANGELOG.md
├─ CONTRIBUTING.md
├─ LICENSE
├─ PROJECT-TREE.md
├─ README.md
├─ SECURITY.md
├─ app
│  ├─ about
│  │  └─ page.tsx
│  ├─ api
│  │  ├─ og
│  │  │  ├─ jobs
│  │  │  │  └─ [slug]
│  │  │  │     └─ route.tsx
│  │  │  └─ route.tsx
│  │  ├─ subscribe
│  │  │  └─ route.ts
│  │  └─ temp-markdown-fix
│  │     └─ jobs
│  ├─ atom.xml
│  │  └─ route.ts
│  ├─ changelog
│  │  └─ page.tsx
│  ├─ contact
│  │  └─ page.tsx
│  ├─ faq
│  │  └─ page.tsx
│  ├─ favicon.ico
│  ├─ feed.json
│  │  └─ route.ts
│  ├─ feed.xml
│  │  └─ route.ts
│  ├─ globals.css
│  ├─ job-alerts
│  │  └─ page.tsx
│  ├─ jobs
│  │  ├─ [category]
│  │  ├─ [slug]
│  │  │  └─ page.tsx
│  │  ├─ language
│  │  │  └─ [language]
│  │  │     └─ page.tsx
│  │  ├─ languages
│  │  │  └─ page.tsx
│  │  ├─ level
│  │  │  └─ [level]
│  │  │     └─ page.tsx
│  │  ├─ levels
│  │  │  └─ page.tsx
│  │  ├─ location
│  │  │  └─ [location]
│  │  │     └─ page.tsx
│  │  ├─ locations
│  │  │  └─ page.tsx
│  │  ├─ not-found.tsx
│  │  ├─ page.tsx
│  │  ├─ type
│  │  │  └─ [type]
│  │  │     └─ page.tsx
│  │  └─ types
│  │     └─ page.tsx
│  ├─ layout.tsx
│  ├─ not-found.tsx
│  ├─ page.tsx
│  ├─ pricing
│  │  └─ page.tsx
│  ├─ privacy
│  │  └─ page.tsx
│  ├─ robots.ts
│  ├─ sitemap.ts
│  ├─ temp-markdown-fix
│  │  └─ nested-list-test
│  └─ terms
│     └─ page.tsx
├─ bordful-plan.md
├─ components
│  ├─ analytics
│  ├─ contact
│  │  ├─ ContactInfoSection.tsx
│  │  └─ SupportChannelCard.tsx
│  ├─ home
│  │  └─ HomePage.tsx
│  ├─ job-alerts
│  │  └─ JobAlertsForm.tsx
│  ├─ jobs
│  │  ├─ CompactJobCard.tsx
│  │  ├─ CompactJobCardList.tsx
│  │  ├─ JobCard.tsx
│  │  ├─ JobCardList.tsx
│  │  ├─ JobListings.tsx
│  │  ├─ JobSearch.tsx
│  │  └─ JobsLayout.tsx
│  ├─ server
│  └─ ui
│     ├─ about-schema.tsx
│     ├─ accordion.tsx
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ checkbox.tsx
│     ├─ client-breadcrumb.tsx
│     ├─ collapsible-text.tsx
│     ├─ contact-schema.tsx
│     ├─ dropdown-menu.tsx
│     ├─ faq-content.tsx
│     ├─ footer.tsx
│     ├─ hero-section.tsx
│     ├─ icons.tsx
│     ├─ input.tsx
│     ├─ job-badge.tsx
│     ├─ job-details-sidebar.tsx
│     ├─ job-filters.tsx
│     ├─ job-schema.tsx
│     ├─ job-search-input.tsx
│     ├─ jobs-per-page-select.tsx
│     ├─ label.tsx
│     ├─ metadata-breadcrumb.tsx
│     ├─ nav.tsx
│     ├─ pagination-control.tsx
│     ├─ pagination.tsx
│     ├─ post-job-banner.tsx
│     ├─ select.tsx
│     ├─ server-breadcrumb.tsx
│     ├─ similar-jobs.tsx
│     ├─ sort-order-select.tsx
│     ├─ switch.tsx
│     ├─ toast.tsx
│     ├─ toaster.tsx
│     └─ website-schema.tsx
├─ components.json
├─ config
│  ├─ README.md
│  ├─ config.example.ts
│  └─ index.ts
├─ docs
│  ├─ README.md
│  ├─ currencies.md
│  ├─ deployment.md
│  ├─ email-providers.md
│  ├─ encharge-integration.md
│  ├─ job-alerts-configuration.md
│  ├─ navbar-customization.md
│  ├─ post-job-banner.md
│  ├─ rate-limiting.md
│  ├─ schema-implementation.md
│  └─ theming-customization.md
├─ hooks
│  └─ use-toast.ts
├─ lib
│  ├─ config
│  │  └─ routes.ts
│  ├─ constants
│  │  ├─ career-levels.ts
│  │  ├─ countries.ts
│  │  ├─ currencies.ts
│  │  ├─ job-types.ts
│  │  ├─ languages.ts
│  │  ├─ locations.ts
│  │  └─ workplace.ts
│  ├─ db
│  │  └─ airtable.ts
│  ├─ email
│  │  ├─ index.ts
│  │  ├─ providers
│  │  │  └─ encharge.ts
│  │  └─ types.ts
│  ├─ hooks
│  │  ├─ useJobSearch.ts
│  │  ├─ useJobsPerPage.ts
│  │  ├─ usePagination.ts
│  │  └─ useSortOrder.ts
│  ├─ providers
│  ├─ utils
│  │  ├─ colors.ts
│  │  ├─ filter-jobs.ts
│  │  ├─ fonts.ts
│  │  ├─ formatDate.ts
│  │  ├─ markdown.ts
│  │  ├─ metadata.ts
│  │  └─ slugify.ts
│  └─ utils.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ assets
│  │  ├─ amex.svg
│  │  ├─ applepay.svg
│  │  ├─ bordful.png
│  │  ├─ googlepay.svg
│  │  ├─ mastercard.svg
│  │  ├─ paypal.svg
│  │  ├─ social
│  │  │  ├─ bluesky.svg
│  │  │  ├─ github.svg
│  │  │  ├─ linkedin.svg
│  │  │  ├─ reddit.svg
│  │  │  ├─ rss.svg
│  │  │  └─ twitter.svg
│  │  └─ visa.svg
│  ├─ avatars
│  │  ├─ bestwriting.png
│  │  ├─ marketful.png
│  │  └─ uithings.png
│  ├─ bordful-light.svg
│  ├─ bordful.svg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ hero-background.jpg
│  ├─ images
│  ├─ next.svg
│  ├─ office.jpg
│  ├─ og-images
│  ├─ optimized-images
│  ├─ screenshot.png
│  ├─ vercel.svg
│  └─ window.svg
├─ tailwind.config.ts
└─ tsconfig.json

```