# Theming and Color Customization

This document explains how to customize the visual appearance of your job board by configuring colors and other theming options.

## Primary Color Configuration

The job board now supports a configurable primary color that is consistently applied across various UI elements throughout the site. This allows for easy branding customization without having to modify individual components.

### Configuration

To set your primary color, update the `primaryColor` property in the `ui` section of your `config.ts` file:

```typescript
// config/config.ts
export const config = {
  // ... other configuration
  ui: {
    // Hero section background color
    heroBackgroundColor: "#f8fafc",
    
    // Primary color used throughout the site (buttons, links, etc.)
    // Can be hex, rgb, hsl, etc.
    primaryColor: "#4f46e5", // Example: indigo color
  },
  // ... other configuration
};
```

The `primaryColor` value can be any of the following:

1. **Standard CSS color values:**
   - Hexadecimal: `#4f46e5`
   - RGB: `rgb(79, 70, 229)`
   - HSL: `hsl(245, 75%, 59%)`

2. **Tailwind color patterns:**
   - Format: `{color}-{shade}` (e.g., `slate-500`)
   - Examples:
     - `indigo-600` (Tailwind's indigo-600 color)
     - `blue-700` (Tailwind's blue-700 color)
     - `emerald-500` (Tailwind's emerald-500 color)

Supported Tailwind colors include: slate, gray, zinc, red, orange, amber, yellow, green, emerald, teal, cyan, blue, indigo, purple, and pink, with shades from 50 to 950.

### Components Using Primary Color

The primary color is automatically applied to the following components:

1. **Navigation Bar**
   - "Post a Job" button in the top navigation

2. **Job Cards**
   - Featured badges on job listings
   - "Apply Now" buttons (visible on hover)

3. **Job Detail Pages**
   - "Apply Now" buttons (top and bottom of job details)

4. **Footer**
   - "Post a Job" button in the footer

5. **Post Job Banner**
   - Call-to-action button in the "Hiring? Post Your Job Ad Here" banner

### Implementation Details

The primary color is applied using a color resolver that handles both direct CSS colors and Tailwind color patterns. This provides flexibility while maintaining a clean configuration.

The implementation:
1. Automatically detects if you're using CSS colors (`#hex`, `rgb()`, etc.) or Tailwind patterns (`blue-500`)
2. Resolves Tailwind patterns to their corresponding hex values
3. Applies the color consistently across all components

## Background Customization

In addition to the primary color, you can customize the background color of specific sections:

```typescript
// config/config.ts
export const config = {
  // ... other configuration
  ui: {
    // Hero section background color
    heroBackgroundColor: "#f8fafc", // Or use "slate-50" as a Tailwind color
    
    // ... other UI configuration
  },
  // ... other configuration
};
```

## Best Practices

When customizing colors, consider the following best practices:

1. **Accessibility**: Ensure sufficient contrast between text and background colors. Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.

2. **Consistency**: Use the primary color for key actions and important elements consistently throughout the site.

3. **Brand Alignment**: Choose colors that align with your brand identity for a cohesive look.

4. **Color Psychology**: Consider the psychological impact of your color choices. Different colors evoke different emotions and reactions.

## Future Enhancements

Planned enhancements to the theming system include:

- Secondary color configuration
- Text color customization
- Full theme configuration with dark mode support
- Custom CSS variables for advanced theming 