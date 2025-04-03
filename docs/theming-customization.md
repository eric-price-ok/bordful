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

The `primaryColor` value can be any valid CSS color value, including:
- Hexadecimal: `#4f46e5`
- RGB: `rgb(79, 70, 229)`
- HSL: `hsl(245, 75%, 59%)`

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

The primary color is applied using inline styles with React's `style` prop. This approach was chosen because:

1. It allows for runtime configuration changes without requiring CSS rebuilds
2. It works reliably with any valid CSS color value
3. It avoids potential issues with CSS-in-JS frameworks or Tailwind's JIT engine

For example, here's how the primary color is applied to buttons:

```tsx
<Button
  variant="primary"
  style={{ backgroundColor: config.ui.primaryColor }}
>
  Button Text
</Button>
```

### Customizing Button Variants

The system extends the button component with a new `primary` variant that uses the configured primary color. This variant is used consistently across all primary action buttons.

## Background Customization

In addition to the primary color, you can customize the background color of specific sections:

```typescript
// config/config.ts
export const config = {
  // ... other configuration
  ui: {
    // Hero section background color
    heroBackgroundColor: "#f8fafc",
    
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