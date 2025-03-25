# Post Job Banner Configuration

The post job banner is a configurable component that appears in the sidebar of job detail pages, encouraging employers to post job listings.

## Configuration

The banner can be configured in your `config.ts` file under the `postJobBanner` section:

```typescript
postJobBanner: {
  // Enable or disable the post job banner
  enabled: true,

  // Banner content
  title: "Hiring? Post Your Job Ad Here",
  description: "Reach talented professionals. Get quality applications fast.",

  // Trust indicators
  showTrustedBy: true,
  trustedByText: "Trusted by top companies",
  companyAvatars: [
    {
      src: "/avatars/company1.png",
      alt: "Company 1",
      fallback: "C1",
    },
    // ... more company avatars
  ],

  // Call to action
  cta: {
    text: "Post a Job ($59)",
    link: "https://your-payment-link.com",
    external: true,
  },

  // Trust message
  trustMessage: "30-day money-back guarantee",
}
```

## Configuration Options

### Basic Settings
- `enabled`: Boolean to toggle the banner visibility
- `title`: The main heading of the banner
- `description`: A brief description of the value proposition

### Trust Indicators
- `showTrustedBy`: Boolean to toggle the company avatars section
- `trustedByText`: Text displayed next to company avatars
- `companyAvatars`: Array of company avatar configurations:
  - `src`: Path to the avatar image
  - `alt`: Alt text for accessibility
  - `fallback`: Text to display if image fails to load

### Call to Action
- `cta`: Object containing button configuration:
  - `text`: Button text
  - `link`: URL the button links to
  - `external`: Boolean indicating if link opens in new tab

### Trust Message
- `trustMessage`: Text displayed below the CTA button

## Usage

The banner is automatically displayed in the sidebar of job detail pages when enabled. It's designed to be visually appealing while maintaining a professional appearance.

## Best Practices

1. **Images**: 
   - Use square images for company avatars
   - Recommended size: 64x64 pixels
   - Place images in the `public/avatars` directory
   - Use PNG format for best quality

2. **Content**:
   - Keep the title concise and action-oriented
   - Use a clear, compelling description
   - Include social proof with company avatars
   - Add a trust message to reduce friction

3. **CTA**:
   - Use clear, action-oriented button text
   - Include pricing if applicable
   - Link to a secure payment page
   - Consider adding a money-back guarantee

## Example Configuration

```typescript
postJobBanner: {
  enabled: true,
  title: "Hiring? Post Your Job Ad Here",
  description: "Reach talented professionals. Get quality applications fast.",
  showTrustedBy: true,
  trustedByText: "Trusted by top companies",
  companyAvatars: [
    {
      src: "/avatars/company1.png",
      alt: "Company 1",
      fallback: "C1",
    },
    {
      src: "/avatars/company2.png",
      alt: "Company 2",
      fallback: "C2",
    },
    {
      src: "/avatars/company3.png",
      alt: "Company 3",
      fallback: "C3",
    },
  ],
  cta: {
    text: "Post a Job ($59)",
    link: "https://your-payment-link.com",
    external: true,
  },
  trustMessage: "30-day money-back guarantee",
}
```

## Styling

The banner uses Tailwind CSS classes for styling and maintains consistency with the rest of the application's design system. The component is responsive and adapts to different screen sizes. 